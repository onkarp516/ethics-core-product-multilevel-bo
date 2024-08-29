import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  Modal,
  CloseButton,
} from "react-bootstrap";
import { Formik } from "formik";
import moment from "moment";
import * as Yup from "yup";
import ReactToPrint from "react-to-print";
import * as Barcode from "react-barcode";

import Select from "react-select";
import {
  customStyles,
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  createPro,
} from "@/helpers";
import {
  createBarcode,
  getGroups,
  get_associate_group,
  getProduct,
  getProductPackageList,
  getBarcode,
  getPurchaseInvoiceList,
  getBrandCategoryLevelOpt,
} from "@/services/api_functions";
import qr_code from "@/assets/images/qr_code.svg";
import scan_existing from "@/assets/images/scan_existing.svg";
import barcode_reader from "@/assets/images/barcode_reader.svg";
import create_new from "@/assets/images/create_new.svg";
import print_icon from "@/assets/images/print_icon.svg";
export default class BarcodeCreate extends React.Component {
  constructor(props) {
    // this.myRef = React.createRef();
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      hide: false,
      opendiv: false,
      scaningdiv: false,
      showDiv: true,
      productLst: [],
      packageLst: [],
      lstPackages: [],
      purchaseInvoiceLst: [],
      barcodeLst: "",
      unitLst: [],
      groupLst: [],

      initValue: {
        associates_id: "",
        associates_group_name: "",
        productId: "",
        unitId: "",
        qtny: "",
        baseamt: "",
        code: "",
        packageId: "",
      },
      undervalue: [],
      associategroupslst: [],
    };
    this.open = this.open.bind(this);
  }

  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
  }
  lstGroups = (id = "") => {
    getGroups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.groupName };
            });
            this.setState({ groupLst: Opt }, () => {
              if (id != "") {
                // console.log("id---", id);

                let groupId = getSelectValue(this.state.groupLst, parseInt(id));
                this.myRef.current.setFieldValue("groupId", groupId);
              }
            });
          }
        }
      })
      .catch((error) => {});
  };

  handleBrandOpt = (groupId) => {
    let reqData = new FormData();
    reqData.append("group_id", groupId.value);
    getBrandCategoryLevelOpt(reqData)
      .then((response) => {
        let data = response.data;
        if (data.responseStatus == 200) {
          let opt = data.responseObject.map((v) => {
            let categoryOpt =
              v.category && v.category.length > 0
                ? v.category.map((vi) => {
                    let subCategoryOpt =
                      vi.subcategory && vi.subcategory.length > 0
                        ? vi.subcategory.map((vii) => {
                            return {
                              label: vii.subcategory_name,
                              value: vii.subcategory_id,
                            };
                          })
                        : [];
                    return {
                      label: vi.category_name,
                      value: vi.category_id,
                      subCategoryOpt: subCategoryOpt,
                    };
                  })
                : [];
            return {
              label: v.brand_name,
              value: v.brand_id,
              categoryOpt: categoryOpt,
            };
          });

          this.setState({ lstBrandOpt: opt });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  getProductPackageLst = (product_id) => {
    let reqData = new FormData();
    reqData.append("product_id", product_id);
    getProductPackageList(reqData)
      .then((response) => {
        let responseData = response.data;
        if (responseData.responseStatus == 200) {
          let data = responseData.responseObject.lst_packages;
          let opt = data.map((v) => {
            let unitOpt =
              v.units &&
              v.units.map((vi) => {
                return { label: vi.unit_name, value: vi.units_id };
              });
            console.log("unitOpt in package", unitOpt);
            return {
              label: v.pack_name != "" ? v.pack_name : "",
              value: v.id != "" ? v.id : [],
            };
          });
          console.log("opt in package", opt);
          this.setState({ lstPackages: opt }, () => {
            if (opt.length > 0) {
              this.setState({});
            }
          });
          // this.setState({ unitLst: unitOpt });
        } else {
          this.setState({ lstPackages: [] });
        }
      })
      .catch((error) => {
        this.setState({ lstPackages: [] });
        console.log("error", error);
      });
  };

  lstPurchaseInvoice = () => {
    getPurchaseInvoiceList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ purchaseInvoiceLst: res.data, show: true });
          console.log("res.data", res.data);
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  // handleSubmitSCList = (value) => {
  //   this.setState({ initVal: value });

  //   let reqData = new FormData();
  //   reqData.append("sundry_creditor_id", value.supplierCodeId.value);

  //   getTranxDebitNoteListInvoiceBillSC(reqData)
  //     .then((response) => {
  //       // console.log('before response', response);
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         // console.log('response', response);
  //         let lst = res.data;
  //         this.setState({
  //           invoiceLstSC: lst,
  //           selected_values: value,
  //           show: true,
  //         });
  //       }
  //     })
  //     .catch((error) => {});
  // };

  getBarcodeLst = (product_id) => {
    let reqData = new FormData();
    reqData.append("product_id", product_id);
    getBarcode(reqData).then((response) => {
      let res = response.data;
      console.log("res", res);

      if (res.responseStatus == 200) {
        let data = res.data;
        if (data != null) {
          this.setState({ barcodeLst: data.barcode });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "No Barcode for this product",
          });
        }
        console.log("data", data.barcode);
        console.log("datalength", data.length);
      } else {
        this.setState({ barcodeLst: [] });
      }
    });
    // .catch((error) => {
    //   this.setState({ barcodeLst: [] });
    //   console.log("error", error);
    // });
  };

  lstProduct = () => {
    getProduct()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          let data = res.responseObject;
          console.log("data", data);
          let unitRowData = [];
          let packageRowData = [];
          let opt = data.map((v) => {
            console.log("v.units  ", v.units);
            console.log("v.units.units  ", v.units[0]["units"]);
            let unitOpt =
              v.units &&
              v.units[0]["units"].map((vi) => {
                return { label: vi.unit_name, value: vi.units_id, ...vi };
              });
            // console.log("unitopt", unitOpt);
            // let packageOpt =
            //   v.units &&
            //   v.units.map((vi) => {
            //     if (vi.pack_name != "" && vi.id != 0) {
            //       return { label: vi.pack_name, value: vi.id };
            //     }
            //   });
            // console.log({ packageOpt });

            console.log("unitopt123", unitOpt);
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
              unitOpt: unitOpt != null ? unitOpt : [],
              // packageOpt: packageOpt != null ? packageOpt : [],
            };

            // this.setState({ unitLst: unitOpt });
          });
          console.log("opt", opt);
          this.setState({ productLst: opt });
          // this.setState({ unitLst: unitRowData });
        }
      })
      .catch((error) => {});
  };

  handleRowClick = ({ rowIndex }) => {
    const { id } = this.tableManager.current;

    document
      .querySelectorAll(`#${id} .rgt-row-focus`)
      .forEach((cell) => cell.classList.remove("rgt-row-focus"));

    document
      .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
      .forEach((cell) => cell.classList.add("rgt-row-focus"));
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  setInitValue = () => {
    let initValue = {
      associates_id: "",

      associates_group_name: "",
      productId: "",
      unitId: "",
      qtny: "",
      baseamt: "",
      code: "",
    };

    this.setState({ initValue: initValue, opendiv: false });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setInitValue();

      this.lstProduct();
    }
  }

  render() {
    const {
      show,
      initValue,
      undervalue,
      associategroupslst,
      opendiv,
      unitLst,
      barcodeLst,
      productLst,
      packageLst,
      lstPackages,
      scaningdiv,
      showDiv,
      purchaseInvoiceLst,
      groupLst,
    } = this.state;

    return (
      <div className="">
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          enableReinitialize={true}
          initialValues={initValue}
          validationSchema={Yup.object().shape({
            // associates_group_name: Yup.string()
            //   .trim()
            //   .required("Ledger Group is required"),
            // underId: Yup.object().nullable().required("Select Under"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            let requestData = new FormData();
            if (values.barcode == "scan") {
              requestData.append("code", values.code);
            }
            requestData.append("productId", values.productId.value);
            requestData.append("unitId", values.unitId.value);
            // requestData.append("qty", values.qtny);
            requestData.append("baseamt", values.baseamt);
            if (values.packageId != null) {
              requestData.append("packageId", values.packageId.value);
            }
            // let returnValues = this.myRef.current.values;
            // if (returnValues.packageId && returnValues.packageId != "") {
            //   requestData.append("packageId", values.packageId.value);
            // }
            // requestData.append("");

            // if (values.associates_id == "") {
            createBarcode(requestData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                  // let opt = res.map((v) => {
                  //   return { label: v.barcode };
                  // });

                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: response.message,
                    is_timeout: true,
                    delay: 1000,
                  });
                  // this.setInitValue();

                  // resetForm();
                  // this.pageReload();

                  console.log("barcode ", res.data.barcode);
                  this.setState({ barcodeLst: res.data.barcode });
                } else {
                  MyNotifications.fire({
                    show: true,
                    icon: "error",
                    title: "Error",
                    msg: response.message,
                    is_button_show: true,
                    response,
                  });
                }
              })
              .catch((error) => {
                setSubmitting(false);
                MyNotifications.fire({
                  show: true,
                  icon: "error",
                  title: "Error",

                  is_button_show: true,
                });
              });
            // }
            //  else {
            //   requestData.append("associates_id", values.associates_id);
            //   updateAssociateGroup(requestData)
            //     .then((response) => {
            //       let res = response.data;
            //       if (res.responseStatus == 200) {
            //         ShowNotification("Success", res.message);

            //         resetForm();
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
            <Form onSubmit={handleSubmit} className=" ">
              <Row className="mx-2">
                <Col lg={4} md={4} sm={4} xs={12}>
                  <div id="example-collapse-text" className="common-form-style">
                    <div
                      className="main-div mb-2 m-0"
                      style={{
                        height: "87vh",
                        overflow: "scroll",
                        overflowX: "hidden",
                      }}
                    >
                      <h4 className="form-header">Generate</h4>

                      {/* {JSON.stringify(errors)} */}
                      <Row
                      // style={{ justifyContent: "center" }}
                      >
                        <Col
                          md={{ offset: "1", span: "5" }}
                          className="type-round-style"
                        >
                          <Form.Group className="">
                            <Form.Check
                              inline
                              type="radio"
                              label="Create New"
                              className="pr-3"
                              name="barcode"
                              id="barcode1"
                              value="new"
                              checked={values.barcode === "new" ? true : false}
                              onChange={handleChange}
                            />{" "}
                            <img alt="" src={create_new} />
                          </Form.Group>
                        </Col>
                        <Col
                          md={{ offset: "1", span: "5" }}
                          className="type-round-style ms-2"
                        >
                          <Form.Group className="">
                            <Form.Check
                              inline
                              type="radio"
                              label="Scanning Existing"
                              name="barcode"
                              id="barcode2"
                              value="scan"
                              checked={values.barcode === "scan" ? true : false}
                              onChange={handleChange}
                            />
                            <img alt="" src={scan_existing} />
                          </Form.Group>
                        </Col>
                        {/* {values.barcode=="new"&&(
                          return(
                            this.setState({scaningdiv:true})

                          )
                        )} */}
                        <Col md={12}>
                          <hr className="border-btm-style" />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <h6 className="ps-4">Type :</h6>
                        <Col
                          md={{ offset: "1", span: "5" }}
                          className="type-round-style"
                        >
                          <Form.Group className="">
                            <Form.Check
                              inline
                              type="radio"
                              label="Barcode"
                              className="pr-3"
                              name="gstApplicable"
                              id="GSTYes"
                              // onClick={() => {
                              //   this.setState({
                              //     toggle: true,
                              //   });
                              //   setFieldValue("gstApplicable", "yes");
                              // }}
                              value="yes"
                              // checked={
                              //   values.gstApplicable == "yes" ? true : false
                              // }
                            />{" "}
                            <img alt="" src={barcode_reader} />
                          </Form.Group>
                        </Col>
                        <Col
                          md={{ offset: "1", span: "5" }}
                          className="type-round-style ms-2"
                        >
                          <Form.Group className="">
                            <Form.Check
                              inline
                              type="radio"
                              label="QR code"
                              name="gstApplicable"
                              id="GSTNo"
                              onClick={() => {
                                this.setState({
                                  scaningdiv: false,
                                });
                                // setFieldValue("gstApplicable", "no");
                              }}
                              value="no"
                              // checked={
                              //   values.gstApplicable == "no" ? true : false
                              // }
                            />
                            <img alt="" src={qr_code} />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <hr className="border-btm-style" />
                        </Col>
                      </Row>
                      {/* <Row className="mt-2">
                        <h6 className="ps-4">Print :</h6>
                        <Col
                          md={{ offset: "1", span: "5" }}
                          className="type-round-style"
                        >
                          <Form.Group className="">
                            <Form.Check
                              inline
                              type="radio"
                              label="Bill"
                              className="pr-3"
                              name="barcode"
                              id="barcode3"
                              value="bill"
                              checked={values.barcode === "bill" ? true : false}
                              // onChange={handleChange}
                              onClick={(v) => {
                                this.lstPurchaseInvoice();
                              }}
                            />
                            <img alt="" src={scan_existing} />
                          </Form.Group>
                        </Col>
                        <Col
                          md={{ offset: "1", span: "5" }}
                          className="type-round-style ms-2"
                        >
                          <Form.Group className="">
                            <Form.Check
                              inline
                              type="radio"
                              label="Product"
                              className="pr-3"
                              name="barcode"
                              id="barcode4"
                              value="product"
                              checked={
                                values.barcode === "product" ? true : false
                              }
                              onChange={handleChange}
                            />
                            <img alt="" src={qr_code} />
                          </Form.Group>
                        </Col>

                        {values.barcode === "product" ? (
                          <div>
                            <hr className="border-btm-style" />
                            <Row className="mt-4 px-3">
                              <h6 className="ps-4">Product :</h6>
                              <Col md="12">
                                <Form.Group>
                                  <Form.Label>
                                    Select Product{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>{" "}
                                  </Form.Label>
                                  <Select
                                    isClearable={true}
                                    styles={customStyles}
                                    className="selectTo"
                                    onChange={(v) => {
                                      console.log("v", v);
                                      setFieldValue("productId", v);
                                      // this.getProductPackageLst(v.value);
                                      this.getBarcodeLst(v.value);
                                      // this.setState({
                                      //   barcodeLst: res.data.barcode,
                                      // });
                                      // this.setState({
                                      //   unitLst: v.unitOpt,
                                      //   packageLst:
                                      //     v.packageOpt != null
                                      //       ? v.packageOpt
                                      //       : "",
                                      // });
                                    }}
                                    name="productId"
                                    id="productId"
                                    options={productLst}
                                    value={values.productId}
                                    invalid={errors.productId ? true : false}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.productId}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          <h1></h1>
                        )}
                        <Col md={12}>
                          <hr className="border-btm-style" />
                        </Col>
                      </Row> */}
                      {values.barcode === "new" || values.barcode === "scan" ? (
                        <div>
                          <Row className="mt-4 px-3">
                            <h6>Properties :</h6>
                            {values.barcode == "scan" ? (
                              <Col md="12">
                                <Form.Group>
                                  <Form.Label>
                                    Code{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="code "
                                    name="code"
                                    id="code"
                                    onChange={handleChange}
                                    value={values.code}
                                    isValid={touched.code && !errors.code}
                                    isInvalid={!!errors.code}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.code}
                                  </span>
                                </Form.Group>
                              </Col>
                            ) : (
                              <h1></h1>
                            )}
                          </Row>

                          <Row className="mt-4 px-3">
                            {/* {JSON.stringify(productLst)} */}
                            <Col md="12">
                              <Form.Group>
                                <Form.Label>
                                  Select Product{" "}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>{" "}
                                </Form.Label>
                                <Select
                                  isClearable={true}
                                  styles={customStyles}
                                  className="selectTo"
                                  onChange={(v) => {
                                    console.log("v", v);
                                    setFieldValue("productId", v);
                                    this.getProductPackageLst(v.value);
                                    this.getBarcodeLst(v.value);
                                    this.setState({
                                      unitLst: v.unitOpt,
                                      packageLst:
                                        v.packageOpt != null
                                          ? v.packageOpt
                                          : "",
                                    });
                                  }}
                                  name="productId"
                                  id="productId"
                                  options={productLst}
                                  value={values.productId}
                                  invalid={errors.productId ? true : false}
                                />
                                <span className="text-danger errormsg">
                                  {errors.productId}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          {/* {JSON.stringify(lstPackages)} */}

                          {lstPackages.label != "" ? (
                            <Row className="mt-4 px-3">
                              <Col md="12">
                                <Form.Group>
                                  <Form.Label>
                                    Group{" "}
                                    <span className="pt-1 pl-1 req_validation">
                                      *
                                    </span>{" "}
                                  </Form.Label>
                                  {/* <Select
                                    isClearable={true}
                                    styles={customStyles}
                                    className="selectTo"
                                    onChange={(v) => {
                                      setFieldValue("packageId", v);
                                      // this.setState({ unitLst: v.unitOpt });
                                    }}
                                    name="packageId"
                                    id="packageId"
                                    options={lstPackages}
                                    value={values.packageId}
                                    invalid={errors.packageId ? true : false}
                                  /> */}
                                  <Select
                                    style={{
                                      border: "1px solid #DCDCDC !important",
                                    }}
                                    className="prd-dd-style"
                                    components={{
                                      // DropdownIndicator: () => null,
                                      IndicatorSeparator: () => null,
                                    }}
                                    isClearable={true}
                                    styles={createPro}
                                    name="groupId"
                                    onChange={(v, triggeraction) => {
                                      if (triggeraction.action == "clear") {
                                        setFieldValue("groupId", "");
                                        this.lstGroups();
                                      } else {
                                        this.handleBrandOpt(v);

                                        setFieldValue("groupId", v);
                                      }
                                    }}
                                    options={groupLst}
                                    value={values.groupId}
                                    invalid={errors.groupId ? true : false}
                                    placeholder="Select Group"
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.packageId}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          ) : (
                            <h1></h1>
                          )}
                          <Row className="mt-4 px-3">
                            <Col md="6">
                              <Form.Group>
                                <Form.Label>
                                  Unit{" "}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Select
                                  isClearable={true}
                                  styles={customStyles}
                                  className="selectTo"
                                  onChange={(v) => {
                                    setFieldValue("unitId", v);
                                  }}
                                  name="unitId"
                                  id="unitId"
                                  options={unitLst}
                                  value={values.unitId}
                                  invalid={errors.unitId ? true : false}
                                />
                                <span className="text-danger errormsg">
                                  {errors.unitId}
                                </span>
                              </Form.Group>
                            </Col>
                            {/* <Col md="6">
                          <Form.Group>
                            <Form.Label>
                              Quantity{" "}
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Quantity"
                              name="qtny"
                              id="qtny"
                              onChange={handleChange}
                              value={values.qtny}
                              isValid={touched.qtny && !errors.qtny}
                              isInvalid={!!errors.qtny}
                            />
                            <span className="text-danger errormsg">
                              {errors.qtny}
                            </span>
                          </Form.Group>
                        </Col> */}

                            <Col md="6">
                              <Form.Group>
                                <Form.Label>
                                  Base Amount{" "}
                                  <span className="pt-1 pl-1 req_validation">
                                    *
                                  </span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Base Amount"
                                  name="baseamt"
                                  id="baseamt"
                                  onChange={handleChange}
                                  value={values.baseamt}
                                  isValid={touched.baseamt && !errors.baseamt}
                                  isInvalid={!!errors.baseamt}
                                />
                                <span className="text-danger errormsg">
                                  {errors.baseamt}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mt-4 px-3">
                            <Col md="12" className="btn_align pt-4 mt-1">
                              <Button
                                className="create-btn mr-2"
                                type="submit"
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   if (isActionExist("ledger-list", "create")) {
                                //     eventBus.dispatch(
                                //       "page_change",
                                //       "ledgercreate"
                                //     );
                                //   } else {
                                //     MyNotifications.fire({
                                //       show: true,
                                //       icon: "error",
                                //       title: "Error",
                                //       msg: "Permission is denied!",
                                //       is_button_show: true,
                                //     });
                                //   }
                                // }}
                              >
                                Create
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  class="bi bi-plus-square-dotted svg-style"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                                </svg>
                              </Button>

                              <Button
                                variant="secondary cancel-btn"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({ opendiv: !opendiv }, () => {
                                    this.pageReload();
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        <h1></h1>
                      )}
                    </div>
                  </div>
                </Col>
                <Col lg={8} md={8} sm={8} xs={12}>
                  <div
                    className="wrapper_div"
                    style={{ background: "#CED3D8", height: "87vh" }}
                  >
                    <Col md="12" className=" pt-4 mt-1">
                      <h6 className="p-2">
                        barcode Size: 35mm x 25mmnm
                        <Button
                          className="float-right create-btn mr-2"
                          type="button"
                          style={{ float: "right" }}
                        >
                          Print
                          <img src={print_icon} className="ms-2" />
                        </Button>
                      </h6>
                    </Col>
                    {values.barcode == "scan" ? (
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            {/* <Form.Control
                              type="text"
                            
                              placeholder="Base Amount"
                              name="baseamt"
                              id="baseamt"
                              onChange={handleChange}
                              value={values.baseamt}
                              isValid={touched.baseamt && !errors.baseamt}
                              isInvalid={!!errors.baseamt}
                            /> */}
                            <textarea
                              style={{ width: "100%" }}
                              rows="5"
                              autoFocus={true}
                              name="scan"
                              id="scan"
                              value={touched.scan}
                            ></textarea>
                            <span className="text-danger errormsg">
                              {errors.scan}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    ) : (
                      <h1></h1>
                    )}

                    {/* {JSON.stringify(barcodeLst)} */}

                    <div>
                      {/* {values.barcode == "new" ? ( */}
                      {barcodeLst != null ? (
                        <Row>
                          <div align={"center"}>
                            <Barcode
                              value={barcodeLst}
                              // value="ABCAPR00013"
                              format={"CODE128"}
                              // text={"hii"}
                              renderer={"svg"}
                              width={2}
                              height={120}
                              class={"center"}
                              displayValue={true}
                              align={"center"}
                              fontOptions={""}
                              font={"monospace"}
                              textAlign={"center"}
                              textPosition={"bottom"}
                              textMargin={2}
                              fontSize={20}
                              background={"#ffffff"}
                              lineColor={"#000000"}
                              margin={10}
                            />
                          </div>
                        </Row>
                      ) : (
                        <h1></h1>
                      )}
                    </div>
                    {/* );
                })} */}
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        {/* <div>
          <ReactToPrint
            trigger={() => <a href="#">Print this out!</a>}
            content={() => this.BarcodeCreateRef}
          />
          <BarcodeCreate ref={(el) => (this.BarcodeCreateRef = el)} />
        </div> */}
        <Modal
          show={show}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ show: false })}
          aria-labelledby="contained-modal-title-vcenter"
          animation={false}
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Invoice List
            </Modal.Title>
            <CloseButton
              variant="white"
              className="pull-right"
              onClick={this.handleClose}
            />
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-2 p-invoice-modal ">
            <div className="purchasescreen">
              {purchaseInvoiceLst.length > 0 && (
                <div className="all_bills">
                  <div className="bills_dt">
                    <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
                      <div className="table_wrapper1">
                        <Table className="serialnotbl  mb-0">
                          <thead>
                            <tr>
                              <th style={{ textAlign: "left" }} className="">
                                {" "}
                                #.
                              </th>
                              <th style={{ textAlign: "left" }} className="">
                                Bill
                              </th>
                              <th style={{ textAlign: "left" }} className="">
                                Bill Date
                              </th>

                              <th style={{ textAlign: "left" }} className="">
                                Bill Name
                              </th>

                              <th style={{ textAlign: "left" }} className="">
                                Bill Amt
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {purchaseInvoiceLst.map((v, i) => {
                              return (
                                <tr
                                  onClick={(e) => {
                                    e.preventDefault();

                                    this.handleRowClick(v);
                                  }}
                                >
                                  <td>{i + 1}</td>
                                  <td>{v.invoice_no}</td>
                                  <td>
                                    {moment(v.invoice_date).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </td>

                                  <td>{v.sundry_creditor_name}</td>
                                  <td>{v.total_amount}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
