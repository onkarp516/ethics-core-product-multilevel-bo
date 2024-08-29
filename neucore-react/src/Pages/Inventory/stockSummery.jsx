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
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";

import { Formik, setNestedObjectValues } from "formik";
import * as Yup from "yup";
import TRowComponent from "../Tranx/Components/TRowComponent";
import moment from "moment";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Filter from "@/assets/images/TBfilter.png";

import { faFilter } from "@fortawesome/free-solid-svg-icons";

import {
  getClosingStock,
  get_closing_stocks,
  get_opening_stocks,
  get_inward_stocks,
  get_outward_stocks,
} from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  MyDatePicker,
  MyTextDatePicker,
  customStyles,
} from "@/helpers";
import save_icon from "@/assets/images/save_icon.svg";
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
    this.stocksummertyRef = React.createRef();
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
      orgData: [],
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
      searchEnable: true,
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
   *
   */
  getClosingStockPageLoad = () => {
    get_closing_stocks()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log("res--------->", res);
          this.setState({ closingstocksTotal: res.totalResult });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ closingStocks: opt, orgData: opt }, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  getClosingStock = () => {
    // console.log("Closing Stock...>>");
    let dates = new FormData();
    dates.append("startDate", this.state.startDate);
    dates.append("endDate", this.state.endDate);
    // console.log("startDate", this.state.startDate);
    // console.log("EndDate", this.state.endDate);
    get_closing_stocks(dates)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ closingstocksTotal: res.totalResult });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ closingStocks: opt, orgData: opt }, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
            //this.setState(searchEnable,true)
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getOpeningStockPageLoad = () => {
    get_opening_stocks()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log("res--------->", res);
          this.setState({ openingStocksTotal: res.totalResult });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ openingStocks: opt, orgData: opt }, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  getOpeningStock = () => {
    //console.log("in opening stcoks");
    let dates = new FormData();
    dates.append("startDate", this.state.startDate);
    dates.append("endDate", this.state.endDate);
    console.log("startDate", this.state.startDate);
    console.log("EndDate", this.state.endDate);
    get_opening_stocks(dates)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ openingStocksTotal: res.totalResult });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ openingStocks: opt, orgData: opt }, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getInwordStockPageLoad = () => {
    get_inward_stocks()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log("res--------->", res);
          this.setState({ inwardStocksTotal: res.totalResult });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ inwardStocks: opt, orgData: opt }, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  getInwardStock = () => {
    // console.log("In Inward Stock");
    let dates = new FormData();
    dates.append("startDate", this.state.startDate);
    dates.append("endDate", this.state.endDate);
    //console.log("startDate", this.state.startDate);
    //console.log("EndDate", this.state.endDate);

    get_inward_stocks(dates)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ inwardStocksTotal: res.totalInward });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ inwardStocks: opt, orgData: opt }, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  getOutwordStockPageLoad = () => {
    get_outward_stocks()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          console.log("res--------->", res);
          this.setState({ outwardStocksTotal: res.totalResult });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ outwardStocks: opt, orgData: opt }, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  getOutwardStock = () => {
    // console.log("In Outward Stock");
    let dates = new FormData();
    dates.append("startDate", this.state.startDate);
    dates.append("endDate", this.state.endDate);
    // console.log("startDate", this.state.startDate);
    // console.log("EndDate", this.state.endDate);

    get_outward_stocks(dates)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ outwardStocksTotal: res.totalOutward });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ outwardStocks: opt, orgData: opt }, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        v.productName != "" &&
        v.productName.toLowerCase().includes(vi.toLowerCase())
    );
    this.setState({
      closingStocks: orgData_F.length > 0 ? orgData_F : orgData,
      openingStocks: orgData_F.length > 0 ? orgData_F : orgData,
      inwardStocks: orgData_F.length > 0 ? orgData_F : orgData,
      outwardStocks: orgData_F.length > 0 ? orgData_F : orgData,
      salesInvoiceLst: orgData_F.length > 0 ? orgData_F : orgData,
    });
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
    console.log("Page Load...>>");

    this.getClosingStockPageLoad();
    this.getOpeningStockPageLoad();
    this.getInwordStockPageLoad();
    this.getOutwordStockPageLoad();
    // const current=new Date();
    // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    // const fdate=moment(date).format("YYYY-MM-DD");
    // dates.append("startDate",fdate);
    // dates.append("endDate",fdate
    // );
    // console.log("Dates",dates);
    // console.log("Current System Date:", moment(date).format("YYYY-MM-DD"));
    // if (AuthenticationCheck()) {
    //    this.getClosingStock();
    //  }
  }

  /**
   *
   * @param {*} element
   * @param {*} value
   * @param {*} index
   * @param {*} setFieldValue
   * @description on change of each element in row function will recalculate amt
   */

  render() {
    const {
      closingStocks,
      openingStocks,
      inwardStocks,
      outwardStocks,
      searchEnable,
    } = this.state;
    return (
      <div>
        <div
          id="example-collapse-text"
          className="stock-summery stock_summery_new px-0 mx-0"
        >
          <Formik
            innerRef={this.stocksummertyRef}
            initialValues={{ selectoption1: "", search: "" }}
          >
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
                <Row className="p-3" style={{ background: "#D9F0FB" }}>
                  <Col lg={12}>
                    <h3 className="company_text">
                      Company : Upahar Cakes & Cookies
                    </h3>
                  </Col>
                  <Col lg={2}>
                    <Row>
                      <Col lg={4} className="my-auto">
                        <p className="my-auto from_date_text">From Date</p>
                      </Col>
                      <Col lg={8}>
                        <MyDatePicker
                          className="invoice-date-style p-2"
                          // placeholderText="DD-MM-YYYY"
                          id="startDate"
                          name="startDate"
                          dateFormat="dd-MM-yyyy"
                          placeholderText="DD-MM-YYYY"
                          // placeholderText="START DATE"
                          onChange={(date) => {
                            setFieldValue("startDate", date);
                            this.state.startDate =
                              moment(date).format("YYYY-MM-DD");
                            if (
                              this.state.startDate != "" &&
                              this.state.endDate != ""
                            ) {
                              // this.getStockDataInventory();
                              // this.getClosingStock();
                              // this.getOpeningStock();
                            }
                          }}
                          selected={values.startDate}
                          maxDate={new Date()}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={2}>
                    <Row>
                      <Col lg={4} className="my-auto">
                        <p className="my-auto from_date_text">To Date</p>
                      </Col>
                      <Col lg={8}>
                        <MyDatePicker
                          className="invoice-date-style p-2"
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
                              // this.getStockDataInventory();
                              console.log("Umesh Fun", this.state.searchEnable);
                              this.setState({ searchEnable: false });
                              this.getClosingStock();
                              this.getOpeningStock();
                              this.getInwardStock();
                              this.getOutwardStock();
                            }
                          }}
                          selected={values.endDate}
                          maxDate={new Date()}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={2} className="ms-auto">
                    <Row>
                      <Col lg={10}>
                        <Form>
                          <Form.Group
                          // className="search_btn_style mt-1"
                          //controlId="formBasicSearch"
                          >
                            <Form.Control
                              type="text"
                              id="search"
                              placeholder="Search"
                              disabled={searchEnable}
                              className="main_search"
                              onChange={(e) => {
                                this.handleSearch(e.target.value);
                              }}
                            />
                            {/* <Button type="submit">x</Button> */}
                          </Form.Group>
                        </Form>
                      </Col>
                      <Col lg={2}>
                        {/* <Button className="btn btn_filter_icon"> */}
                        <Navbar expand="lg" style={{ justifyContent: "end" }}>
                          <Navbar.Collapse id="basic-navbar-nav">
                            <Nav>
                              <NavDropdown
                                title={
                                  <FontAwesomeIcon
                                    icon={faFilter}
                                    size={"1x"}
                                    className="filter_icon"
                                  />
                                }
                                id="basic-nav-dropdown"
                              >
                                <NavDropdown.Item href="#action/3.1">
                                  <Form.Check
                                    type="switch"
                                    label="Closing Stock"
                                    id="closingstock"
                                    name="closingstock"
                                    checked={this.state.closingstock}
                                    onChange={this.handleChange}
                                  />
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">
                                  <Form.Check
                                    type="switch"
                                    label="Opening Stock"
                                    id="openingstock"
                                    name="openingstock"
                                    checked={this.state.openingstock}
                                    onChange={this.handleopeningstock}
                                  />
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">
                                  <Form.Check
                                    type="switch"
                                    label="Inward Stock"
                                    id="inwardgstock"
                                    name="inwardgstock"
                                    checked={this.state.inwardstock}
                                    onChange={this.handleinwardstock}
                                  />
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">
                                  <Form.Check
                                    type="switch"
                                    label="Outward Stock"
                                    id="outwardstock"
                                    name="outwardstock"
                                    checked={this.state.outwardstock}
                                    onChange={this.handleoutwardstock}
                                  />
                                </NavDropdown.Item>
                              </NavDropdown>
                            </Nav>
                          </Navbar.Collapse>
                        </Navbar>
                        {/* </Button> */}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* {JSON.stringify(this.state.openingstock)} */}
                <Row className="mx-0">
                  <Col md="12" className="px-0 mx-0">
                    <div className="table-style tblresponsive">
                      <Table hover bordered>
                        <thead className="thead1">
                          <tr
                            className="border-dark"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(218, 226, 232, 0.3) 59.37%), linear-gradient(180deg, #FFFFFF 0%, #EBEBEB 63.02%)",
                              borderWidth: "1px 0px",
                              borderStyle: "solid",
                              borderColor: "#A8ADB3",
                            }}
                          >
                            <th className="border-dark ">Purticulars</th>
                            {/* <th className="border-dark ">Package</th> */}
                            <th className="border-dark ">Unit</th>
                            {this.state.openingstock ? (
                              <th className="border-dark " colSpan={3}>
                                Opening Stock
                              </th>
                            ) : null}
                            {this.state.inwardstock ? (
                              <th className="border-dark " colSpan={3}>
                                Inward
                              </th>
                            ) : null}
                            {/* Inwards end */}
                            {/* Outwards start */}
                            {this.state.outwardstock ? (
                              <th className="border-dark " colSpan={3}>
                                Outward
                              </th>
                            ) : null}
                            {/* Outwards end */}
                            {/* Closing Stock  start*/}
                            {this.state.closingstock ? (
                              <th className="border-dark " colSpan={3}>
                                Closing Stock
                              </th>
                            ) : null}
                            {/* Closing Stock  end*/}
                          </tr>
                          {/* </thead> */}
                          {/* <thead className="thead2 "> */}
                          <tr
                            className="border-dark "
                            style={{
                              background: "#E2E3E4",
                              borderBottom: "1px solid #A8ADB3",
                            }}
                          >
                            <th className="border-dark "></th>
                            {/* <th className="border-dark "></th> */}
                            <th className="border-dark "></th>
                            {this.state.openingstock ? (
                              <>
                                <th className="border-dark ">Qty</th>

                                <th className="border-dark ">Rate</th>
                                <th className="border-dark ">Value</th>
                              </>
                            ) : null}
                            {this.state.inwardstock ? (
                              <>
                                <th className="border-dark ">Qty</th>
                                <th className="border-dark ">Rate</th>
                                <th className="border-dark ">Value</th>
                              </>
                            ) : null}
                            {this.state.outwardstock ? (
                              <>
                                <th className="border-dark ">Qty</th>
                                <th className="border-dark ">Rate</th>
                                <th className="border-dark ">Value</th>
                              </>
                            ) : null}
                            {this.state.closingstock ? (
                              <>
                                <th className="border-dark ">Qty</th>
                                <th className="border-dark ">Rate</th>
                                <th className="border-dark ">Value</th>
                              </>
                            ) : null}
                          </tr>
                        </thead>
                        <tbody>
                          {closingStocks.length > 0 &&
                            closingStocks.map((v, i) => {
                              return (
                                <>
                                  <tr>
                                    <td>{v.product_name}</td>
                                    {/* <td>{v.packageName}</td> */}
                                    <td>{v.unit_name}</td>
                                    {/* {JSON.stringify(this.state.openingstock)} */}
                                    {this.state.openingStocks && (
                                      <>
                                        <td>
                                          {openingStocks[i]
                                            ? openingStocks[i]["opening_stock"]
                                            : 0}
                                          {/* {v.opening_stock} */}
                                        </td>
                                        <td>
                                          {/* {openingStocks[i]
                                            ? openingStocks[i][
                                                "openingQuantity"
                                              ]
                                            : ""} */}
                                        </td>
                                        <td>
                                          {/* {openingStocks[i]
                                            ? openingStocks[i][
                                                "openingQuantity"
                                              ]
                                            : ""} */}
                                        </td>
                                      </>
                                    )}
                                    {this.state.inwardStocks && (
                                      <>
                                        <td>
                                          {inwardStocks[i]
                                            ? inwardStocks[i]["inword_stock"]
                                            : ""}
                                        </td>
                                        <td>
                                          {/* {inwardStocks[i]
                                            ? inwardStocks[i][
                                                "openingQuantity"
                                              ]
                                            : ""} */}
                                        </td>
                                        <td>
                                          {/* {inwardStocks[i]
                                            ? inwardStocks[i][
                                                "openingQuantity"
                                              ]
                                            : ""} */}
                                        </td>
                                      </>
                                    )}
                                    {this.state.outwardStocks && (
                                      <>
                                        <td>
                                          {outwardStocks[i]
                                            ? outwardStocks[i]["outword_stock"]
                                            : ""}
                                        </td>

                                        <td>
                                          {/* {inwardStocks[i]
                                            ? inwardStocks[i][
                                                "openingQuantity"
                                              ]
                                            : ""} */}
                                        </td>
                                        <td>
                                          {/* {inwardStocks[i]
                                            ? inwardStocks[i][
                                                "openingQuantity"
                                              ]
                                            : ""} */}
                                        </td>
                                      </>
                                    )}
                                    {this.state.closingstock && (
                                      <>
                                        <td>
                                          {closingStocks[i]
                                            ? closingStocks[i]["closing_stock"]
                                            : ""}
                                          {/* {v.closing_stock} */}
                                        </td>
                                        <td>
                                          {/* {closingStocks[i]
                                            ? closingStocks[i]["quantity"]
                                            : ""} */}
                                        </td>
                                        <td>
                                          {/* {closingStocks[i]
                                            ? closingStocks[i]["quantity"]
                                            : ""} */}
                                          {/* {v.closing_balance} */}
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                </>
                              );
                            })}
                          {/* <td>{JSON.stringify(openingStocks)}</td> */}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </Formik>
        </div>
        {/* </div> */}
      </div>
    );
  }
}
