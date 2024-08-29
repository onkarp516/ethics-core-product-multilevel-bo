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
import {
  faPlug,
  faPlugCircleBolt,
  faPlusCircle,
  faIndianRupeeSign,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
// import { Select, components } from "react-select";

// import inr from "@render/assets/images/inr.png";
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
      searchEnable:true,
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
    // console.log("Closing Stock...>>");
    this.setState({searchEnable:false});
    const current=new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    console.log("Fdata",date);
    const fdate=moment(date).format("YYYY-DD-MM");
    let dates = new FormData();
    dates.append("startDate", fdate);
    dates.append("endDate", fdate);
    get_closing_stocks(dates)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ closingstocksTotal: res.totalResult });
          let opt = res.response.map((v, i) => {
            return v;
          });
          this.setState({ closingStocks: opt, orgData: opt}, () => {
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
          this.setState({ closingStocks: opt, orgData: opt}, () => {
            this.stocksummertyRef.current.setFieldValue("search", "");
            //this.setState(searchEnable,true)
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
          this.setState({ openingStocks: opt, orgData: opt, }, () => {
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
          this.setState({ outwardStocks: opt, orgData: opt}, () => {
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
    const { closingStocks, openingStocks, inwardStocks, outwardStocks,searchEnable} =
      this.state;
    return (
      <div>
        <div id="example-collapse-text" className="stock-summery px-2">
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
                <Row className="p-3">
                  <Col md="3">
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
                        onChange={(e)=>{

                          this.handleSearch(e.target.value);
                        }}
                      />
                      {/* <Button type="submit">x</Button> */}
                    </Form.Group>
                  </Form>
                </Col>
                  <Col md="6">
                    <h6
                      style={{
                        // width: "101px",
                        height: "12px",
                        marginTop: "20px",
                        fontFamily: "Lato",
                        fontStyle: "normal",
                        fontWeight: "700",
                        fontSize: "16px",
                        lineHeight: "12px",
                        color: " #000000",
                        // alignItems:"center",
                        textAlign:"center",
                      }}
                    >
                      Upahar Cakes And Cookies
                    </h6>
                  </Col>

                  <Col md={3}>
                    <Form.Group
                      style={{ display: "flex", justifyContent: "end" }}
                    >
                      <Form.Group>
                        <Form.Label
                          style={{
                            height: "14px",
                            marginRight: "0%",
                            marginTop: "0px",
                            fontFamily: "Lato",
                            fontStyle: "normal",
                            // fontWeight: "600",
                            fontSize: "12px",
                            lineHeight: "14px",
                            color: "#85878E",
                          }}
                        >
                          Start Date
                        </Form.Label>
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
                      </Form.Group>

                      <Form.Group className="ms-3">
                        <Form.Label
                          style={{
                            height: "14px",
                            marginRight: "0%",
                            marginTop: "0px",
                            fontFamily: "Lato",
                            fontStyle: "normal",
                            // fontWeight: "600",
                            fontSize: "12px",
                            lineHeight: "14px",
                            color: "#85878E",
                          }}
                        >
                          End Date
                        </Form.Label>
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
                              console.log("Umesh Fun",this.state.searchEnable);
                              this.setState({searchEnable:false});
                              this.getClosingStock();
                              this.getOpeningStock();
                              this.getInwardStock();
                              this.getOutwardStock();
                            }
                          }}
                          selected={values.endDate}
                          maxDate={new Date()}
                        />
                      </Form.Group>

                      <Navbar expand="lg">
                        <Navbar.Collapse id="basic-navbar-nav">
                          <Nav>
                            <NavDropdown
                              title={
                                <FontAwesomeIcon
                                  icon={faFilter}
                                  size={"1x"}
                                  style={{
                                    color: "#A0A3BD",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                />
                              }
                              id="basic-nav-dropdown"
                            >
                              <NavDropdown.Item href="#action/3.1">
                                <Form.Check
                                  type="checkbox"
                                  label="Closing Stock"
                                  id="closingstock"
                                  name="closingstock"
                                  checked={this.state.closingstock}
                                  onChange={this.handleChange}
                                />
                              </NavDropdown.Item>
                              <NavDropdown.Item href="#action/3.1">
                                <Form.Check
                                  type="checkbox"
                                  label="Opening Stock"
                                  id="openingstock"
                                  name="openingstock"
                                  checked={this.state.openingstock}
                                  onChange={this.handleopeningstock}
                                />
                              </NavDropdown.Item>
                              <NavDropdown.Item href="#action/3.1">
                                <Form.Check
                                  type="checkbox"
                                  label="Inward Stock"
                                  id="inwardgstock"
                                  name="inwardgstock"
                                  checked={this.state.inwardstock}
                                  onChange={this.handleinwardstock}
                                />
                              </NavDropdown.Item>
                              <NavDropdown.Item href="#action/3.1">
                                <Form.Check
                                  type="checkbox"
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
                    </Form.Group>
                  </Col>
                </Row>
                {/* {JSON.stringify(this.state.openingstock)} */}
                <Row className="mx-1">
                  <Col md="12" className="px-0">
                    <div className="table-style tblresponsive">
                      <Table hover bordered>
                        <thead className="thead1">
                          <tr>
                            <th
                              style={{
                                width: "581px",
                                height: "12px",
                                marginLeft: "32px",
                                marginTop: "12px",
                                fontFamily: "Lato",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "14px",
                              }}
                              // rowSpan={2}
                            >
                              <p
                                style={
                                  {
                                    // marginBottom: "45px",
                                  }
                                }
                              ></p>
                              Product
                            </th>

                            <th
                              style={{
                                width: "102.7px",
                                height: "12px",
                                marginLeft: "848.58px",
                                marginTop: "12px",
                                fontFamily: "Lato",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "14px",
                              }}
                              // rowSpan={2}
                            >
                              <p
                                style={
                                  {
                                    // marginBottom: "45px",
                                  }
                                }
                              ></p>
                              Package
                            </th>
                            <th
                              style={{
                                width: "79.59px",
                                height: "12px",
                                marginLeft: "961.55px",
                                marginTop: "12px",
                                fontFamily: "Lato",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "14px",
                              }}
                              // rowSpan={2}
                            >
                              <p
                                style={
                                  {
                                    // marginBottom: "45px",
                                  }
                                }
                              ></p>
                              Unit
                            </th>
                            {this.state.openingstock ? (
                              <th
                                style={{
                                  width: "78.31px",
                                  height: "12px",
                                  marginLeft: "1052.7px",
                                  marginTop: "12px",
                                  fontFamily: "Lato",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  textAlign: "center",
                                }}
                                colSpan={3}
                              >
                                Opening Stock
                              </th>
                            ) : null}
                            {this.state.inwardstock ? (
                              <th
                                style={{
                                  width: "107.84px",
                                  height: "12px",
                                  marginLeft: "1141.28px",
                                  marginTop: "12px",
                                  fontFamily: "Lato",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  textAlign: "center",
                                }}
                                colSpan={3}
                              >
                                Inward
                              </th>
                            ) : null}
                            {/* Inwards end */}
                            {/* Outwards start */}
                            {this.state.outwardstock ? (
                              <th
                                style={{
                                  width: "107.84px",
                                  height: "12px",
                                  marginLeft: "1258.11px",
                                  marginTop: "12px",
                                  fontFamily: "Lato",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  textAlign: "center",
                                }}
                                colSpan={3}
                              >
                                Outward
                              </th>
                            ) : null}
                            {/* Outwards end */}
                            {/* Closing Stock  start*/}
                            {this.state.closingstock ? (
                              <th
                                style={{
                                  width: "84.73px",
                                  height: "12px",
                                  marginLeft: "1475.07px",
                                  marginTop: "12px",
                                  fontFamily: "Lato",
                                  fontStyle: "normal",
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  textAlign: "center",
                                }}
                                colSpan={3}
                              >
                                Closing Stock
                              </th>
                            ) : null}
                            {/* Closing Stock  end*/}
                          </tr>
                        </thead>
                        <thead className="thead2  ">
                          <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            {this.state.openingstock ? (
                              <>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                      // marginLeft: "auto",
                                      // marginRight: "auto",
                                    }}
                                  >
                                    Qty
                                  </p>
                                </th>

                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                      // marginLeft: "auto",
                                      // marginRight: "auto",
                                    }}
                                  >
                                    Rate
                                  </p>
                                </th>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      // margin: "auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                      // marginLeft: "auto",
                                      // marginRight: "auto",
                                    }}
                                  >
                                    Value
                                  </p>
                                </th>
                              </>
                            ) : null}
                            {this.state.inwardstock ? (
                              <>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Qty
                                  </p>
                                </th>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Rate
                                  </p>
                                </th>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Value
                                  </p>
                                </th>
                              </>
                            ) : null}
                            {this.state.outwardstock ? (
                              <>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Qty
                                  </p>
                                </th>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Rate
                                  </p>
                                </th>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      borderRadius: "2px",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Value
                                  </p>
                                </th>
                              </>
                            ) : null}
                            {this.state.closingstock ? (
                              <>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Qty
                                  </p>
                                </th>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Rate
                                  </p>
                                </th>
                                <th>
                                  <p
                                    style={{
                                      background: "rgb(220, 226, 230)",
                                      width: "90px",
                                      height: "28px",
                                      textAlign: "center",
                                      margin: "0px auto",
                                      lineHeight: "28px",
                                      color: "#2F3033",
                                      opacity: "0.6",
                                    }}
                                  >
                                    Value
                                  </p>
                                </th>
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
                                    <td>
                                      <p
                                        style={{
                                          width: "430px",
                                          fontFamily: "Lato",
                                          fontStyle: "normal",
                                          fontWeight: "400",
                                          fontSize: "14px",
                                          lineHeight: "12px",
                                          color: "#2F3033",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis",
                                          maxWidth: "430px",
                                          margin: "10px 0px",
                                          marginLeft: "1px",
                                          textAlign: "left",
                                          // marginLeft: "32px",
                                        }}
                                      >
                                        {" "}
                                        {v.productName}
                                      </p>
                                    </td>
                                    <td>
                                      <p
                                        style={{
                                          width: "80px",
                                          fontFamily: "Lato",
                                          fontStyle: "normal",
                                          fontWeight: "400",
                                          fontSize: "14px",
                                          lineHeight: "12px",
                                          color: "#2F3033",
                                          maxWidth: "80px",
                                          margin: "10px 0px",
                                        }}
                                      >
                                        {" "}
                                        {v.packageName}
                                      </p>
                                    </td>
                                    <td>
                                      <p
                                        style={{
                                          width: "60px",
                                          fontFamily: "Lato",
                                          fontStyle: "normal",
                                          fontWeight: "400",
                                          fontSize: "14px",
                                          lineHeight: "12px",
                                          color: "#2F3033",
                                          maxWidth: "60px",
                                          margin: "10px 0px",
                                        }}
                                      >
                                        {" "}
                                        {v.unitName}
                                      </p>
                                    </td>
                                    {/* {JSON.stringify(this.state.openingstock)} */}
                                    {this.state.openingstock  && (
                                      <>
                                        <td>
                                          {openingStocks[i]
                                            ? openingStocks[i][
                                                "openingQuantity"
                                              ]
                                            : 0}
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
                                    {this.state.inwardstock && (
                                      <>
                                        <td>
                                          {inwardStocks[i]
                                            ? inwardStocks[i]["totalInward"]
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
                                    {this.state.outwardstock && (
                                      <>
                                        <td>
                                          {outwardStocks[i]
                                            ? outwardStocks[i]["totalOutward"]
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
                                            ? closingStocks[i]["quantity"]
                                            : ""}
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
                  purchaseId: Yup.object().required("select purchase account"),
                  invoice_no: Yup.string()
                    .trim()
                    .required("invoice no is required"),
                  invoice_dt: Yup.string().required("invoice dt is required"),
                  supplierCodeId: Yup.object().required("select supplier code"),
                  supplierNameId: Yup.object().required("select supplier name"),
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
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                            <span className="pt-1 pl-1 req_validation">*</span>
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
                            <span className="pt-1 pl-1 req_validation">*</span>
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
      </div>
    );
  }
}
