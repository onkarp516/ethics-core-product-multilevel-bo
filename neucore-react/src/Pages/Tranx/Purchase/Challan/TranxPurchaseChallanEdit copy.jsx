import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  ButtonGroup,
  Modal,
  Collapse,
  InputGroup,
  CloseButton,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CMPTranxRow from "../../Components/CMPTranxRow";
import {
  faPencil,
  faPlusCircle,
  faIndianRupeeSign,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import {
  getPurchaseAccounts,
  getSundryCreditors,
  getProduct,
  createPOChallanInvoice,
  getDiscountLedgers,
  getAdditionalLedgers,
  authenticationService,
  listGetPO,
  getPOPendingOrderWithIds,
  getPOInvoiceWithIds,
  getPurchaseChallanbyId,
  getProductPackageList,
  editPurchaseChallan,
  get_Product_batch,
  listTranxDebitesNotes,
  getPurChallanProductFpuById,
  getProductFlavourList,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  customStyles,
  MyDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
  invoiceSelectTo,
  purchaseSelect,
  fnTranxCalculation,
} from "@/helpers";

import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import calendar2 from "@/assets/images/calendar2.png";
import add from "@/assets/images/add.png";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import TGSTFooter from "../../Components/TGSTFooter";

const customStyles1 = {
  control: (base) => ({
    ...base,
    height: 26,
    minHeight: 26,
    border: "none",
    padding: "0 6px",
    boxShadow: "none",
    //lineHeight: "10",
    background: "transparent",
  }),
};

class TranxPurchaseChallanEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.manufdpRef = React.createRef();
    this.dpRef = React.createRef();
    this.batchdpRef = React.createRef();

    this.state = {
      show: false,
      // invoice_data: "",
      purchaseAccLst: [],
      lstBrand: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      invoiceedit: false,
      createproductmodal: false,
      productLst: [],
      unitLst: [],
      rows: [],
      lstBrand: [],
      serialnopopupwindow: false,
      pendingorderprdctsmodalshow: false,
      pendingordermodal: false,
      serialnoshowindex: -1,
      serialnoarray: [],
      lstDisLedger: [],
      additionalCharges: [],
      lstAdditionalLedger: [],
      additionalChargesTotal: 0,

      taxcal: { igst: [], cgst: [], sgst: [] },
      opPOList: [],
      purchasePendingOrderLst: [],
      selectedCounterSalesBills: [],
      selectedOrderToInvoice: [],
      isAllChecked: false,
      selectedProductDetails: [],
      selectedPendingOrder: [],
      rowDelDetailsIds: [],
      lstPackages: [],
      transaction_mdl_show: false,
      transaction_detail_index: 0,
      opendiv: false,
      hidediv: true,
      isEditDataSet: false,
      purchaseEditData: "",
      batchModalShow: false,
      batchData: "",
      batchInitVal: "",
      b_details_id: 0,
      isBatch: false,
      tr_id: "",
      fetchBatch: [],
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
      },
    };
  }
  handlebatchModalShow = (status) => {
    this.setState({ batchModalShow: status, tr_id: "" });
  };
  handleLstPackage = (lstPackages) => {
    this.setState({ lstPackages: lstPackages });
  };
  setBillEditData = () => {
    const { id } = this.state.purchaseEditData;
    let formData = new FormData();
    formData.append("id", id);
    getPurchaseChallanbyId(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          let {
            invoice_data,
            row,
            narration,
            discountLedgerId,
            additional_charges,
          } = res;
          const {
            purchaseAccLst,
            supplierNameLst,
            supplierCodeLst,
            productLst,
            lstAdditionalLedger,
            lstDisLedger,
            purchaseEditData,
            lstPackages,
            lstBrand,
          } = this.state;

          let inputdiscountLedgerId = "";
          let discountInPer = 0;
          let discountInAmt = 0;

          if (res.discountLedgerId > 0) {
            inputdiscountLedgerId = res.discountLedgerId
              ? getSelectValue(lstDisLedger, res.discountLedgerId)
              : "";
            discountInPer = res.discountInPer;
            discountInAmt = res.discountInAmt;
          }
          let initInvoiceData = {
            id: invoice_data.id,
            pc_sr_no: invoice_data.purchase_sr_no,
            pc_no: invoice_data.invoice_no,
            discountLedgerId: invoice_data.purchase_disc_ledger,
            pc_invoice_date: new Date(invoice_data.transaction_dt),
            pc_transaction_dt: moment(invoice_data.transaction_dt).format(
              "YYYY-MM-DD"
            ),
            purchase_id: getSelectValue(
              purchaseAccLst,
              invoice_data.purchase_account_ledger_id //From Reference Purchase Invoice Before ref purchase_id
            ),

            supplierCodeId: invoice_data.supplierId
              ? getSelectValue(supplierCodeLst, invoice_data.supplierId) //From Reference Purchase Invoice Before ref supplier_id
              : "",
            supplierNameId: invoice_data.supplierId
              ? getSelectValue(supplierNameLst, invoice_data.supplierId) //From Reference Purchase Invoice Before ref supplier_id
              : "",
            transport_name:
              invoice_data.transport_name != null
                ? invoice_data.transport_name
                : "",
            reference:
              invoice_data.reference != null ? invoice_data.reference : "",
            purchase_disc_ledger: inputdiscountLedgerId,
            purchase_discount: discountInPer,
            purchase_discount_amt: discountInAmt,
          };

          let initRowData = [];
          if (row.length >= 0) {
            initRowData = row.map((v, i) => {
              let productOpt = getSelectValue(lstBrand, parseInt(v.productId));
              v["productId"] = getSelectValue(productLst, v.productId);
              v.details_id = v.details_id != "" ? v.details_id : 0;

              v["brandDetails"] = v.brandDetails.map((vb) => {
                if (vb.brandId == "") {
                  vb.brandId = getSelectValue(productOpt.brandOpt, "");
                } else if (vb.brandId) {
                  vb.brandId = getSelectValue(productOpt.brandOpt, vb.brandId);
                }

                console.log("vb", vb);
                vb.categoryDetails = vb.categoryDetails.map((vc) => {
                  if (vc.categoryId == "") {
                    vc.categoryId = getSelectValue(vb.brandId.categoryOpt, "");
                  } else if (vc.categoryId) {
                    vc.categoryId = getSelectValue(
                      vb.brandId.categoryOpt,
                      vc.categoryId
                    );
                  }
                  console.log("vc", vc);
                  vc.subcategoryDetails = vc.subcategoryDetails.map((vs) => {
                    if (vs.subCategoryId == "") {
                      vs.subCategoryId = getSelectValue(
                        vc.categoryId.subcategoryOpt,
                        ""
                      );
                    } else if (vs.subCategoryId) {
                      vs.subCategoryId = getSelectValue(
                        vc.categoryId.subcategoryOpt,
                        vs.subCategoryId
                      );
                    }

                    vs.flavourDetails = vs.flavourDetails.map((vf) => {
                      if (vf.flavourId == "") {
                        vf.flavourId = getSelectValue(
                          vs.subCategoryId.flavourOpt,
                          ""
                        );
                      } else if (vf.flavourId) {
                        vf.flavourId = getSelectValue(
                          vs.subCategoryId.flavourOpt,
                          vf.flavourId
                        );
                      }

                      vf.packageDetails = vf.packageDetails.map((vp) => {
                        if (vp.packageId == "") {
                          vp.packageId = getSelectValue(
                            vf.flavourId.packageOpt,
                            ""
                          );
                        } else if (vp.packageId) {
                          vp.packageId = getSelectValue(
                            vf.flavourId.packageOpt,
                            vp.packageId
                          );
                        }
                        console.log("vp", vp);
                        vp.unitDetails = vp.unitDetails.map((vu) => {
                          if (vu.unitId == "") {
                            vu.unitId = getSelectValue(
                              vp.packageId.unitOpt,
                              ""
                            );
                          } else if (vu.unitId) {
                            vu.unitId = getSelectValue(
                              vp.packageId.unitOpt,
                              vu.unitId
                            );
                          }
                          console.log("vu", vu);
                          return {
                            details_id: vu.details_id != "" ? vu.details_id : 0,
                            unitId: vu.unitId != "" ? vu.unitId : "",
                            qty: vu.qty != "" ? vu.qty : "",
                            rate: vu.rate != "" ? vu.rate : 0,
                            base_amt: vu.base_amt != "" ? vu.base_amt : 0,
                            unit_conv: vu.unit_conv != "" ? vu.unit_conv : 0,
                            dis_amt: vu.dis_amt,
                            dis_per: vu.dis_per,
                            dis_per_cal:
                              vu.dis_per_cal != "" ? vu.dis_per_cal : 0,
                            dis_amt_cal:
                              vu.dis_amt_cal != "" ? vu.dis_amt_cal : 0,
                            total_amt: vu.total_amt != "" ? vu.total_amt : 0,
                            total_base_amt:
                              vu.total_base_amt != "" ? vu.total_base_amt : 0,
                            gst: vu.gst != "" ? vu.gst : 0,
                            igst: vu.igst != "" ? vu.igst : 0,
                            cgst: vu.cgst != "" ? vu.cgst : 0,
                            sgst: vu.sgst != "" ? vu.sgst : 0,
                            total_igst: vu.total_igst != "" ? vu.total_igst : 0,
                            total_cgst: vu.total_cgst != "" ? vu.total_cgst : 0,
                            total_sgst: vu.total_sgst > 0 ? vu.total_sgst : 0,
                            final_amt: vu.final_amt != "" ? vu.final_amt : 0,
                            final_discount_amt:
                              vu.final_discount_amt != ""
                                ? vu.final_discount_amt
                                : 0,
                            discount_proportional_cal:
                              vu.discount_proportional_cal != ""
                                ? vu.discount_proportional_cal
                                : 0,
                            additional_charges_proportional_cal:
                              vu.additional_charges_proportional_cal != ""
                                ? vu.additional_charges_proportional_cal
                                : 0,
                            b_no: vu.batch_no != "" ? vu.batch_no : "",
                            b_rate: vu.b_rate != "" ? vu.b_rate : 0,
                            rate_a: vu.min_rate_a != "" ? vu.min_rate_a : 0,
                            rate_b: vu.min_rate_b != "" ? vu.min_rate_b : 0,
                            rate_c: vu.min_rate_c != "" ? vu.min_rate_c : 0,
                            max_discount:
                              vu.max_discount != "" ? vu.max_discount : 0,
                            min_discount:
                              vu.min_discount != "" ? vu.min_discount : 0,
                            min_margin: vu.min_margin != "" ? vu.min_margin : 0,
                            manufacturing_date:
                              vu.manufacturing_date != ""
                                ? vu.manufacturing_date
                                : "",
                            b_purchase_rate:
                              vu.b_purchase_rate != "" ? vu.b_purchase_rate : 0,
                            b_expiry: vu.b_expiry != "" ? vu.b_expiry : "",
                            b_details_id:
                              vu.b_detailsId != "" ? vu.b_detailsId : "",
                            is_batch: vu.is_batch != "" ? vu.is_batch : "",
                          };
                        });
                        return vp;
                      });

                      return vf;
                    });
                    return vs;
                  });
                  return vc;
                });
                return vb;
              });

              return v;
            });
          }
          let InitAdditionalCharges = [];
          let totalAdditionalCharges = 0;
          if (additional_charges.length > 0) {
            additional_charges.map((v) => {
              let data = {
                additional_charges_details_id: v.additional_charges_details_id,
                ledger_id:
                  v.ledger_id > 0
                    ? getSelectValue(lstAdditionalLedger, v.ledger_id)
                    : "",
                amt: v.amt > 0 ? v.amt : "",
              };
              totalAdditionalCharges += parseFloat(v.amt);
              InitAdditionalCharges.push(data);
            });
          }
          // if (res.discountLedgerId > 0) {
          //   let discountLedgerId = getSelectValue(
          //     lstDisLedger,
          //     res.discountLedgerId
          //   );
          //   this.myRef.current.setFieldValue(
          //     "purchase_disc_ledger",
          //     discountLedgerId
          //   );
          //   this.myRef.current.setFieldValue(
          //     "purchase_discount",
          //     res.discountInPer
          //   );
          //   this.myRef.current.setFieldValue(
          //     "purchase_discount_amt",
          //     res.discountInAmt
          //   );
          // }
          // this.myRef.current.setFieldValue("narration", narration);
          this.setState(
            {
              invoice_data: initInvoiceData,
              rows: initRowData,
              isEditDataSet: true,
              additionalCharges: InitAdditionalCharges,
              additionalChargesTotal: totalAdditionalCharges,
            },
            () => {
              setTimeout(() => {
                this.handleTranxCalculation();
              }, 25);
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getProductFlavorpackageUnitbyids = (invoice_id) => {
    let reqData = new FormData();
    reqData.append("id", invoice_id);
    getPurChallanProductFpuById(reqData)
      .then((res) => res.data)
      .then((response) => {
        if (response.responseStatus == 200) {
          let Opt = response.productIds.map((v) => {
            let brand_opt = v.brandsOpt.map((vb) => {
              let category_opt = vb.categoryOpt.map((vc) => {
                let subcategory_opt = vc.subCategoryOpt.map((vs) => {
                  let flavour_opt = vs.flavourOpt.map((vi) => {
                    let pkg_opt = vi.packageOpt.map((vii) => {
                      let unit_opt = vii.unitOpt.map((z) => {
                        return {
                          label: z.label,
                          value: z.value != "" ? parseInt(z.value) : "",
                          isDisabled: false,
                          ...z,
                          batchOpt: z.batchOpt,
                        };
                      });
                      return {
                        label: vii.label,
                        value: vii.value != "" ? parseInt(vii.value) : "",
                        isDisabled: false,

                        unitOpt: unit_opt,
                      };
                    });
                    return {
                      label: vi.label,
                      value: vi.value != "" ? parseInt(vi.value) : "",
                      isDisabled: false,

                      packageOpt: pkg_opt,
                    };
                  });
                  return {
                    label: vs.label,
                    value: vs.value != "" ? parseInt(vs.value) : "",
                    isDisabled: false,

                    flavourOpt: flavour_opt,
                  };
                });
                return {
                  label: vc.label,
                  value: vc.value != "" ? parseInt(vc.value) : "",
                  isDisabled: false,

                  subcategoryOpt: subcategory_opt,
                };
              });
              return {
                label: vb.label,
                value: vb.value != "" ? parseInt(vb.value) : "",
                isDisabled: false,

                categoryOpt: category_opt,
              };
            });
            return {
              product_id: v.product_id,
              value: v.value != "" ? parseInt(v.value) : "",
              isDisabled: false,

              brandOpt: brand_opt,
            };
          });

          this.setState({ lstBrand: Opt }, () => {});
        } else {
          this.setState({ lstBrand: [] });
        }
      })

      .catch((error) => {
        console.log("error", error);
        this.setState({ lstBrand: [] }, () => {});
      });
  };

  handleRowStateChange = (
    rowValue,
    showBatch = false,
    rowIndex = -1,
    brandIndex = -1,
    categoryIndex = -1,
    subcategoryIndex = -1,
    flavourIndex = -1,
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
        flavourIndex >= 0 &&
        packageIndex >= 0 &&
        unitIndex >= 0
      ) {
        this.setState(
          {
            rowIndex: rowIndex,
            brandIndex: brandIndex,
            categoryIndex: categoryIndex,
            subcategoryIndex: subcategoryIndex,
            flavourIndex: flavourIndex,
            packageIndex: packageIndex,
            unitIndex: unitIndex,
          },
          () => {
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
    if (findProductPackges) {
      // let lstFlavours = findProductPackges.flavour_opts;

      if (findProductPackges && rowIndex != -1) {
        rows[rowIndex]["brandDetails"][0]["brandId"] =
          findProductPackges["brandOpt"][0];
        if (findProductPackges["brandOpt"][0]["categoryOpt"].length >= 1) {
          rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
            "categoryId"
          ] = findProductPackges["brandOpt"][0]["categoryOpt"][0];

          if (
            findProductPackges["brandOpt"][0]["categoryOpt"][0][
              "subcategoryOpt"
            ].length >= 1
          ) {
            rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
              "subcategoryDetails"
            ][0]["subCategoryId"] =
              findProductPackges["brandOpt"][0]["categoryOpt"][0][
                "subcategoryOpt"
              ][0];

            if (
              findProductPackges["brandOpt"][0]["categoryOpt"][0][
                "subcategoryOpt"
              ][0]["flavourOpt"].length >= 1
            ) {
              rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
                "subcategoryDetails"
              ][0]["flavourDetails"][0]["flavourId"] =
                findProductPackges["brandOpt"][0]["categoryOpt"][0][
                  "subcategoryOpt"
                ][0]["flavourOpt"][0];

              if (
                findProductPackges["brandOpt"][0]["categoryOpt"][0][
                  "subcategoryOpt"
                ][0]["flavourOpt"][0]["packageOpt"].length >= 1
              ) {
                rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
                  "subcategoryDetails"
                ][0]["flavourDetails"][0]["packageDetails"][0]["packageId"] =
                  findProductPackges["brandOpt"][0]["categoryOpt"][0][
                    "subcategoryOpt"
                  ][0]["flavourOpt"][0]["packageOpt"][0];

                if (
                  findProductPackges["brandOpt"][0]["categoryOpt"][0][
                    "subcategoryOpt"
                  ][0]["flavourOpt"][0]["packageOpt"][0]["unitOpt"].length >= 1
                ) {
                  rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
                    "subcategoryDetails"
                  ][0]["flavourDetails"][0]["packageDetails"][0][
                    "unitDetails"
                  ][0]["unitId"] =
                    findProductPackges["brandOpt"][0]["categoryOpt"][0][
                      "subcategoryOpt"
                    ][0]["flavourOpt"][0]["packageOpt"][0]["unitOpt"][0];
                }
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
            let data = responseData.responseObject.lst_packages;

            // let brandOpt = [];
            let brandOpt = data.map((v) => {
              let categoryOpt = v.category.map((vc) => {
                let subcategoryOpt = vc.subcategory.map((vs) => {
                  let flavourOpt = vs.flavour.map((vf) => {
                    let packageOpt = vf.package.map((vp) => {
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
                      label: vf.flavour_name != "" ? vf.flavour_name : "",
                      value: vf.flavour_id != "" ? vf.flavour_id : "",
                      packageOpt: packageOpt,
                      isDisabled: false,
                    };
                  });
                  return {
                    // ...v,
                    label: vs.subcategory_name != "" ? vs.subcategory_name : "",
                    value: vs.subcategory_id != "" ? vs.subcategory_id : "",
                    flavourOpt: flavourOpt,
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
                label: v.brand_name != "" ? v.brand_name : "",
                value: v.brand_id != "" ? v.brand_id : "",
                categoryOpt: categoryOpt,
                isDisabled: false,
              };
            });

            let fPackageLst = [
              ...lstBrand,
              {
                product_id: product_id,
                value: product_id,
                brandOpt: brandOpt,
              },
            ];
            console.log("fPackageLst =-> ", fPackageLst);
            this.setState({ lstBrand: fPackageLst }, () => {
              let findProductPackges = getSelectValue(
                this.state.lstBrand,
                product_id
              );
              // console.log("findProductPackges =-> ", findProductPackges);
              if (findProductPackges && rowIndex != -1) {
                rows[rowIndex]["brandDetails"][0]["brandId"] =
                  findProductPackges["brandOpt"][0];
                if (
                  findProductPackges["brandOpt"][0]["categoryOpt"].length >= 1
                ) {
                  rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
                    "categoryId"
                  ] = findProductPackges["brandOpt"][0]["categoryOpt"][0];

                  if (
                    findProductPackges["brandOpt"][0]["categoryOpt"][0][
                      "subcategoryOpt"
                    ].length >= 1
                  ) {
                    rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
                      "subcategoryDetails"
                    ][0]["subCategoryId"] =
                      findProductPackges["brandOpt"][0]["categoryOpt"][0][
                        "subcategoryOpt"
                      ][0];

                    if (
                      findProductPackges["brandOpt"][0]["categoryOpt"][0][
                        "subcategoryOpt"
                      ][0]["flavourOpt"].length >= 1
                    ) {
                      rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
                        "subcategoryDetails"
                      ][0]["flavourDetails"][0]["flavourId"] =
                        findProductPackges["brandOpt"][0]["categoryOpt"][0][
                          "subcategoryOpt"
                        ][0]["flavourOpt"][0];

                      if (
                        findProductPackges["brandOpt"][0]["categoryOpt"][0][
                          "subcategoryOpt"
                        ][0]["flavourOpt"][0]["packageOpt"].length >= 1
                      ) {
                        rows[rowIndex]["brandDetails"][0]["categoryDetails"][0][
                          "subcategoryDetails"
                        ][0]["flavourDetails"][0]["packageDetails"][0][
                          "packageId"
                        ] =
                          findProductPackges["brandOpt"][0]["categoryOpt"][0][
                            "subcategoryOpt"
                          ][0]["flavourOpt"][0]["packageOpt"][0];

                        if (
                          findProductPackges["brandOpt"][0]["categoryOpt"][0][
                            "subcategoryOpt"
                          ][0]["flavourOpt"][0]["packageOpt"][0]["unitOpt"]
                            .length >= 1
                        ) {
                          rows[rowIndex]["brandDetails"][0][
                            "categoryDetails"
                          ][0]["subcategoryDetails"][0]["flavourDetails"][0][
                            "packageDetails"
                          ][0]["unitDetails"][0]["unitId"] =
                            findProductPackges["brandOpt"][0]["categoryOpt"][0][
                              "subcategoryOpt"
                            ][0]["flavourOpt"][0]["packageOpt"][0][
                              "unitOpt"
                            ][0];
                        }
                      }
                    }
                  }
                }
              }
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
    this.setState({ batchModalShow: status, tr_id: "" });
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
      let { sales_discount, sales_discount_amt } = this.myRef.current.values;
      ledger_disc_per = sales_discount;
      ledger_disc_amt = sales_discount_amt;
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
      parseFloat(total_purchase_discount_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_taxable_amt",
      parseFloat(total_taxable_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "total_tax_amt",
      parseFloat(total_tax_amt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "roundoff",
      parseFloat(roffamt).toFixed(2)
    );
    this.myRef.current.setFieldValue(
      "totalamt",
      parseFloat(roundoffamt).toFixed(2)
    );

    let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };

    this.setState(
      {
        rows: gst_row,
        taxcal: taxState,
      },
      () => {
        if (this.state.rows.length < 10) {
          this.initRow(10 - this.state.rows.length);
        }
      }
    );
  };

  getProductBatchList = () => {
    let {
      rowIndex,
      brandIndex,
      categoryIndex,
      subcategoryIndex,
      packageIndex,
      flavourIndex,
      unitIndex,
      rows,
      invoice_data,
      lstBrand,
    } = this.state;
    let product_id = rows[rowIndex]["productId"]["value"];
    let brand_id =
      rows[rowIndex]["brandDetails"][brandIndex]["brandId"]["value"];
    let category_id =
      rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
        categoryIndex
      ]["categoryId"]["value"];
    let subcategory_id =
      rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
        categoryIndex
      ]["subcategoryDetails"][subcategoryIndex]["subCategoryId"]["value"];
    let flavour_id =
      rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
        categoryIndex
      ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][flavourIndex][
        "flavourId"
      ]["value"];
    let package_id =
      rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
        categoryIndex
      ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][flavourIndex][
        "packageDetails"
      ][packageIndex]["packageId"]["value"];
    let unit_id =
      rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
        categoryIndex
      ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][flavourIndex][
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
        let categorydata = "";
        if (category_id > 0) {
          categorydata = getSelectValue(brandData.categoryOpt, category_id);
        } else {
          categorydata = getSelectValue(brandData.categoryOpt, "");
        }
        if (categorydata) {
          let subcategorydata = "";
          if (subcategory_id > 0) {
            subcategorydata = getSelectValue(
              categorydata.subcategoryOpt,
              subcategory_id
            );
          } else {
            subcategorydata = getSelectValue(categorydata.subcategoryOpt, "");
          }
          if (subcategorydata) {
            let flavourdata = "";
            if (flavour_id > 0) {
              flavourdata = getSelectValue(
                subcategorydata.flavourOpt,
                flavour_id
              );
            } else {
              flavourdata = getSelectValue(subcategorydata.flavourOpt, "");
            }
            if (flavourdata) {
              let packagedata = "";
              if (package_id > 0) {
                packagedata = getSelectValue(
                  flavourdata.packageOpt,
                  package_id
                );
              } else {
                packagedata = getSelectValue(flavourdata.packageOpt, "");
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
      if (category_id > 0) {
        reqData.append("category_id", category_id);
      }
      if (flavour_id > 0) {
        reqData.append("flavour_id", flavour_id);
      }

      if (package_id > 0) {
        reqData.append("package_id", package_id);
      }

      get_Product_batch(reqData)
        .then((res) => res.data)
        .then((response) => {
          if (response.responseStatus == 200) {
            let res = response.data;
            // lstBrand = lstBrand.map((v, i) => {
            //   if (v.product_id == product_id) {
            //     // console.log("v", v);

            //     v.brand_opts = v.brand_opts.map((vi) => {
            //       if (vi.value == brand_id) {
            //         // console.log("vi", vi);
            //         vi.categoryOpt = vi.categoryOpt.map((vc) => {
            //           vc.flavourOpt = vc.flavourOpt.map((vf) => {
            //             vf.packageOpt = vf.packageOpt.map((vii) => {
            //               // console.log("vii", vii);
            //               vii.unitOpt = vii.unitOpt.map((z) => {
            //                 // console.log("z", z);
            //                 z.batchOpt = res;
            //                 return z;
            //               });
            //               return vii;
            //             });

            //             return vf;
            //           });

            //           return vc;
            //         });
            //       }
            //       return vi;
            //     });
            //   }
            //   return v;
            // });
            // console.log("lstBrand", lstBrand);

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
      flavourIndex,
      packageIndex,
      unitIndex,
      rows,
      productLst,
    } = this.state;
    let initVal = "";
    // console.log(
    //   "b_no: ",
    //   rows[rowIndex]["productDetails"][transactionDetailIndex]["b_no"]
    // );
    if (
      rowIndex != -1 &&
      brandIndex != -1 &&
      categoryIndex != -1 &&
      subcategoryIndex != -1 &&
      flavourIndex != -1 &&
      packageIndex != -1 &&
      unitIndex != -1
    ) {
      initVal = {
        b_no: rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
          categoryIndex
        ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
          flavourIndex
        ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["b_no"],
        b_rate:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["b_rate"],
        rate_a:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["rate_a"],
        rate_b:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["rate_b"],
        rate_c:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex]["rate_c"],
        max_discount:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "max_discount"
          ],
        min_discount:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "min_discount"
          ],
        min_margin:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "min_margin"
          ],
        b_purchase_rate:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "b_purchase_rate"
          ],
        b_expiry:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "b_expiry"
          ],
        manufacturing_date:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
          ]["packageDetails"][packageIndex]["unitDetails"][unitIndex][
            "manufacturing_date"
          ],
        // b_create: 0,
        b_details_id:
          rows[rowIndex]["brandDetails"][brandIndex]["categoryDetails"][
            categoryIndex
          ]["subcategoryDetails"][subcategoryIndex]["flavourDetails"][
            flavourIndex
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
        manufacturing_date: 0,
        b_purchase_rate: 0,
        b_expiry: "",
        b_details_id: 0,
      };
    }
    // console.log("initVal", initVal);
    // console.log("productLst.isBatchNo", productLst.isBatchNo);
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

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt });
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
            let unitOpt = v.units.map((vi) => {
              return { label: vi.unitCode, value: vi.id };
            });
            return {
              label: v.productName,
              value: v.id,
              igst: v.igst,
              hsnId: v.hsnId,
              taxMasterId: v.taxMasterId,
              sgst: v.sgst,
              cgst: v.cgst,
              productCode: v.productCode,
              productName: v.productName,
              isNegativeStocks: v.isNegativeStocks,
              isSerialNumber: v.isSerialNumber,
              unitOpt: unitOpt,
              isBatchNo: v.isBatchNo,
            };
          });
          this.setState({ productLst: opt });
        }
      })
      .catch((error) => {});
  };

  /**
   * @description Initialize Product Row
   */
  initRow = (len = null) => {
    let lst = [];
    let condition = 10;
    if (len != null) {
      condition = len;
    }

    for (let index = 0; index < condition; index++) {
      let data = {
        productId: "",
        brandDetails: [
          {
            brandId: "",
            categoryDetails: [
              {
                categoryId: "",
                subcategoryDetails: [
                  {
                    subCategoryId: "",
                    flavourDetails: [
                      {
                        flavourId: "",
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
                                additional_charges_proportioncallCreateInal_cal: 0,
                                b_no: 0,
                                b_rate: 0,
                                b_sale_rate: 0,
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
          if (res.data.length > 0) {
            this.setState({
              purchasePendingOrderLst: res.data,
              pendingordermodal: true,
            });
          } else {
            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: "No bills found",
              is_button_show: true,
            });
            // ShowNotification("Error", "No bills found");
          }
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
  handlePendingOrderSelectionAll = (status) => {
    const { purchasePendingOrderLst } = this.state;

    let lstSelected = [];
    if (status == true) {
      lstSelected = purchasePendingOrderLst.map((v) => v.id);
    }
    this.setState({
      isAllChecked: status,
      selectedPendingOrder: lstSelected,
    });
  };

  handlePendingOrder = () => {
    this.lstPOPendingOrder();
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
              state: parseInt(stateCode),
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
              value: parseInt(v.id),
              name: v.name,
              state: parseInt(stateCode),
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
      });
    } else {
      this.setState({ invoice_data: prop_data });
    }
  };

  componentDidMount() {
    this.lstPurchaseAccounts();
    this.lstSundryCreditors();
    this.lstProduct();
    // this.lstUnit();
    this.initRow();
    this.initAdditionalCharges();
    this.lstDiscountLedgers();
    this.lstAdditionalLedgers();

    let get_data = this.props.block;
    this.setState({ purchaseEditData: get_data.prop_data });
    const { prop_data } = this.props.block;

    this.setState({ purchaseEditData: prop_data }, () => {
      if (prop_data.id) {
        this.getProductFlavorpackageUnitbyids(prop_data.id);
      }
    });
    this.handlePropsData(prop_data);
  }

  componentDidUpdate() {
    const {
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      productLst,
      lstAdditionalLedger,
      isEditDataSet,
      purchaseEditData,
      lstDisLedger,
      lstPackages,
      lstBrand,
    } = this.state;
    console.log(purchaseEditData);

    if (
      purchaseAccLst.length > 0 &&
      supplierNameLst.length > 0 &&
      supplierCodeLst.length > 0 &&
      productLst.length > 0 &&
      lstAdditionalLedger.length > 0 &&
      lstBrand.length > 0 &&
      lstDisLedger.length > 0 &&
      isEditDataSet == false &&
      purchaseEditData != ""
    ) {
      this.setBillEditData();
    }
  }

  handlePlaceHolder = (product, element) => {
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
    return elementCheck ? elementCheck[element] : "";
  };

  handleUnitLstOpt = (productId) => {
    if (productId != undefined && productId) {
      return productId.unitOpt;
    }
  };
  handleUnitLstOptLength = (productId) => {
    if (productId != undefined && productId) {
      return productId.unitOpt.length;
    }
  };
  handleSerialNoQty = (element, index) => {
    let { rows } = this.state;
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
    let { rows, serialnoshowindex, serialnoarray } = this.state;
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

  render() {
    const {
      invoice_data,
      invoiceedit,
      createproductmodal,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      rows,
      productLst,
      serialnopopupwindow,
      pendingorderprdctsmodalshow,
      pendingordermodal,
      additionchargesyes,
      lstDisLedger,
      additionalCharges,
      lstAdditionalLedger,
      additionalChargesTotal,
      taxcal,
      purchasePendingOrderLst,
      isAllChecked,
      selectedPendingOrder,
      rowDelDetailsIds,
      batchModalShow,
      batchInitVal,
      batchData,
      b_details_id,
      isBatch,
      fetchBatch,
      is_expired,
      flag,
      tr_id,
      isBatchNo,
      lstBrand,
    } = this.state;
    return (
      <>
        <div className="purchase-form-style ">
          {/* <h6>Purchase Challan</h6> */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            enableReinitialize={true}
            initialValues={invoice_data}
            // initialValues={{
            //   pi_sr_no: "",
            //   pi_no: "",
            //   pi_transaction_dt: new Date(),
            //   pi_invoice_dt: "",
            //   purchase_id: "",
            //   supplierCodeId: "",
            //   supplierNameId: "",
            //   totalamt: 0,
            //   totalqty: 0,
            //   roundoff: 0,
            //   narration: "",
            //   tcs: 0,
            //   purchase_discount: 0,
            //   purchase_discount_amt: 0,
            //   total_purchase_discount_amt: "",
            //   total_base_amt: 0,
            //   total_tax_amt: 0,
            //   total_taxable_amt: 0,
            //   total_dis_amt: 0,
            //   total_dis_per: 0,
            //   totalcgstper: 0,
            //   totalsgstper: 0,
            //   totaligstper: 0,
            //   purchase_disc_ledger: "",
            //   total_discount_proportional_amt: 0,
            //   total_additional_charges_proportional_amt: 0,
            // }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //this.handleFetchData(invoice_data.supplierCodeId.value);
              let requestData = new FormData();

              requestData.append("id", values.id);
              // !Invoice Data
              requestData.append(
                "pur_challan_date",
                moment(values.pc_invoice_date).format("yyyy-MM-DD")
              );
              requestData.append("pur_challan_sr_no", values.pc_sr_no);
              requestData.append("pur_challan_no", values.pc_no);
              requestData.append("purchase_id", values.purchase_id.value);
              requestData.append("transaction_date", values.pc_transaction_dt);
              requestData.append(
                "supplier_code_id",
                values.supplierCodeId.value
              );

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

              requestData.append("roundoff", values.roundoff);
              if (values.narration != "") {
                requestData.append("narration", values.narration);
              }
              requestData.append("total_base_amt", values.total_base_amt);
              requestData.append("totalamt", values.totalamt);
              requestData.append("taxable_amount", values.total_taxable_amt);
              requestData.append("totalcgst", totalcgst);
              requestData.append("totalsgst", totalsgst);
              requestData.append("totaligst", totaligst);
              requestData.append("totalqty", values.totalqty);
              requestData.append("tcs", values.tcs);
              requestData.append("purchase_discount", values.purchase_discount);

              requestData.append(
                "purchase_discount_amt",
                values.purchase_discount_amt
              );
              requestData.append(
                "total_purchase_discount_amt",
                values.purchase_discount_amt > 0
                  ? values.purchase_discount_amt
                  : values.total_purchase_discount_amt
              );

              let returnValues = this.myRef.current.values;

              requestData.append(
                "purchase_disc_ledger",
                returnValues.purchase_disc_ledger
                  ? returnValues.purchase_disc_ledger.value
                  : 0
              );

              let frow = rows.map((v, i) => {
                if (v.productId != "") {
                  v.productId = v.productId ? v.productId.value : "";
                  v.details_id = v.details_id ? v.details_id : 0;
                  v.brandDetails = v.brandDetails.filter((vi) => {
                    vi["brandId"] = vi.brandId ? vi.brandId.value : "";
                    vi["details_id"] = vi.details_id ? vi.details_id : 0;
                    vi["categoryDetails"] = vi.categoryDetails.map((vc) => {
                      vc["categoryId"] = vc.categoryId
                        ? vc.categoryId.value
                        : "";
                      vc["subcategoryDetails"] = vc.subcategoryDetails.map(
                        (vs) => {
                          vs["subCategoryId"] = vs.subCategoryId
                            ? vs.subCategoryId.value
                            : "";
                          vs["flavourDetails"] = vs.flavourDetails.map((vf) => {
                            vf["flavourId"] = vf.flavourId
                              ? vf.flavourId.value
                              : "";
                            vf["packageDetails"] = vf.packageDetails.map(
                              (vp) => {
                                vp["packageId"] = vp.packageId
                                  ? vp.packageId.value
                                  : "";
                                vp.unitDetails = vp.unitDetails.map((vu) => {
                                  vu["details_id"] = vu.details_id
                                    ? vu.details_id
                                    : 0;
                                  vu["unitId"] = vu.unitId
                                    ? vu.unitId.value
                                    : "";
                                  vu["details_id"] = vu.details_id
                                    ? vu.details_id
                                    : 0;

                                  vu["is_multi_unit"] = vu.is_multi_unit;
                                  vu["rate"] = vu.rate;
                                  vu["rate_a"] = vu.rate_a;
                                  vu["rate_b"] = vu.rate_b;
                                  vu["rate_c"] = vu.rate_c;
                                  vu["max_discount"] = vu.max_discount;
                                  vu["min_discount"] = vu.min_discount;
                                  vu["min_margin"] = vu.min_margin;
                                  vu["b_expiry"] = moment(vu.b_expiry).format(
                                    "yyyy-MM-DD"
                                  );
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
                              }
                            );
                            return vf;
                          });
                          return vs;
                        }
                      );
                      return vc;
                    });
                    return vi;
                  });
                  return v;
                }
              });

              var filtered = frow.filter(function (el) {
                return el != null;
              });
              let additionalChargesfilter = additionalCharges.filter((v) => {
                if (
                  v.ledgerId != "" &&
                  v.ledgerId != undefined &&
                  v.ledgerId != null
                ) {
                  v["ledger"] = v["ledgerId"]["value"];
                  return v;
                }
              });
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
                values &&
                values.supplierCodeId &&
                values.supplierCodeId.state !=
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

              let filterRowDetail = [];
              if (rowDelDetailsIds.length > 0) {
                filterRowDetail = rowDelDetailsIds.map((v) => {
                  return { del_id: v };
                });
              }
              console.log("filterRowDetail", filterRowDetail);
              requestData.append(
                "rowDelDetailsIds",
                JSON.stringify(filterRowDetail)
              );
              editPurchaseChallan(requestData)
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
                    eventBus.dispatch(
                      "page_change",
                      "tranx_purchase_challan_list"
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
              <Form
                onSubmit={handleSubmit}
                noValidate
                style={{ overflowX: "hidden", overflowY: "hidden" }}
                autoComplete="off"
              >
                <>
                  <div className="purchase-style">
                    <Row
                      className="py-2 px-2 pb-0"
                      style={{ backgroundColor: "#CEE7F1" }}
                    >
                      <Col md="4" style={{ borderRight: "1px solid #e1e1e1" }}>
                        <Form.Group as={Row} className="mb-2">
                          <Form.Label column sm={3} className="lbl">
                            Branch
                          </Form.Label>
                          <Col sm={9}>
                            <Select
                              autoFocus
                              className="selectTo"
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              styles={purchaseSelect}
                              isClearable
                              options={purchaseAccLst}
                              isDisabled
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
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2">
                          <Form.Label column sm={3} className="lbl">
                            Transaction Date
                          </Form.Label>
                          <Col sm={6}>
                            <Form.Label>
                              {/* <img
                                src={calendar2date}
                                style={{ height: "20px" }}
                                className="my-auto"
                              /> */}
                              <Form.Control
                                className="tr_date_style"
                                name="pc_transaction_dt"
                                placeholderText="DD/MM/YYYY"
                                id="pc_transaction_dt"
                                value={moment(new Date()).format("DD/MM/YYYY")}
                              ></Form.Control>
                              {/* <MyDatePicker
                                name="pi_transaction_dt"
                                placeholderText="DD/MM/YYYY"
                                id="pi_transaction_dt"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                  setFieldValue("pi_transaction_dt", date);
                                }}
                                selected={values.pi_transaction_dt}
                                maxDate={new Date()}
                                style={{
                                  border: "none",
                                  backgroundColor: "transperant",
                                }}
                              /> */}
                              <span className="text-danger errormsg">
                                {errors.pc_transaction_dt}
                              </span>
                            </Form.Label>
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2">
                          <Form.Label column sm={3} className="lbl">
                            Challan Sr#
                          </Form.Label>

                          <Col sm={4}>
                            <Form.Control
                              type="text"
                              className="formhover"
                              placeholder="Challan sr No. "
                              name="pc_sr_no"
                              id="pc_sr_no"
                              onChange={handleChange}
                              value={values.pc_sr_no}
                              // value={initVal.count}
                              isValid={touched.pc_sr_no && !errors.pc_sr_no}
                              isInvalid={!!errors.pc_sr_no}
                              readOnly={true}
                            />
                            <span className="text-danger errormsg">
                              {errors.pc_sr_no}
                            </span>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md="4" style={{ borderRight: "1px solid #e1e1e1" }}>
                        <Form.Group as={Row} className="mb-2">
                          <Form.Label column sm={3} className="lbl">
                            Supplier Code
                          </Form.Label>
                          <Col sm={4}>
                            <Select
                              autoFocus
                              className="selectTo"
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              styles={purchaseSelect}
                              isClearable
                              options={supplierCodeLst}
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
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2">
                          <Form.Label column sm={3} className="lbl">
                            Supplier Name
                          </Form.Label>
                          <Col sm={8}>
                            <Select
                              autoFocus
                              className="selectTo"
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              style={{ zIndex: "2" }}
                              styles={purchaseSelect}
                              isClearable
                              options={supplierNameLst}
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
                            </span>{" "}
                          </Col>
                          <Col sm={1} className="p-0">
                            <img
                              src={add}
                              // style={{ marginTop: "2px" }}
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
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_purchase_challan_edit",
                                    to: "ledgercreate",
                                    prop_data: {
                                      from_page: "tranx_purchase_challan_edit",
                                      rows: rows,
                                      invoice_data: invoice_data,
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
                            ></img>
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2">
                          <Form.Label column sm={3} className="lbl">
                            Purchase A/C
                          </Form.Label>
                          <Col sm={9}>
                            <Select
                              autoFocus
                              className="selectTo"
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                              }}
                              styles={purchaseSelect}
                              isClearable
                              options={purchaseAccLst}
                              name="purchase_id"
                              onChange={(v) => {
                                setFieldValue("purchase_id", v);
                              }}
                              value={values.purchase_id}
                            />

                            <span className="text-danger errormsg">
                              {errors.purchase_id}
                            </span>
                          </Col>
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <Form.Group as={Row} className="mb-2">
                          <Form.Label column sm={3} className="lbl">
                            Challan Date
                          </Form.Label>
                          <Col
                            sm={4}
                            // className="d-flex"
                            className={`${
                              this.state.hideDp == true
                                ? "DPHideShow d-flex"
                                : "d-flex"
                            }`}
                          >
                            <MyDatePicker
                              // ref={this.dpRef}

                              innerRef={(input) => {
                                this.dpRef = input;
                              }}
                              name="pc_invoice_date"
                              placeholderText="DD/MM/YYYY"
                              id="pc_invoice_date"
                              dateFormat="dd/MM/yyyy"
                              onChange={(date) => {
                                console.log("onChange clicked");
                                setFieldValue("pc_invoice_date", date);
                              }}
                              selected={values.pc_invoice_date}
                              maxDate={new Date()}
                              className="date-style"
                              onFocus={() => {
                                console.log("click event");
                                this.setState({ hideDp: true });
                              }}
                            />
                            <Button
                              className="calendar"
                              onClick={(e) => {
                                // e.preventDefault();
                                console.log("btn clicked", this.dpRef);
                                // this.focusDp();
                                this.setState({ hideDp: false }, () => {
                                  this.dpRef.setOpen(true);
                                });
                              }}
                            >
                              <img
                                src={calendar2}
                                // style={{
                                //   height: "20px",
                                //   marginTop: "0px",
                                //   width: "20px",
                                // }}
                                className="calendarimg"
                              ></img>
                            </Button>

                            <span className="text-danger errormsg">
                              {errors.pi_invoice_dt}
                            </span>
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2">
                          <Form.Label column sm={3} className="lbl">
                            Challan No
                          </Form.Label>
                          <Col sm={4}>
                            <Form.Control
                              type="text"
                              placeholder="Invoice No."
                              name="pc_no"
                              id="pc_no"
                              className="formhover"
                              onChange={handleChange}
                              value={values.pc_no}
                              isValid={touched.pc_no && !errors.pc_no}
                              isInvalid={!!errors.pc_no}
                            />
                            <span className="text-danger errormsg">
                              {errors.pc_no}
                            </span>
                          </Col>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  <div className="my-cc-tbl-style-edit">
                    <Table>
                      <thead>
                        <tr>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              paddingLeft: "8px",
                              width: "10%",
                            }}
                          >
                            Product
                          </td>
                          {/* <td
                            style={{
                              backgroundColor: "#D6FCDC",
                            }}
                          ></td> */}

                          {/* <td
                            colSpan={28}
                            className="rwht"
                            style={{ padding: "0", width: "90%" }}
                          >
                            <tr> */}
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              padding: "0px",
                              width: "1.5%",
                            }}
                          ></td>

                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "2.5%",
                              padding: "0",
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "4%",
                            }}
                          >
                            Brand
                          </td>

                          {/* <td style={{ width: "87%", padding: "0" }}>
                            <tr> */}
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "1.5%",
                              padding: "0",
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "3%",
                              padding: "0",
                            }}
                          ></td>

                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "6.5%",
                              paddingLeft: "13px",
                            }}
                          >
                            Category
                          </td>
                          {/* <td style={{ width: "87%", padding: "0" }}>
                                <tr> */}
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "3%",
                              // paddingLeft: "0",
                            }}
                          >
                            SubCategory
                          </td>

                          {/* <td style={{ width: "90%", padding: "0" }}>
                                    <tr> */}
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "1.5%",
                              padding: "0",
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "2%",
                              padding: "0",
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "5%",
                            }}
                          >
                            Flavour
                          </td>

                          {/* <td
                                        style={{
                                          width: "85%",
                                          padding: "0",
                                        }}
                                      >
                                        <tr> */}
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "1.5%",
                              padding: "0",
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "2%",
                              padding: "0",
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "3%",
                              paddingLeft: "0",
                            }}
                          >
                            Package
                          </td>

                          {/* <td
                                            style={{
                                              width: "87%",
                                              padding: "0",
                                            }}
                                          >
                                            <tr> */}
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "1.5%",
                              padding: "0",
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "1.5%",
                              padding: "0",
                            }}
                          ></td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "4%",
                              paddingLeft: "0",
                            }}
                          >
                            Unit
                          </td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "5%",
                            }}
                          >
                            Batch
                          </td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "4%",
                            }}
                          >
                            Qty.
                          </td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "2%",
                              paddingLeft: "0",
                            }}
                          >
                            Rate
                          </td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "2.5%",
                              textAlign: "end",
                            }}
                          >
                            Disc%
                          </td>
                          <td
                            style={{
                              backgroundColor: "#D6FCDC",
                              width: "0%",
                            }}
                          >
                            Disc.Amt
                          </td>
                          <td
                            style={{
                              backgroundColor: "#C5EFC9",
                              textAlign: "start",
                              width: "5%",
                            }}
                          >
                            Base Amt
                          </td>
                          <td
                            style={{
                              backgroundColor: "#C5EFC9",
                              textAlign: "end",
                              width: "5%",
                            }}
                          >
                            Taxable Amt
                          </td>
                          <td
                            style={{
                              backgroundColor: "#C5EFC9",
                              textAlign: "start",
                              width: "3%",
                            }}
                          >
                            Tax(%)
                          </td>
                          <td
                            style={{
                              backgroundColor: "#C5EFC9",
                              paddingRight: "15px",
                              textAlign: "start",
                              width: "6%",
                            }}
                          >
                            Total Amt
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {rows &&
                          rows.length > 0 &&
                          rows.map((vi, ii) => {
                            return (
                              <>
                                <CMPTranxRow
                                  from_page="tranx_purchase_challan_edit"
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
                                />
                              </>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                  <Row className="mx-0">
                    <Col md={10}>
                      <Row
                        className="me-0 py-2"
                        style={{ background: "#DEE4EB" }}
                      >
                        <Col sm={9}>
                          <Row>
                            <Col md={2}>
                              <Form.Label className="text-label my-auto">
                                Disc Ledger:
                              </Form.Label>
                            </Col>
                            <Col md={3}>
                              <Select
                                autoFocus
                                className="selectTo"
                                components={{
                                  // DropdownIndicator: () => null,
                                  IndicatorSeparator: () => null,
                                }}
                                isClearable={true}
                                styles={purchaseSelect}
                                onChange={(v) => {
                                  setFieldValue("purchase_disc_ledger", v);
                                }}
                                options={lstDisLedger}
                                name="purchase_disc_ledger"
                                value={values.purchase_disc_ledger}
                              />
                            </Col>
                            <Col md={2} style={{ display: "flex" }}>
                              <Form.Label className="text-label my-auto me-2">
                                Disc:
                              </Form.Label>
                              <Form.Control
                                // style={{ width: "100px" }}
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

                            <Col md={2} style={{ display: "flex" }}>
                              <Form.Label className="text-label my-auto text-center me-2">
                                Disc Rs:
                              </Form.Label>
                              <Form.Control
                                // style={{ width: "100px" }}
                                type="text"
                                placeholder="Enter"
                                name="purchase_discount_amt"
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

                            <Col md={3} style={{ display: "flex" }}>
                              <Form.Label
                                className="text-label my-auto me-2"
                                style={{ width: "175px" }}
                              >
                                Add Charges:
                              </Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  // style={{ width: "131px" }}
                                  placeholder="0"
                                  className="text-box formhover box"
                                  id=""
                                  name="addch"
                                  value={additionalChargesTotal}
                                  readOnly
                                />
                                {/* <InputGroup.Text
                                  style={{
                                    fontSize: "11px",
                                    padding: "4px",
                                    color: "gray",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faIndianRupeeSign}
                                  ></FontAwesomeIcon>
                                </InputGroup.Text> */}
                                <a
                                  href="/"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ additionchargesyes: true });
                                  }}
                                >
                                  {/* <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    class="bi bi-plus-square-dotted svg-style mt-2 ms-2"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                  </svg>{" "} */}
                                  <img
                                    src={add}
                                    // style={{ marginTop: "2px" }}
                                    className="add-btn"
                                  ></img>
                                </a>
                              </InputGroup>
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
                                placeholder="Enter Narration"
                                style={{ height: "72px" }}
                                className="formhover"
                                id="narration"
                                name="narration"
                                onChange={handleChange}
                                // rows={5}
                                // cols={25}

                                value={values.narration}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col sm={3}>
                          <TGSTFooter
                            values={values}
                            taxcal={taxcal}
                            authenticationService={authenticationService}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={2} style={{ backgroundColor: "#F8F0D2" }}>
                      <Table
                        className="my-3 px-3 text-start smalltbfont"
                        style={{ borderBottom: "transparent" }}
                      >
                        <tbody>
                          <tr>
                            <td className="p-0">Base Amt</td>
                            <td className="p-0">{values.total_base_amt}</td>
                          </tr>
                          <tr>
                            <td className="p-0">Disc Amt</td>
                            <td className="p-0">
                              {values.purchase_discount > 0
                                ? isNaN(
                                    parseFloat(
                                      values.total_purchase_discount_amt
                                    ) + parseFloat(values.purchase_discount_amt)
                                  )
                                  ? 0
                                  : parseFloat(
                                      values.total_purchase_discount_amt
                                    ) + parseFloat(values.purchase_discount_amt)
                                : parseFloat(values.purchase_discount_amt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-0">Taxable Amt</td>
                            <td className="p-0">{values.total_taxable_amt}</td>
                          </tr>
                          <tr>
                            <td className="p-0">Round Off</td>
                            <td className="p-0">{values.roundoff}</td>
                          </tr>
                          <tr>
                            <td className="p-0">Tax Amt.</td>
                            <td className="p-0">{values.total_tax_amt}</td>
                          </tr>
                          <tr>
                            <td className="p-0">Final Amt.</td>
                            <td className="p-0">{values.totalamt}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row className="py-1">
                    <Col className="text-end">
                      <Button
                        className="ms-2 warning-style btstyle"
                        type="submit"
                        style={{
                          borderRadius: "15px",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                        }}
                      >
                        Save Latter
                      </Button>
                      <Button
                        className="successbtn-style ms-2 btstyle"
                        type="submit"
                        style={{
                          borderRadius: "15px",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                        }}
                      >
                        Save
                      </Button>

                      <Button
                        className="cancel-btn btstyle"
                        onClick={(e) => {
                          e.preventDefault();

                          eventBus.dispatch(
                            "page_change",
                            "tranx_purchase_challan_list"
                          );
                        }}
                        style={{
                          // background: "#ADADAD",
                          backgroundColor: "red",
                          borderRadius: "15px",
                          color: "#fff",
                          border: "1px solid red",
                          //paddingLeft: "20px",
                          //paddingRight: "20px",
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                  <Row className="footereditstyle">
                    <Col md="1" className="pd">
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

          <Modal
            show={invoiceedit}
            size="lg"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ invoiceedit: false })}
            aria-labelledby="contained-modal-title-vcenter"
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              className="pl-2 pr-2 pt-1 pb-1 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Purchase Challan Invoice
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal ">
              <div className="purchasescreen">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  // enableReinitialize={true}
                  initialValues={invoice_data}
                  validationSchema={Yup.object().shape({
                    pc_sr_no: Yup.string()
                      .trim()
                      .required("Purchase no is required"),
                    pc_no: Yup.string()
                      .trim()
                      .required("Purchase no is required"),
                    pc_transaction_dt: Yup.string().required(
                      "Transaction date is required"
                    ),
                    purchase_id: Yup.object().required(
                      "Select 1purchase account"
                    ),
                    invoice_no: Yup.string()
                      .trim()
                      .required("invoice no is required"),
                    // invoice_dt: Yup.string().required('invoice dt is required'),
                    invoice_dt: Yup.string().required(
                      "invoice_date is required"
                    ),
                    supplierCodeId: Yup.object().required(
                      "Select supplier code"
                    ),
                    supplierNameId: Yup.object().required(
                      "Select supplier name"
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
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md="2">
                          <Form.Group>
                            <Form.Label>
                              P. Challan. Sr. #.{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder=" "
                              name="pc_sr_no"
                              id="pc_sr_no"
                              onChange={handleChange}
                              value={values.pc_sr_no}
                              isValid={touched.pc_sr_no && !errors.pc_sr_no}
                              isInvalid={!!errors.pc_sr_no}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pc_sr_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Transaction Date{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              name="pc_transaction_dt"
                              id="pc_transaction_dt"
                              onChange={handleChange}
                              value={values.pc_transaction_dt}
                              isValid={
                                touched.pc_transaction_dt &&
                                !errors.pc_transaction_dt
                              }
                              isInvalid={!!errors.pc_transaction_dt}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pc_transaction_dt}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Invoice #.{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Invoice No."
                              name="pc_no"
                              id="pc_no"
                              onChange={handleChange}
                              value={values.pc_no}
                              isValid={touched.pc_no && !errors.pc_no}
                              isInvalid={!!errors.pc_no}
                              readOnly={true}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pc_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md="3">
                          <Form.Group>
                            <Form.Label>
                              Challan Date{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <MyDatePicker
                              name="pc_invoice_date"
                              placeholderText="dd/MM/yyyy"
                              id="pc_invoice_date"
                              dateFormat="dd/MM/yyyy"
                              onChange={(date) => {
                                setFieldValue("pc_invoice_date", date);
                              }}
                              selected={values.pc_invoice_date}
                              minDate={new Date()}
                              className="newdate"
                            />

                            <span className="text-danger errormsg">
                              {errors.pc_invoice_date}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col md="3">
                          <Form.Group className="">
                            <Form.Label>
                              Supplier Code{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>

                            <Select
                              className="selectTo"
                              styles={customStyles}
                              isClearable
                              options={supplierCodeLst}
                              borderRadius="0px"
                              colors="#729"
                              name="supplierCodeId"
                              onChange={(v) => {
                                setFieldValue("supplierCodeId", v);
                                setFieldValue(
                                  "supplierNameId",
                                  getSelectValue(supplierNameLst, v.value)
                                );
                              }}
                              value={values.supplierCodeId}
                            />

                            <span className="text-danger">
                              {errors.supplierCodeId}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="5">
                          <Form.Group className="">
                            <Form.Label>
                              Supplier Name{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Select
                              className="selectTo"
                              styles={customStyles}
                              isClearable
                              options={supplierNameLst}
                              borderRadius="0px"
                              colors="#729"
                              name="supplierNameId"
                              onChange={(v) => {
                                setFieldValue(
                                  "supplierCodeId",
                                  getSelectValue(supplierCodeLst, v.value)
                                );
                                setFieldValue("supplierNameId", v);
                              }}
                              value={values.supplierNameId}
                            />

                            <span className="text-danger">
                              {errors.supplierNameId}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md="4" className="btn_align mt-4">
                          <Button className="createbtn mt-2" type="submit">
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

          {/* create product start */}
          <Modal
            show={createproductmodal}
            //size="lg"
            dialogClassName="modal-90w"
            className="mt-5"
            onHide={() => this.setState({ createproductmodal: false })}
            // aria-labelledby="contained-modal-title-vcenter"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Create Product
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2">
              <div className="institute-head purchasescreen">
                <Form className=""></Form>
              </div>
            </Modal.Body>

            <Modal.Footer className="p-1">
              <Button className="createbtn seriailnobtn">Submit</Button>
            </Modal.Footer>
          </Modal>

          {/* serial no start */}
          <Modal
            show={serialnopopupwindow}
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
                  if (
                    isActionExist(
                      "ledger",
                      "create",
                      this.props.userPermissions
                    )
                  ) {
                    eventBus.dispatch(
                      "page_change",
                      "tranx_purchase_challan_list"
                    );
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
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Pending Order start */}
          <Modal
            show={pendingordermodal}
            //size="lg"
            dialogClassName="modal-90w"
            className="mt-5 mainmodal"
            onHide={() => this.setState({ pendingordermodal: false })}
            // aria-labelledby="contained-modal-title-vcenter"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header
              closeButton
              closeVariant="white"
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Pending Orders
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="pmt-select-ledger">
                <Table className="mb-2">
                  <tr>
                    {/* <th className="">
                    <Form.Group
                      controlId="formBasicCheckbox"
                      className="ml-1 mb-1 pmt-allbtn"
                    >
                      <Form.Check type="checkbox" />
                    </Form.Group>
                    <span className="pt-2 mt-2">Invoice #.</span>
                  </th> */}

                    <th className="">
                      <Form.Group
                        controlId="formBasicCheckbox"
                        className="pl-0"
                      >
                        <Form.Check
                          className="pmt-allbtn"
                          type="checkbox"
                          checked={isAllChecked === true ? true : false}
                          onChange={(e) => {
                            // e.preventDefault();
                            this.handlePendingOrderSelectionAll(
                              e.target.checked
                            );
                          }}
                          label="Order #."
                        />
                      </Form.Group>
                      {/* <span className="pt-2 mt-2">&nbsp;Order #.</span> */}
                    </th>
                    <th>Date</th>
                    <th style={{ textAlign: "right" }} className="pl-2">
                      Amt
                    </th>
                  </tr>
                  <tbody>
                    {purchasePendingOrderLst.map((v, i) => {
                      return (
                        <tr className="bgclass">
                          <td className="pt-1 p2-1 pl-1 pb-0">
                            <Form.Group
                              controlId="formBasicCheckbox"
                              className=""
                            >
                              <Form.Check
                                type="checkbox"
                                checked={selectedPendingOrder.includes(
                                  parseInt(v.id)
                                )}
                                onChange={(e) => {
                                  // e.preventDefault();
                                  this.handlePendingOrderSelection(
                                    v.id,
                                    e.target.checked
                                  );
                                }}
                                label={v.invoice_no}
                              />
                            </Form.Group>
                            {/* <span className="pt-2 mt-2"> {v.invoice_no}</span> */}
                          </td>
                          <td>{v.invoice_date}</td>

                          <td style={{ textAlign: "right" }} className="p-1">
                            {v.total_amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Modal.Body>

            <Modal.Footer className="p-1">
              <Button
                className="createbtn seriailnobtn"
                onClick={(e) => {
                  e.preventDefault();
                  // this.setBillEditData();
                }}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* pending order product  end*/}
          <Modal
            show={pendingorderprdctsmodalshow}
            size="lg"
            dialogClassName="modal-90w"
            className="mt-5"
            onHide={() => this.setState({ pendingorderprdctsmodalshow: false })}
            // aria-labelledby="contained-modal-title-vcenter"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header
              closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Convert to Challan
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
              <div className="pmt-select-ledger">
                {/* <h6>Shivshankar Pharmaceticul Distributers</h6> */}
                <Table className="mb-2">
                  <tr>
                    <th className="pt-1 p2-1 pl-1 pb-0">
                      {/* <Form.Group
                      controlId="formBasicCheckbox"
                      className="ml-1 mb-1 pmt-allbtn"
                    >
                      <Form.Check type="checkbox" />
                    </Form.Group>
                    <span className="pt-2 mt-2">Invoice #.</span> */}

                      <Form.Group
                        controlId="formBasicCheckbox"
                        className="pl-1"
                      >
                        <Form.Check type="checkbox" label="Invoice #." />
                        {/* <span className="pt-2 mt-2">Invoice #.</span> */}
                      </Form.Group>
                    </th>
                    <th>Pur Sr. No.</th>
                    <th>Transaction Dt</th>
                    <th>Invoice Dt</th>
                    <th>Products</th>
                    <th>Supplier Name</th>
                    {/* <th className="pl-2">Amt</th> */}
                    {/* <th>Status</th> */}
                  </tr>
                  <tbody>
                    <tr className="bgclass">
                      <td className="pt-1 p2-1 pl-1 pb-0">
                        <Form.Group controlId="formBasicCheckbox" className="">
                          <Form.Check type="checkbox" label="12345" />
                        </Form.Group>
                      </td>
                      <td>1</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">ABC product</td>
                      <td className="p-1">Kiran Enterprises</td>
                    </tr>
                    <tr className="bgclass">
                      <td className="pt-1 p2-1 pl-1 pb-0">
                        <Form.Group controlId="formBasicCheckbox" className="">
                          <Form.Check type="checkbox" label="12345" />
                        </Form.Group>
                      </td>
                      <td>1</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">ABC product</td>
                      <td className="p-1">Kiran Enterprises</td>
                    </tr>
                    <tr className="bgclass">
                      <td className="pt-1 p2-1 pl-1 pb-0">
                        <Form.Group controlId="formBasicCheckbox" className="">
                          <Form.Check type="checkbox" label="12345" />
                        </Form.Group>
                      </td>
                      <td>1</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">ABC product</td>
                      <td className="p-1">Kiran Enterprises</td>
                    </tr>
                    <tr className="bgclass">
                      <td className="pt-1 p2-1 pl-1 pb-0">
                        <Form.Group controlId="formBasicCheckbox" className="">
                          <Form.Check type="checkbox" label="12345" />
                        </Form.Group>
                      </td>
                      <td>1</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">ABC product</td>
                      <td className="p-1">Kiran Enterprises</td>
                    </tr>
                    <tr className="bgclass">
                      <td className="pt-1 p2-1 pl-1 pb-0">
                        <Form.Group controlId="formBasicCheckbox" className="">
                          <Form.Check type="checkbox" label="12345" />
                        </Form.Group>
                      </td>
                      <td>1</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">ABC product</td>
                      <td className="p-1">Kiran Enterprises</td>
                    </tr>
                    <tr className="bgclass">
                      <td className="pt-1 p2-1 pl-1 pb-0">
                        <Form.Group controlId="formBasicCheckbox" className="">
                          <Form.Check type="checkbox" label="12345" />
                        </Form.Group>
                      </td>
                      <td>1</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">03-03-2021</td>
                      <td className="p-1">ABC product</td>
                      <td className="p-1">Kiran Enterprises</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Modal.Body>

            <Modal.Footer className="p-1">
              <Button className="createbtn seriailnobtn">
                Convert To Challan
              </Button>
            </Modal.Footer>
          </Modal>

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
                                eventBus.dispatch("page_change", {
                                  from: "tranx_purchase_challan_edit",
                                  to: "ledgercreate",
                                  prop_data: {
                                    from_page: "tranx_purchase_challan_edit",
                                    rows: rows,
                                    invoice_data: invoice_data,
                                    mdl_additionalcharges: true,
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
              validationSchema={Yup.object().shape({})}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // ;
                let {
                  rows,
                  rowIndex,
                  brandIndex,
                  categoryIndex,
                  subcategoryIndex,
                  flavourIndex,
                  packageIndex,
                  unitIndex,
                  // b_details_id,
                  // is_expired,
                } = this.state;

                if (is_expired != true) {
                  if (b_details_id != 0) {
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["rate"] = b_details_id.purchase_rate;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["b_details_id"] = b_details_id.id;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["b_no"] = b_details_id.batch_no;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["b_rate"] = values.b_rate;

                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["b_purchase_rate"] = values.b_purchase_rate;
                    // rows[rowIndex]["brandDetails"][brandIndex][
                    //   "categoryDetails"
                    // ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                    //   "flavourDetails"
                    // ][flavourIndex]["packageDetails"][packageIndex][
                    //   "unitDetails"
                    // ][unitIndex]["b_expiry"] = values.b_expiry;

                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["is_batch"] = isBatch;
                  } else {
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["rate"] = values.b_purchase_rate;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["b_no"] = values.b_no;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["b_rate"] = values.b_rate;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["rate_a"] = values.rate_a;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["rate_b"] = values.rate_b;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["rate_c"] = values.rate_c;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["max_discount"] = values.max_discount;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["min_discount"] = values.min_discount;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["min_margin"] = values.min_margin;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["b_purchase_rate"] = values.b_purchase_rate;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["b_expiry"] = values.b_expiry;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["manufacturing_date"] =
                      values.manufacturing_date;
                    rows[rowIndex]["brandDetails"][brandIndex][
                      "categoryDetails"
                    ][categoryIndex]["subcategoryDetails"][subcategoryIndex][
                      "flavourDetails"
                    ][flavourIndex]["packageDetails"][packageIndex][
                      "unitDetails"
                    ][unitIndex]["is_batch"] = isBatch;
                  }
                  this.setState(
                    {
                      batchModalShow: false,
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
                } else {
                  MyNotifications.fire({
                    show: true,
                    icon: "error",
                    title: "Error",
                    msg: "Batch Expired",
                    is_button_show: true,
                  });
                }
                this.setState(
                  {
                    batchModalShow: false,
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
                                Expiry Date
                              </Form.Label>

                              <Col
                                sm={6}
                                className={`${
                                  this.state.hideBatchDp == true
                                    ? "DPHideShow d-flex"
                                    : "d-flex"
                                }`}
                              >
                                <MyDatePicker
                                  innerRef={(input) => {
                                    this.batchdpRef = input;
                                  }}
                                  name="b_expiry"
                                  placeholderText="DD/MM/YYYY"
                                  id="b_expiry"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue("b_expiry", date);
                                  }}
                                  selected={values.b_expiry}
                                  minDate={new Date()}
                                  className="date-style"
                                  onFocus={() => {
                                    this.setState({ hideBatchDp: true });
                                  }}
                                />
                                <Button
                                  className="calendar"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // this.focusDp();
                                    this.setState(
                                      { hideBatchDp: false },
                                      () => {
                                        this.batchdpRef.setOpen(true);
                                      }
                                    );
                                  }}
                                >
                                  <img
                                    src={calendar2}
                                    className="calendarimg"
                                  ></img>
                                </Button>
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

                              <Col
                                sm={6}
                                className={`${
                                  this.state.hideManufDp == true
                                    ? "DPHideShow d-flex"
                                    : "d-flex"
                                }`}
                              >
                                <MyDatePicker
                                  innerRef={(input) => {
                                    this.manufdpRef = input;
                                  }}
                                  name="manufacturing_date"
                                  placeholderText="DD/MM/YYYY"
                                  id="manufacturing_date"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue("manufacturing_date", date);
                                  }}
                                  selected={values.manufacturing_date}
                                  maxDate={new Date()}
                                  className="date-style"
                                  onFocus={() => {
                                    this.setState({ hideManufDp: true });
                                  }}
                                />
                                <Button
                                  className="calendar"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // this.focusDp();
                                    this.setState(
                                      { hideManufDp: false },
                                      () => {
                                        this.manufdpRef.setOpen(true);
                                      }
                                    );
                                  }}
                                >
                                  <img
                                    src={calendar2}
                                    className="calendarimg"
                                  ></img>
                                </Button>
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
                        </Row>
                        <Row>
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
                            {/* <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Sales Rate
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="b_sale_rate"
                                  id="b_sale_rate"
                                  onChange={handleChange}
                                  value={values.b_sale_rate}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group> */}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Rate A
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_a"
                                  id="rate_a"
                                  onChange={handleChange}
                                  value={values.rate_a}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Rate B
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_b"
                                  id="rate_b"
                                  onChange={handleChange}
                                  value={values.rate_b}
                                  //value={initVal.count}
                                  // isValid={touched.pi_sr_no && !errors.pi_sr_no}
                                  // isInvalid={!!errors.pi_sr_no}
                                  // readOnly={true}
                                />
                              </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Rate C
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="rate_c"
                                  id="rate_c"
                                  onChange={handleChange}
                                  value={values.rate_c}
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
                                Max Discount
                              </Form.Label>

                              <Col sm={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter "
                                  name="max_discount"
                                  id="max_discount"
                                  onChange={handleChange}
                                  value={values.max_discount}
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
                                Min Discount
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
                          <Col
                            lg={4}
                            style={{ borderRight: "1px solid #c7c7cd" }}
                          >
                            {" "}
                            <Form.Group as={Row} className="mb-2">
                              <Form.Label column sm={4} className="lbl">
                                Min Margin
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
                                <th>Product Name</th>
                                <th>Rate A</th>
                                <th>Rate B</th>
                                <th>Rate C</th>
                                <th>Purchase Rate</th>
                                <th>Max Discount</th>
                                <th>Min Discount</th>
                                <th>Min Margin</th>
                                <th>MRP</th>
                                <th>Expiry Date</th>
                                <th>Manufacturing Date</th>
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
                                    <td>{v.product_name}</td>
                                    <td>{v.min_rate_a}</td>
                                    <td>{v.min_rate_b}</td>
                                    <td>{v.min_rate_c}</td>
                                    <td>{v.purchase_rate}</td>
                                    <td>{v.max_discount}</td>
                                    <td>{v.min_discount}</td>
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
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </>
                      )}
                    </div>
                  </Modal.Body>
                  <div className="text-end p-2">
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

                    <Button
                      variant="secondary"
                      className="cancel-btn"
                      onClick={() => this.handlebatchModalShow(false)}
                      style={{
                        // background: "#ADADAD",
                        backgroundColor: "#f86464",
                        borderRadius: "15px",
                        color: "#fff",
                        border: "1px solid #f86464",
                        //paddingLeft: "20px",
                        //paddingRight: "20px",
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
        </div>
      </>
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
)(TranxPurchaseChallanEdit);
