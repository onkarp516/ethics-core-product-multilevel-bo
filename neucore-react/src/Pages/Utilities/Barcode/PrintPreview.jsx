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
  Card,
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
} from "@/helpers";
import {
  createBarcode,
  get_associate_group,
  getProduct,
  getProductPackageList,
  getBarcode,
  getPurchaseInvoiceList,
} from "@/services/api_functions";
import qr_code from "@/assets/images/qr_code.svg";
import scan_existing from "@/assets/images/scan_existing.svg";
import barcode_reader from "@/assets/images/barcode_reader.svg";
import create_new from "@/assets/images/create_new.svg";
import print_icon from "@/assets/images/print_icon.svg";
export default class PrintPreview extends React.Component {
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
      productBarcodeList: [],
    };
    this.open = this.open.bind(this);
  }

  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
  }

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
          this.setState({ productBarcodeList: data });
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

            // console.log("unitopt123", unitOpt);
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
      .catch((error) => { });
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

      // this.lstProduct();
      const { prop_data } = this.props.block;
      this.state.productBarcodeList = prop_data.prop_data;
      console.log("props_data in print preview", JSON.stringify(prop_data.prop_data));
    }
  }
  callPrint = () => {
    var newWin = window.frames["printf"];
    var divToPrint = document.getElementById("printDiv");
    let data = divToPrint.outerHTML;
    let htmlToPrint = '<body onload="window.print()">';
    htmlToPrint +=
      "<style>@media print {" +
      ".border-style {" +
      // "margin-top: -5px;" +
      "font-size: 6px;" +
      // "font-family: monospace;" +
      "margin:auto;" +
      // "border: 1px solid #333;" +
      "}" +
      ".page-break {" +
      "page-break-after: always;" +
      "}" +
      ".card-body {" +
      "padding: 0rem 0rem;" +
      "}" +
      ".card-title {" +
      "margin-top: 0rem;" +
      "margin-bottom: 0rem;" +
      "}" +
      ".barcode-style {" +
      "margin:0px;" +
      // "margin-left:-10px;" +
      "}" +
      ".margin-style {" +
      "margin-top:-10px;" +
      "}" +
      "}</style>";
    htmlToPrint += data;
    htmlToPrint += "</body>";
    newWin.document.write(htmlToPrint);
    newWin.document.close();
  };

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
      productBarcodeList,
    } = this.state;

    return (
      <div className="">
        <Row className="mx-2">
          <Col lg={12} md={12} sm={12} xs={12}>
            <div
              className="wrapper_div"
              style={{ background: "#CED3D8", height: "85vh" }}
            >
              <Col md="12" className=" pt-4 mt-1">
                <h6 className="p-2">
                  barcode Size: 35mm x 25mmnm
                  <Button
                    className="float-right create-btn mr-2"
                    type="button"
                    style={{ float: "right" }}
                    onClick={() => {
                      this.callPrint();
                      // window.print()
                    }}
                  >
                    Print
                    <img src={print_icon} className="ms-2" />
                  </Button>
                </h6>
              </Col>
              <p>Barcode List</p>
              <iframe id="printf" name="printf" className="d-none"></iframe>
              <div id="printDiv" className="border-style">

                {productBarcodeList != "" &&
                  productBarcodeList.map((v, i) => {
                    if (v.barcode_no && v.barcode_no != "") {

                      console.log("Pring Qty : ", v.print_qty);

                      return (
                        <Row>
                          <Col
                            md="2"
                            // className={`${
                            //   i != 0 && i < productBarcodeList.length - 1
                            //     ? "margin-style page-break"
                            //     : i == 0
                            //     ? "margin-style page-break"
                            //     : "margin-style"
                            // }`}
                            className="page-break"
                          >
                            <Card>
                              <Card.Body className="card-body">
                                <Card.Title>{v.product_name}</Card.Title>
                                {/* <Card.Subtitle className="">
                                  014 STEEL
                                </Card.Subtitle> */}
                                {/* <Card.Subtitle className="">
                                014 STEEL JACK BEARING
                              </Card.Subtitle> */}
                                <Card.Subtitle className="">
                                  <b>MRP : {v.mrp}</b>
                                </Card.Subtitle>
                                <Card.Text className="barcode-style">
                                  <Barcode
                                    value={v.barcode_no}
                                    format={"CODE128"}
                                    // text={"hii"}
                                    // renderer={"svg"}
                                    width={1}
                                    height={8}
                                    margin={0}
                                    // class={"center"}
                                    displayValue={true}
                                    // align={"center"}
                                    // fontOptions={""}
                                    // font={"monospace"}
                                    // textAlign={"center"}
                                    // textPosition={"bottom"}
                                    // textMargin={2}
                                    fontSize={8}
                                  // background={"#ffffff"}
                                  // lineColor={"#000000"}
                                  />
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>

                      )
                    }
                    // );
                  })}

              </div>
              {/* {JSON.stringify(productBarcodeList, 2, undefined)} */}
            </div>
          </Col>
        </Row>
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
