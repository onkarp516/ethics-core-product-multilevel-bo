import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  Collapse,
  InputGroup,
} from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  createTax,
  get_taxOutlet,
  updateTax,
  get_tax_master,
  validate_Tax,
  delete_product_tax,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faCirclePlus,
  faCircleQuestion,
  faFloppyDisk,
  faGear,
  faHouse,
  faPen,
  faPrint,
  faArrowUpFromBracket,
  faRightFromBracket,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  getHeader,
  ShowNotification,
  AuthenticationCheck,
  MyDatePicker,
  isActionExist,
  MyNotifications,
  eventBus,
  OnlyEnterNumbers,
  Accepts_numeric_regex,
  LoadingComponent,
  dateRegex,
  MyTextDatePicker,
  OnlyEnterAmount,
  allEqual,
} from "@/helpers";
import axios from "axios";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import delete_icon from "@/assets/images/delete_icon3.png";

import mousetrap from "mousetrap";
import "mousetrap-global-bind";

class Tax extends React.Component {
  constructor(props) {
    super(props);
    this.taxRef = React.createRef();
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.inputRefs = [];
    this.nameInput = React.createRef();

    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
      showloader: true,

      data: [],
      getTaxtable: [],
      orgData: [],
      initVal: {
        id: "",
        gst_per: "",
        sratio: "50%",
        igst: "",
        cgst: "",
        sgst: "",
      },
      errorArrayBorder: "",
    };
  }

  pageReload = () => {
    this.setInitValue();
    this.letTaxlst();
    this.handleSearch("");
    // console.log("in pageReload");
    this.myRef.current.resetForm();
  };

  validateTax = (gst_per) => {
    let requestData = new FormData();
    requestData.append("gst_per", gst_per);
    validate_Tax(requestData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          // console.log("res----", res);
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,
          });
        }
      })
      .catch((error) => { });
  };

  letTaxlst = () => {
    this.setState({ showloader: true });
    // console.log("showloader->", this.state.showloader);
    get_taxOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              getTaxtable: res.responseObject,
              orgData: res.responseObject,
              showloader: false,
            },
            () => {
              document.getElementById("searchTl").focus();
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ getTaxtable: [] });
      });
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    // console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        (v.gst_per != null && v.gst_per.toString().includes(vi)) ||
        (v.igst != null && v.igst.toString().includes(vi)) ||
        (v.cgst != null && v.cgst.toString().includes(vi)) ||
        (v.sgst != null && v.sgst.toString().includes(vi))
      // parseInt(v.gst_per) == vi.toLowerCase() ||
      // v.igst == vi ||
      // v.cgst == vi ||
      // v.sgst == vi
    );
    // console.log("vi.length ", vi.length, orgData_F);
    if (vi.length == 0) {
      this.setState({
        getTaxtable: orgData,
      });
    } else {
      this.setState({
        getTaxtable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };
  backtomainpage = () => {
    let { edit_data } = this.state;
    // console.log("ESC:2", edit_data);
    eventBus.dispatch("page_change", {
      from: "catlog",
      to: "dashboard",
      // prop_data: {
      //   hsnNumber: edit_data.hsnNumber,
      //   id: edit_data.id,
      // },
      isNewTab: false,
    });
  };

  movetoNext = (current, nextFieldID) => {
    if (current.value.length >= current.maxLength) {
      document.getElementById(nextFieldID).focus();
    }
  };

  deleteproducttax = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_product_tax(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 1500,
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

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.letTaxlst();
      // mousetrap.bindGlobal("esc", this.backtomainpage);

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }
  componentWillUnmount() {
    // mousetrap.unbindGlobal("esc", this.backtomainpage);
    // alt key button disabled start
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    // alt key button disabled end
  }

  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end

  componentDidUpdate(prevProps, prevState) {
    // this.nameInput.focus();

    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  setInitValue = () => {
    let initVal = {
      id: "",
      gst_per: "",
      sratio: "50%",
      igst: "",
      cgst: "",
      sgst: "",
      applicable_date: "",
    };
    this.setState(
      { initVal: initVal, opendiv: false, errorArrayBorder: "" },
      () => {
        setTimeout(() => {
          // document.getElementById("gst_per").focus();
        }, 1600);
      }
    );
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_tax_master(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;
          let p = moment(res.applicable_date, "YYYY-MM-DD").toDate();

          let initVal = {
            id: res.id,
            gst_per: res.gst_per,
            sratio: res.ratio,
            igst: res.igst,
            cgst: res.cgst,
            sgst: res.sgst,

            applicable_date:
              res.applicable_date != ""
                ? moment(new Date(p)).format("DD/MM/YYYY")
                : "",
          };
          this.setState({ initVal: initVal, opendiv: true }, () => {
            document.getElementById("gst_per").focus();
          });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => { });
  };

  // validation start
  // ! function set border to required fields
  setErrorBorder(index, value) {
    let { errorArrayBorder } = this.state;
    let errorArrayData = [];
    if (errorArrayBorder.length > 0) {
      errorArrayData = errorArrayBorder;
      if (errorArrayBorder.length >= index) {
        errorArrayData.splice(index, 1, value);
      } else {
        Array.from(Array(index), (v) => {
          errorArrayData.push(value);
        });
      }
    } else {
      {
        Array.from(Array(index + 1), (v) => {
          errorArrayData.push(value);
        });
      }
    }

    this.setState({ errorArrayBorder: errorArrayData });
  }
  // validation end

  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let { ledgerModalStateChange, transactionType, invoice_data, ledgerData } =
      this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));

        // console.warn("da->>>>>>>>>>>>>>>>>>down", val);

        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else {
      // if (k === 13) {
      //   let cuurentProduct = t;
      //   let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
      //   if (
      //     isActionExist("tax-management", "edit", this.props.userPermissions)
      //   ) {
      //     this.handleFetchData(selectedLedger.id);
      //   } else {
      //     MyNotifications.fire({
      //       show: true,
      //       icon: "error",
      //       title: "Error",
      //       msg: "Permission is denied!",
      //       is_button_show: true,
      //     });
      //   }
      // }
    }
  }

  render() {
    const {
      show,
      data,
      initVal,
      opendiv,
      gethsntable,
      showloader,
      showDiv,
      getTaxtable,
      errorArrayBorder,
    } = this.state;
    return (
      <div className="ledger-group-style">
        <div className="cust_table">
          <Row className=""
            onKeyDown={(e) => {
              if (e.keyCode === 40) {
                document.getElementById("taxTr_0")?.focus();
              }
            }}>
            <Col md="3">
              <InputGroup className="mb-2 mdl-text">
                <Form.Control
                  placeholder="Search"
                  id="searchTl"
                  // aria-label="Search"
                  // aria-describedby="basic-addon1"
                  className="mdl-text-box"
                  // autoFocus="true"
                  onChange={(e) => {
                    this.handleSearch(e.target.value);
                  }}
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box int-grp" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md="9" className="mt-2 text-end"></Col>
          </Row>

          <div className="tbl-list-style1">
            {/* {getTaxtable.length > 0 && ( */}
            <Table
              // hover
              size="sm"
            // className="tbl-font"
            // responsive
            >
              <thead>
                {/* <div className="scrollbar_hd"> */}
                <tr>
                  {/* {this.state.showDiv && ( */}
                  {/* <th>Sr.</th> */}
                  {/* )} */}

                  {/* <th>HSN No.</th> */}
                  <th>GST (%)</th>
                  {/* <th>RATIO</th> */}
                  <th>IGST (%)</th>
                  <th>CGST (%)</th>
                  <th>SGST (%)</th>
                  {/* <th>Action</th> */}
                </tr>
                {/* </div> */}
              </thead>
              <tbody
                style={{ borderTop: "2px solid transparent" }}
                className="prouctTableTr"
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.shiftKey && e.keyCode == 9) {
                    document.getElementById("searchTl").focus();
                  } else if (e.keyCode != 9) {
                    this.handleTableRow(e);
                  }
                }}
              >
                {/* <div className="scrollban_new"> */}
                {getTaxtable.length > 0 ? (
                  getTaxtable.map((v, i) => {
                    return (
                      <tr
                        value={JSON.stringify(v)}
                        id={`taxTr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                      >
                        {/* <td style={{ width: "5%" }}>{i + 1}</td> */}

                        {/* <td>{v.hsnno}</td> */}
                        <td>{v.gst_per} %</td>
                        {/* <td>{v.ratio}</td> */}
                        <td>{v.igst} %</td>
                        <td>{v.cgst} %</td>
                        <td>{v.sgst} %</td>
                        {/* <td>
                          {" "}
                          <img
                            src={delete_icon}
                            className="del_icon"
                            title="Delete"
                            onClick={(e) => {
                              if (
                                isActionExist(
                                  "tax",
                                  "delete",
                                  this.props.userPermissions
                                )
                              ) {
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
                                      this.deleteproducttax(v.id);
                                    },
                                    handleFailFn: () => { },
                                  },
                                  () => {
                                    console.warn("return_data");
                                  }
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
                          />
                        </td> */}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
                {/* </div> */}
              </tbody>
              {/* <thead
                className="tbl-footer mt-1"
                style={{ borderTop: "2px solid transparent" }}
              >
                <tr>
                  <th colSpan={3}>
                    {Array.from(Array(1), (v) => {
                      return (
                        <tr>
                          <th>Total Tax List :</th>
                          <th>{getTaxtable.length}</th>
                        </tr>
                      );
                    })}
                  </th>
                </tr>
              </thead> */}
            </Table>
            <Row className="style-footr">
              <Col md="10" className="my-auto">
                {/* <Row>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faHouse}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+A</span>
                        </Form.Label>
                      </Col>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faCirclePlus}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">F2</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faPen}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+E</span>
                        </Form.Label>
                      </Col>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faFloppyDisk}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+S</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+D</span>
                        </Form.Label>
                      </Col>

                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faCalculator}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Alt+C</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faGear}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">F11</span>
                        </Form.Label>
                      </Col>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faRightFromBracket}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+Z</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faPrint}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+P</span>
                        </Form.Label>
                      </Col>
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faArrowUpFromBracket}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Export</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faCircleQuestion}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">F1</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                </Row> */}
              </Col>
              <Col md="2" className="text-end">
                <Row>
                  <Col className="my-auto">
                    {Array.from(Array(1), (v) => {
                      return (
                        <>
                          <span>Tax:</span>
                          <span>{getTaxtable.length}</span>
                        </>
                      );
                    })}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapActionsToProps)(Tax);
