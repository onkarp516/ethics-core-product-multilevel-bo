import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
} from "react-bootstrap";

import {
  AuthenticationCheck,
  getUserControlData,
  isActionExist,
  eventBus,
  MyNotifications,
  INRformat,
} from "@/helpers";

import {
  transaction_product_list,
  transaction_product_details,
  delete_Product_list,
} from "@/services/api_functions";

import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import Scanner from "@/assets/images/scanner.png";

export default class MdlProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productLst: [],

      productData: "",
      apiCal: false,
    };
  }

  transaction_product_listFun = (search = "", barcode = "") => {
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
            },
            () => {
              let { productModalStateChange } = this.props;
              productModalStateChange({ productLst: res.list });
              setTimeout(() => {
                // console.warn(
                //   "this.props.selectedProduct->>>>>>>>>>",
                //   this.props.selectedProduct
                // );
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
  // handleSearch = (vi) => {
  //     let { productLst } = this.state;
  //     console.log({ productLst });
  //     let orgData_F = productLst.filter(
  //       (v) =>
  //       (v.code != null && v.code.toLowerCase().includes(vi.toLowerCase())) ||
  //       (  v.product_name != null && v.product_name.toLowerCase().includes(vi.toLowerCase())  ) ||
  //       ( v.mrp != ""  &&  v.mrp.toString().includes(vi) ) ||
  //       (  v.packing != null && v.packing.toLowerCase().includes(vi.toLowerCase())) ||
  //       (  v.current_stock != null &&  v.current_stock.toString().includes(vi)) ||
  //       (  v.sales_rate  != null && v.sales_rate.toString().includes(vi))

  //     );
  //     if (vi.length == 0) {
  //       this.setState({
  //         prdList : productLst,
  //       });
  //     } else {
  //       this.setState({
  //         prdList : orgData_F.length > 0 ? orgData_F : [],
  //       });
  //     }
  //   };

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
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  componentDidMount() {
    // console.log("MLDPRODUCT cmp mount", this.props);
    if (AuthenticationCheck()) {
      let { isRowProductSet, setProductRowIndex, setProductId, productId } =
        this.props;
      this.transaction_product_listFun();
      if (this.props.isRowProductSet) {
        console.log("isRowProductSet", this.props.isRowProductSet);
        this.setRowProductData();
      }

      if (productId != "" && setProductId == true && setProductRowIndex != -1) {
        this.setProductIdFun(productId, setProductRowIndex);
      }
    }
  }

  componentWillReceiveProps(prev, next) {
    let { apiCal } = this.state;
    // console.log("prev => ", prev, "next => ", next);
    // console.log("this.props", this.props);
    let { isRowProductSet, setProductRowIndex, setProductId, productId } =
      this.props;
    //  console.log("MLDPRODUCT willreceive props this.props", this.props);
    let { selectProductModal, rowIndex, productData, selectedProduct } = prev;
    if (isRowProductSet) {
      this.setRowProductData();
    }

    if (
      selectProductModal == true &&
      rowIndex != -1 &&
      productData == "" &&
      selectedProduct == ""
    ) {
      this.setSelectedProduct(rowIndex);
    }

    if (selectProductModal == true) {
      this.setState({ apiCal: true }, () => {
        if (apiCal == false) {
          this.transaction_product_listFun();
        }
      });
    }

    if (productId != "" && setProductId == true && setProductRowIndex != -1) {
      this.setProductIdFun(productId, setProductRowIndex);
    }
  }

  setProductIdFun = (productId, setProductRowIndex) => {
    let { rows, productModalStateChange, saleRateType, getProductPackageLst } =
      this.props;
    let { productLst } = this.state;
    // console.log("MDLPRODUCT productLst=->", productLst);
    let selectedProduct;
    if (productLst.length > 0) {
      let p_id = productId;
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

  setRowProductData = () => {
    let {
      rows,
      productModalStateChange,
      transactionType,
      get_supplierlist_by_productidFun,
    } = this.props;
    console.log("this.props", this.props);
    let { productLst } = this.state;
    if (productLst.length > 0) {
      rows = rows.map((v, i) => {
        let selectedProduct = productLst.find(
          (vi) => parseInt(vi.id) === parseInt(v.product_id)
        );
        console.log("selectedProduct edit", selectedProduct);
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
    }
  };

  deleteproduct = (id) => {
    // debugger;
    let formData = new FormData();
    formData.append("id", id);
    delete_Product_list(formData)
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
          // this.initRow();
          this.componentDidMount();
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };

  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let {
      productModalStateChange,
      get_supplierlist_by_productidFun,
      rows,
      rowIndex,
      getProductPackageLst,
      transactionType,
      saleRateType,
    } = this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));

        // console.warn('da->>>>>>>>>>>>>>>>>>down', val.id)

        productModalStateChange({
          selectedProduct: val,
          add_button_flag: true,
        });
        this.transaction_product_detailsFun(val.id);
        //    get_supplierlist_by_productidFun(val.id);
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', da)

        productModalStateChange({
          selectedProduct: val,
          add_button_flag: true,
        });
        this.transaction_product_detailsFun(val.id);
        // get_supplierlist_by_productidFun(val.id);
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedProduct = JSON.parse(cuurentProduct.getAttribute("value"));
        // document.getElementById("ProductMdlTr_0").focus();

        // console.warn('k->>>>>>>>>>>>>>', k)
        rows[rowIndex]["selectedProduct"] = selectedProduct;
        rows[rowIndex]["productName"] = selectedProduct.product_name;
        if (transactionType == "sales_invoice") {
          rows[rowIndex]["rate"] = selectedProduct.sales_rate;
        } else {
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

        rows[rowIndex]["unit_id"] = unit_id;
        rows[rowIndex]["packing"] = selectedProduct.packing;

        // console.warn('rows->>>>>>>>>>>>>>>>>', rows)
        productModalStateChange({
          rows: rows,
          selectProductModal: false,
          levelOpt: [],
        });
        getProductPackageLst(selectedProduct.id, rowIndex);
      }
      // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
    }
  }

  render() {
    let { productLst, productData } = this.state;
    let {
      getProductPackageLst,
      productModalStateChange,
      rows,
      rowIndex,
      selectProductModal,
      selectedProduct,
      get_supplierlist_by_productidFun,
      transactionType,
      from_source,
      invoice_data,
      saleRateType,
    } = this.props;

    return (
      <div>
        <Modal
          show={selectProductModal}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="tnx-pur-inv-mdl-product"
          centered
          onHide={(e) => {
            productModalStateChange({
              selectProductModal: false,
              selectedProduct: "",
              rowIndex: -1,
            });
            this.setState({
              productData: "",
            });
          }}
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Select Product
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                // this.transaction_product_listFun();
                productModalStateChange({
                  selectProductModal: false,
                  selectedProduct: "",
                  rowIndex: -1,
                });
                this.setState({
                  productData: "",
                  apiCal: false,
                });

                // this.SelectProductModalFun(false);
              }}
            />
          </Modal.Header>
          <Modal.Body className="tnx-pur-inv-mdl-body p-0">
            <Row className="p-3">
              <Col lg={6}>
                <InputGroup className="mb-3 mdl-text">
                  <Form.Control
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    className="mdl-text-box"
                    autoFocus="true"
                    onChange={(e) => {
                      this.transaction_product_listFun(e.target.value);
                    }}
                  />
                  <InputGroup.Text className="int-grp" id="basic-addon1">
                    <img className="srch_box" src={search} alt="" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col lg={1} className="">
                <Form.Label>Barcode</Form.Label>
              </Col>
              <Col lg={3}>
                <InputGroup className="mdl-text">
                  <Form.Control
                    type="text"
                    placeholder="Enter"
                    name="gst_per"
                    id="gst_per"
                    className="mdl-text-box"
                    onChange={(e) => {
                      this.transaction_product_listFun("", e.target.value);
                    }}
                  />
                </InputGroup>
              </Col>

              <Col lg={2}>
                <Button
                  className="successbtn-style"
                  onClick={(e) => {
                    e.preventDefault();
                    // console.log("rowIndex", rowIndex);
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
                      };
                      eventBus.dispatch("page_change", {
                        from: from_source,
                        to: "newproductcreate",
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
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
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
                        };
                        eventBus.dispatch("page_change", {
                          from: from_source,
                          to: "newproductcreate",
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
                    }
                  }}
                >
                  + Add
                </Button>
              </Col>
            </Row>
            {/* {JSON.stringify(this.props.selectedProduct, undefined, 2)} */}
            <div className="tnx-pur-inv-ModalStyle">
              <Table className="text-start">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Packing</th>
                    <th>Barcode</th>
                    <th>Brand</th>
                    <th>MRP</th>
                    <th>Current Stock</th>
                    <th>Unit</th>
                    <th>Sale Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody
                  className="prouctTableTr"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {productLst.map((pv, pi) => {
                    return (
                      <tr
                        value={JSON.stringify(pv)}
                        id={`productTr_` + pi}
                        prId={pv.id}
                        tabIndex={pi}
                        className={`${JSON.stringify(pv) == JSON.stringify(selectedProduct)
                          ? "selected-tr"
                          : ""
                          }`}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          console.log("selectedProduct", selectedProduct);
                          if (selectedProduct != "") {
                            rows[rowIndex]["selectedProduct"] = selectedProduct;
                            rows[rowIndex]["productName"] =
                              selectedProduct.product_name;
                            if (saleRateType == "sale") {
                              rows[rowIndex]["rate"] =
                                selectedProduct.sales_rate;
                            } else {
                              if (transactionType == "purchase_order") {
                                rows[rowIndex]["rate"] =
                                  selectedProduct.purchaserate;
                              }
                              if (selectedProduct.is_batch == false) {
                                rows[rowIndex]["rate"] =
                                  selectedProduct.purchaserate;
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
                            rows[rowIndex]["packing"] = selectedProduct.packing;

                            productModalStateChange({
                              rows: rows,
                              selectProductModal: false,
                              levelOpt: [],
                            });
                            getProductPackageLst(selectedProduct.id, rowIndex);
                            this.transaction_product_listFun();
                          }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          productModalStateChange({
                            selectedProduct: pv,
                            add_button_flag: true,
                          });
                          this.transaction_product_detailsFun(pv.id);
                          // get_supplierlist_by_productidFun(pv.id);
                        }}
                      >
                        <td className="ps-3">{pv.code}</td>
                        <td className="ps-3">{pv.product_name}</td>
                        <td className="ps-3">{pv.packing}</td>
                        <td className="ps-3">{pv.barcode}</td>
                        <td></td>
                        <td className="ps-3 text-end">
                          {/* {pv.mrp} */}
                          {isNaN(pv.mrp)
                            ? INRformat.format(0)
                            : INRformat.format(pv.mrp)}
                        </td>
                        <td className="ps-3 text-end">
                          {pv.current_stock}
                          {/* {isNaN(pv.current_stock)
                            ? INRformat.format(0)
                            : INRformat.format(pv.current_stock)} */}
                        </td>
                        <td>{pv.unit}</td>
                        <td className="ps-3 text-end">
                          {/* {pv.sales_rate} */}
                          {isNaN(pv.sales_rate)
                            ? INRformat.format(0)
                            : INRformat.format(pv.sales_rate)}
                        </td>
                        <td>
                          <img
                            src={TableEdit}
                            alt=""
                            className="mdl-icons"
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
                                  invoice_data: invoice_data,
                                  from_page: from_source,
                                  rowIndex: rowIndex,
                                };
                                let data = {
                                  source: source,
                                  id: pv.id,
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
                          <img
                            src={TableDelete}
                            alt=""
                            className="mdl-icons"
                            onClick={(e) => {
                              e.preventDefault();
                              MyNotifications.fire(
                                {
                                  show: true,
                                  icon: "confirm",
                                  title: "Confirm",
                                  msg: "Do you want to Delete",
                                  is_button_show: false,
                                  is_timeout: false,
                                  delay: 0,
                                  handleSuccessFn: () => {
                                    this.deleteproduct(pv.id);
                                  },
                                  handleFailFn: () => { },
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div>
              <div className="ledger_details_style pb-2">
                <Row className="mx-1">
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td style={{ width: "30%" }}>Brand:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.brand : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Group:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.group : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Category:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.category : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Supplier:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.supplier : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td style={{ width: "30%" }}>HSN:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.hsn : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Tax Type:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.tax_type : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Tax%:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.tax_per : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Margin%:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.margin_per : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                    <Table className="colored_label mb-0">
                      <tbody style={{ borderBottom: "0px transparent" }}>
                        <tr>
                          <td style={{ width: "30%" }}>Cost:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.cost : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Shelf ID:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.shelf_id : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Min Stock:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.min_stock : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: "30%" }}>Max Stock:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.max_stock : ""}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
