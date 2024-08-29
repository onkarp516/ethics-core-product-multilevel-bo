import React from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  Collapse,
  CloseButton,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";

import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import moment from "moment";
import Select from "react-select";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getPurchaseInvoiceList,
  getLastPurchaseInvoiceNo,
  getProduct,
  createPurchaseInvoice,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getPOPendingOrderWithIds,
  getPOInvoiceWithIds,
  getPurchaseInvoiceShowById,
  get_outstanding_pur_return_amt,
  listTranxDebitesNotes,
  getProductPackageList,
} from "@/services/api_functions";

import {
  getSelectValue,
  calculatePercentage,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
  invoiceSelectTo,
  calculatePrValue,
  transSelectTo,
  TRAN_NO,
  disc_select_to,
  ddselect_to,
  purchaseSelect,
  CustomCss,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlusCircle,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import calendar2date from "@/assets/images/calendar2date.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import updown_arrow from "@/assets/images/updown_arrow.svg";
import add_blue_circle from "@/assets/images/add_circle_blue.svg";
import delete_icon from "@/assets/images/delete_icon.svg";
import save_icon from "@/assets/images/save_icon.svg";

const customStyles1 = {
  control: (base) => ({
    ...base,
    marginLeft: -25,
    // marginTop: -10,
    height: 15,
    minHeight: 15,
    fontSize: "14px",
    border: "none",
    // padding: "0 6px",
    fontWeight: "500",
    // fontFamily: "MontserratRegular",
    boxShadow: "none",
    background: "transparent",
  }),
};
const productLst = [
  {
    label:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ",
    value: true,
  },
  { label: "No", value: false },
  // more options...
];
const packageLst = [
  {
    label: "1000 ml",
    value: true,
  },
  { label: "500 ml", value: false },
  // more options...
];
export default class CreatePurchaseInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      opendiv: false,
      addunits: false,
      hidediv: true,
      invoice_data: "",
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      selectedBills: [],
      selectedBillsdebit: [],
      invoiceedit: false,
      clientinfo: false,
      lerdgerCreate: false,
      createproductmodal: false,
      pendingordermodal: false,
      pendingorderprdctsmodalshow: false,
      isAllCheckeddebit: false,
      adjustbillshow: false,
      billLst: [],
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
      isEditDataSet: false,
      adjusmentbillmodal: false,
      outstanding_pur_return_amt: 0,
      lstPackages: [],
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      addunitsrow: [""],
      flag: 0,
    };
  }
  handleLstPackage = (lstPackages) => {
    this.setState({ lstPackages: lstPackages });
  };
  getProductPackageLst = (product_id) => {
    let reqData = new FormData();
    let { transaction_detail_index, rows } = this.state;

    reqData.append("product_id", product_id);

    getProductPackageList(reqData)
      .then((response) => {
        let responseData = response.data;
        if (responseData.responseStatus == 200) {
          let data = responseData.responseObject.lst_packages;
          let optN = [];
          data.map((v) => {
            let unitOpt = v.units.map((vi) => {
              return {
                label: vi.unit_name,
                value: vi.units_id,
                ...vi,
                isDisabled: false,
              };
            });
            // return {
            //   label: v.pack_name != "" ? v.pack_name : 0,
            //   value: v.id != "" ? v.id : 0,
            //   ...v,
            //   unitOpt: unitOpt,
            //   isDisabled: false,
            // };
            optN.push({
              label: v.pack_name != "" ? v.pack_name : "",
              value: v.id != "" ? v.id : 0,
              ...v,
              unitOpt: unitOpt,
              isDisabled: false,
            });
          });
          this.setState({ lstPackages: optN }, () => {
            if (optN.length == 1) {
              // console.log(
              //   "rows[transaction_detail_index]productDetails unitOpt",
              //   rows[transaction_detail_index]["productDetails"][0]["unitId"][
              //     "unitOpt"
              //   ]
              // );
              // console.log(
              //   "rows[transaction_detail_index]productDetai",
              //   rows[transaction_detail_index]["productDetails"]
              // );
              // console.log("opt unitOpt", optN[0]["unitOpt"][0]);
              if (optN.length == 1) {
                rows[transaction_detail_index]["productDetails"][0][
                  "packageId"
                ] = optN[0];
              }

              // rows[transaction_detail_index]["productDetails"][0]["packageId"][
              //   "unitOpt"
              // ] = optN[0]["unitOpt"][0];
              this.setState({ rows: rows });
            } else if (optN.length > 1) {
              rows[transaction_detail_index]["productDetails"][0]["packageId"] =
                optN[0];

              this.setState({ rows: rows });
            }
          });
        } else {
          this.setState({ lstPackages: [] });
        }
      })
      .catch((error) => {
        this.setState({ lstPackages: [] });
        // console.log("error", error);
      });
  };

  handeladjusmentbillmodal = (status) => {
    this.setState({ adjusmentbillmodal: status });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  get_outstanding_pur_return_amtFun = (sundry_creditor_id) => {
    let reqData = new FormData();
    reqData.append("sundry_creditor_id", sundry_creditor_id);
    get_outstanding_pur_return_amt(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            isEditDataSet: true,
            outstanding_pur_return_amt: res.balance,
          });
        }
      })
      .catch((error) => {});
  };

  handleFetchData = (sundry_creditor_id) => {
    // ;
    const { billLst } = this.state;
    let reqData = new FormData();

    reqData.append("sundry_creditor_id", sundry_creditor_id);
    listTranxDebitesNotes(reqData)
      .then((response) => {
        let res = response.data;

        let data = res.list;
        if (data.length == 0) {
          console.log("debit list is empty");

          this.callCreateInvoice();
        }
        if (res.responseStatus == 200) {
          this.setState({ billLst: data }, () => {
            if (data.length > 0) {
              this.setState({ adjustbillshow: true });
            }
          });
        }
      })
      .catch((error) => {});
  };

  callCreateInvoice = () => {
    console.log("in create");
    // ;
    const {
      invoice_data,
      additionalCharges,
      additionalChargesTotal,
      rows,
    } = this.state;
    let invoiceValues = this.myRef.current.values;

    let requestData = new FormData();
    // console.log("invoice_data", invoice_data);
    // console.log("this.state", this.state);
    // !Invoice Data

    requestData.append(
      "invoice_date",
      moment(invoice_data.pi_invoice_dt).format("yyyy-MM-DD")
    );
    requestData.append("newReference", false);
    requestData.append("invoice_no", invoice_data.pi_no);
    requestData.append("purchase_id", invoice_data.purchaseId.value);
    requestData.append("purchase_sr_no", invoice_data.pi_sr_no);
    requestData.append(
      "transaction_date",
      moment(invoice_data.pi_transaction_dt).format("yyyy-MM-DD")
    );
    if (this.state.selectedPendingOrder.length > 0) {
      requestData.append(
        "reference_po_ids",
        this.state.selectedPendingOrder.join(",")
      );
    }

    if (this.state.selectedPendingChallan.length > 0) {
      requestData.append(
        "reference_pc_ids",
        this.state.selectedPendingChallan.join(",")
      );
    }
    requestData.append("supplier_code_id", invoice_data.supplierCodeId.value);
    // !Invoice Data
    requestData.append("roundoff", invoiceValues.roundoff);
    if (invoiceValues.narration && invoiceValues.narration != "") {
      requestData.append("narration", invoiceValues.narration);
    }
    requestData.append("total_base_amt", invoiceValues.total_base_amt);
    requestData.append("totalamt", invoiceValues.totalamt);
    requestData.append("taxable_amount", invoiceValues.total_taxable_amt);
    requestData.append("totalcgst", invoiceValues.totalcgst);
    requestData.append("totalsgst", invoiceValues.totalsgst);
    requestData.append("totaligst", invoiceValues.totaligst);
    requestData.append("totalqty", invoiceValues.totalqty);
    requestData.append("tcs", invoiceValues.tcs);
    requestData.append("purchase_discount", invoiceValues.purchase_discount);
    requestData.append(
      "purchase_discount_amt",
      invoiceValues.purchase_discount_amt
    );
    // requestData.append(
    //   "total_purchase_discount_amt",
    //   invoiceValues.purchase_discount_amt > 0
    //     ? invoiceValues.purchase_discount_amt
    //     : invoiceValues.total_purchase_discount_amt
    // );
    requestData.append(
      "total_purchase_discount_amt",
      invoiceValues.purchase_discount_amt > 0
        ? isNaN(invoiceValues.purchase_discount_amt)
          ? 0
          : invoiceValues.purchase_discount_amt
        : isNaN(invoiceValues.total_purchase_discount_amt)
        ? 0
        : invoiceValues.total_purchase_discount_amt
    );
    requestData.append(
      "purchase_disc_ledger",
      invoiceValues.purchase_disc_ledger
        ? invoiceValues.purchase_disc_ledger.value
        : 0
    );
    console.log("row in create", rows);

    let frow = rows.map((v, i) => {
      let funits = v.productDetails.filter((vi) => {
        vi["packageId"] = vi.packageId ? vi.packageId.id : "";
        vi["is_multi_unit"] = vi.is_multi_unit;
        vi["pack_name"] = vi.pack_name;
        vi["unitCount"] = vi.unitCount;
        return vi;
      });
      if (v.productId != "") {
        return {
          details_id: 0,
          product_id: v.productId.value,

          qtyH: v.qtyH != "" ? v.qtyH : 0,
          rateH: v.rateH != "" ? v.rateH : 0,
          qtyM: v.qtyM != "" ? v.qtyM : 0,
          rateM: v.rateM != "" ? v.rateM : 0,
          qtyL: v.qtyL != "" ? v.qtyL : 0,
          rateL: v.rateL != "" ? v.rateL : 0,
          base_amt_H: v.base_amt_H != "" ? v.base_amt_H : 0,
          base_amt_L: v.base_amt_L != "" ? v.base_amt_L : 0,
          base_amt_M: v.base_amt_M != "" ? v.base_amt_M : 0,
          base_amt: v.base_amt != "" ? v.base_amt : 0,
          dis_amt: v.dis_amt != "" ? v.dis_amt : 0,
          dis_per: v.dis_per != "" ? v.dis_per : 0,
          dis_per_cal: v.dis_per_cal != "" ? v.dis_per_cal : 0,
          dis_amt_cal: v.dis_amt_cal != "" ? v.dis_amt_cal : 0,
          total_amt: v.total_amt != "" ? v.total_amt : 0,
          igst: v.igst != "" ? v.igst : 0,
          cgst: v.cgst != "" ? v.cgst : 0,
          sgst: v.sgst != "" ? v.sgst : 0,
          total_igst: v.total_igst != "" ? v.total_igst : 0,
          total_cgst: v.total_cgst != "" ? v.total_cgst : 0,
          total_sgst: v.total_sgst != "" ? v.total_sgst : 0,
          final_amt: v.final_amt != "" ? v.final_amt : 0,
          serialNo: v.serialNo,
          discount_proportional_cal:
            v.discount_proportional_cal != "" ? v.discount_proportional_cal : 0,
          additional_charges_proportional_cal:
            v.additional_charges_proportional_cal != ""
              ? v.additional_charges_proportional_cal
              : 0,
          reference_id: v.reference_id != "" ? v.reference_id : "",
          reference_type: v.reference_type,
          productDetails: funits,
          // packageId: v.packageId ? v.packageId.value : "",
        };
      }
    });

    var filtered = frow.filter(function (el) {
      return el != null;
    });
    let additionalChargesfilter = additionalCharges.filter((v) => {
      if (v.ledgerId != "" && v.ledgerId != undefined && v.ledgerId != null) {
        v["ledger"] = v["ledgerId"]["value"];
        return v;
      }
    });
    requestData.append("additionalChargesTotal", additionalChargesTotal);
    requestData.append("row", JSON.stringify(filtered));
    requestData.append(
      "additionalCharges",
      JSON.stringify(additionalChargesfilter)
    );

    if (
      authenticationService.currentUserValue.state &&
      invoice_data &&
      invoice_data.supplierCodeId &&
      invoice_data.supplierCodeId.state !=
        authenticationService.currentUserValue.state
    ) {
      let taxCal = {
        igst: this.state.taxcal.igst,
      };

      requestData.append("taxFlag", false);
      requestData.append("taxCalculation", JSON.stringify(taxCal));
    } else {
      let taxCal = {
        cgst: this.state.taxcal.cgst,
        sgst: this.state.taxcal.sgst,
      };

      requestData.append("taxCalculation", JSON.stringify(taxCal));
      requestData.append("taxFlag", true);
    }

    createPurchaseInvoice(requestData)
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
          // resetForm();
          this.initRow();

          eventBus.dispatch("page_change", "tranx_purchase_invoice_list");
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
      .catch((error) => {});
  };

  handlePackageChange = (transaction_detail_index, element, value) => {
    let { rows, handleRowChange } = this.state;
    // console.log('handleRowChange', handleRowChange);
    rows[transaction_detail_index][element] = value;
    this.handleRowChange(rows);
  };

  getPackageValue = (transaction_detail_index, element) => {
    // console.log(
    //   "transaction_detail_index, element",
    //   transaction_detail_index,
    //   element
    // );
    let { rows } = this.state;
    // console.log({ rows });
    // console.log(rows[0]["packageId"]);

    return rows ? rows[transaction_detail_index][element] : "";
  };

  lstAdditionalLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name };
            });
            let fOpt = Opt.filter(
              (v) => v.label.trim().toLowerCase() != "round off"
            );
            // console.log({ fOpt });
            this.setState({ lstAdditionalLedger: fOpt });
          }
        }
      })
      .catch((error) => {});
  };
  lstDiscountLedgers = () => {
    getDiscountLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.name };
            });
            this.setState({ lstDisLedger: Opt });
          }
        }
      })
      .catch((error) => {});
  };

  // lstPurchaseAccounts = () => {
  //   getPurchaseAccounts()
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         let opt = res.list.map((v, i) => {
  //           return { label: v.name, value: v.id };
  //         });
  //         this.setState({ purchaseAccLst: opt });
  //       }
  //     })
  //     .catch((error) => { });
  // };
  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id, ...v };
          });
          this.setState({ purchaseAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.unique_code.toUpperCase().includes("PUAC")
            );
            const { prop_data } = this.props.block;
            console.log("prop_data", prop_data);

            if (v != null && v != undefined && prop_data.invoice_data != null) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["purchaseId"] = v[0];
              this.setState({ invoice_data: init_d });
            } else if (
              v != null &&
              v != undefined &&
              !prop_data.hasOwnProperty("invoice_data")
            ) {
              let { invoice_data } = this.state;
              let init_d = { ...invoice_data };
              init_d["purchaseId"] = v[0];
              this.setState({ invoice_data: init_d });
              console.log("invoice_data", init_d);
            }
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  lstPurchaseInvoice = () => {
    getPurchaseInvoiceList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ purchaseInvoiceLst: res.data });
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };

  lstProduct = () => {
    getProduct()
      .then((response) => {
        // console.log('res', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          let opt = data.map((v) => {
            // let unitOpt = v.units.map((vi) => {
            //   return { label: vi.unitCode, value: vi.id };
            // });
            return {
              label: v.productName,
              value: v.id,
              igst: v.igst,
              hsnId: v.hsnId,
              taxMasterId: v.taxMasterId,
              sgst: v.sgst,
              cgst: v.cgst,
              taxMasterId: v.taxMasterId,
              productCode: v.productCode,
              productName: v.productName,
              isNegativeStocks: v.isNegativeStocks,
              isSerialNumber: v.isSerialNumber,
              // unitOpt: unitOpt,
            };
          });
          this.setState({ productLst: opt });
        }
      })
      .catch((error) => {});
  };

  lstSundryCreditors = () => {
    getSundryCreditors()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.name,
              value: v.id,
              code: v.ledger_code,
              state: stateCode,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: v.id,
              name: v.name,
              state: stateCode,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
          });
        }
      })
      .catch((error) => {});
  };

  initRow = (len = null) => {
    let lst = [];
    let condition = 30;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        productId: "",
        productDetails: [
          {
            packageId: "",
            pack_name: "",
            is_multi_unit: "",
            unitCount: "",
            unitId: "",
            qty: 1,
            rate: "",
            base_amt: 0,
            unit_conv: 0,
            dis_amt: 0,
            dis_per: 0,
            dis_per_cal: 0,
            dis_amt_cal: 0,
            total_amt: 0,
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
          },
        ],
        dis_per_cal: 0,
        dis_amt_cal: 0,
        total_amt: 0,
        gst: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
        total_igst: 0,
        total_cgst: 0,
        total_sgst: 0,
        final_amt: 0,
        serialNo: [],
        discount_proportional_cal: 0,
        additional_charges_proportional_cal: 0,
        reference_id: "",
        reference_type: "",
      };
      lst.push(data);
    }
    // let row_count = [];
    // for (let index = 0; index < 30; index++) {
    //   row_count.push(index);
    // }
    this.setState({ rows: lst });
  };

  handleClearProduct = (index) => {
    const { rows } = this.state;
    let frows = [...rows];
    let data = {
      details_id: 0,
      productId: "",
      productDetails: [
        {
          packageId: "",
          pack_name: "",
          is_multi_unit: "",
          unitCount: "",
          unitId: "",
          qty: 1,
          rate: "",
          base_amt: 0,
          unit_conv: 0,
          dis_amt: 0,
          dis_per: 0,
          dis_per_cal: 0,
          dis_amt_cal: 0,
          total_amt: 0,
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
        },
      ],

      dis_per_cal: 0,
      dis_amt_cal: 0,
      total_amt: 0,
      gst: 0,
      igst: 0,
      cgst: 0,
      sgst: 0,
      total_igst: 0,
      total_cgst: 0,
      total_sgst: 0,
      final_amt: "",
      serialNo: [],
      discount_proportional_cal: 0,
      additional_charges_proportional_cal: 0,
      reference_id: "",
      reference_type: "",
    };
    frows[index] = data;
    this.setState({ rows: frows }, () => {
      this.handleAdditionalChargesSubmit();
    });
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

  lstPOPendingOrder = (values) => {
    const { invoice_data } = this.state;
    let { supplierCodeId } = invoice_data;

    let reqData = new FormData();
    reqData.append(
      "supplier_code_id",
      supplierCodeId ? supplierCodeId.value : ""
    );
    getPOPendingOrderWithIds(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ purchasePendingOrderLst: res.data });
        }
      })
      .catch((error) => {
        this.setState({ purchasePendingOrderLst: [] });
      });
  };

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

  handleclientinfo = (status) => {
    let { invoice_data } = this.state;

    if (status == true) {
      let reqData = new FormData();
      let sunC_Id =
        invoice_data.supplierNameId && invoice_data.supplierNameId.value;
      reqData.append("sundry_creditors_id", sunC_Id);
      getPurchaseInvoiceShowById(reqData)
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            this.setState({ clientinfo: res });
          }
        })
        .catch((error) => {});
    }
    this.setState({ clientinfo: status });
  };

  ledgerCreate = (status) => {
    let { lerdgerCreate } = this.setState;
    // eventBus.dispatch("page_change", "ledgercreate");
    eventBus.dispatch("page_change", {
      from: "tranx_purchase_invoice_create_modified",
      to: "ledgercreate",

      prop_data: {},
      isNewTab: true,
    });
  };
  productCreate = (e = null) => {
    console.log("ProductCreate");
    if (e != null) {
      e.preventDefault();
    }
    eventBus.dispatch("page_change", {
      from: "tranx_purchase_invoice_create_modified",
      to: "newproductcreate",
      isNewTab: true,
      prop_data: { tran_no: TRAN_NO.prd_tranx_purchase_invoice_create },
    });
  };

  handleResetForm = () => {
    this.handleclientinfo(true);
  };

  handlePendingOrderSelectionAll = (status) => {
    let { purchasePendingOrderLst } = this.state;

    let lstSelected = [];
    if (status == true) {
      lstSelected = purchasePendingOrderLst.map((v) => v.id);
    }
    this.setState({
      isAllChecked: status,
      selectedPendingOrder: lstSelected,
    });
  };

  handleBillsSelection = (id, status) => {
    let { selectedBills, billLst } = this.state;
    if (status == true) {
      if (!selectedBills.includes(id)) {
        selectedBills = [...selectedBills, id];
      }
    } else {
      selectedBills = selectedBills.filter((v) => v != id);
    }
    this.setState({
      selectedBills: selectedBills,
    });
  };

  handleBillsSelectionAll = (status) => {
    let { billLst, selectedBills } = this.state;

    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.id);
    }
    this.setState({
      isAllChecked:
        selectedBills.length == 0
          ? false
          : selectedBills.length === billLst.length
          ? true
          : false,
      selectedBills: lstSelected,
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
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      this.lstSundryCreditors();
      this.lstProduct();
      // this.lstUnit();
      this.initRow();
      this.initAdditionalCharges();
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      const { prop_data } = this.props.block;

      this.setState({ invoice_data: prop_data });
      mousetrap.bindGlobal("ctrl+v", this.handleResetForm);
      mousetrap.bindGlobal("ctrl+c", this.ledgerCreate);
      mousetrap.bind("alt+p", this.productCreate);

      eventBus.on(TRAN_NO.prd_tranx_purchase_invoice_create, this.lstProduct);
    }
  }

  componentWillUnmount() {
    if (AuthenticationCheck()) {
      mousetrap.unbind("alt+p", this.productCreate);

      mousetrap.unbindGlobal("ctrl+v", this.handleResetForm);
      mousetrap.unbindGlobal("ctrl+c", this.ledgerCreate);
      eventBus.remove(
        TRAN_NO.prd_tranx_purchase_invoice_create,
        this.lstProduct
      );
    }
  }

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
    // console.log({ element, value, index });
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

          v["productDetails"] = v["productDetails"].map((vi) => {
            vi["igst"] = value.igst;
            vi["gst"] = value.igst;
            vi["cgst"] = value.cgst;
            vi["sgst"] = value.sgst;

            return vi;
          });
        }

        return v;
      } else {
        return v;
      }
    });
    this.setState({ rows: frows, lstPackages: [] }, () => {
      if (
        element == "productId" &&
        value != "" &&
        value != undefined &&
        value != null
      ) {
        this.setState({ transaction_detail_index: index }, () => {
          this.getProductPackageLst(value.value);
          //   console.log("in  if statement of getProductPackageLst ");
        });
      }
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
    let { rows, serialnoshowindex, serialnoarray } = this.state;
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

  handleAdditionalChargesSubmit = (discamtval = -1, type = "") => {
    const { rows, additionalChargesTotal } = this.state;
    // console.log({ discamtval, type });

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
        let baseamt = 0;
        let i_totalamt = 0;
        v["productDetails"] = v.productDetails.map((vi) => {
          if (vi["qty"] != "" && vi["rate"] != "") {
            vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
          } else {
            vi["base_amt"] = 0;
          }
          vi["total_amt"] = vi["base_amt"];
          vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
          baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
          if (vi["dis_amt"] != "" && vi["dis_amt"] > 0) {
            vi["total_amt"] =
              parseFloat(vi["total_amt"]) - parseFloat(vi["dis_amt"]);
            vi["dis_amt_cal"] = vi["dis_amt"];
          }
          if (vi["dis_per"] != "" && vi["dis_per"] > 0) {
            let per_amt = calculatePercentage(vi["total_amt"], vi["dis_per"]);
            vi["dis_per_cal"] = per_amt;
            vi["total_amt"] = vi["total_amt"] - per_amt;
          }
          i_totalamt = parseFloat(i_totalamt) + parseFloat(vi["total_amt"]);

          return vi;
        });
        v["base_amt"] = baseamt;
        v["total_amt"] = i_totalamt;
        totalamt = parseFloat(totalamt) + i_totalamt;
      }
      return v;
    });

    // console.log("row_disc", { row_disc });
    // console.log("totalamt", totalamt);
    let ntotalamt = 0;
    /**
     *purchase Discount ledger selected
     */
    let bdisc = row_disc.map((v, i) => {
      if (v["productId"] != "") {
        if (type != "" && discamtval >= 0) {
          if (type == "purchase_discount") {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              let peramt = calculatePercentage(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                peramt,
                vi["total_amt"]
              );
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(totalamt, peramt, vi["total_amt"]);

              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;

            if (
              this.myRef.current.values.purchase_discount_amt > 0 &&
              this.myRef.current.values.purchase_discount_amt != ""
            ) {
              let disc_total_amt = 0;
              let disc_prop_cal = 0;
              v["productDetails"] = v.productDetails.map((vi) => {
                vi["total_amt"] =
                  vi["total_amt"] -
                  calculatePrValue(
                    totalamt,
                    parseFloat(this.myRef.current.values.purchase_discount_amt),
                    vi["total_amt"]
                  );
                vi["discount_proportional_cal"] = calculatePrValue(
                  totalamt,
                  parseFloat(discamtval),
                  vi["total_amt"]
                );
                disc_prop_cal =
                  parseFloat(disc_prop_cal) +
                  parseFloat(vi["discount_proportional_cal"]);
                disc_total_amt =
                  parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
                return vi;
              });

              v["total_amt"] = disc_total_amt;
              v["discount_proportional_cal"] = disc_prop_cal;
            }
          } else {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(
                  totalamt,
                  parseFloat(discamtval),
                  vi["total_amt"]
                );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;

            if (
              this.myRef.current.values.purchase_discount > 0 &&
              this.myRef.current.values.purchase_discount != ""
            ) {
              let disc_total_amt = 0;
              let disc_prop_cal = 0;
              v["productDetails"] = v.productDetails.map((vi) => {
                let peramt = calculatePercentage(
                  totalamt,
                  parseFloat(this.myRef.current.values.purchase_discount),
                  vi["total_amt"]
                );
                vi["discount_proportional_cal"] = calculatePrValue(
                  totalamt,
                  peramt,
                  vi["total_amt"]
                );
                vi["total_amt"] =
                  vi["total_amt"] -
                  calculatePrValue(totalamt, peramt, vi["total_amt"]);

                disc_prop_cal =
                  parseFloat(disc_prop_cal) +
                  parseFloat(vi["discount_proportional_cal"]);
                disc_total_amt =
                  parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
                return vi;
              });

              v["total_amt"] = disc_total_amt;
              v["discount_proportional_cal"] = disc_prop_cal;
            }
          }
        } else {
          if (
            this.myRef.current.values.purchase_discount > 0 &&
            this.myRef.current.values.purchase_discount != ""
          ) {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              let peramt = calculatePercentage(
                totalamt,
                parseFloat(this.myRef.current.values.purchase_discount),
                vi["total_amt"]
              );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                peramt,
                vi["total_amt"]
              );
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(totalamt, peramt, vi["total_amt"]);

              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;
          }
          if (
            this.myRef.current.values.purchase_discount_amt > 0 &&
            this.myRef.current.values.purchase_discount_amt != ""
          ) {
            let disc_total_amt = 0;
            let disc_prop_cal = 0;
            v["productDetails"] = v.productDetails.map((vi) => {
              vi["total_amt"] =
                vi["total_amt"] -
                calculatePrValue(
                  totalamt,
                  parseFloat(this.myRef.current.values.purchase_discount_amt),
                  vi["total_amt"]
                );
              vi["discount_proportional_cal"] = calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
              disc_prop_cal =
                parseFloat(disc_prop_cal) +
                parseFloat(vi["discount_proportional_cal"]);
              disc_total_amt =
                parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
              return vi;
            });

            v["total_amt"] = disc_total_amt;
            v["discount_proportional_cal"] = disc_prop_cal;
          }
        }
        ntotalamt = parseFloat(ntotalamt) + parseFloat(v["total_amt"]);
      }
      return v;
    });

    // console.log("ntotalamt", { ntotalamt });
    /**
     * Additional Charges
     */
    let addCharges = [];

    addCharges = bdisc.map((v, i) => {
      let add_total_amt = 0;
      let add_prop_cal = 0;
      if (v["productId"] != "") {
        v["productDetails"] = v.productDetails.map((vi) => {
          vi["total_amt"] = parseFloat(
            vi["total_amt"] +
              calculatePrValue(
                ntotalamt,
                additionalChargesTotal,
                vi["total_amt"]
              )
          ).toFixed(2);
          vi["additional_charges_proportional_cal"] = calculatePrValue(
            ntotalamt,
            additionalChargesTotal,
            vi["total_amt"]
          );
          add_total_amt =
            parseFloat(add_total_amt) + parseFloat(vi["total_amt"]);
          add_prop_cal =
            parseFloat(add_prop_cal) +
            parseFloat(vi["additional_charges_proportional_cal"]);
          return vi;
        });
        v["total_amt"] = parseFloat(add_total_amt).toFixed(2);
        v["additional_charges_proportional_cal"] = parseFloat(
          add_prop_cal
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
    let totalqtyH = 0;
    let totalqtyM = 0;
    let totalqtyL = 0;
    /**
     * GST Calculation
     * **/

    let frow = addCharges.map((v, i) => {
      if (v["productId"] != "") {
        let i_total_igst = 0;
        let i_total_cgst = 0;
        let i_total_sgst = 0;
        let i_final_amt = 0;
        let i_total_purchase_discount_amt = 0;
        let i_total_discount_proportional_amt = 0;
        let i_total_additional_charges_proportional_amt = 0;
        let i_base_amt = 0;
        let i_total_amt = 0;
        v["productDetails"] = v.productDetails.map((vi) => {
          vi["igst"] = v["productId"]["igst"];
          vi["gst"] = v["productId"]["igst"];
          vi["cgst"] = v["productId"]["cgst"];
          vi["sgst"] = v["productId"]["sgst"];
          vi["total_igst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["igst"])
          ).toFixed(2);
          vi["total_cgst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["cgst"])
          ).toFixed(2);
          vi["total_sgst"] = parseFloat(
            calculatePercentage(vi["total_amt"], v["productId"]["sgst"])
          ).toFixed(2);

          vi["final_amt"] = parseFloat(
            parseFloat(vi["total_amt"]) + parseFloat(vi["total_igst"])
          ).toFixed(2);
          // console.log("vi final_amt", vi["final_amt"]);
          i_total_amt = i_total_amt + parseFloat(vi["total_amt"]);
          i_total_igst =
            parseFloat(i_total_igst) + parseFloat(vi["total_igst"]);
          i_total_cgst =
            parseFloat(i_total_cgst) + parseFloat(vi["total_cgst"]);
          i_total_sgst =
            parseFloat(i_total_sgst) + parseFloat(vi["total_sgst"]);
          i_final_amt = parseFloat(i_final_amt) + parseFloat(vi["final_amt"]);
          i_total_purchase_discount_amt =
            parseFloat(i_total_purchase_discount_amt) +
            parseFloat(vi["discount_proportional_cal"]);
          i_total_discount_proportional_amt =
            parseFloat(i_total_discount_proportional_amt) +
            parseFloat(vi["discount_proportional_cal"]);
          i_total_additional_charges_proportional_amt =
            parseFloat(i_total_additional_charges_proportional_amt) +
            parseFloat(vi["additional_charges_proportional_cal"]);

          // let baseamt = parseFloat(vi["base_amt"]);
          // if (vi["dis_amt"] != "" && vi["dis_amt"] > 0) {
          //   baseamt = baseamt - parseFloat(vi["dis_amt_cal"]);
          // }
          // if (vi["dis_per"] != "" && vi["dis_per"] > 0) {
          //   baseamt = baseamt - parseFloat(vi["dis_per_cal"]);
          // }
          i_base_amt = i_base_amt + parseFloat(vi["total_amt"]);

          return vi;
        });
        // console.log("i_final_amt", i_final_amt);
        v["total_igst"] = parseFloat(i_total_igst).toFixed(2);
        v["total_cgst"] = parseFloat(i_total_cgst).toFixed(2);
        v["total_sgst"] = parseFloat(i_total_sgst).toFixed(2);

        v["final_amt"] = parseFloat(i_final_amt).toFixed(2);
        famt = parseFloat(parseFloat(famt) + parseFloat(i_final_amt)).toFixed(
          2
        );

        totalqtyH += parseInt(v["qtyH"] != "" ? v["qtyH"] : 0);
        totalqtyM += parseInt(v["qtyM"] != "" ? v["qtyM"] : 0);
        totalqtyL += parseInt(v["qtyL"] != "" ? v["qtyL"] : 0);
        totaligstamt += parseFloat(v["total_igst"]).toFixed(2);
        totalcgstamt += parseFloat(v["total_cgst"]).toFixed(2);
        totalsgstamt += parseFloat(v["total_sgst"]).toFixed(2);
        total_purchase_discount_amt =
          parseFloat(total_purchase_discount_amt) +
          parseFloat(i_total_purchase_discount_amt);
        total_discount_proportional_amt =
          parseFloat(total_discount_proportional_amt) +
          parseFloat(i_total_discount_proportional_amt);
        total_additional_charges_proportional_amt =
          parseFloat(total_additional_charges_proportional_amt) +
          parseFloat(i_total_additional_charges_proportional_amt);
        // additional_charges_proportional_cal
        totalbaseamt = parseFloat(
          parseFloat(totalbaseamt) + i_base_amt
        ).toFixed(2);

        totaltaxableamt = parseFloat(
          parseFloat(totaltaxableamt) + parseFloat(i_total_amt)
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
    // console.log("famt", famt);
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
    // ``;
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

  handleBillPayableAmtChange = (value, index) => {
    // console.log({ value, index });
    const { billLst, debitBills } = this.state;
    let fBilllst = billLst.map((v, i) => {
      // console.log('v', v);
      // console.log('payable_amt', v['payable_amt']);
      if (i == index) {
        v["debit_paid_amt"] = parseFloat(value);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(value);
      }
      return v;
    });

    this.setState({ billLst: fBilllst });
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
        let baseamt = 0;
        v["units"] = v.units.map((vi) => {
          if (vi["qty"] != "" && vi["rate"] != "") {
            vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
          } else {
            vi["base_amt"] = 0;
          }

          vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
          baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
          return vi;
        });

        v["base_amt"] = baseamt;
        v["total_amt"] = baseamt;

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
  handleBillselectionDebit = (id, index, status) => {
    let { billLst, selectedBillsdebit } = this.state;
    // console.log({ id, index, status });
    let f_selectedBills = selectedBillsdebit;
    let f_billLst = billLst;
    if (status == true) {
      if (selectedBillsdebit.length > 0) {
        if (!selectedBillsdebit.includes(id)) {
          f_selectedBills = [...f_selectedBills, id];
        }
      } else {
        f_selectedBills = [...f_selectedBills, id];
      }
    } else {
      f_selectedBills = f_selectedBills.filter((v, i) => v != id);
    }
    f_billLst = f_billLst.map((v, i) => {
      if (f_selectedBills.includes(v.debit_note_no)) {
        v["debit_paid_amt"] = parseFloat(v.Total_amt);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);
      } else {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
      }

      return v;
    });

    this.setState({
      isAllCheckeddebit:
        f_billLst.length == f_selectedBills.length ? true : false,
      selectedBillsdebit: f_selectedBills,
      billLst: f_billLst,
    });
  };
  handleBillsSelectionAllDebit = (status) => {
    let { billLst } = this.state;
    let fBills = billLst;
    let lstSelected = [];
    if (status == true) {
      lstSelected = billLst.map((v) => v.debit_note_no);
      // console.log("All BillLst Selection", billLst);
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = parseFloat(v.Total_amt);
        v["debit_remaining_amt"] =
          parseFloat(v["Total_amt"]) - parseFloat(v.Total_amt);

        return v;
      });

      // console.log("fBills", fBills);
    } else {
      fBills = billLst.map((v) => {
        v["debit_paid_amt"] = 0;
        v["debit_remaining_amt"] = parseFloat(v.Total_amt);
        return v;
      });
    }
    this.setState({
      isAllCheckeddebit: status,
      selectedBillsdebit: lstSelected,
      billLst: fBills,
    });
  };

  handleTranxModal = (status) => {
    this.setState({ transaction_mdl_show: status });
    if (status == false) {
      this.handleAdditionalChargesSubmit();
    }
  };

  handleRowChange = (rows) => {
    this.setState({ rows: rows }, () => {
      this.handleAdditionalChargesSubmit();
    });
  };

  render() {
    const {
      show,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      initVal,
      showDiv,
      addunits,
      opendiv,
      outstanding_pur_return_amt,
      adjusmentbillmodal,
      invoice_data,
      invoiceedit,
      clientinfo,
      lerdgerCreate,
      createproductmodal,

      setFieldValue,
      rows,
      productLst,
      serialnopopupwindow,
      pendingordermodal,
      pendingorderprdctsmodalshow,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      purchasePendingOrderLst,
      isAllChecked,
      selectedPendingOrder,

      hidediv,
      adjustbillshow,
      billLst,
      selectedBills,
      selectedBillsdebit,
      isAllCheckeddebit,
      transaction_mdl_show,
      transaction_detail_index,
      lstPackages,
      flag,
    } = this.state;
    // let row_count = [];
    // for (let index = 0; index < 30; index++) {
    //   row_count.push(index);
    // }

    return (
      <>
        {/* <div className=""> */}
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="main-form-style m-2 p-2">
            <div className="main-div ">
              <h4>Create Purchase Invoice</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={invoice_data}
                validationSchema={Yup.object().shape({
                  pi_sr_no: Yup.string()
                    .trim()
                    .required("Purchase no is required"),
                  pi_transaction_dt: Yup.string().required(
                    "Transaction date is required"
                  ),
                  purchaseId: Yup.object().required("Select purchase account"),
                  pi_no: Yup.string().trim().required("invoice no is required"),
                  pi_invoice_dt: Yup.string().required(
                    "Invoice date is required"
                  ),
                  supplierCodeId: Yup.string()
                    .trim()
                    .required("Supplier code is required"),
                  supplierNameId: Yup.string().required(
                    "Supplier Name is required"
                  ),
                  supplierCodeId: Yup.object().required("Select supplier code"),
                  supplierNameId: Yup.object().required("Select supplier name"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // console.log("values", values);
                  this.setState({
                    invoice_data: values,
                    opendiv: false,
                  });
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
                    noValidate
                    className="form-style"
                    autoComplete="off"
                  >
                    <Row>
                      <Col md="1" className="p-0 ps-2">
                        <Form.Group>
                          <Form.Label>
                            Purchase Sr.
                            <span className="pt-1 pl-1 req_validation">
                              *
                            </span>{" "}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            className="pl-2"
                            placeholder=" "
                            name="pi_sr_no"
                            id="pi_sr_no"
                            onChange={handleChange}
                            value={values.pi_sr_no}
                            isValid={touched.pi_sr_no && !errors.pi_sr_no}
                            isInvalid={!!errors.pi_sr_no}
                            readOnly={true}
                          />
                          <span className="text-danger errormsg">
                            {errors.pi_sr_no}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Trans Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>

                          <MyDatePicker
                            name="pi_transaction_dt"
                            placeholderText="DD/MM/YYYY"
                            id="pi_transaction_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pi_transaction_dt", date);
                            }}
                            selected={values.pi_transaction_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />
                          <span className="text-danger errormsg">
                            {errors.pi_transaction_dt}
                          </span>
                        </Form.Group>
                      </Col>

                      <Col md="1">
                        <Form.Group>
                          <Form.Label>
                            Invoice #.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Invoice No."
                            name="pi_no"
                            id="pi_no"
                            onChange={handleChange}
                            value={values.pi_no}
                            isValid={touched.pi_no && !errors.pi_no}
                            isInvalid={!!errors.pi_no}
                          />
                          <span className="text-danger errormsg">
                            {errors.pi_no}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="1" className="p-0 ps-2">
                        <Form.Group>
                          <Form.Label>
                            Invoice Date{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <MyDatePicker
                            name="pi_invoice_dt"
                            placeholderText="DD/MM/YYYY"
                            id="pi_invoice_dt"
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              setFieldValue("pi_invoice_dt", date);
                            }}
                            selected={values.pi_invoice_dt}
                            maxDate={new Date()}
                            className="date-style"
                          />

                          <span className="text-danger errormsg">
                            {errors.pi_invoice_dt}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group className="">
                          <Form.Label>
                            Purchase A/c.{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            autoFocus
                            className="selectTo"
                            classNamePrefix="myDropDown"
                            styles={transSelectTo}
                            isClearable
                            options={purchaseAccLst}
                            borderRadius="0px"
                            colors="#729"
                            name="purchaseId"
                            onChange={(v) => {
                              setFieldValue("purchaseId", v);
                            }}
                            value={values.purchaseId}
                          />

                          <span className="text-danger errormsg">
                            {errors.purchaseId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group className="">
                          <Form.Label>
                            Supplier Name{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={transSelectTo}
                            isClearable
                            options={supplierNameLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierNameId"
                            onChange={(v) => {
                              if (v != null) {
                                setFieldValue(
                                  "supplierCodeId",
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                              }
                              setFieldValue("supplierNameId", v);
                            }}
                            value={values.supplierNameId}
                          />

                          <span className="text-danger errormsg">
                            {errors.supplierNameId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group className="">
                          <Form.Label>
                            Supplier Code{" "}
                            <span className="pt-1 pl-1 req_validation">*</span>
                          </Form.Label>
                          <Select
                            className="selectTo"
                            styles={transSelectTo}
                            isClearable
                            options={supplierCodeLst}
                            borderRadius="0px"
                            colors="#729"
                            name="supplierCodeId"
                            onChange={(v) => {
                              setFieldValue("supplierCodeId", v);
                              if (v != null) {
                                setFieldValue(
                                  "supplierNameId",
                                  getSelectValue(supplierNameLst, v.value)
                                );
                              }
                            }}
                            value={values.supplierCodeId}
                          />

                          <span className="text-danger errormsg">
                            {errors.supplierCodeId}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col
                        md="2"
                        className="d-flex p-0"
                        style={{
                          justifyContent: "end",
                          marginLeft: "-10px",
                        }}
                      >
                        <Button className="successbtn-style ms-2" type="submit">
                          Create
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            this.myRef.current.resetForm();
                            this.setState({ opendiv: !opendiv });
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Collapse>
        <div className="purchase-style">
          {opendiv != true ? (
            <Row className="px-3 py-3" style={{ backgroundColor: "#CEE7F1" }}>
              <Col md="4" style={{ borderRight: "1px solid #e1e1e1" }}>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={3} className="lbl">
                    Branchs:
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      isClearable={true}
                      components={{
                        // DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      autoFocus="true"
                      className="selectTo"
                      styles={purchaseSelect}
                      name="groupId"
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  controlId="formHorizontalEmail"
                  className="mb-2"
                >
                  <Form.Label column sm={3} className="lbl">
                    Transaction Date:
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Label>
                      <img
                        src={calendar2date}
                        style={{ height: "20px" }}
                        className="mb-2 me-2"
                      ></img>
                      5-08-2022
                    </Form.Label>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={3} className="lbl">
                    Purchase Sr#:
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control
                      type="email"
                      placeholder="Enter"
                      className="formhover"
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col md="4" style={{ borderRight: "1px solid #e1e1e1" }}>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={3} className="lbl">
                    Supplier Code:
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control
                      type="email"
                      placeholder="Enter"
                      className="formhover"
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={3} className="lbl">
                    Supplier Name:
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="email"
                      placeholder="Enter"
                      className="formhover"
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={3} className="lbl">
                    Purchase A/C
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      isClearable={true}
                      components={{
                        // DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                      }}
                      autoFocus="true"
                      className="selectTo"
                      styles={purchaseSelect}
                      name="groupId"
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col md="4">
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={3} className="lbl">
                    Invoice Date :
                  </Form.Label>
                  <Col sm={3}>
                    <MyDatePicker
                      name="pi_invoice_dt"
                      placeholderText="DD/MM/YYYY"
                      id="pi_invoice_dt"
                      dateFormat="dd/MM/yyyy"
                      className="formhover"
                      //className="date-style"
                    />
                    {/* <InputGroup className="mb-3">
                      
                      <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                    </InputGroup> */}
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={3} className="lbl">
                    Invoice Sr:
                  </Form.Label>
                  <Col sm={4}>
                    <Form.Control
                      type="email"
                      placeholder="Enter"
                      className="formhover"
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          ) : (
            ""
          )}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={{
              totalamt: 0,
              totalqty: 0,
              roundoff: 0,
              narration: "",
              tcs: 0,
              purchase_discount: 0,
              purchase_discount_amt: 0,
              total_purchase_discount_amt: 0,
              total_base_amt: 0,
              total_tax_amt: 0,
              total_taxable_amt: 0,
              total_dis_amt: 0,
              total_dis_per: 0,
              totalcgstper: 0,
              totalsgstper: 0,
              totaligstper: 0,
              purchase_disc_ledger: "",
              total_discount_proportional_amt: 0,
              total_additional_charges_proportional_amt: 0,
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();
              // ;

              this.handleFetchData(invoice_data.supplierCodeId.value);
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
                <>
                  <Row className="mx-1">
                    <Col md="12" className="px-0">
                      <div className="table-style my-2">
                        <Table hover id="my_table">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  width: "9px",
                                  height: "12px",
                                  marginLeft: "10px",
                                  marginTop: "calc(50% - 12px/2)",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              >
                                #
                              </th>
                              <th
                                style={{
                                  width: "581px",
                                  height: "12px",
                                  marginLeft: "32px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              >
                                Product
                              </th>

                              <th
                                style={{
                                  width: "102.7px",
                                  height: "12px",
                                  marginLeft: "848.58px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              >
                                Pakage
                              </th>
                              <th
                                style={{
                                  width: "79.59px",
                                  height: "12px",
                                  marginLeft: "961.55px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              >
                                Unit
                              </th>
                              <th
                                style={{
                                  width: "78.31px",
                                  height: "12px",
                                  marginLeft: "1052.7px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              >
                                Qty
                              </th>
                              <th
                                style={{
                                  width: "107.84px",
                                  height: "12px",
                                  marginLeft: "1141.28px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              >
                                Rate
                              </th>
                              <th
                                style={{
                                  width: "107.84px",
                                  height: "12px",
                                  marginLeft: "1258.11px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              >
                                Disc.Amt
                              </th>
                              <th
                                style={{
                                  width: "74.46px",
                                  height: "12px",
                                  marginLeft: "1377.5px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              >
                                Disc%
                              </th>
                              <th
                                style={{
                                  width: "84.73px",
                                  height: "12px",
                                  marginLeft: "1475.07px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                  //  textAlign: "right",
                                }}
                              >
                                Base.Amt
                              </th>
                              <th
                                style={{
                                  width: "44.93px",
                                  height: "12px",
                                  marginLeft: "1576.49px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                  // textAlign: "right",
                                }}
                              >
                                GST%
                              </th>
                              <th
                                style={{
                                  width: "66.76px",
                                  height: "12px",
                                  marginLeft: "1639.39px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                  //textAlign: "right",
                                }}
                              >
                                Tax
                              </th>
                              <th
                                style={{
                                  width: "87px",
                                  height: "12px",
                                  marginLeft: "1751px",
                                  marginTop: "12px",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                  // textAlign: "right",
                                }}
                                // colSpan={3}
                              >
                                Taxable
                              </th>
                              <th
                                style={{
                                  width: "9px",
                                  height: "12px",
                                  marginLeft: "10px",
                                  marginTop: "calc(50% - 12px/2)",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              ></th>
                              <th
                                style={{
                                  width: "9px",
                                  height: "12px",
                                  marginLeft: "10px",
                                  marginTop: "calc(50% - 12px/2)",
                                  fontFamily: "Inter",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  // fontSize: "14px",
                                }}
                              ></th>
                            </tr>
                          </thead>
                          {/* <tbody>
                            {rows.map((v, ii) => {
                              return (
                                <TRowComponentModified
                                  i={ii}
                                  setFieldValue={setFieldValue.bind(this)}
                                  setElementValue={this.setElementValue.bind(
                                    this
                                  )}
                                  handleChangeArrayElement={this.handleChangeArrayElement.bind(
                                    this
                                  )}
                                  productLst={productLst}
                                  handlePlaceHolder={this.handlePlaceHolder.bind(
                                    this
                                  )}
                                  lstPackages={lstPackages}
                                  handleUnitLstOptLength={this.handleUnitLstOptLength.bind(
                                    this
                                  )}
                                  rows={rows}
                                  isDisabled={false}
                                  handleClearProduct={this.handleClearProduct.bind(
                                    this
                                  )}
                                  handleRowChange={this.handleRowChange.bind(
                                    this
                                  )}
                                  handleLstPackage={this.handleLstPackage.bind(
                                    this
                                  )}
                                  tranx={"purchase"}
                                  showBatch
                                />
                              );
                            })}
                          </tbody> */}
                          <tbody style={{ borderTop: "2px solid transparent" }}>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd box-style"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd box-style"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "#eaedef",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "#eaedef",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "#eaedef",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Mark</td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Select
                                  className="selectTo selectdd"
                                  // autoFocus={true}
                                  components={{
                                    // DropdownIndicator: () => null,
                                    IndicatorSeparator: () => null,
                                  }}
                                  placeholder="Select"
                                  styles={invoiceSelectTo}
                                />
                              </td>
                              <td>
                                {" "}
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  onChange={(e) => {
                                    this.handleAdditionalChargesSubmit(
                                      e.target.value,
                                      "purchase_discount"
                                    );
                                  }}
                                  value={values.purchase_discount}
                                  readOnly={
                                    values.purchase_disc_ledger == ""
                                      ? true
                                      : false
                                  }
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="999999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="28%"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="9999.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td style={{ background: "#eaedef" }}>
                                <Form.Control
                                  className="box-style p-1"
                                  aria-label="Default"
                                  aria-describedby="inputGroup-sizing-default"
                                  // className="amtreadonly"

                                  type="text"
                                  name="purchase_discount"
                                  placeholder="123456789.99"
                                  style={{
                                    borderColor: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mx-0">
                    <Col md={10}>
                      <Row
                        className="me-0 py-2"
                        style={{ background: "#DEE4EB" }}
                      >
                        <Col sm={8}>
                          <Row>
                            <Col md={2}>
                              <Form.Label className="text-label">
                                Disc Ledger:
                              </Form.Label>
                            </Col>
                            <Col md={3}>
                              <Select
                                components={{
                                  // DropdownIndicator: () => null,
                                  IndicatorSeparator: () => null,
                                }}
                                isClearable={true}
                                styles={CustomCss}
                                name="groupId"
                              />
                            </Col>
                            <Col
                              md={2}
                              style={{ display: "flex", padding: "0" }}
                            >
                              <Form.Label className="text-label">
                                Disc:
                              </Form.Label>
                              <Form.Control
                                // style={{ width: "100px" }}
                                type="text"
                                placeholder="Enter"
                                className="text-box formhover"
                                id=""
                                name=""
                              />
                            </Col>

                            <Col
                              md={2}
                              style={{ display: "flex", padding: "0" }}
                            >
                              <Form.Label className="text-label text-center">
                                Disc Amt:
                              </Form.Label>
                              <Form.Control
                                // style={{ width: "100px" }}
                                type="text"
                                placeholder="Enter"
                                className="text-box formhover"
                                id=""
                                name=""
                              />
                            </Col>

                            <Col
                              md={3}
                              style={{ display: "flex", padding: "0" }}
                            >
                              <Form.Label className="text-label">
                                Add Charges:
                              </Form.Label>
                              <Form.Control
                                type="text"
                                // style={{ width: "131px" }}
                                placeholder="Enter"
                                className="text-box formhover box"
                                id=""
                                name=""
                              />
                            </Col>
                          </Row>

                          <Row className="mt-2">
                            <Col sm={2}>
                              <Form.Label className="text-label">
                                Narration:
                              </Form.Label>
                            </Col>
                            <Col sm={10}>
                              <Form.Control
                                as="textarea"
                                placeholder="Enter"
                                style={{ height: "72px" }}
                                className="formhover"
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col sm={4}>
                          <Table
                            className="my-3 text-center lgtbfont"
                            // style={{ marginLeft: "auto", marginRight: "auto" }}
                          >
                            <tbody>
                              <tr>
                                <td className="p-0">3%</td>
                                <td className="p-0">9999.99</td>
                                <td className="p-0">9999.99</td>
                                <td className="p-0">9999.99</td>
                              </tr>
                              <tr>
                                <td className="p-0">12%</td>
                                <td className="p-0">9999.99</td>
                                <td className="p-0">9999.99</td>
                                <td className="p-0">9999.99</td>
                              </tr>
                              <tr>
                                <td className="p-0">18%</td>
                                <td className="p-0">9999.99</td>
                                <td className="p-0">9999.99</td>
                                <td className="p-0">9999.99</td>
                              </tr>
                              <tr>
                                <td className="p-0">28%</td>
                                <td className="p-0">9999.99</td>
                                <td className="p-0">9999.99</td>
                                <td className="p-0">9999.99</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={2} style={{ backgroundColor: "#F8F0D2" }}>
                      <Table
                        className="my-3 px-3 text-end smalltbfont"
                        style={{ borderBottom: "transparent" }}
                      >
                        <tbody>
                          <tr>
                            <td className="p-0">Total</td>
                            <td className="p-0">9999.99</td>
                          </tr>
                          <tr>
                            <td className="p-0">Round Off</td>
                            <td className="p-0">9999.99</td>
                          </tr>
                          <tr>
                            <td className="p-0">Tax Amt.</td>
                            <td className="p-0">9999.99</td>
                          </tr>
                          <tr>
                            <td className="p-0">Final Amt.</td>
                            <td className="p-0">9999.99</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row className="py-1">
                    <Col className="text-end">
                      <Button
                        variant="secondary cancel-btn"
                        className=""
                        onClick={(e) => {
                          e.preventDefault();

                          eventBus.dispatch(
                            "page_change",
                            "tranx_purchase_invoice_list"
                          );
                        }}
                        style={{
                          background: "#ADADAD",
                          borderRadius: "15px",
                          color: "#fff",
                          border: "1px solid #adadad",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="successbtn-style ms-2"
                        type="submit"
                        style={{
                          borderRadius: "15px",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                        }}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      background: "#EEEFF2",
                      border: "1px solid #c7c7c7",
                    }}
                  >
                    <Col md="1">
                      <Form.Label className="btmstylelbl">
                        <img
                          src={keyboard}
                          className="svg-style mt-0"
                          style={{ borderRight: "1px solid #c7c7c7" }}
                        ></img>
                        New entry:<span className="shortkey">Ctrl+N</span>
                      </Form.Label>
                    </Col>
                    <Col md="9">
                      {" "}
                      <Form.Label className="btmstylelbl">
                        Duplicate: <span className="shortkey">Ctrl+D</span>
                      </Form.Label>
                    </Col>
                    {/* <Col md="8"></Col> */}
                    <Col md="2" className="text-end">
                      <img
                        src={question}
                        className="svg-style ms-1"
                        style={{ borderLeft: "1px solid #c7c7c7" }}
                      ></img>
                    </Col>
                  </Row>
                </>
              </Form>
            )}
          </Formik>
          {/* additional charges */}
          <Modal
            show={additionchargesyes}
            // size="sm"
            className="mt-5 mainmodal"
            onHide={() => this.handleAdditionalChargesSubmit()}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Additional Charges
              </Modal.Title>
              {/* <CloseButton
              variant="white"
              className="pull-right"
              onClick={() => this.handleAdditionalChargesSubmit(false)}
            /> */}
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <div className="purchasescreen">
                {additionalCharges.length > 0 && (
                  <Table className="serialnotbl additionachargestbl  table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Ledger</th>
                        <th> Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalCharges.map((v, i) => {
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td style={{ width: "75%" }}>
                              <Select
                                className="selectTo"
                                components={{
                                  DropdownIndicator: () => null,
                                  IndicatorSeparator: () => null,
                                }}
                                placeholder=""
                                styles={customStyles}
                                isClearable
                                options={lstAdditionalLedger}
                                borderRadius="0px"
                                colors="#729"
                                onChange={(value) => {
                                  this.handleAdditionalCharges(
                                    "ledgerId",
                                    i,
                                    value
                                  );
                                }}
                                value={this.setAdditionalCharges("ledgerId", i)}
                              />
                            </td>
                            <td className="additionamt pr-5 pl-1">
                              <Form.Control
                                type="text"
                                placeholder=""
                                onChange={(value) => {
                                  this.handleAdditionalCharges(
                                    "amt",
                                    i,
                                    value.target.value
                                  );
                                }}
                                value={this.setAdditionalCharges("amt", i)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={2} style={{ textAlign: "right" }}>
                          Total:{" "}
                        </td>
                        <td clasName="additionamt pr-5 pl-1">
                          <Form.Control
                            type="text"
                            placeholder=""
                            readOnly
                            value={additionalChargesTotal}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer className="p-0">
              <li>
                Ledger Create <span>ctrl+c</span>
                {/* <span>l</span> */}
              </li>
              <Button
                className="createbtn seriailnobtn"
                onClick={(e) => {
                  e.preventDefault();

                  this.handleAdditionalChargesSubmit();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={adjustbillshow}
            size="lg"
            className="transaction_mdl invoice-mdl-style"
            onHide={() => this.setState({ adjustbillshow: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header
            // closeButton
            // closeVariant="white"
            // className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Settlement of Bills
              </Modal.Title>
              <CloseButton
                // variant="white"
                className="pull-right"
                // onClick={this.handleClose}
                onClick={() => this.setState({ adjustbillshow: false })}
              />
            </Modal.Header>

            <Modal.Body className="p-0 ">
              <div className="table_wrapper">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={{
                    debitnoteNo: "",
                    newReference: "",
                  }}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    this.handleFetchData(values);
                    console.log("in settlement");
                    // this.setState({ billLst: values, adjustbillshow: false });
                    let requestData = new FormData();
                    requestData.append(
                      "debitNoteReference",
                      values.newReference
                    );
                    let row = billLst.filter((v) => v.Total_amt != "");
                    if (values.newReference == "true") {
                      let bills = [];
                      row.map((v) => {
                        // if (selectedBills.includes(parseInt(v.id))) {
                        bills.push({
                          debitNoteId: v.id,
                          debitNotePaidAmt: v.debit_paid_amt,
                          debitNoteRemaningAmt: v.debit_remaining_amt,
                          source: v.source,
                        });
                      });
                      requestData.append("bills", JSON.stringify(bills));
                    }
                    console.log("invoice_data", invoice_data);

                    // !Invoice Data
                    requestData.append(
                      "invoice_date",
                      moment(invoice_data.pi_invoice_dt).format("yyyy-MM-DD")
                    );
                    requestData.append("invoice_no", invoice_data.pi_no);
                    requestData.append(
                      "purchase_id",
                      invoice_data.purchaseId.value
                    );
                    requestData.append("purchase_sr_no", invoice_data.pi_sr_no);
                    requestData.append(
                      "transaction_date",
                      moment(invoice_data.pi_transaction_dt).format(
                        "yyyy-MM-DD"
                      )
                    );

                    if (this.state.selectedPendingOrder.length > 0) {
                      requestData.append(
                        "reference_po_ids",
                        this.state.selectedPendingOrder.join(",")
                      );
                    }

                    if (this.state.selectedPendingChallan.length > 0) {
                      requestData.append(
                        "reference_pc_ids",
                        this.state.selectedPendingChallan.join(",")
                      );
                    }
                    requestData.append(
                      "supplier_code_id",
                      invoice_data.supplierCodeId.value
                    );
                    // !Invoice Data
                    let returnValues = this.myRef.current.values;
                    requestData.append("roundoff", returnValues.roundoff);
                    if (
                      returnValues.narration &&
                      returnValues.narration != ""
                    ) {
                      requestData.append("narration", returnValues.narration);
                    }
                    requestData.append(
                      "total_base_amt",
                      returnValues.total_base_amt
                    );
                    requestData.append("totalamt", returnValues.totalamt);
                    requestData.append(
                      "taxable_amount",
                      returnValues.total_taxable_amt
                    );
                    requestData.append("totalcgst", returnValues.totalcgst);
                    requestData.append("totalsgst", returnValues.totalsgst);
                    requestData.append("totaligst", returnValues.totaligst);
                    requestData.append("totalqty", returnValues.totalqty);
                    requestData.append("tcs", returnValues.tcs);
                    requestData.append(
                      "purchase_discount",
                      returnValues.purchase_discount
                    );
                    requestData.append(
                      "purchase_discount_amt",
                      returnValues.purchase_discount_amt
                    );
                    // requestData.append(
                    //   "total_purchase_discount_amt",
                    //   returnValues.purchase_discount_amt > 0
                    //     ? returnValues.purchase_discount_amt
                    //     : returnValues.total_purchase_discount_amt
                    // );
                    requestData.append(
                      "total_purchase_discount_amt",
                      returnValues.purchase_discount_amt > 0
                        ? isNaN(returnValues.purchase_discount_amt)
                          ? 0
                          : returnValues.purchase_discount_amt
                        : isNaN(returnValues.total_purchase_discount_amt)
                        ? 0
                        : returnValues.total_purchase_discount_amt
                    );
                    requestData.append(
                      "purchase_disc_ledger",
                      returnValues.purchase_disc_ledger
                        ? returnValues.purchase_disc_ledger.value
                        : 0
                    );

                    let frow = rows.map((v, i) => {
                      let funits = v.productDetails.filter((vi) => {
                        vi["packageId"] = vi.packageId ? vi.packageId.id : "";
                        vi["is_multi_unit"] = vi.is_multi_unit;
                        vi["pack_name"] = vi.pack_name;
                        vi["unitCount"] = vi.unitCount;
                        return vi;
                      });
                      if (v.productId != "") {
                        return {
                          details_id: 0,
                          product_id: v.productId.value,

                          qtyH: v.qtyH != "" ? v.qtyH : 0,
                          rateH: v.rateH != "" ? v.rateH : 0,
                          qtyM: v.qtyM != "" ? v.qtyM : 0,
                          rateM: v.rateM != "" ? v.rateM : 0,
                          qtyL: v.qtyL != "" ? v.qtyL : 0,
                          rateL: v.rateL != "" ? v.rateL : 0,
                          base_amt_H: v.base_amt_H != "" ? v.base_amt_H : 0,
                          base_amt_L: v.base_amt_L != "" ? v.base_amt_L : 0,
                          base_amt_M: v.base_amt_M != "" ? v.base_amt_M : 0,
                          base_amt: v.base_amt != "" ? v.base_amt : 0.0,
                          dis_amt: v.dis_amt != "" ? v.dis_amt : 0.0,
                          dis_per: v.dis_per != "" ? v.dis_per : 0.0,
                          dis_per_cal: v.dis_per_cal != "" ? v.dis_per_cal : 0,
                          dis_amt_cal: v.dis_amt_cal != "" ? v.dis_amt_cal : 0,
                          total_amt: v.total_amt != "" ? v.total_amt : 0,
                          igst: v.igst != "" ? v.igst : 0,
                          cgst: v.cgst != "" ? v.cgst : 0,
                          sgst: v.sgst != "" ? v.sgst : 0,
                          total_igst: v.total_igst != "" ? v.total_igst : 0,
                          total_cgst: v.total_cgst != "" ? v.total_cgst : 0,
                          total_sgst: v.total_sgst != "" ? v.total_sgst : 0,
                          final_amt: v.final_amt != "" ? v.final_amt : 0,
                          serialNo: v.serialNo,
                          discount_proportional_cal:
                            v.discount_proportional_cal != ""
                              ? v.discount_proportional_cal
                              : 0,
                          additional_charges_proportional_cal:
                            v.additional_charges_proportional_cal != ""
                              ? v.additional_charges_proportional_cal
                              : 0,
                          reference_id:
                            v.reference_id != "" ? v.reference_id : 0,
                          reference_type:
                            v.reference_type != "" ? v.reference_type : "",
                          productDetails: funits,
                          // packageId: v.packageId ? v.packageId.value : "",
                        };
                      }
                    });

                    var filtered = frow.filter(function (el) {
                      return el != null;
                    });
                    let additionalChargesfilter = additionalCharges.filter(
                      (v) => {
                        if (
                          v.ledgerId != "" &&
                          v.ledgerId != undefined &&
                          v.ledgerId != null
                        ) {
                          v["ledger"] = v["ledgerId"]["value"];
                          return v;
                        }
                      }
                    );
                    requestData.append(
                      "additionalChargesTotal",
                      additionalChargesTotal
                    );
                    requestData.append("row", JSON.stringify(filtered));
                    requestData.append(
                      "additionalCharges",
                      JSON.stringify(additionalChargesfilter)
                    );

                    if (
                      authenticationService.currentUserValue.state &&
                      invoice_data &&
                      invoice_data.supplierCodeId &&
                      invoice_data.supplierCodeId.state !=
                        authenticationService.currentUserValue.state
                    ) {
                      let taxCal = {
                        igst: this.state.taxcal.igst,
                      };

                      requestData.append("taxFlag", false);
                      requestData.append(
                        "taxCalculation",
                        JSON.stringify(taxCal)
                      );
                    } else {
                      let taxCal = {
                        cgst: this.state.taxcal.cgst,
                        sgst: this.state.taxcal.sgst,
                      };
                      // console.log("taxCal", taxCal);
                      requestData.append(
                        "taxCalculation",
                        JSON.stringify(taxCal)
                      );
                      requestData.append("taxFlag", true);
                    }

                    // List key/value pairs
                    for (let [name, value] of requestData) {
                      // console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
                    }

                    createPurchaseInvoice(requestData)
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
                          resetForm();
                          this.initRow();

                          eventBus.dispatch("page_change", {
                            from: "tranx_purchase_invoice_create",
                            to: "tranx_purchase_invoice_list",

                            isNewTab: false,
                          });
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
                        // console.log('error', error);
                      });
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
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <Form.Label>
                              {/* Adjust Amount In Bill?{' '} */}
                              <span className="redstar"></span>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col md="2">
                          <Form.Group className="gender nightshiftlabel">
                            <Form.Label>
                              <input
                                name="newReference"
                                type="radio"
                                value="true"
                                checked={
                                  values.newReference === "true" ? true : false
                                }
                                onChange={handleChange}
                                className="mr-3"
                              />
                              <span className="ml-3">&nbsp;&nbsp;YES</span>
                            </Form.Label>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group className="nightshiftlabel">
                            <Form.Label className="ml-3">
                              <input
                                name="newReference"
                                type="radio"
                                value="false"
                                onChange={handleChange}
                                checked={
                                  values.newReference === "false" ? true : false
                                }
                                className="mr-3"
                              />
                              <span className="ml-3">&nbsp;&nbsp;NO</span>
                            </Form.Label>

                            <span className="text-danger">
                              {errors.newReference && "Select Option"}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                      {values.newReference === "true" && (
                        <div className="table_wrapper1">
                          <Table className="mb-2">
                            <thead>
                              <tr>
                                <th className="">
                                  <Form.Group
                                    controlId="formBasicCheckbox"
                                    className="ml-1 mb-1 pmt-allbtn"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      checked={
                                        isAllCheckeddebit === true
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        this.handleBillsSelectionAllDebit(
                                          e.target.checked
                                        );
                                      }}
                                      label="Sr.#"
                                    />
                                  </Form.Group>
                                  {/* <span className="pt-2 mt-2"> Debit Note No</span> */}
                                </th>
                                <th>Debit Note No</th>
                                <th> Debit Note Date</th>
                                <th>Total amount</th>
                                <th style={{ width: "23%" }}>Paid Amt</th>
                                <th>Remaining Amt</th>

                                {/* <th style={{ width: '23%' }}>Paid Amt</th>
                            <th>Remaining Amt</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {billLst.map((v, i) => {
                                return (
                                  <tr>
                                    <td style={{ width: "5%" }}>
                                      <Form.Group
                                        controlId="formBasicCheckbox1"
                                        className="ml-1 pmt-allbtn"
                                      >
                                        <Form.Check
                                          type="checkbox"
                                          checked={selectedBillsdebit.includes(
                                            v.debit_note_no
                                          )}
                                          onChange={(e) => {
                                            this.handleBillselectionDebit(
                                              v.debit_note_no,
                                              i,
                                              e.target.checked
                                            );
                                          }}
                                          // onClick={(e) => {
                                          //   let checked = e.target.checked;

                                          //   if (checked == true) {
                                          //     this.handleBillPayableAmtChange(
                                          //       v.Total_amt,
                                          //       i
                                          //     );
                                          //   } else {
                                          //     this.handleBillPayableAmtChange(
                                          //       0,
                                          //       i
                                          //     );
                                          //   }
                                          // }}
                                          label={i + 1}
                                        />
                                      </Form.Group>
                                    </td>
                                    <td>{v.debit_note_no}</td>

                                    <td>
                                      {moment(v.debit_note_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>

                                    <td>{v.Total_amt}</td>
                                    <td>
                                      {/* {vi.paid_amt} */}
                                      <Form.Control
                                        type="text"
                                        onChange={(e) => {
                                          e.preventDefault();

                                          this.handleBillPayableAmtChange(
                                            e.target.value,
                                            i
                                          );
                                        }}
                                        value={v.debit_paid_amt}
                                        className="paidamttxt"
                                        //style={{ paddingTop: "0" }}
                                      />
                                    </td>
                                    <td>
                                      {parseFloat(
                                        v.debit_remaining_amt
                                      ).toFixed(2)
                                        ? v.debit_remaining_amt
                                        : 0}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="bb-total">
                              <tr>
                                <td colSpan={2} className="bb-t">
                                  {" "}
                                  <b>Total</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </td>
                                <td></td>
                                <td>
                                  {billLst.length > 0 &&
                                    billLst.reduce(function (prev, next) {
                                      return parseFloat(
                                        parseFloat(prev) +
                                          parseFloat(
                                            next.Total_amt ? next.Total_amt : 0
                                          )
                                      ).toFixed(2);
                                    }, 0)}
                                </td>
                                <td>
                                  {" "}
                                  {billLst.length > 0 &&
                                    billLst.reduce(function (prev, next) {
                                      return parseFloat(
                                        parseFloat(prev) +
                                          parseFloat(
                                            next.debit_paid_amt
                                              ? next.debit_paid_amt
                                              : 0
                                          )
                                      ).toFixed(2);
                                    }, 0)}
                                </td>
                                <td>
                                  {" "}
                                  {billLst.length > 0 &&
                                    billLst.reduce(function (prev, next) {
                                      return parseFloat(
                                        parseFloat(prev) +
                                          parseFloat(
                                            next.debit_remaining_amt
                                              ? next.debit_remaining_amt
                                              : 0
                                          )
                                      ).toFixed(2);
                                    }, 0)}
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      )}

                      <Row className="m-2">
                        <Col md={12}>
                          <Button className="createbtn float-end" type="submit">
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
        </div>
      </>
    );
  }
}
