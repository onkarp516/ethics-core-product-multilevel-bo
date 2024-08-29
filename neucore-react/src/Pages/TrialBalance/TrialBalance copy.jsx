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
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import TRowComponent from "../Tranx/Components/TRowComponent";
import moment from "moment";
import Select from "react-select";
import { get_all_ledgers_trial_balance } from "@/services/api_functions";

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
export default class TrBalance extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      lstLedger: [],
      lstLedgerFiltered: [],
      isLedgerFilterd: true,
      opendiv: false,
      showDiv: true,
      totalDr: 0,
      totalCr: 0,
      currentIndex: false,
    };
  }

  getlstLedger = () => {
    get_all_ledgers_trial_balance()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          this.setState({ lstLedger: res.responseList }, () => {
            this.getFilterLstLedger();
          });
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

    lstLedger &&
      lstLedger.length > 0 &&
      lstLedger.map((v) => {
        v.list &&
          v.list.map((vi, ii) => {
            debitamt = parseFloat(debitamt) + parseFloat(vi["dr"]);
          });
      });
    console.log({ debitamt });
    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };

  getCreditTotalAmount = () => {
    let { lstLedger } = this.state;
    let creditamt = 0;
    lstLedger &&
      lstLedger.length > 0 &&
      lstLedger.map((v) => {
        v.list &&
          v.list.map((vi, ii) => {
            creditamt = parseFloat(creditamt) + parseFloat(vi["cr"]);
          });
      });
    return isNaN(creditamt) ? 0 : parseFloat(creditamt).toFixed(2);
  };

  pageReload = () => {
    this.componentDidMount();
  };

  setUpdateValue = (id) => {
    window.electron.ipcRenderer.webPageChange({
      from: "ledgerlist",
      to: "ledgeredit",
      isNewTab: false,
      prop_data: id,
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getlstLedger();
    }
  }

  render() {
    const {
      show,
      lstLedgerFiltered,
      isLedgerFilterd,
      lstLedger,
      totalDr,
      totalCr,
      currentIndex,
    } = this.state;
    return (
      <Container fluid>
        <div className="">
          <div className="wrapper_div m-0" style={{ height: "auto" }}>
            <Form className="supplie-det bsheet">
              <Row>
                <Col md="3"></Col>
                <Col md="6">
                  <div className="p-2 main_hd_center">
                    <h6>Upahar Cakes and Cookies</h6>
                  </div>
                </Col>
              </Row>
              <Row>
                {/* <Col md="11"></Col> */}
                <Col md="8"></Col>
                <Col className="ms-3">
                  <InputGroup className="mb-3 ">
                    <MyDatePicker
                      // placeholderText="DD-MM-YYYY"
                      id="startDate"
                      dateFormat="dd-MM-yyyy"
                      placeholderText="START DATE"
                      onChange={(date) => {
                        //setFieldValue("startDate", date);
                        this.state.startDate =
                          moment(date).format("YYYY-MM-DD");
                        if (
                          this.state.startDate !== "" &&
                          this.state.endDate !== ""
                        ) {
                          this.getStockDataInventory();
                        }
                      }}
                      //selected={values.startDate}
                      maxDate={new Date()}
                      className="newdate text_center mt-1"
                    />
                    <InputGroup.Text id="basic-addon2" className=" mt-1">
                      <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </InputGroup.Text>
                    <MyDatePicker
                      // placeholderText="DD-MM-YYYY"
                      id="endDate"
                      dateFormat="dd-MM-yyyy"
                      placeholderText="END DATE"
                      onChange={(date) => {
                        //setFieldValue("endDate", date);
                        this.state.endDate = moment(date).format("YYYY-MM-DD");
                        if (
                          this.state.startDate !== "" &&
                          this.state.endDate !== ""
                        ) {
                          this.getStockDataInventory();
                        }
                      }}
                      //selected={values.endDate}
                      maxDate={new Date()}
                      className="newdate text_center mt-1"
                    />
                  </InputGroup>
                </Col>
                <Col md="1">
                  <div className="bs_date text-right mb-1">
                    <Button
                      style={{ marginRight: "18px" }}
                      onClick={(e) => {
                        this.setState({
                          currentIndex: !this.state.currentIndex,
                        });
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
            <div className="Balancesheet_tbl">
              {/* <Row>
                <Col md="9"></Col>
                <Col md="2">
                  <div className="bal_title" style={{ textAlign: "right" }}>
                    
                  </div>
                </Col>
              </Row> */}
              <Row>
                <Col md="9">
                  <div className="bal_title">
                    <h6>Particulars</h6>
                  </div>
                </Col>
                <Col md="1">
                  <div className="bal_title">{/* <h6>Closing Sum</h6> */}</div>
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
            </div>
            <div className="bsheet_det">
              {lstLedger.map((v, i) => {
                //  if (v.closing_sum > 0) { */}
                return (
                  <>
                    <Row>
                      <Col md="9">
                        <div
                          onClick={() => {
                            this.setState({ currentIndex: i });
                            // this.setState({
                            //   currentIndex: !this.state.currentIndex,
                            // });
                          }}
                        >
                          <h6>
                            <b>{v.label}</b>
                          </h6>
                        </div>
                      </Col>{" "}
                      <Col md="1">
                        <div
                          className="group_s_det"
                          style={{ textAlign: "right" }}
                        ></div>
                      </Col>
                      <Col md="1">
                        <div
                          className="group_s_det"
                          style={{ textAlign: "right" }}
                        >
                          <h6>{v.total_dr.toFixed(2)}</h6>
                        </div>
                      </Col>
                      <Col md="1">
                        <div
                          className="group_s_det"
                          style={{ textAlign: "right" }}
                        >
                          <h6>{v.total_cr.toFixed(2)}</h6>
                        </div>
                      </Col>
                    </Row>
                    {currentIndex === true
                      ? v.list.length > 0 &&
                        v.list.map((vi, ii) => {
                          return (
                            <div className="capital_detail_view">
                              <div className="groups_mid">
                                <Row>
                                  <Col md="9">
                                    <div className="group_s_det">
                                      {vi.ledger_name}
                                    </div>
                                  </Col>
                                  <Col md="1">
                                    <div
                                      className="group_s_det"
                                      style={{ textAlign: "right" }}
                                    ></div>
                                  </Col>
                                  <Col md="1">
                                    <div
                                      className="group_s_det"
                                      style={{ textAlign: "right" }}
                                    >
                                      {vi.dr.toFixed(2)}
                                    </div>
                                  </Col>
                                  <Col md="1">
                                    <div
                                      className="group_s_det"
                                      style={{ textAlign: "right" }}
                                    >
                                      {vi.cr.toFixed(2)}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          );
                        })
                      : ""}
                  </>
                ); // }
              })}
            </div>
            <div className="bs_total">
              <Row>
                <Col md="9">
                  <div className="bs_left_total pt-1">
                    <h3>Total</h3>
                  </div>
                </Col>
                <Col md="1">
                  <div className="bs_right_total">
                    {/* <p>{this.getTotalAmount()}</p> */}
                  </div>
                </Col>
                {/* {currentIndex == true ? ( */}
                <>
                  <Col md="1">
                    <div className="bs_right_total text-end ">
                      <p>{this.getDebitTotalAmount()}</p>
                    </div>
                  </Col>
                  <Col md="1">
                    <div className="bs_right_total text-end pe-2">
                      <p>{this.getCreditTotalAmount()}</p>
                    </div>
                  </Col>
                </>
              </Row>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
