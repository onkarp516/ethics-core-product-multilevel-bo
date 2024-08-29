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
  CloseButton,
  NavDropdown,
  Nav,
  Navbar,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
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
import { get_all_ledger_tranx_details } from "@/services/api_functions";

import {
  getSelectValue,
  ShowNotification,
  calculatePercentage,
  calculatePrValue,
  AuthenticationCheck,
  MyDatePicker,
  customStyles,
} from "@/helpers";

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
const products = [
  { value: "Product 1", label: "Product 1" },
  { value: "Washing Machine", label: "Washing Machine" },
];
const drcrtype = [
  { value: "Dr", label: "Dr" },
  { value: "Cr", label: "Cr" },
];
export default class DayBook extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      lstLedger: [],
      orgData: [],
      startDate: "",
      endDate: "",
    };
  }

  getlstLedgerTranx = () => {
    const current = new Date();
    const fdate = moment().format("YYYY-MM-DD");
    let dates = new FormData();
    dates.append("currentDate", fdate);
    get_all_ledger_tranx_details(dates)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            { lstLedger: res.responseList, orgData: res.responseList },
            () => {
              this.getFilterLstLedger();
            }
          );
        }
      })
      .catch((error) => {
        ShowNotification("Error", "Unable to connect the server");
      });
  };

  getlstLedgerTranxOnDateChange = () => {
    // const current=new Date();
    let dates = new FormData();
    dates.append("startDate", this.state.startDate);
    dates.append("endDate", this.state.endDate);
    get_all_ledger_tranx_details(dates)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            { lstLedger: res.responseList, orgData: res.responseList },
            () => {
              this.getFilterLstLedger();
            }
          );
        }
      })
      .catch((error) => {
        ShowNotification("Error", "Unable to connect the server");
      });
  };
  getFilterLstLedger = () => {
    let { isLedgerFilterd, lstLedger } = this.state;

    if (lstLedger.length > 0) {
      let filterLst = lstLedger;
      if (isLedgerFilterd) {
        filterLst = filterLst.filter(
          (v) => v.dr > 0 || v.cr > 0 || v.rdr > 0 || v.rcr > 0
        );
      }
      this.setState({ lstLedgerFiltered: filterLst });
    }
  };

  getTotalAmount = () => {
    let { lstLedger } = this.state;
    let debitamt = 0;
    lstLedger.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["closing_sum"]);
    });

    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };
  getDebitTotalAmount = () => {
    let { lstLedger } = this.state;
    console.log({ lstLedger });
    let debitamt = 0;

    lstLedger.map((v) => {
      {
        debitamt = parseFloat(debitamt) + parseFloat(v["dr"]);
      }
    });

    // console.log({ debitamt });
    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };

  getCreditTotalAmount = () => {
    let { lstLedger } = this.state;
    let creditamt = 0;
    lstLedger.map((v) => {
      {
        creditamt = parseFloat(creditamt) + parseFloat(v["cr"]);
      }
    });
    return isNaN(creditamt) ? 0 : parseFloat(creditamt).toFixed(2);
  };

  componentDidMount() {
    // console.log("props", this.props);
    if (AuthenticationCheck()) {
      this.getlstLedgerTranx();
    }
  }

  componentDidUpdate() {
    const { } = this.state;
  }

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let lstLedger_F = orgData.filter(
      (v) =>
        v.perticulars != "" &&
        v.perticulars.toLowerCase().includes(vi.toLowerCase())
    );
    this.setState({
      lstLedger: lstLedger_F.length > 0 ? lstLedger_F : orgData,
    });
  };
  /**
   *
   * @param {*} product
   * @param {*} element
   * @description to return place holder according to product unit
   * @returns
   */

  render() {
    const { lstLedger } = this.state;
    return (
      <Container fluid className="ledger_form_style">
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
            <div className="cust_table mt-3">
              <Row>
                <Col md="3">
                  <Form>
                    <Form.Control
                      type="text"
                      id="search"
                      placeholder="Search"
                      className="main_search"
                      onChange={(e) => {
                        this.handleSearch(e.target.value);
                      }}
                    />
                  </Form>
                </Col>
                <Col md="4"></Col>
                <Col md="5">
                  <Row>
                    <Col md="5">
                      {/* <Form.Group
                      style={{ display: "flex", justifyContent: "end" }}
                    > */}
                      {/* { <Form.Group>
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
                          dateFormat="dd-MM-yyyy"
                          placeholderText="DD-MM-YYYY"
                     
                        />
                      </Form.Group> } */}
                      {
                        <Form.Group
                          as={Row}
                          className="mb-4"
                          controlId="formHorizontalEmail"
                        >
                          <Form.Label column sm={5}>
                            Start Date
                          </Form.Label>
                          <Col sm={7}>
                            <MyDatePicker
                              className="invoice-date-style p-2"
                              name="startDate"
                              id="startDate"
                              dateFormat="dd-MM-yyyy"
                              placeholderText="DD-MM-YYYY"
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
                        </Form.Group>
                      }
                    </Col>
                    <Col md="5">
                      {
                        <Form.Group
                          as={Row}
                          className="mb-3"
                          controlId="formHorizontalEmail"
                        >
                          <Form.Label column sm={5}>
                            End Date
                          </Form.Label>
                          <Col sm={7}>
                            <MyDatePicker
                              className="invoice-date-style p-2"
                              id="endDate"
                              dateFormat="dd-MM-yyyy"
                              placeholderText="DD-MM-YYYY"
                              onChange={(date) => {
                                setFieldValue("endDate", date);
                                this.state.endDate =
                                  moment(date).format("YYYY-MM-DD");
                                if (
                                  this.state.startDate != "" &&
                                  this.state.endDate != ""
                                ) {
                                  // this.getStockDataInventory();
                                  console.log(
                                    "Umesh Fun",
                                    this.state.searchEnable
                                  );
                                  this.setState({ searchEnable: false });
                                  this.getlstLedgerTranxOnDateChange();
                                }
                              }}
                              selected={values.endDate}
                              maxDate={new Date()}
                            />
                          </Col>
                        </Form.Group>
                      }
                    </Col>
                    <Col md="2">
                      {/* <Navbar expand="lg">
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
                                 
                                />
                              </NavDropdown.Item>
                              <NavDropdown.Item href="#action/3.1">
                                <Form.Check
                                  type="checkbox"
                                  label="Opening Stock"
                                  id="openingstock"
                                  name="openingstock"
                                  
                                />
                              </NavDropdown.Item>
                              <NavDropdown.Item href="#action/3.1">
                                <Form.Check
                                  type="checkbox"
                                  label="Inward Stock"
                                  id="inwardgstock"
                                  name="inwardgstock"
                                 
                                />
                              </NavDropdown.Item>
                              <NavDropdown.Item href="#action/3.1">
                                <Form.Check
                                  type="checkbox"
                                  label="Outward Stock"
                                  id="outwardstock"
                                  name="outwardstock"
                               
                                />
                              </NavDropdown.Item>
                            </NavDropdown>
                          </Nav>
                        </Navbar.Collapse>
                      </Navbar> */}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className="tbl-body-style">
                <Table size="sm">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Date</th>
                      <th style={{ width: "20%" }}>Particulars</th>
                      <th style={{ width: "20%" }}>Voucher #</th>
                      <th style={{ width: "20%" }}>Voucher Type</th>
                      <th style={{ width: "20%" }}>Amount</th>
                      {/* <th>Credit</th> */}
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: "2px solid transparent" }}>
                    {lstLedger.map((v, i) => {
                      return (
                        <tr>
                          <td style={{ width: "20%" }}>
                            {moment(v.transaction_date).format("DD-MM-YYYY")}
                          </td>
                          <td style={{ width: "20%" }}>
                            {v.perticulars.charAt(0).toUpperCase() +
                              v.perticulars.slice(1)}
                          </td>
                          <td style={{ width: "20%" }}>{v.voucher_no}</td>
                          <td style={{ width: "20%" }}>
                            {v.voucher_type.charAt(0).toUpperCase() +
                              v.voucher_type.slice(1)}
                          </td>
                          {/* <td>{v.dr.toFixed(2)}</td> */}
                          <td style={{ width: "20%" }}>
                            {v.amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                    {/* ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )} */}
                  </tbody>
                </Table>
              </div>
              {/* <div className="Balancesheet_tbl">
              <Row>
                <Col md="1">
                  <div className="bal_title">
                    <h6>Date</h6>
                  </div>
                </Col>
                <Col md="6">
                  <div className="bal_title">
                    <h6>Particulars</h6>
                  </div>
                </Col>
                <Col md="2">
                  <div className="bal_title">
                    <h6>Voucher Type</h6>
                  </div>
                </Col>
                <Col md="1">
                  <div className="bal_title">
                    <h6>Voucher #.</h6>
                  </div>
                </Col>
                <Col md="1">
                  <div className="bal_title" style={{ textAlign: "right" }}>
                    <h6>Debit</h6>
                  </div>
                </Col>

                <Col md="1">
                  <div className="bal_title" style={{ textAlign: "right" }}>
                    <h6>Credit</h6>
                  </div>
                </Col>
              </Row>
            </div> */}
              {/* <pre>{JSON.stringify(lstLedger, undefined, 2)}</pre> */}
              {/* <div className="bsheet_det">
            {lstLedger.map((v, i) => {
              return (
                <Row>
                  <Col md="1">
                    <h4>{moment(v.transaction_date).format("DD-MM-YYYY")}</h4>
                  </Col>
                  <Col md="6">
                    <h4>
                      <b>{v.perticulars}</b>
                    </h4>
                  </Col>
                  <Col md="2">
                    <h4>{v.voucher_type}</h4>
                  </Col>
                  <Col md="1">
                    <h4>{v.voucher_no}</h4>
                  </Col>
                  <Col md="1">
                    <div className="capital_amt">
                      <p>{v.dr.toFixed(2)}</p>
                    </div>
                  </Col>
                  <Col md="1">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                          billadjusmentmodalshow: true,
                        });
                      }}
                      className="capital_amt"
                    >
                      <p>{v.cr.toFixed(2)}</p>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </div> */}
              {/* <div className="bs_total">
              <Row>
                <Col md="10">
                  <div className="bs_left_total pt-1">
                    <h3>Total</h3>
                  </div>
                </Col>
                <Col md="1">
                  <div className="bs_right_total">
                    <p>{this.getDebitTotalAmount()}</p>
                  </div>
                </Col>
                <Col md="1">
                  <div className="bs_right_total">
                    <p>{this.getCreditTotalAmount()}</p>
                  </div>
                </Col>
              </Row>
            </div> */}
            </div>
          )}
        </Formik>
      </Container>
    );
  }
}
