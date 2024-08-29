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
} from "@/helpers";

import {
  transaction_product_list,
  transaction_product_details,
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
              productLst: res.list,
            },
            () => {
              let { productModalStateChange } = this.props;
              productModalStateChange({ productLst: res.list });
            }
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  transaction_product_detailsFun = (product_id = 0) => {
    let requestData = new FormData();
    requestData.append("product_id", product_id);
    transaction_product_details(requestData)
      .then((response) => {
        let res = response.data;
        console.log("res--product", res);
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
    if (AuthenticationCheck()) {
      this.transaction_product_listFun();
      if (this.props.isRowProductSet) {
        console.log("isRowProductSet", this.props.isRowProductSet);
        this.setRowProductData();
      }
    }
  }

  componentWillReceiveProps(prev, next) {
    // console.log("prev => ", prev, "next => ", next);
    // console.log("this.props", this.props);
    let { isRowProductSet } = this.props;
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

  setRowProductData = () => {
    let {
      rows,
      productModalStateChange,
      transactionType,
      get_supplierlist_by_productidFun,
    } = this.props;
    let { productLst } = this.state;
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

        let unit_id = {
          gst: selectedProduct.igst,
          igst: selectedProduct.igst,
          cgst: selectedProduct.cgst,
          sgst: selectedProduct.sgst,
        };

        v["unit_id"] = unit_id;
        this.transaction_product_detailsFun(v.product_id);
        get_supplierlist_by_productidFun(v.product_id);
      }

      return v;
    });

    productModalStateChange(
      { isRowProductSet: false, rows: rows, add_button_flag: true },
      true
    );
  };

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
                productModalStateChange({
                  selectProductModal: false,
                  selectedProduct: "",
                  rowIndex: -1,
                });
                this.setState({
                  productData: "",
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
                    autoFocus="true"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    className="mdl-text-box"
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
                  <InputGroup.Text className="int-grp" id="basic-addon1">
                    {/* <img className="scanner_icon" src={Scanner} alt="" /> */}
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col lg={2}>
                <Button
                  className="successbtn-style"
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
                >
                  + Add
                </Button>
              </Col>
            </Row>
            <div className="tnx-pur-inv-ModalStyle">
              <Table hover className="text-start">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Packing</th>
                    <th>Barcode</th>
                    <th>MRP</th>
                    <th>Current Stock</th>
                    <th>Sale Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productLst.map((pv, pi) => {
                    return (
                      <tr
                        className={`${
                          JSON.stringify(pv) == JSON.stringify(selectedProduct)
                            ? "selected-tr"
                            : ""
                        }`}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          // console.log("selectedProduct", selectedProduct);
                          if (selectedProduct != "") {
                            rows[rowIndex]["selectedProduct"] = selectedProduct;
                            rows[rowIndex]["productName"] =
                              selectedProduct.product_name;
                            if (transactionType == "sales_invoice") {
                              rows[rowIndex]["rate"] =
                                selectedProduct.sales_rate;
                            } else {
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

                            productModalStateChange({
                              rows: rows,
                              selectProductModal: false,
                              levelOpt: [],
                            });
                            getProductPackageLst(selectedProduct.id, rowIndex);
                          }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          productModalStateChange({
                            selectedProduct: pv,
                            add_button_flag: true,
                          });
                          this.transaction_product_detailsFun(pv.id);
                          get_supplierlist_by_productidFun(pv.id);
                        }}
                      >
                        <td className="ps-3">{pv.code}</td>
                        <td className="ps-3">{pv.product_name}</td>
                        <td className="ps-3">{pv.packing}</td>
                        <td className="ps-3">{pv.barcode}</td>
                        <td className="ps-3">{pv.mrp}</td>
                        <td className="ps-3">{pv.current_stock}</td>
                        <td className="ps-3">{pv.sales_rate}</td>
                        <td>
                          <img
                            src={TableEdit}
                            alt=""
                            className="mdl-icons"
                            onClick={(e) => {
                              e.preventDefault();
                              // if (
                              //   isActionExist(
                              //     "product",
                              //     "edit",
                              //     this.props.userPermissions
                              //   )
                              // ) {
                              //   let source = {
                              //     rows: rows,

                              //     invoice_data:
                              //       this.myRef != null && this.myRef.current
                              //         ? this.myRef.current.values
                              //         : "",
                              //     from_page: "tranx_purchase_invoice_create",
                              //   };
                              //   let data = {
                              //     source: source,
                              //     id: pv.id,
                              //   };
                              //   //console.log({ data });
                              //   eventBus.dispatch("page_change", {
                              //     from: "tranx_purchase_invoice_create",
                              //     to: "productedit",
                              //     prop_data: data,
                              //     isNewTab: false,
                              //   });
                              // } else {
                              //   MyNotifications.fire({
                              //     show: true,
                              //     icon: "error",
                              //     title: "Error",
                              //     msg: "Permission is denied!",
                              //     is_button_show: true,
                              //   });
                              // }
                            }}
                          />
                          <img
                            src={TableDelete}
                            alt=""
                            className="mdl-icons"
                            onClick={(e) => {
                              //   MyNotifications.fire(
                              //     {
                              //       show: true,
                              //       icon: "confirm",
                              //       title: "Confirm",
                              //       msg: "Do you want to Delete",
                              //       is_button_show: false,
                              //       is_timeout: false,
                              //       delay: 0,
                              //       handleSuccessFn: () => {
                              //         this.deleteproduct(pv.id);
                              //       },
                              //       handleFailFn: () => {},
                              //     },
                              //     () => {
                              //       console.warn("return_data");
                              //     }
                              //   );
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
                          <td>Brand:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.brand : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Group:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.group : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Category:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.category : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Supplier:</td>
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
                          <td>HSN:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.hsn : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Tax Type:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.tax_type : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Tax%:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.tax_per : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Margin%:</td>
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
                          <td>Cost:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.cost : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Shelf ID:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.shelf_id : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Min Stock:</td>
                          <td>
                            <p className="colored_sub_text mb-0">
                              {productData != "" ? productData.min_stock : ""}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>Max Stock:</td>
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
