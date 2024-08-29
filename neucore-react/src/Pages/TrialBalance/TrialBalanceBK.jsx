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
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import TRowComponent from "../Tranx/Components/TRowComponent";
import moment from "moment";
import Select from "react-select";
import { get_all_ledgers_trial_balance } from "@/services/api_functions";

import Filter from "@/assets/images/TBfilter.png";

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
export default class TrialBalanceBk extends React.Component {
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
      <>
        <Container fluid className="Trial_balance_main">
          <Row>
            <Col>
              <h3 className="company_name_text">Company : Dummy Name</h3>
            </Col>
          </Row>
          <Row>
            <Col lg={1}>
              <h4 className="date_text my-auto">From Date</h4>
            </Col>
            <Col lg={2}>
              <MyTextDatePicker
                style={{ borderRadius: "0" }}
                id="fssai_expiry"
                name="fssai_expiry"
                placeholder="DD/MM/YYYY"
                className="form-control"
                // value={values.fssai_expiry}
                // onChange={handleChange}
                // onBlur={(e) => {
                //   console.log("e ", e);
                //   console.log("e.target.value", e.target.value);
                //   if (e.target.value != null && e.target.value != "") {
                //     setFieldValue("fssai_expiry", e.target.value);
                //     this.checkExpiryDate(
                //       setFieldValue,
                //       e.target.value,
                //       "fssai_expiry"
                //     );
                //   } else {
                //     setFieldValue("fssai_expiry", "");
                //   }
                // }}
              />
            </Col>
            <Col lg={1}>
              <h4 className="date_text my-auto">To Date</h4>
            </Col>
            <Col lg={2}>
              <MyTextDatePicker
                style={{ borderRadius: "0" }}
                id="fssai_expiry"
                name="fssai_expiry"
                placeholder="DD/MM/YYYY"
                className="form-control"
                // value={values.fssai_expiry}
                // onChange={handleChange}
                // onBlur={(e) => {
                //   console.log("e ", e);
                //   console.log("e.target.value", e.target.value);
                //   if (e.target.value != null && e.target.value != "") {
                //     setFieldValue("fssai_expiry", e.target.value);
                //     this.checkExpiryDate(
                //       setFieldValue,
                //       e.target.value,
                //       "fssai_expiry"
                //     );
                //   } else {
                //     setFieldValue("fssai_expiry", "");
                //   }
                // }}
              />
            </Col>
            <Col lg={1} className="text-end ms-auto">
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="filter_btn"
                  align="end"
                >
                  <img src={Filter} alt="" className="TBfilter_icon" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="drop_style">
                  <p className="apply_filter_text">Apply Filter:</p>
                  <Dropdown.Item href="#/action-1">
                    {" "}
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Opening Balance"
                      className="check_text"
                    />
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-1">
                    {" "}
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Closing Balance"
                      className="check_text"
                    />
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-1">
                    {" "}
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Transactions"
                      className="check_text"
                    />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
