import React, { Component } from "react";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import calendar2 from "@/assets/images/calendar2.png";
import add from "@/assets/images/add.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import TGSTFooter from "../../Components/TGSTFooter";
import CMPTranxRow from "../../Components/CMPTranxRow";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCropSimple,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
  Alert,
} from "react-bootstrap";

import {
  getPurchaseAccounts,
  getSundryCreditors,
  getLastPurchaseInvoiceNo,
  getProduct,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  getPurchaseInvoiceShowById,
  getProductFlavourList,
  get_Product_batch,
  listTranxDebitesNotes,
  createPOChallanInvoice,
  getLastPOChallanInvoiceNo,
  checkInvoiceDateIsBetweenFY,
  checkLedgerDrugAndFssaiExpiryByLedgerId,
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
} from "@/helpers";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class TranxPurchaseInvoiceCreate_bk extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.dpRef = React.createRef();
    this.batchdpRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.mfgDateRef = React.createRef();

    this.invoiceDateRef = React.createRef();

    this.state = {
      isBranch: false,
      purchaseAccLst: [],
      supplierNameLs: [],
      supplierCodeLst: [],
      productLst: [],
      rows: [],
      additionalCharges: [],
      lstDisLedger: [],
      lstAdditionalLedger: [],
      invoice_data: "",
      lerdgerCreate: false,
      lstBrand: [],
      batchModalShow: false,
      batchData: "",
      batchInitVal: "",
      b_details_id: 0,
      isBatch: false,
      tr_id: "",
      fetchBatch: [],
      isBatchNo: "",
      rowIndex: -1,
      brandIndex: -1,
      categoryIndex: -1,
      subcategoryIndex: -1,
      flavourIndex: -1,
      packageIndex: -1,
      unitIndex: -1,
      taxcal: { igst: [], cgst: [], sgst: [] },
      additionalChargesTotal: 0,
      invoice_data: {
        pc_sr_no: "",
        pc_no: "",
        pc_transaction_dt: new Date(),
        pc_invoice_dt: "",
        purchaseId: "",
        supplierCodeId: "",
        supplierNameId: "",
        totalamt: 0,
        totalqty: 0,
        roundoff: 0,
        narration: "",
        debitnoteNo: "",
        newReference: "",
        tcs: 0,
        purchase_discount: 0,
        purchase_discount_amt: 0,
        total_purchase_discount_amt: 0,
        total_base_amt: 0,
        total_b_amt: 0,

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
        gstId: "",
      },
      lstGst: [],
      rowDelDetailsIds: [],
      batch_error: false,
    };
  }

  /**** Validation of FSSAI and DRUG Expriry of suppliers *****/
  setSupplierData = (supplierId = "", setFieldValue) => {
    console.warn("warn :: supplierId", supplierId);
    let requestData = new FormData();
    requestData.append("ledgerId", supplierId && supplierId.value);
    checkLedgerDrugAndFssaiExpiryByLedgerId(requestData)
      .then((response) => {
        console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "confirm",
              title: `${res.message} expired...`,
              msg: "Do you want continue with invoice",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => {},
              handleFailFn: () => {
                this.reloadPage();
              },
            },
            () => {}
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });

    let opt = [];
    opt = supplierId.gstDetails.map((v, i) => {
      return {
        label: v.gstin,
        value: v.id,
      };
    });
    this.setState({ lstGst: opt }, () => {
      if (opt.length > 0) setFieldValue("gstId", opt[0]);
    });
  };

  validatePurchaseRate = (mrp = 0, p_rate = 0) => {
    console.log("MRP ::", mrp);
    console.log("Purchase rate ::", p_rate);
    if (parseFloat(mrp) < parseFloat(p_rate)) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "MRP shouldn't less than purchase rate",
        //  is_timeout: true,
        //  delay: 1000,
      });
    }
  };
  validateSalesRate = (mrp, purchaseRate, salesRates) => {
    if (
      parseFloat(salesRates) < parseFloat(purchaseRate) ||
      parseFloat(salesRates) > parseFloat(mrp)
    ) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "Sales rate is always between Purchase and Mrp",
        //  is_timeout: true,
        //  delay: 1000,
      });
    }
  };
  validateMaxDiscount = (maxDiscount, purchaseRate, salesRates, minMargin) => {
    let discountInPer = parseFloat(purchaseRate * 100) / parseFloat(salesRates);
    let discountInAmt =
      (parseFloat(salesRates) * parseFloat(maxDiscount)) / 100;
    let minMarginAmt = (parseFloat(purchaseRate) * parseFloat(minMargin)) / 100;
    let maxDiscountAmt = minMarginAmt + parseFloat(purchaseRate);
    if (discountInAmt > maxDiscountAmt) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: `Can't set discount amount ${parseFloat(discountInAmt).toFixed(
          2
        )} is more than Max disc.amt(margin included)  ${parseFloat(
          maxDiscountAmt
        ).toFixed(2)} `,
        //  is_timeout: true,
        //  delay: 1000,
      });
    }
  };

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt }, () => {
            let v = opt.filter((v) =>
              v.label.toLowerCase().includes("purchase a/c")
            );
            console.log("sid:: lstPurchaseAccounts", { v }, v[0]);
            if (v != null && v != undefined)
              this.myRef.current.setFieldValue("purchaseId", v[0]);
          });
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
              value: parseInt(v.id),
              code: v.ledger_code,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode;
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
              value: parseInt(v.id),
              name: v.name,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,
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
  lstProduct = () => {
    getProduct()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let opt = data.map((v) => {
            return {
              label: v.productName,
              value: v.id,
              isBatchNo: v.isBatchNo,
            };
          });
          this.setState({ productLst: opt });
        }
      })
      .catch((error) => {});
  };
  setLastPurchaseSerialNo = () => {
    getLastPurchaseInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          // const { initVal } = this.state;
          // initVal["pi_sr_no"] = res.count;
          // initVal["pi_no"] = res.serialNo;
          if (this.myRef.current) {
            this.myRef.current.setFieldValue("pi_sr_no", res.count);
            this.myRef.current.setFieldValue("pi_no", res.serialNo);
          }
          // this.setState({ initVal: initVal });
        }
      })
      .catch((error) => {});
  };
  checkInvoiceDateIsBetweenFYFun = (invoiceDate = "", setFieldValue) => {
    let requestData = new FormData();
    requestData.append(
      "invoiceDate",
      moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
    );
    checkInvoiceDateIsBetweenFY(requestData)
      .then((response) => {
        console.log("res", response);
        let res = response.data;
        if (res.responseStatus != 200) {
          MyNotifications.fire(
            {
              show: true,
              icon: "confirm",
              title: "Challan date not valid as per FY",
              msg: "Do you want continue with challan date",
              is_button_show: false,
              is_timeout: false,
              delay: 0,
              handleSuccessFn: () => {},
              handleFailFn: () => {
                setFieldValue("pc_invoice_date", "");
                eventBus.dispatch(
                  "page_change",
                  "tranx_purchase_challan_create"
                );
                // this.reloadPage();
              },
            },
            () => {}
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  getLastPurchaseChallanSerialNo = () => {
    getLastPOChallanInvoiceNo()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          // let { initVal } = this.state;
          // initVal["pc_sr_no"] = res.count;
          // initVal["pc_no"] = res.serialNo;
          // this.setState({ initVal: initVal });
          if (this.myRef.current) {
            this.myRef.current.setFieldValue("pc_sr_no", res.count);
            // this.myRef.current.setFieldValue("pc_no", res.serialNo);
          }
        }
      })
      .catch((error) => {});
  };
  initRow = (len = null) => {
    let lst = [];
    let condition = 1;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        productId: "",
        brandDetails: [
          {
            brandId: "",
            groupDetails: [
              {
                groupId: "",
                categoryDetails: [
                  {
                    categoryId: "",
                    subcategoryDetails: [
                      {
                        subcategoryId: "",
                        packageDetails: [
                          {
                            packageId: "",
                            unitDetails: [
                              {
                                is_multi_unit: "",
                                unitCount: "",
                                unitId: "",
                                qty: "",
                                rate: "",
                                base_amt: 0,
                                unit_conv: 0,
                                dis_amt: 0,
                                dis_per: 0,
                                dis_per_cal: 0,
                                dis_amt_cal: 0,
                                total_amt: 0,
                                total_base_amt: 0,
                                gst: 0,
                                igst: 0,
                                cgst: 0,
                                sgst: 0,
                                total_igst: 0,
                                total_cgst: 0,
                                total_sgst: 0,
                                final_amt: 0,
                                final_discount_amt: 0,
                                discount_proportional_cal: 0,
                                additional_charges_proportional_cal: 0,
                                b_no: 0,
                                b_rate: 0,
                                rate_a: 0,
                                rate_b: 0,
                                rate_c: 0,
                                max_discount: 0,
                                min_discount: 0,
                                min_margin: 0,
                                manufacturing_date: 0,
                                b_purchase_rate: 0,
                                b_expiry: 0,
                                b_details_id: 0,
                                is_batch: false,
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        dis_per_cal: 0,
        dis_amt_cal: 0,
        total_amt: 0,
        total_b_amt: 0,

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

    if (len != null) {
      let Initrows = [...this.state.rows, ...lst];
      this.setState({ rows: Initrows });
    } else {
      this.setState({ rows: lst });
    }
  };
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
  lstAdditionalLedgers = () => {
    getAdditionalLedgers()
      .then((response) => {
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
            this.setState({ lstAdditionalLedger: fOpt });
          }
        }
      })
      .catch((error) => {});
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

  handleResetForm = () => {
    this.handleclientinfo(true);
  };

  ledgerCreate = () => {
    // eventBus.dispatch("page_change", "ledgercreate");
    eventBus.dispatch("page_change", {
      from: "tranx_purchase_invoice_create_modified",
      to: "ledgercreate",

      prop_data: {},
      isNewTab: true,
    });
  };
  productCreate = (e = null) => {
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
  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleRowStateChange = (
    rowValue,
    showBatch = false,
    rowIndex = -1,
    brandIndex = -1,
    groupIndex = -1,
    categoryIndex = -1,
    subcategoryIndex = -1,
    packageIndex = -1,
    unitIndex = -1
  ) => {
    this.setState({ rows: rowValue }, () => {
      if (
        showBatch == true &&
        rowIndex >= 0 &&
        brandIndex >= 0 &&
        categoryIndex >= 0 &&
        subcategoryIndex >= 0 &&
        groupIndex >= 0 &&
        packageIndex >= 0 &&
        unitIndex >= 0
      ) {
        this.setState(
          {
            rowIndex: rowIndex,
            brandIndex: brandIndex,
            categoryIndex: categoryIndex,
            subcategoryIndex: subcategoryIndex,
            groupIndex: groupIndex,
            packageIndex: packageIndex,
            unitIndex: unitIndex,
          },
          () => {
            // this.getInitBatchValue();
            this.getProductBatchList();
          }
        );
      }
      this.handleTranxCalculation();
    });
  };

  handleLstBrand = (lstBrand) => {
    this.setState({ lstBrand: lstBrand });
  };
  handleMstState = (rows) => {
    this.setState({ rows: rows });
  };

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  getProductPackageLst = (product_id, rowIndex = -1) => {
    // debugger;
    let reqData = new FormData();
    let { rows, lstBrand } = this.state;
    let findProductPackges = getSelectValue(lstBrand, product_id);

    console.warn("rahul findProductPackges:: ", findProductPackges);
    if (findProductPackges) {
      // let lstFlavours = findProductPackges.flavour_opts;

      if (findProductPackges && rowIndex != -1) {
        rows[rowIndex]["isBrand"] = findProductPackges.isBrand;
        rows[rowIndex]["isGroup"] = findProductPackges.isGroup;
        rows[rowIndex]["isCategory"] = findProductPackges.isCategory;
        rows[rowIndex]["isSubCategory"] = findProductPackges.isSubCategory;
        rows[rowIndex]["isPackage"] = findProductPackges.isPackage;

        rows[rowIndex]["brandDetails"][0]["brandId"] =
          findProductPackges["brandOpt"][0];

        if (findProductPackges["brandOpt"][0]["groupOpt"].length >= 1) {
          rows[rowIndex]["brandDetails"][0]["groupDetails"][0]["groupId"] =
            findProductPackges["brandOpt"][0]["groupOpt"][0];

          if (
            findProductPackges["brandOpt"][0]["groupOpt"][0]["categoryOpt"]
              .length >= 1
          ) {
            rows[rowIndex]["brandDetails"][0]["groupDetails"][0][
              "categoryDetails"
            ][0]["categoryId"] =
              findProductPackges["brandOpt"][0]["groupOpt"][0][
                "categoryOpt"
              ][0];

            if (
              findProductPackges["brandOpt"][0]["groupOpt"][0][
                "categoryOpt"
              ][0]["subcategoryOpt"].length >= 1
            ) {
              rows[rowIndex]["brandDetails"][0]["groupDetails"][0][
                "categoryDetails"
              ][0]["subcategoryDetails"][0]["subcategoryId"] =
                findProductPackges["brandOpt"][0]["groupOpt"][0][
                  "categoryOpt"
                ][0]["subcategoryOpt"][0];

              if (
                findProductPackges["brandOpt"][0]["groupOpt"][0][
                  "categoryOpt"
                ][0]["subcategoryOpt"][0]["packageOpt"].length >= 1
              ) {
                rows[rowIndex]["brandDetails"][0]["groupDetails"][0][
                  "categoryDetails"
                ][0]["subcategoryDetails"][0]["packageDetails"][0][
                  "packageId"
                ] =
                  findProductPackges["brandOpt"][0]["groupOpt"][0][
                    "categoryOpt"
                  ][0]["subcategoryOpt"][0]["packageOpt"][0];
              }
            }
          }
        }
      }
      this.setState({ rows: rows });
    } else {
      reqData.append("product_id", product_id);

      getProductFlavourList(reqData)
        .then((response) => {
          let responseData = response.data;
          if (responseData.responseStatus == 200) {
            let levelData = responseData.responseObject;
            let data = responseData.responseObject.lst_packages;

            // let brandOpt = [];
            let brandOpt = data.map((v) => {
              let groupOpt = v.group.map((gv) => {
                let categoryOpt = gv.category.map((vc) => {
                  let subcategoryOpt = vc.subcategory.map((vs) => {
                    let packageOpt = vs.package.map((vp) => {
                      let unitOpt = vp.units.map((vi) => {
                        return {
                          label: vi.unit_name,
                          value: vi.unit_id,
                          ...vi,
                          isDisabled: false,
                        };
                      });
                      return {
                        // ...vp,
                        label: vp.package_name != "" ? vp.package_name : "",
                        value: vp.package_id != "" ? vp.package_id : "",
                        unitOpt: unitOpt,
                        isDisabled: false,
                      };
                    });
                    return {
                      // ...v,
                      label:
                        vs.subcategory_name != "" ? vs.subcategory_name : "",
                      value: vs.subcategory_id != "" ? vs.subcategory_id : "",
                      packageOpt: packageOpt,
                      isDisabled: false,
                    };
                  });

                  return {
                    // ...v,
                    label: vc.category_name != "" ? vc.category_name : "",
                    value: vc.category_id != "" ? vc.category_id : "",
                    subcategoryOpt: subcategoryOpt,
                    isDisabled: false,
                  };
                });
                return {
                  // ...v,
                  label: gv.group_name != "" ? gv.group_name : "",
                  value: gv.group_id != "" ? gv.group_id : "",
                  categoryOpt: categoryOpt,
                  isDisabled: false,
                };
              });
              return {
                // ...v,
                label: v.brand_name != "" ? v.brand_name : "",
                value: v.brand_id != "" ? v.brand_id : "",
                groupOpt: groupOpt,
                isDisabled: false,
              };
            });

            console.warn("rahul brandOpt:: ", brandOpt);

            let fPackageLst = [
              ...lstBrand,
              {
                product_id: product_id,
                value: product_id,
                brandOpt: brandOpt,

                isBrand: levelData.isBrand,
                isGroup: levelData.isGroup,
                isCategory: levelData.isCategory,
                isSubCategory: levelData.isSubcategory,
                isPackage: levelData.isPackage,
              },
            ];
            console.log("fPackageLst =-> ", fPackageLst, rows[rowIndex]);
            this.setState({ lstBrand: fPackageLst }, () => {
              let findProductPackges = getSelectValue(
                this.state.lstBrand,
                product_id
              );
              // console.log("findProductPackges =-> ", findProductPackges);
              if (findProductPackges && rowIndex != -1) {
                rows[rowIndex]["brandDetails"][0]["brandId"] =
                  findProductPackges["brandOpt"][0];

                if (findProductPackges["brandOpt"][0]["groupOpt"].length >= 1) {
                  rows[rowIndex]["brandDetails"][0]["groupDetails"][0][
                    "groupId"
                  ] = findProductPackges["brandOpt"][0]["groupOpt"][0];

                  if (
                    findProductPackges["brandOpt"][0]["groupOpt"][0][
                      "categoryOpt"
                    ].length >= 1
                  ) {
                    rows[rowIndex]["brandDetails"][0]["groupDetails"][0][
                      "categoryDetails"
                    ][0]["categoryId"] =
                      findProductPackges["brandOpt"][0]["groupOpt"][0][
                        "categoryOpt"
                      ][0];

                    if (
                      findProductPackges["brandOpt"][0]["groupOpt"][0][
                        "categoryOpt"
                      ][0]["subcategoryOpt"].length >= 1
                    ) {
                      rows[rowIndex]["brandDetails"][0]["groupDetails"][0][
                        "categoryDetails"
                      ][0]["subcategoryDetails"][0]["subcategoryId"] =
                        findProductPackges["brandOpt"][0]["groupOpt"][0][
                          "categoryOpt"
                        ][0]["subcategoryOpt"][0];

                      if (
                        findProductPackges["brandOpt"][0]["groupOpt"][0][
                          "categoryOpt"
                        ][0]["subcategoryOpt"][0]["packageOpt"].length >= 1
                      ) {
                        rows[rowIndex]["brandDetails"][0]["groupDetails"][0][
                          "categoryDetails"
                        ][0]["subcategoryDetails"][0]["packageDetails"][0][
                          "packageId"
                        ] =
                          findProductPackges["brandOpt"][0]["groupOpt"][0][
                            "categoryOpt"
                          ][0]["subcategoryOpt"][0]["packageOpt"][0];
                      }
                    }
                  }
                }

                rows[rowIndex]["isBrand"] = levelData.isBrand;
                rows[rowIndex]["isGroup"] = levelData.isGroup;
                rows[rowIndex]["isCategory"] = levelData.isCategory;
                rows[rowIndex]["isSubCategory"] = levelData.isSubcategory;
                rows[rowIndex]["isPackage"] = levelData.isPackage;

                // let key = "unitId" + rowIndex;
                // console.warn("rahul::key ", key);
                setTimeout(() => {
                  var allElements =
                    document.getElementsByClassName("unitClass");
                  for (var i = 0; i < allElements.length; i++) {
                    document.getElementsByClassName("unitClass")[
                      i
                    ].style.border = "1px solid";
                  }
                }, 1);
              }
              console.warn("rahul::rows", rows);
              this.setState({ rows: rows });
            });
          } else {
            this.setState({ lstBrand: [] });
          }
        })
        .catch((error) => {
          this.setState({ lstBrand: [] });
          // console.log("error", error);
        });
    }
  };

  batchModalShow = (status) => {
    this.setState({ batchModalShow: status });
  };
  handlebatchModalShow = (status) => {
    if (status == false) {
      this.setState({ batchModalShow: status, tr_id: "", batch_error: false });
    } else {
      this.setState({ batchModalShow: status, tr_id: "" });
    }
  };

  setAdditionalCharges = (element, index) => {
    let elementCheck = this.state.additionalCharges.find((v, i) => {
      return i == index;
    });

    return elementCheck ? elementCheck[element] : "";
  };

  handleAdditionalCharges = (element, index, value) => {
    // console.log({ element, index, value });

    let { additionalCharges } = this.state;
    let fa = additionalCharges.map((v, i) => {
      if (i == index) {
        v[element] = value;

        if (value == undefined || value == null) {
          v["amt"] = "";
        }
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

  handleAdditionalChargesHide = () => {
    this.setState({ additionchargesyes: false }, () => {
      this.handleTranxCalculation();
    });
  };
  handleTranxCalculation = () => {
    // !Most IMP̥
    let { rows, additionalChargesTotal } = this.state;

    // console.log("handleTranxCalculation Row => ", rows);
    let ledger_disc_amt = 0;
    let ledger_disc_per = 0;

    if (this.myRef.current) {
      let { purchase_discount, purchase_discount_amt } =
        this.myRef.current.values;
      ledger_disc_per = purchase_discount;
      ledger_disc_amt = purchase_discount_amt;
    }

    let resTranxFn = fnTranxCalculation({
      rows: rows,
      ledger_disc_per: ledger_disc_per,
      ledger_disc_amt: ledger_disc_amt,
      additionalChargesTotal: additionalChargesTotal,
    });
    let {
      base_amt,
      total_purchase_discount_amt,
      total_taxable_amt,
      total_tax_amt,
      gst_row,
      gst_total_amt,
      taxIgst,
      taxCgst,
      taxSgst,
    } = resTranxFn;

    let roundoffamt = Math.round(gst_total_amt);
    let roffamt = parseFloat(roundoffamt - gst_total_amt).toFixed(2);

    this.myRef.current.setFieldValue(
      "total_base_amt",
      isNaN(parseFloat(base_amt)) ? 0 : parseFloat(base_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_purchase_discount_amt",
      isNaN(parseFloat(total_purchase_discount_amt))
        ? 0
        : parseFloat(total_purchase_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      isNaN(parseFloat(total_taxable_amt))
        ? 0
        : parseFloat(total_taxable_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_tax_amt",
      isNaN(parseFloat(total_tax_amt))
        ? 0
        : parseFloat(total_tax_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      isNaN(parseFloat(roffamt)) ? 0 : parseFloat(roffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      isNaN(parseFloat(roundoffamt)) ? 0 : parseFloat(roundoffamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };

    this.setState({
      rows: gst_row,
      taxcal: taxState,
    });
  };

  getProductBatchList = () => {
    let {
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      packageIndex,
      groupIndex,
      unitIndex,
      rows,
      invoice_data,
      lstBrand,
    } = this.state;
    let product_id = rows[rowIndex]["productId"]["value"];
    let brand_id =
      rows[rowIndex]["brandDetails"][brandIndex]["brandId"]["value"];
    let group_id =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "groupId"
      ]["value"];
    let category_id =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["categoryId"]["value"];
    let sub_category_id =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][subcategoryIndex]["subcategoryId"][
        "value"
      ];
    let package_id =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
        "packageDetails"
      ][packageIndex]["packageId"]["value"];
    let unit_id =
      rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][groupIndex][
        "categoryDetails"
      ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
        "packageDetails"
      ][packageIndex]["unitDetails"][unitIndex]["unitId"]["value"];

    let isfound = false;
    let productData = getSelectValue(lstBrand, product_id);
    let batchOpt = [];
    // console.log("productData", productData);
    if (productData) {
      let brandData = "";
      if (brand_id > 0) {
        brandData = getSelectValue(productData.brandOpt, brand_id);
      } else {
        brandData = getSelectValue(productData.brandOpt, "");
      }
      if (brandData) {
        let groupdata = "";
        if (group_id > 0) {
          groupdata = getSelectValue(brandData.groupOpt, group_id);
        } else {
          groupdata = getSelectValue(brandData.groupOpt, "");
        }
        if (groupdata) {
          let categorydata = "";
          if (category_id > 0) {
            categorydata = getSelectValue(groupdata.categoryOpt, category_id);
          } else {
            categorydata = getSelectValue(groupdata.categoryOpt, "");
          }
          if (categorydata) {
            let subcategorydata = "";
            if (sub_category_id > 0) {
              subcategorydata = getSelectValue(
                categorydata.subcategoryOpt,
                sub_category_id
              );
            } else {
              subcategorydata = getSelectValue(categorydata.subcategoryOpt, "");
            }
            if (subcategorydata) {
              let packagedata = "";
              if (package_id > 0) {
                packagedata = getSelectValue(
                  subcategorydata.packageOpt,
                  package_id
                );
              } else {
                packagedata = getSelectValue(subcategorydata.packageOpt, "");
              }
              if (packagedata) {
                let unitdata = "";
                if (unit_id > 0) {
                  unitdata = getSelectValue(packagedata.unitOpt, unit_id);
                } else {
                  unitdata = getSelectValue(packagedata.unitOpt, "");
                }
                if (unitdata && unitdata.batchOpt) {
                  isfound = true;
                  batchOpt = unitdata.batchOpt;
                }
              }
            }
          }
        }
      }
    }
    if (isfound == false) {
      let reqData = new FormData();
      reqData.append("product_id", product_id);
      reqData.append("unit_id", unit_id);
      reqData.append(
        "invoice_date",
        moment(invoice_data.pi_transaction_dt).format("yyyy-MM-DD")
      );
      if (brand_id > 0) {
        reqData.append("brand_id", brand_id);
      }
      if (group_id > 0) {
        reqData.append("group_id", group_id);
      }
      if (category_id > 0) {
        reqData.append("category_id", category_id);
      }
      if (sub_category_id > 0) {
        reqData.append("sub_category_id", sub_category_id);
      }
      if (package_id > 0) {
        reqData.append("package_id", package_id);
      }

      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          if (response.responseStatus == 200) {
            let res = response.data;

            this.setState(
              {
                lstBrand: lstBrand,
                batchData: res,
              },
              () => {
                this.getInitBatchValue();
              }
            );
          }
        })
        .catch((error) => {});
    } else {
      this.setState(
        {
          batchData: batchOpt,
        },
        () => {
          this.getInitBatchValue();
        }
      );
    }
  };

  getInitBatchValue = () => {
    let {
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      groupIndex,
      packageIndex,
      unitIndex,
      rows,
    } = this.state;
    let initVal = "";

    if (
      rowIndex != -1 &&
      brandIndex != -1 &&
      categoryIndex != -1 &&
      subcategoryIndex != -1 &&
      groupIndex != -1 &&
      packageIndex != -1 &&
      unitIndex != -1
    ) {
      initVal = {
        b_no: rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
          groupIndex
        ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
          subcategoryIndex
        ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["b_no"],
        b_rate:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["b_rate"],
        rate_a:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["rate_a"],
        rate_b:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["rate_b"],
        rate_c:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["rate_c"],
        max_discount:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "max_discount"
          ],
        min_discount:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "min_discount"
          ],
        min_margin:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "min_margin"
          ],
        b_purchase_rate:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "b_purchase_rate"
          ],
        b_expiry:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "b_expiry"
          ] != ""
            ? moment(
                new Date(
                  moment(
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "b_expiry"
                    ],
                    "YYYY-MM-DD"
                  ).toDate()
                )
              ).format("DD/MM/YYYY")
            : "",
        manufacturing_date:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "manufacturing_date"
          ] != ""
            ? moment(
                new Date(
                  moment(
                    rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
                      groupIndex
                    ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
                      subcategoryIndex
                    ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
                      "manufacturing_date"
                    ],
                    "YYYY-MM-DD"
                  ).toDate()
                )
              ).format("DD/MM/YYYY")
            : "",
        // b_create: 0,
        b_details_id:
          rows[rowIndex]["brandDetails"][brandIndex]["groupDetails"][
            groupIndex
          ]["categoryDetails"][categoryIndex]["subcategoryDetails"][
            subcategoryIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "b_details_id"
          ],
      };
    } else {
      initVal = {
        b_no: 0,
        b_rate: 0,
        rate_a: 0,
        rate_b: 0,
        rate_c: 0,
        max_discount: 0,
        min_discount: 0,
        min_margin: 0,
        manufacturing_date: "",
        b_purchase_rate: 0,
        b_expiry: "",
        b_details_id: 0,
      };
    }

    let IsBatch = rows[rowIndex]["productId"]["isBatchNo"];
    if (IsBatch == true) {
      this.setState({
        batchInitVal: initVal,
        batchModalShow: true,
        isBatch: IsBatch,
        tr_id: "",
      });
    }
  };

  callCreateChallan = () => {
    console.log("in create!!!!!");
    // debugger;
    //;
    const { invoice_data, additionalCharges, additionalChargesTotal, rows } =
      this.state;
    let invoiceValues = this.myRef.current.values;

    let requestData = new FormData();
    // requestData.append(
    //   "pur_challan_date",
    //   moment(invoice_data.pc_invoice_date).format("yyyy-MM-DD")
    // );
    if (
      invoice_data.pc_invoice_date != "" &&
      invoice_data.pc_invoice_date != null
    ) {
      let pandateofregistration = moment(
        invoice_data.pc_invoice_date,
        "DD/MM/YYYY"
      ).toDate();
      requestData.append(
        "pur_challan_date",
        moment(pandateofregistration).format("yyyy-MM-DD")
      );
    }

    requestData.append("newReference", false);
    requestData.append("pur_challan_sr_no", this.myRef.current.values.pc_sr_no);
    requestData.append("purchase_id", invoice_data.purchaseId.value);
    requestData.append("pur_challan_no", invoiceValues.pc_no);
    requestData.append(
      "transaction_date",
      moment(invoice_data.pc_transaction_dt).format("yyyy-MM-DD")
    );

    requestData.append("supplier_code_id", invoice_data.supplierCodeId.value);
    requestData.append(
      "gstNo",
      invoice_data.gstId !== "" ? invoice_data.gstId.label : ""
    );

    // !Invoice Data
    requestData.append("roundoff", invoiceValues.roundoff);
    if (invoiceValues.narration && invoiceValues.narration != "") {
      requestData.append("narration", invoiceValues.narration);
    }
    requestData.append("total_base_amt", invoiceValues.total_base_amt);

    requestData.append("totalamt", invoiceValues.totalamt);
    requestData.append(
      "total_purchase_discount_amt",
      isNaN(parseFloat(invoiceValues.total_purchase_discount_amt))
        ? 0
        : parseFloat(invoiceValues.total_purchase_discount_amt)
    );
    // console.log("total_purchase_discount_amt->", total_purchase_discount_amt);
    requestData.append("taxable_amount", invoiceValues.total_taxable_amt);
    let totalcgst = this.state.taxcal.cgst.reduce(
      (n, p) => n + parseFloat(p.amt),
      0
    );
    let totalsgst = this.state.taxcal.sgst.reduce(
      (n, p) => n + parseFloat(p.amt),
      0
    );
    let totaligst = this.state.taxcal.igst.reduce(
      (n, p) => n + parseFloat(p.amt),
      0
    );

    requestData.append("totalcgst", totalcgst);
    requestData.append("totalsgst", totalsgst);
    requestData.append("totaligst", totaligst);
    requestData.append(
      "totalqty",
      invoiceValues.totalqty && invoiceValues.totalqty != ""
        ? invoiceValues.totalqty
        : 0
    );
    requestData.append(
      "tcs",
      invoiceValues.tcs && invoiceValues.tcs != "" ? invoiceValues.tcs : 0
    );

    requestData.append(
      "purchase_discount",
      invoiceValues.purchase_discount && invoiceValues.purchase_discount != ""
        ? invoiceValues.purchase_discount
        : 0
    );

    requestData.append(
      "purchase_discount_amt",
      invoiceValues.purchase_discount_amt &&
        invoiceValues.purchase_discount_amt != ""
        ? invoiceValues.purchase_discount_amt
        : 0
    );

    requestData.append(
      "total_purchase_discount_amt",
      invoiceValues.total_purchase_discount_amt &&
        invoiceValues.total_purchase_discount_amt != ""
        ? invoiceValues.total_purchase_discount_amt
        : 0
    );

    requestData.append(
      "purchase_disc_ledger",
      invoiceValues.purchase_disc_ledger
        ? invoiceValues.purchase_disc_ledger.value
        : 0
    );

    console.log("row in create", rows);

    let frow = rows.map((v, i) => {
      if (v.productId != "") {
        v.productId = v.productId ? v.productId.value : "";
        v.brandDetails = v.brandDetails.filter((vi) => {
          vi["brandId"] = vi.brandId ? vi.brandId.value : "";
          vi["groupDetails"] = vi.groupDetails.map((gv) => {
            gv["groupId"] = gv.groupId ? gv.groupId.value : "";
            gv["categoryDetails"] = gv.categoryDetails.map((vc) => {
              vc["categoryId"] = vc.categoryId ? vc.categoryId.value : "";
              vc["subcategoryDetails"] = vc.subcategoryDetails.map((vs) => {
                vs["subcategoryId"] = vs.subcategoryId
                  ? vs.subcategoryId.value
                  : "";
                vs["packageDetails"] = vs.packageDetails.map((vp) => {
                  vp["packageId"] = vp.packageId ? vp.packageId.value : "";
                  vp.unitDetails = vp.unitDetails.map((vu) => {
                    vu["unitId"] = vu.unitId ? vu.unitId.value : "";

                    vu["is_multi_unit"] = vu.is_multi_unit;
                    vu["rate"] = vu.rate;
                    vu["dis_amt"] = vu.dis_amt != "" ? vu.dis_amt : 0;
                    vu["dis_per"] = vu.dis_per != "" ? vu.dis_per : 0;
                    vu["rate_a"] = vu.rate_a;
                    vu["rate_b"] = vu.rate_b;
                    vu["rate_c"] = vu.rate_c;
                    vu["max_discount"] = vu.max_discount;
                    vu["min_discount"] = vu.min_discount;
                    vu["min_margin"] = vu.min_margin;
                    vu["b_expiry"] = moment(vu.b_expiry).format("yyyy-MM-DD");
                    vu["manufacturing_date"] = moment(
                      vu.manufacturing_date
                    ).format("yyyy-MM-DD");
                    vu["is_batch"] = vu.is_batch;
                    vu["isBatchNo"] = vu.isBatchNo;
                    vu["igst"] = vu.igst != "" ? vu.igst : 0;
                    vu["cgst"] = vu.cgst != "" ? vu.cgst : 0;
                    vu["sgst"] = vu.sgst != "" ? vu.sgst : 0;

                    return vu;
                  });
                  return vp;
                });
                return vs;
              });
              return vc;
            });

            return gv;
          });
          return vi;
        });
        return v;
      }
    });
    console.log("frow =->", frow);

    var filtered = frow.filter(function (el) {
      return el && el != null;
    });
    console.log("frow", frow);
    let additionalChargesfilter = additionalCharges.filter((v) => {
      if (v.ledgerId != "" && v.ledgerId != undefined && v.ledgerId != null) {
        v["ledger"] = v["ledgerId"]["value"];
        return v;
      }
    });
    requestData.append("additionalChargesTotal", additionalChargesTotal);
    console.log("filtered", filtered);
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
    for (const pair of requestData.entries()) {
      console.log(`key => ${pair[0]}, value =>${pair[1]}`);
    }
    createPOChallanInvoice(requestData)
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

          eventBus.dispatch("page_change", "tranx_purchase_challan_list");
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
  handlePropsData = (prop_data) => {
    if (prop_data.mdl_additionalcharges) {
      this.setState({
        additionchargesyes: true,
      });
    }

    if (prop_data.invoice_data) {
      this.setState({
        invoice_data: prop_data.invoice_data,
        rows: prop_data.rows,
        additionalCharges: prop_data.additionalCharges,
      });
    } else {
      this.setState({ invoice_data: prop_data });
    }
  };

  handleClearProduct = (frows) => {
    this.setState({ rows: frows }, () => {
      this.handleTranxCalculation();
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      // eventBus.on("scroll", this.handleScroll);
      this.lstPurchaseAccounts();
      this.lstSundryCreditors();
      this.lstProduct();
      this.getLastPurchaseChallanSerialNo();
      // this.lstUnit();
      this.initRow();
      this.initAdditionalCharges();
      this.lstDiscountLedgers();
      this.lstAdditionalLedgers();
      const { prop_data } = this.props.block;

      // console.log("prop_data", prop_data);
      this.handlePropsData(prop_data);

      mousetrap.bindGlobal("ctrl+v", this.handleResetForm);
      mousetrap.bindGlobal("ctrl+c", this.ledgerCreate);
      mousetrap.bind("alt+p", this.productCreate);

      eventBus.on(TRAN_NO.prd_tranx_purchase_invoice_create, this.lstProduct);
    }
  }

  componentWillUnmount() {
    if (AuthenticationCheck()) {
      // eventBus.remove("scroll", this.handleScroll);
      mousetrap.unbind("alt+p", this.productCreate);
      mousetrap.unbindGlobal("ctrl+v", this.handleResetForm);
      mousetrap.unbindGlobal("ctrl+c", this.ledgerCreate);
      eventBus.remove(
        TRAN_NO.prd_tranx_purchase_invoice_create,
        this.lstProduct
      );
    }
  }

  render() {
    const {
      isBranch,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      invoice_data,
      rows,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      adjustbillshow,
      billLst,
      selectedBillsdebit,
      isAllCheckeddebit,
      batchModalShow,
      batchInitVal,
      batchData,
      b_details_id,
      isBatch,
      is_expired,
      tr_id,
      productLst,
      lstBrand,
      lstGst,
      rowDelDetailsIds,
    } = this.state;
    return (
      <div>
        {" "}
        <div className="tranx-form-style">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            validationSchema={Yup.object().shape({
              pc_invoice_date: Yup.string().required("Required"),
              supplierCodeId: Yup.object().nullable().required("Required"),
              purchaseId: Yup.object().nullable().required("Required"),
              supplierNameId: Yup.object().nullable().required("Required"),
              pc_no: Yup.string().required("Required"),
            })}
            enableReinitialize={true}
            initialValues={invoice_data}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to submit",
                  is_button_show: false,
                  is_timeout: false,
                  delay: 0,
                  handleSuccessFn: () => {
                    this.setState(
                      {
                        invoice_data: values,
                      },
                      () => {
                        this.callCreateChallan();
                      }
                    );
                  },
                  handleFailFn: () => {},
                },
                () => {
                  console.warn("return_data");
                }
              );
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
              <Form onSubmit={handleSubmit} noValidate autoComplete="off">
                <>
                  <div className="div-style">
                    <div style={{ padding: "15px 20px 15px " }}>
                      <Row className="mx-0 inner-div-style">
                        {isBranch == true && (
                          <Col lg={2} md={2} sm={2} xs={2}>
                            <Row>
                              <Col
                                lg={4}
                                md={4}
                                sm={4}
                                xs={4}
                                className="my-auto"
                              >
                                <Form.Label>Branch</Form.Label>
                              </Col>
                              <Col lg={8} md={8} sm={8} xs={8}>
                                <Select
                                  className="selectTo"
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  styles={purchaseSelect}
                                  isClearable
                                  isDisabled
                                  options={purchaseAccLst}
                                  name="purchaseId"
                                  onChange={(v) => {
                                    setFieldValue("branchId", v);
                                  }}
                                  value={values.branchId}
                                />

                                <span className="text-danger errormsg">
                                  {errors.branchId}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        )}

                        <Col lg={2} md={2} sm={2} xs={2}>
                          <Row>
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              xs={6}
                              className="my-auto"
                            >
                              <Form.Label>Transaction Date</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Form.Label>
                                <Form.Control
                                  className="text-box"
                                  name="pc_transaction_dt"
                                  placeholderText="DD/MM/YYYY"
                                  id="pc_transaction_dt"
                                  value={moment(new Date()).format(
                                    "DD/MM/YYYY"
                                  )}
                                ></Form.Control>

                                <span className="text-danger errormsg">
                                  {errors.pc_transaction_dt}
                                </span>
                              </Form.Label>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={2}>
                          <Row>
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              xs={6}
                              className="my-auto"
                            >
                              <Form.Label>Challan Sr. No.</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Form.Control
                                type="text"
                                className="text-box"
                                placeholder="Challan sr No. "
                                name="pc_sr_no"
                                id="pc_sr_no"
                                onChange={handleChange}
                                value={values.pc_sr_no}
                                isValid={touched.pc_sr_no && !errors.pc_sr_no}
                                isInvalid={!!errors.pc_sr_no}
                                readOnly={true}
                              />
                              <span className="text-danger errormsg">
                                {errors.pc_sr_no}
                              </span>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Row>
                            <Col
                              lg={2}
                              md={2}
                              sm={2}
                              xs={2}
                              className="my-auto px-0"
                            >
                              <Form.Label>Supplier Code</Form.Label>
                            </Col>
                            <Col lg={3} md={3} sm={3} xs={3}>
                              <Select
                                autoFocus="true"
                                className="selectTo"
                                components={{
                                  IndicatorSeparator: () => null,
                                }}
                                styles={purchaseSelect}
                                isClearable
                                options={supplierCodeLst}
                                name="supplierCodeId"
                                onChange={(v) => {
                                  setFieldValue("supplierCodeId", "");
                                  setFieldValue("supplierNameId", "");
                                  setFieldValue("gstId", "");

                                  if (v != null) {
                                    setFieldValue("supplierCodeId", v);
                                    setFieldValue(
                                      "supplierNameId",
                                      getSelectValue(supplierNameLst, v.value)
                                    );
                                    this.setSupplierData(v, setFieldValue);
                                  } else {
                                    this.setState({
                                      lstGst: [],
                                    });
                                  }
                                }}
                                //this.validateLicenceDetails()
                                value={values.supplierCodeId}
                              />

                              <span className="text-danger errormsg">
                                {errors.supplierCodeId}
                              </span>
                            </Col>

                            <Col
                              lg={2}
                              md={2}
                              sm={2}
                              xs={2}
                              className="my-auto px-0"
                            >
                              <Form.Label>Supplier Name</Form.Label>
                            </Col>
                            <Col lg={5} md={5} sm={5} xs={5}>
                              <div className="d-flex w-100">
                                <Select
                                  className="selectTo"
                                  components={{
                                    IndicatorSeparator: () => null,
                                  }}
                                  style={{ zIndex: "2" }}
                                  styles={purchaseSelect}
                                  isClearable
                                  options={supplierNameLst}
                                  name="supplierNameId"
                                  onChange={(v) => {
                                    setFieldValue("supplierCodeId", "");
                                    setFieldValue("supplierNameId", "");
                                    setFieldValue("gstId", "");
                                    if (v != null) {
                                      setFieldValue("supplierNameId", v);
                                      // setFieldValue("gstId", "");
                                      setFieldValue(
                                        "supplierCodeId",
                                        getSelectValue(supplierCodeLst, v.value)
                                      );

                                      this.setSupplierData(v, setFieldValue);
                                    } else {
                                      this.setState({
                                        lstGst: [],
                                      });
                                    }
                                  }}
                                  value={values.supplierNameId}
                                />
                                <Button
                                  className="plus-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                      isActionExist(
                                        "ledger",
                                        "create",
                                        this.props.userPermissions
                                      )
                                    ) {
                                      eventBus.dispatch("page_change", {
                                        from: "tranx_purchase_challan_create",
                                        to: "ledgercreate",
                                        prop_data: {
                                          from_page:
                                            "tranx_purchase_challan_create",
                                          rows: rows,
                                          invoice_data: values,
                                        },
                                        isNewTab: false,
                                      });
                                      // eventBus.dispatch(
                                      //   "page_change",
                                      //   "ledgercreate"
                                      // );
                                      let prop_data = {
                                        sundary_creditor_from_purchase:
                                          "sundry_creditors",
                                      };
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
                                >
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    className="plus-color"
                                  />
                                </Button>
                              </div>
                              <span className="text-danger errormsg">
                                {errors.supplierNameId}
                              </span>{" "}
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={2}>
                          <Row>
                            <Col
                              lg={5}
                              md={5}
                              sm={5}
                              xs={5}
                              className="my-auto"
                            >
                              <Form.Label>Purchase A/C</Form.Label>
                            </Col>
                            <Col lg={7} md={7} sm={7} xs={7}>
                              <Select
                                className="selectTo"
                                components={{
                                  IndicatorSeparator: () => null,
                                }}
                                styles={purchaseSelect}
                                isClearable={true}
                                options={purchaseAccLst}
                                name="purchaseId"
                                onChange={(v) => {
                                  setFieldValue("purchaseId", v);
                                }}
                                value={values.purchaseId}
                              />
                              <span className="text-danger errormsg">
                                {errors.purchaseId}
                              </span>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={2} className="mt-2">
                          <Row>
                            <Col
                              lg={4}
                              md={4}
                              sm={4}
                              xs={4}
                              className="my-auto"
                            >
                              <Form.Label>Challan No.</Form.Label>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8}>
                              <Form.Control
                                className="text-box"
                                type="text"
                                placeholder="Challan No."
                                name="pc_no"
                                id="pc_no"
                                onChange={handleChange}
                                value={values.pc_no}
                                isValid={touched.pc_no && !errors.pc_no}
                                isInvalid={!!errors.pc_no}
                              />
                              <span className="text-danger errormsg">
                                {errors.pc_no}
                              </span>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={2} className="mt-2">
                          <Row>
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              xs={6}
                              className="my-auto"
                            >
                              <Form.Label>Challan Date</Form.Label>
                            </Col>

                            <Col lg={6} md={6} sm={6} xs={6}>
                              <MyTextDatePicker
                                innerRef={(input) => {
                                  this.invoiceDateRef.current = input;
                                }}
                                className="text-box "
                                name="pc_invoice_date"
                                id="pc_invoice_date"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/MM/yyyy"
                                value={values.pc_invoice_date}
                                onChange={handleChange}
                                onBlur={(e) => {
                                  console.log("e ", e);
                                  console.log(
                                    "e.target.value ",
                                    e.target.value
                                  );
                                  if (
                                    e.target.value != null &&
                                    e.target.value != ""
                                  ) {
                                    console.warn(
                                      "warn:: isValid",
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid()
                                    );
                                    if (
                                      moment(
                                        e.target.value,
                                        "DD-MM-YYYY"
                                      ).isValid() == true
                                    ) {
                                      setFieldValue(
                                        "pc_invoice_date",
                                        e.target.value
                                      );
                                      this.checkInvoiceDateIsBetweenFYFun(
                                        e.target.value,
                                        setFieldValue
                                      );
                                    } else {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Invalid challan date",
                                        is_button_show: true,
                                      });
                                      this.invoiceDateRef.current.focus();
                                      setFieldValue("pc_invoice_date", "");
                                    }
                                  } else {
                                    setFieldValue("pc_invoice_date", "");
                                  }
                                }}
                              />
                              <span className="text-danger errormsg">
                                {errors.pc_invoice_date}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={3} md={3} sm={3} xs={3} className="mt-2">
                          <Row>
                            <Col
                              lg={4}
                              md={4}
                              sm={4}
                              xs={4}
                              className="my-auto"
                            >
                              <Form.Label>Supplier GST</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Select
                                className="selectTo"
                                components={{
                                  IndicatorSeparator: () => null,
                                }}
                                styles={purchaseSelect}
                                options={lstGst}
                                name="gstId"
                                onChange={(v) => {
                                  setFieldValue("gstId", v);
                                }}
                                value={values.gstId}
                              />
                              <span className="text-danger errormsg">
                                {errors.gstId}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <div className="tranx-tbl-style">
                    <Table>
                      <thead
                        style={{
                          borderBottom: "2px solid transparent",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              width: "30px",
                            }}
                          ></th>
                          <th
                            style={{
                              width: "30px",
                            }}
                          ></th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "80px",
                            }}
                          >
                            Product
                          </th>

                          <th
                            colSpan={28}
                            style={{
                              padding: "0px",
                              // width: "2000px",
                              borderLeft: "1px solid #949494",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  width: "30px",
                                }}
                              ></th>
                              <th
                                style={{
                                  width: "30px",
                                }}
                              ></th>
                              <th
                                style={{
                                  width: "160px",
                                  paddingLeft: "25px",
                                }}
                              >
                                Brand
                              </th>

                              <th
                                style={{
                                  padding: "0px",
                                  width: "2000px",
                                  borderLeft: "1px solid #949494",
                                }}
                              >
                                <tr>
                                  <th
                                    style={{
                                      width: "50px",
                                    }}
                                  ></th>
                                  <th
                                    style={{
                                      width: "50px",
                                    }}
                                  ></th>

                                  <th
                                    style={{
                                      width: "139px",
                                    }}
                                  >
                                    Group
                                  </th>

                                  <th
                                    style={{
                                      padding: "0px",
                                      width: "2000px",
                                      borderLeft: "1px solid #949494",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          width: "30px",
                                        }}
                                      ></td>
                                      <td
                                        style={{
                                          width: "30px",
                                        }}
                                      ></td>
                                      <th
                                        style={{
                                          width: "150px",
                                          paddingLeft: "20px",
                                        }}
                                      >
                                        Category
                                      </th>

                                      <th
                                        style={{
                                          padding: "0px",
                                          width: "1800px",
                                          borderLeft: "1px solid #949494",
                                        }}
                                      >
                                        <tr>
                                          <td
                                            style={{
                                              width: "15px",
                                            }}
                                          ></td>
                                          <td
                                            style={{
                                              width: "15px",
                                            }}
                                          ></td>
                                          <th
                                            style={{
                                              width: "210px",
                                              textAlign: "center",
                                              // paddingLeft: "20px",
                                            }}
                                          >
                                            Flavour
                                          </th>

                                          <th
                                            style={{
                                              padding: "0px",
                                              width: "1600px",
                                              borderLeft: "1px solid #949494",
                                            }}
                                          >
                                            <tr>
                                              <td
                                                style={{
                                                  width: "12px",
                                                }}
                                              ></td>
                                              <td
                                                style={{
                                                  width: "12px",
                                                }}
                                              ></td>
                                              <th
                                                style={{
                                                  width: "165px",
                                                  textAlign: "center",
                                                }}
                                              >
                                                Package
                                              </th>

                                              <th
                                                style={{
                                                  padding: "0px",
                                                  width: "1500px",
                                                  borderLeft:
                                                    "1px solid #949494",
                                                }}
                                              >
                                                <tr>
                                                  <td
                                                    style={{
                                                      width: "5px",
                                                    }}
                                                  ></td>
                                                  <td
                                                    style={{
                                                      width: "5px",
                                                    }}
                                                  ></td>
                                                  <th
                                                    style={{
                                                      width: "101px",
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    Unit
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "91px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Batch
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "66px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Qty.
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "86px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Rate
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "40px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Disc%
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "76px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Disc.Amt
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "121px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Base Amt
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "121px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Taxable Amt
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "136px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Tax(%)
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "120px",
                                                      textAlign: "center",
                                                      borderLeft:
                                                        "1px solid #949494",
                                                    }}
                                                  >
                                                    Total Amt
                                                  </th>
                                                </tr>
                                              </th>
                                            </tr>
                                          </th>
                                        </tr>
                                      </th>
                                    </tr>
                                  </th>
                                </tr>
                              </th>
                            </tr>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows &&
                          rows.length > 0 &&
                          rows.map((vi, ii) => {
                            return (
                              <>
                                <CMPTranxRow
                                  from_page="tranx_purchase_challan_create"
                                  invoice_data={values}
                                  rows={rows}
                                  rowIndex={ii}
                                  rowData={vi}
                                  productLst={productLst}
                                  lstBrand={lstBrand}
                                  handleRowStateChange={this.handleRowStateChange.bind(
                                    this
                                  )}
                                  getProductPackageLst={this.getProductPackageLst.bind(
                                    this
                                  )}
                                  handlebatchModalShow={this.handlebatchModalShow.bind(
                                    this
                                  )}
                                  handleLstBrand={this.handleLstBrand.bind(
                                    this
                                  )}
                                  handleMstState={this.handleMstState.bind(
                                    this
                                  )}
                                  showBatch
                                  handleClearProduct={this.handleClearProduct.bind(
                                    this
                                  )}
                                  rowDelDetailsIds={rowDelDetailsIds}
                                />
                              </>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>

                  <Row className="mx-0 btm-data">
                    <Col lg={8} md={8} sm={8} xs={8}>
                      <Row style={{ paddingTop: "15px" }}>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Row>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              xs={3}
                              className="my-auto"
                            >
                              <Form.Label>Disc Ledger</Form.Label>
                            </Col>
                            <Col lg={9} md={9} sm={9} xs={9}>
                              <Select
                                className="selectTo"
                                components={{
                                  IndicatorSeparator: () => null,
                                }}
                                isClearable={true}
                                styles={purchaseSelect}
                                onChange={(v) => {
                                  setFieldValue("purchase_disc_ledger", "");
                                  setFieldValue("purchase_discount", "");
                                  setFieldValue("purchase_discount_amt", "");

                                  if (v != null) {
                                    setFieldValue("purchase_disc_ledger", v);
                                  }
                                }}
                                options={lstDisLedger}
                                name="purchase_disc_ledger"
                                value={values.purchase_disc_ledger}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Row>
                            <Col
                              lg={2}
                              md={2}
                              sm={2}
                              xs={2}
                              className="my-auto"
                            >
                              <Form.Label>Disc %</Form.Label>
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Control
                                type="text"
                                placeholder="Enter"
                                className="text-box formhover"
                                name="purchase_discount"
                                onChange={(e) => {
                                  setFieldValue(
                                    "purchase_discount",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={values.purchase_discount}
                                readOnly={
                                  values.purchase_disc_ledger == ""
                                    ? true
                                    : false
                                }
                              />
                            </Col>

                            <Col
                              lg={2}
                              md={2}
                              sm={2}
                              xs={2}
                              className="my-auto px-0"
                            >
                              <Form.Label>Disc Amt</Form.Label>
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                              <Form.Control
                                type="text"
                                placeholder="Enter"
                                className="text-box formhover"
                                onChange={(e) => {
                                  setFieldValue(
                                    "purchase_discount_amt",
                                    e.target.value
                                  );
                                  setTimeout(() => {
                                    this.handleTranxCalculation();
                                  }, 100);
                                }}
                                value={values.purchase_discount_amt}
                                readOnly={
                                  values.purchase_disc_ledger == ""
                                    ? true
                                    : false
                                }
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Row>
                            <Col
                              lg={4}
                              md={4}
                              sm={4}
                              xs={4}
                              className="my-auto"
                            >
                              <Form.Label>Add Charges</Form.Label>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={8} className="d-flex">
                              <Form.Control
                                type="text"
                                placeholder="0"
                                className="text-box formhover box"
                                id=""
                                name="addch"
                                value={additionalChargesTotal}
                                readOnly
                              />

                              <Button
                                className="plus-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({ additionchargesyes: true });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  className="plus-color"
                                />
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <Row className="mt-2" style={{ paddingBottom: "15px" }}>
                        <Col lg={1} md={1} sm={1} xs={1} className="my-auto">
                          <Form.Label>Narrations</Form.Label>
                        </Col>
                        <Col sm={11}>
                          <Form.Control
                            as="textarea"
                            placeholder="Enter Narration"
                            style={{ height: "65px" }}
                            className="text-box"
                            id="narration"
                            onChange={handleChange}
                            name="narration"
                            value={values.narration}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      lg={2}
                      md={2}
                      sm={2}
                      xs={2}
                      style={{ borderLeft: "1px solid #D9D9D9" }}
                    >
                      <TGSTFooter
                        values={values}
                        taxcal={taxcal}
                        authenticationService={authenticationService}
                      />
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Table className="btm-amt-tbl">
                        <tbody>
                          <tr>
                            <td className="py-0">Base Amt</td>
                            <td className="p-0 text-end">
                              {values.total_base_amt}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Disc Amt</td>
                            <td className="p-0 text-end">
                              {isNaN(
                                parseFloat(values.total_purchase_discount_amt)
                              )
                                ? 0
                                : parseFloat(
                                    values.total_purchase_discount_amt
                                  )}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Taxable Amt</td>
                            <td className="p-0 text-end">
                              {values.total_taxable_amt}
                            </td>
                          </tr>{" "}
                          <tr>
                            <td className="py-0">Tax Amt</td>
                            <td className="p-0 text-end">
                              {values.total_tax_amt}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0">Round Off</td>
                            <td className="p-0 text-end">{values.roundoff}</td>
                          </tr>
                          <tr>
                            <th>Final Amt</th>
                            <th className="text-end">{values.totalamt}</th>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>

                  <Row className="mx-0 btm-rows-btn">
                    <Col lg={12} className="text-end">
                      <Button className="successbtn-style  me-2" type="submit">
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          MyNotifications.fire(
                            {
                              show: true,
                              icon: "confirm",
                              title: "Confirm",
                              msg: "Do you want to cancel",
                              is_button_show: false,
                              is_timeout: false,
                              delay: 0,
                              handleSuccessFn: () => {
                                eventBus.dispatch(
                                  "page_change",
                                  "tranx_purchase_challan_list"
                                );
                              },
                              handleFailFn: () => {},
                            },
                            () => {
                              console.warn("return_data");
                            }
                          );
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>

                  <Row className="mx-0 btm-rows-btn1">
                    <Col md="2" className="px-0">
                      <Form.Label className="btm-label">
                        <img
                          src={keyboard}
                          className="svg-style mt-0 mx-2"
                        ></img>
                        New entry: <span className="shortkey">Ctrl + N</span>
                      </Form.Label>
                    </Col>
                    <Col md="8">
                      <Form.Label className="btm-label">
                        Duplicate: <span className="shortkey">Ctrl + D</span>
                      </Form.Label>
                    </Col>
                    {/* <Col md="8"></Col> */}
                    <Col md="2" className="text-end">
                      <img src={question} className="svg-style ms-1"></img>
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
            onHide={() => this.handleAdditionalChargesHide()}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Additional Charges
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <div className="purchasescreen">
                {additionalCharges.length > 0 && (
                  <Table className="serialnotbl additionachargestbl  table-bordered">
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>
                          Ledger
                          <img
                            src={add}
                            className="add-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                isActionExist(
                                  "ledger",
                                  "create",
                                  this.props.userPermissions
                                )
                              ) {
                                if (this.myRef.current) {
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_purchase_challan_create",
                                    to: "ledgercreate",
                                    prop_data: {
                                      from_page:
                                        "tranx_purchase_challan_create",
                                      rows: rows,
                                      invoice_data: this.myRef.current.values,
                                      additionalCharges: additionalCharges,
                                      mdl_additionalcharges: true,
                                    },
                                    isNewTab: false,
                                  });
                                }
                                // eventBus.dispatch(
                                //   "page_change",
                                //   "ledgercreate"
                                // );
                                let prop_data = {
                                  sundary_creditor_from_purchase:
                                    "sundry_creditors",
                                };
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
                          ></img>
                        </th>
                        <th>Amt</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: "2px solid transparent" }}>
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
              <Button
                className="createbtn seriailnobtn"
                onClick={(e) => {
                  e.preventDefault();

                  this.handleAdditionalChargesHide();
                  // this.handle
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Adjustment Bill Amount */}

          <Modal
            show={adjustbillshow}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ adjustbillshow: false })}
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Settlement of Bills
              </Modal.Title>

              <Button
                className="ml-2 btn-refresh pull-right clsbtn"
                type="submit"
                onClick={() => this.setState({ adjustbillshow: false })}
              >
                <img src={closeBtn} alt="icon" className="my-auto" />
              </Button>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2 ">
              <div className="purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  innerRef={this.formRef}
                  initialValues={invoice_data}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let invoiceValues = this.myRef.current.values;

                    let requestData = new FormData();
                    requestData.append(
                      "debitNoteReference",
                      values.newReference
                    );
                    let row = billLst.filter((v) => v.Total_amt != "");
                    if (values.newReference == "true") {
                      let bills = [];
                      row.map((v) => {
                        bills.push({
                          debitNoteId: v.id,
                          debitNotePaidAmt: v.debit_paid_amt,
                          debitNoteRemaningAmt: v.debit_remaining_amt,
                          source: v.source,
                        });
                      });
                      requestData.append("bills", JSON.stringify(bills));
                    }

                    // !Invoice Data
                    requestData.append(
                      "invoice_date",
                      moment(invoice_data.pc_invoice_dt).format("yyyy-MM-DD")
                    );
                    requestData.append("invoice_no", invoiceValues.pi_no);
                    requestData.append(
                      "purchase_id",
                      invoice_data.purchaseId.value
                    );
                    requestData.append(
                      "purchase_sr_no",
                      invoiceValues.pi_sr_no
                    );
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
                    requestData.append("total_b_amt", returnValues.total_b_amt);
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
                        vi["brandId"] = vi.brandId ? vi.brandId.value : "";
                        vi["categoryId"] = vi.categoryId
                          ? vi.categoryId.value
                          : "";
                        vi["subCategoryId"] = vi.subCategoryId
                          ? vi.subCategoryId.value
                          : "";
                        vi["flavourId"] = vi.flavourId
                          ? vi.flavourId.value
                          : "";
                        vi["packageId"] = vi.packageId
                          ? vi.packageId.value
                          : "";
                        vi["unitId"] = vi.unitId ? vi.unitId.value : "";
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
                      requestData.append(
                        "taxCalculation",
                        JSON.stringify(taxCal)
                      );
                      requestData.append("taxFlag", true);
                    }

                    for (let [name, value] of requestData) {
                    }

                    createPOChallanInvoice(requestData)
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
                      .catch((error) => {});
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
                      <Row className="mb-3">
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
                        <div className="">
                          <Table className="serialnotbl additionachargestbl  table-bordered">
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
                                    />
                                  </Form.Group>
                                </th>
                                <th>Debit Note No</th>
                                <th> Debit Note Date</th>
                                <th>Total amount</th>
                                <th style={{ width: "23%" }}>Paid Amt</th>
                                <th>Remaining Amt</th>
                              </tr>
                            </thead>
                            <tbody
                              style={{
                                borderTop: "2px solid transparent",
                                textAlign: "center",
                              }}
                            >
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
                          <Button
                            className="successbtn-style  float-end"
                            type="submit"
                          >
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

          {/* Batch Modal  */}
          <Modal
            show={batchModalShow}
            size="xl"
            className=" mt-5 mainmodal"
            onHide={() => this.handlebatchModalShow(false)}
            aria-labelledby="contained-modal-title-vcenter"
            //centered
          >
            <Modal.Header>
              <Modal.Title className="modalhead">Batch Number</Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.handlebatchModalShow(false)}
              />
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={batchInitVal}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({})}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let {
                  rows,
                  rowIndex,
                  brandIndex,
                  categoryIndex,
                  subcategoryIndex,
                  groupIndex,
                  packageIndex,
                  unitIndex,
                  b_details_id,
                  is_expired,
                } = this.state;

                console.warn(
                  "rahul::batch values, is_expired, b_details_id",
                  values,
                  is_expired,
                  b_details_id
                );
                if (b_details_id == 0 && batchData.length > 0) {
                  // setSubmitting(false);
                  // MyNotifications.fire({
                  //   show: true,
                  //   icon: "error",
                  //   title: "Error",
                  //   msg: "Please Select Batch Or add New Batch",
                  //   is_button_show: true,
                  // });
                  // console.log(
                  //   "batch not selected even after having row in table"
                  // );
                  this.setState({ batch_error: true });
                  // this.setState({ batchModalShow: true });
                  // this.handlebatchModalShow(true);
                } else {
                  this.setState({
                    batch_error: false,
                    batchModalShow: false,
                  });
                  if (is_expired != true) {
                    if (b_details_id != 0) {
                      let salesrate = b_details_id.purchase_rate;

                      if (
                        this.myRef.current.values &&
                        this.myRef.current.values.supplierNameId &&
                        parseInt(
                          this.myRef.current.values.supplierNameId.salesRate
                        ) == 2
                      ) {
                        salesrate = b_details_id.min_rate_b;
                      } else if (
                        this.myRef.current.values &&
                        this.myRef.current.values.supplierNameId &&
                        parseInt(
                          this.myRef.current.values.supplierNameId.salesRate
                        ) == 3
                      ) {
                        salesrate = b_details_id.min_rate_c;
                      }

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["rate"] = salesrate;

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_details_id"] = b_details_id.id;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_no"] = b_details_id.batch_no;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_rate"] = b_details_id.b_rate;

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_purchase_rate"] =
                        b_details_id.purchase_rate;

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["rate_a"] = b_details_id.min_rate_a;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["rate_b"] = b_details_id.min_rate_b;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["rate_c"] = b_details_id.min_rate_c;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["max_discount"] = b_details_id.max_discount;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["min_discount"] = b_details_id.min_discount;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["min_margin"] = b_details_id.min_margin;

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_expiry"] =
                        b_details_id.expiry_date != ""
                          ? b_details_id.expiry_date
                          : "";

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["manufacturing_date"] =
                        b_details_id.manufacturing_date != ""
                          ? b_details_id.manufacturing_date
                          : "";

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["is_batch"] = isBatch;
                    } else {
                      let salesrate = values.b_purchase_rate;

                      if (
                        this.myRef.current.values &&
                        this.myRef.current.values.supplierNameId &&
                        parseInt(
                          this.myRef.current.values.supplierNameId.salesRate
                        ) == 2
                      ) {
                        salesrate = values.rate_b;
                      } else if (
                        this.myRef.current.values &&
                        this.myRef.current.values.supplierNameId &&
                        parseInt(
                          this.myRef.current.values.supplierNameId.salesRate
                        ) == 3
                      ) {
                        salesrate = values.rate_c;
                      }

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["rate"] = salesrate;

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_details_id"] = values.b_details_id;

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_no"] = values.b_no;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_rate"] = values.b_rate;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["rate_a"] = values.rate_a;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["rate_b"] = values.rate_b;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["rate_c"] = values.rate_c;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["max_discount"] = values.max_discount;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["min_discount"] = values.min_discount;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["min_margin"] = values.min_margin;
                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_purchase_rate"] = values.b_purchase_rate;

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["b_expiry"] =
                        values.b_expiry != ""
                          ? moment(
                              new Date(
                                moment(values.b_expiry, "DD/MM/YYYY").toDate()
                              )
                            ).format("YYYY-MM-DD")
                          : "";

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["manufacturing_date"] =
                        values.manufacturing_date != ""
                          ? moment(
                              new Date(
                                moment(
                                  values.manufacturing_date,
                                  "DD/MM/YYYY"
                                ).toDate()
                              )
                            ).format("YYYY-MM-DD")
                          : "";

                      rows[rowIndex]["brandDetails"][brandIndex][
                        "groupDetails"
                      ][groupIndex]["categoryDetails"][categoryIndex][
                        "subcategoryDetails"
                      ][subcategoryIndex]["packageDetails"][packageIndex][
                        "unitDetails"
                      ][unitIndex]["is_batch"] = isBatch;
                    }
                    this.setState(
                      {
                        batchModalShow: false,
                        rowIndex: -1,
                        brandIndex: -1,
                        groupIndex: -1,
                        categoryIndex: -1,
                        subcategoryIndex: -1,
                        packageIndex: -1,
                        unitIndex: -1,
                        b_details_id: 0,
                        isBatch: isBatch,
                      },
                      () => {
                        this.handleRowStateChange(rows);
                      }
                    );
                  } else {
                    MyNotifications.fire({
                      show: true,
                      icon: "error",
                      title: "Error",
                      msg: "Batch Expired",
                      is_button_show: true,
                    });
                  }
                }
                this.setState(
                  {
                    rowIndex: -1,
                    brandIndex: -1,
                    categoryIndex: -1,
                    subcategoryIndex: -1,
                    flavourIndex: -1,
                    packageIndex: -1,
                    unitIndex: -1,
                    b_details_id: 0,
                    isBatch: isBatch,
                  },
                  () => {
                    this.handleRowStateChange(rows);
                  }
                );
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
                <Form className="" onSubmit={handleSubmit} autoComplete="off">
                  {/* {JSON.stringify(batchInitVal)}
                {JSON.stringify(values)} */}
                  <Modal.Body className="p-0">
                    <div className="">
                      <div className="bgstyle">
                        <Row>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Batch No.
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="b_no"
                                  id="b_no"
                                  onChange={handleChange}
                                  value={values.b_no}
                                />
                              </Col>
                            </Form.Group>
                          </Col>

                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Manufacturing Date
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Label>
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.mfgDateRef.current = input;
                                    }}
                                    name="manufacturing_date"
                                    id="manufacturing_date"
                                    placeholder="DD/MM/YYYY"
                                    value={values.manufacturing_date}
                                    onChange={handleChange}
                                    onBlur={(e) => {
                                      console.log("e ", e);
                                      console.log(
                                        "e.target.value ",
                                        e.target.value
                                      );
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
                                          setFieldValue(
                                            "manufacturing_date",
                                            e.target.value
                                          );
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Invalid date",
                                            is_button_show: true,
                                          });
                                          this.mfgDateRef.current.focus();
                                          setFieldValue(
                                            "manufacturing_date",
                                            ""
                                          );
                                        }
                                      } else {
                                        setFieldValue("manufacturing_date", "");
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.manufacturing_date}
                                  </span>
                                </Form.Label>
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Expiry Date
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Label>
                                  <MyTextDatePicker
                                    innerRef={(input) => {
                                      this.batchdpRef.current = input;
                                    }}
                                    name="b_expiry"
                                    id="b_expiry"
                                    placeholder="DD/MM/YYYY"
                                    value={values.b_expiry}
                                    onChange={handleChange}
                                    onBlur={(e) => {
                                      console.log("e ", e);

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
                                          let mfgDate =
                                            values.manufacturing_date;
                                          console.log("mfgDate", mfgDate);
                                          let mfgTime = moment(
                                            values.manufacturing_date,
                                            "DD-MM-YYYY"
                                          ).toDate();

                                          if (
                                            mfgDate == "" ||
                                            mfgDate == null ||
                                            mfgDate == undefined
                                          ) {
                                            // MyNotifications.fire({
                                            //   show: true,
                                            //   icon: "error",
                                            //   title: "Error",
                                            //   msg: "First input manufacturing date",
                                            //   is_button_show: true,
                                            // });
                                            // this.mfgDateRef.current.focus();
                                            // setFieldValue("b_expiry", "");
                                          } else {
                                            let expDate = moment(
                                              e.target.value,
                                              "DD/MM/YYYY"
                                            ).toDate();

                                            if (
                                              mfgTime.getTime() <
                                              expDate.getTime()
                                            ) {
                                              setFieldValue(
                                                "b_expiry",
                                                e.target.value
                                              );
                                            } else {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Expiry date should be greater MFG date",
                                                is_button_show: true,
                                              });
                                              setFieldValue("b_expiry", "");
                                              this.batchdpRef.current.focus();
                                            }
                                          }
                                        } else {
                                          MyNotifications.fire({
                                            show: true,
                                            icon: "error",
                                            title: "Error",
                                            msg: "Invalid date",
                                            is_button_show: true,
                                          });
                                          this.batchdpRef.current.focus();
                                          setFieldValue("b_expiry", "");
                                        }
                                      } else {
                                        setFieldValue("b_expiry", "");
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_expiry}
                                  </span>
                                </Form.Label>
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                MRP
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="b_rate"
                                  id="b_rate"
                                  onChange={handleChange}
                                  value={values.b_rate}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Purchase Rate
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="b_purchase_rate"
                                  id="b_purchase_rate"
                                  onChange={handleChange}
                                  value={values.b_purchase_rate}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    this.validatePurchaseRate(
                                      values.b_rate,
                                      values.b_purchase_rate
                                    );
                                  }}

                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Sales Rate A
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_a"
                                  id="rate_a"
                                  onChange={handleChange}
                                  value={values.rate_a}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_a > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_a
                                      );
                                    }
                                  }}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Sales Rate B
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_b"
                                  id="rate_b"
                                  onChange={handleChange}
                                  value={values.rate_b}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_b > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_b
                                      );
                                    }
                                  }}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Sales Rate C
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_c"
                                  id="rate_c"
                                  onChange={handleChange}
                                  value={values.rate_c}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.rate_c > 0) {
                                      this.validateSalesRate(
                                        values.b_rate,
                                        values.b_purchase_rate,
                                        values.rate_c
                                      );
                                    }
                                  }}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Min Margin %
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="min_margin"
                                  id="min_margin"
                                  onChange={handleChange}
                                  value={values.min_margin}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Max Discount %
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="max_discount"
                                  id="max_discount"
                                  onChange={handleChange}
                                  value={values.max_discount}
                                  onBlur={(e) => {
                                    e.preventDefault();
                                    if (values.max_discount > 0) {
                                      this.validateMaxDiscount(
                                        values.max_discount,
                                        values.b_purchase_rate,
                                        values.rate_a,
                                        values.min_margin
                                      );
                                    }
                                  }}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Min Discount %
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="min_discount"
                                  id="min_discount"
                                  onChange={handleChange}
                                  value={values.min_discount}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </div>
                    <div>
                      {/* {JSON.stringify(batchData)} */}
                      {batchData && batchData.length > 0 && (
                        <>
                          <Table>
                            <thead className="modaltblhead">
                              <tr>
                                <th>Batch no</th>
                                <th>Rate A</th>
                                <th>Rate B</th>
                                <th>Rate C</th>
                                <th>Purchase Rate</th>
                                <th>Max Discount</th>
                                <th>Min Margin</th>
                                <th>MRP</th>
                                <th>Expiry Date</th>
                                <th>Manufacturing Date</th>
                                <th>Stock</th>
                              </tr>
                            </thead>

                            <tbody>
                              {batchData.map((v, i) => {
                                return (
                                  <tr
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({
                                        b_details_id: v,
                                        tr_id: i + 1,
                                        is_expired: v.is_expired,
                                      });
                                    }}
                                    className={`${
                                      is_expired != true
                                        ? tr_id == i + 1
                                          ? "tr-color"
                                          : ""
                                        : ""
                                      // v.is_expired == true ? "bg-danger" : ""
                                    }`}
                                  >
                                    {/* <td>{i + 1}</td> */}
                                    <td>{v.batch_no}</td>
                                    <td>{v.min_rate_a}</td>
                                    <td>{v.min_rate_b}</td>
                                    <td>{v.min_rate_c}</td>
                                    <td>{v.purchase_rate}</td>
                                    <td>{v.max_discount}</td>
                                    <td>{v.min_margin}</td>
                                    <td>{v.mrp}</td>
                                    <td
                                      className={`${
                                        v.is_expired == true
                                          ? "text-danger"
                                          : ""
                                      }`}
                                    >
                                      {v.expiry_date}
                                    </td>
                                    <td>{v.manufacturing_date}</td>
                                    <td>{v.closing_stock}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </>
                      )}
                    </div>
                    {this.state.batch_error == true && (
                      <Alert key={"danger"} variant={"danger"}>
                        Please Select Batch Or add New Batch
                      </Alert>
                    )}
                  </Modal.Body>
                  <div className="text-end p-2">
                    <Button
                      className="successbtn-style me-2"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   if (b_details_id == 0 && batchData.length > 0) {
                      //     MyNotifications.fire({
                      //       show: true,
                      //       icon: "warning",
                      //       title: "Warning",
                      //       msg: "Please Select Batch Or add New Batch",
                      //       is_button_show: true,
                      //     });
                      //     console.log(
                      //       "batch not selected even after having row in table"
                      //     );

                      //   }
                      // }}
                      type="submit"
                    >
                      Submit
                    </Button>

                    <Button
                      variant="secondary"
                      className="cancel-btn"
                      onClick={() => {
                        resetForm();
                        this.setState({
                          batchInitVal: {
                            b_no: 0,
                            b_rate: 0,
                            rate_a: 0,
                            rate_b: 0,
                            rate_c: 0,
                            max_discount: 0,
                            min_discount: 0,
                            min_margin: 0,
                            manufacturing_date: "",
                            b_purchase_rate: 0,
                            b_expiry: "",
                            b_details_id: 0,
                          },
                          // this.clearBatchValue(setFieldValue);
                        });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userPermissions }) => {
  return { userPermissions };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(TranxPurchaseChallanCreate_bk);
