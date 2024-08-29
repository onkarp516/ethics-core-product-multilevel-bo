import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
} from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  createBankMaster,
  getBankMasterOutlet,
  updateBankMaster,
  getBankMaster,
  deleteBankMaster,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  ShowNotification,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  eventBus,
  OnlyEnterNumbers,
  allEqual,
} from "@/helpers";
import axios from "axios";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import delete_icon from "@/assets/images/delete_icon3.png";

import mousetrap from "mousetrap";
import "mousetrap-global-bind";

class BankMaster extends React.Component {
  constructor(props) {
    super(props);

    this.bankMasterRef = React.createRef();
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.nameInput = React.createRef();
    this.inputRefs = [];

    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
      showloader: true,
      data: [],
      getBankMasters: [],
      orgData: [],
      initVal: {
        id: "",
        bank_name: "",
        account_number: "",
        branch: "",
      },
      errorArrayBorder: "",
    };
  }

  pageReload = () => {
    this.setInitValue();
    this.componentDidMount();
    this.handleSearch("");
    console.log("in pageReload");
    this.myRef.current.resetForm();
  };

  letBankMasterlst = () => {
    this.setState({ showloader: true });
    console.log("showloader->", this.state.showloader);
    getBankMasterOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              getBankMasters: res.responseObject,
              orgData: res.responseObject,
              showloader: false,
            },
            () => {

              this.bankMasterRef.current.setFieldValue("search", "");
              setTimeout(() => {
                document.getElementById("bank_name").focus();
              }, 1500);
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ getBankMasters: [] });
      });
  };

  handleSearch = (vi) => {
    this.setState({ search: vi }, () => {
      let { orgData } = this.state;
      console.log({ orgData });
      let orgData_F = orgData.filter(
        (v) =>
          (v.bankName != null &&
            v.accountNumber != null &&
            v.branch != null &&
            v.bankName.toLowerCase().includes(vi.toLowerCase())) ||
          v.accountNumber.toString().includes(vi) ||
          v.branch.toString().includes(vi)
      );
      console.log("vi.length ", vi.length, orgData_F);
      if (vi.length == 0) {
        this.setState({

          getBankMasters: orgData,
        });
      } else {
        this.setState({

          getBankMasters: orgData_F.length > 0 ? orgData_F : [],
        });
      }
    });
  };
  backtomainpage = () => {
    let { edit_data } = this.state;
    console.log("ESC:2", edit_data);
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

  deleteBankMaster = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    deleteBankMaster(formData)
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
      this.setInitValue();
      this.letBankMasterlst();
      window.addEventListener("keydown", this.handleAltKeyDisable);
    }
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleAltKeyDisable);
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
      bank_name: "",
      account_number: "",
      branch: "",
    };
    this.setState({ initVal: initVal, opendiv: false, errorArrayBorder: "" });
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    getBankMaster(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;
          let initVal = {
            id: res.id,
            bank_name: res.bankName,
            account_number: res.accountNumber,
            branch: res.branch,
          };
          this.setState({ initVal: initVal, opendiv: true }, () => {
            document.getElementById("bank_name").focus();
          });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => { });
  };
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

  handleTableRow(event) {
    const t = event.target;
    let {
      ledgerModalStateChange,
      transactionType,
      invoice_data,
      ledgerData,
    } = this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
        if (isActionExist("bank-master", "edit", this.props.userPermissions)) {
          this.handleFetchData(selectedLedger.id);
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
    }
  }
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  handleKeyDown = (e, index) => {

    if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index).focus();

    }
    if (e.keyCode === 37) {

    }
    if (e.altKey && e.keyCode === 83) {
      const index = ("submit")
      document.getElementById(index).focus();
    }
    if (e.altKey && e.keyCode === 67) {
      const index = ("cancel")
      document.getElementById(index).focus();
    }
  };


  render() {
    const {
      initVal,
      opendiv,
      errorArrayBorder,
      getBankMasters,
    } = this.state;
    return (
      <div className="ledger-group-style">
        <div className="main-div mb-2 m-0">
          <h4 className="form-header">Create Bank Master</h4>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            innerRef={this.myRef}
            initialValues={initVal}

            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log("value------->", values);

              // validation start
              let errorArray = [];
              if (values.bank_name.trim() == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              // validation end

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  let requestData = new FormData();
                  if (values.id != "") {
                    requestData.append("id", values.id);
                  }
                  requestData.append("bankName", values.bank_name);
                  requestData.append("accountNumber", values.account_number);
                  requestData.append("branch", values.branch);
                  if (values.id == "") {
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to Submit",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          createBankMaster(requestData)
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

                                this.pageReload();
                                resetForm();

                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: "Error in Bank Master Creation",
                                  is_button_show: true,
                                });
                              }
                            })
                            .catch((error) => {
                              MyNotifications.fire({
                                show: true,
                                icon: "error",
                                title: "Error",

                                is_button_show: true,
                              });
                            });
                        },
                        handleFailFn: () => { },
                      },
                      () => {
                        console.warn("return_data");
                      }
                    );
                  } else {
                    requestData.append("id", values.id);
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to Update ?",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          updateBankMaster(requestData)
                            .then((response) => {
                              // debugger;
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
                                // this.handleModal(false);
                                this.pageReload();
                                resetForm();
                                // this.props.handleRefresh(true);
                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: res.message,
                                  is_button_show: true,
                                });
                              }
                            })

                            .catch((error) => {
                              setSubmitting(false);
                              console.log("error", error);
                            });
                        },
                        handleFailFn: () => { },
                      },
                      () => {
                        console.warn("return_data");
                      }
                    );
                  }
                }
              });
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
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                noValidate
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
              >
                <Row
                  style={{ background: "#CEE7F1" }}
                  className="row_padding p-2"
                >
                  <Col lg={4} md={4} sm={4} xs={4}>
                    <Row>
                      <Col lg={3} md={3} sm={3} xs={3}>
                        <Form.Label>
                          Bank Name<span className="text-danger">*</span>
                        </Form.Label>
                      </Col>
                      <Col lg={9} md={9} sm={9} xs={9}>
                        <Form.Group>
                          <Form.Control

                            autoComplete="nope"
                            autoFocus="off"
                            type="text"
                            placeholder="Bank Name"
                            name="bank_name"

                            className={`${values.bank_name == "" &&
                              errorArrayBorder[0] == "Y"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            onBlur={(e) => {
                              e.preventDefault();
                              if (e.target.value.trim()) {
                                this.setErrorBorder(0, "");
                              } else {
                                this.setErrorBorder(0, "Y");

                              }
                            }}
                            onInput={(e) => {
                              e.target.value = this.getDataCapitalised(
                                e.target.value
                              );
                            }}

                            onKeyDown={(e) => {
                              if (e.target.value === "") { }
                              else { this.handleKeyDown(e, "account_number") }
                            }}
                            id="bank_name"
                            onChange={handleChange}

                            value={values.bank_name}
                            isValid={touched.bank_name && !errors.bank_name}
                            isInvalid={!!errors.bank_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bank_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={2} md={2} sm={2} xs={2}>
                    <Row>
                      <Col lg={5} md={5} sm={5} xs={5} className="p-0">
                        <Form.Label>Account Number</Form.Label>
                      </Col>
                      <Col lg={7} md={7} sm={7} xs={7}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            autoComplete="off"
                            placeholder="Account number"
                            name="account_number"
                            className="text-box"
                            id="account_number"
                            onChange={handleChange}
                            value={values.account_number}
                            isValid={touched.account_number && !errors.account_number}
                            isInvalid={!!errors.account_number}

                            onKeyDown={(e) => this.handleKeyDown(e, "branch")}
                          />{" "}
                          <Form.Control.Feedback type="invalid">
                            {errors.account_number}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={2} md={2} sm={2} xs={2}>
                    <Row>
                      <Col lg={4} md={4} sm={4} xs={4}>
                        <Form.Label>Branch</Form.Label>
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={8}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Branch"
                            autoComplete="off"
                            name="branch"
                            className="text-box"
                            id="branch"
                            onChange={handleChange}
                            value={values.branch}
                            isValid={touched.branch && !errors.branch}
                            isInvalid={!!errors.branch}
                            // ref={(input) => (this.inputRefs[2] = input)}
                            onKeyDown={(e) => this.handleKeyDown(e, "submit")}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.branch}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col md="4" className="my-auto text-end">
                    <Button
                      className="submit-btn"
                      id="submit"
                      type="submit"
                      // ref={(input) => (this.inputRefs[3] = input)}
                      onKeyDown={(e) => {
                        this.handleKeyDown(e, "cancel");
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.myRef.current.handleSubmit();
                        }
                      }}
                    >
                      {values.id == "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      id="cancel"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ opendiv: !opendiv }, () => {
                          MyNotifications.fire(
                            {
                              show: true,
                              icon: "confirm",
                              title: "Confirm",
                              msg: "Do you want to Clear",
                              is_button_show: false,
                              is_timeout: false,
                              delay: 0,
                              handleSuccessFn: () => {
                                this.pageReload();
                                resetForm();
                              },
                              handleFailFn: () => {

                              },
                            },
                            () => {
                              console.warn("return_data");
                            }
                          );
                        });
                      }}
                      // ref={(input) => (this.inputRefs[4] = input)}
                      onKeyDown={(e) => {

                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode == 13) {
                          this.setState({ opendiv: !opendiv }, () => {
                            MyNotifications.fire(
                              {
                                show: true,
                                icon: "confirm",
                                title: "Confirm",
                                msg: "Do you want to Clear",
                                is_button_show: false,
                                is_timeout: false,
                                delay: 0,
                                handleSuccessFn: () => {
                                  this.pageReload();
                                  resetForm();
                                },
                                handleFailFn: () => {
                                  // eventBus.dispatch(
                                  //   "page_change",
                                  //   "tranx_sales_invoice_list"
                                  // );
                                },
                              },
                              () => {
                                console.warn("return_data");
                              }
                            );
                          });
                        }
                        else {
                          this.handleKeyDown(e, "bank_name")
                        }
                      }}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
                <Row></Row>
              </Form>
            )}
          </Formik>
        </div>
        <div className="cust_table">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            // innerRef={this.taxRef}
            innerRef={this.bankMasterRef}
            initialValues={{ search: "" }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              // groupName: Yup.string().trim().required("Group name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => { }}
          >
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
            }) => (
              // {!opendiv && (
              <Form>
                <Row className="">
                  <Col md="3">
                    {/* <Form>
                      <Form.Group className="mt-1" controlId="formBasicSearch">
                        <Form.Control
                          type="text"
                          placeholder="Search"
                          className="search-box"
                          id="search"
                          name="search"
                          onChange={(e) => {
                            let v = e.target.value;
                            console.log({ v });
                            setFieldValue("search", v);
                            this.handleSearch(v);
                          }}
                          value={values.search}
                        />
                        <Button type="submit">x</Button>
                      </Form.Group>
                    </Form> */}
                    <InputGroup className="mb-2 mdl-text">
                      <Form.Control
                        placeholder="Search"
                        // aria-label="Search"
                        // aria-describedby="basic-addon1"
                        id="Search"
                        className="mdl-text-box"
                        autoComplete="nope"
                        // autoFocus="true"
                        onChange={(e) => {
                          let v = e.target.value;
                          this.handleSearch(v);
                          // if(v == ""){
                          //   document.getElementById("Search").focus();
                          // }
                        }}
                      />
                      <InputGroup.Text className="int-grp" id="basic-addon1">
                        <img className="srch_box" src={search} alt="" />
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>

                  <Col md="9" className="mt-2 text-end">
                    {/* {this.state.hide == 'true'} */}
                    {/* <Button
                      className="ml-2 btn-refresh"
                      onClick={(e) => {
                        console.log("button clicked");
                        // debugger;
                        e.preventDefault();
                        this.pageReload();
                        resetForm();
                      }}
                    >
                      <img src={refresh} alt="icon" />
                    </Button> */}
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
          {/* )} */}

          <div className="tbl-list-style">
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
                  <th>Bank Name</th>
                  {/* <th>RATIO</th> */}
                  <th>Account Number</th>
                  <th>Branch</th>
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
                    document.getElementById("Search").focus();
                  }
                  if (e.keyCode != 9) {
                    this.handleTableRow(e);
                  }
                }}
              >
                {/* <div className="scrollban_new"> */}
                {getBankMasters.length > 0 ? (
                  getBankMasters.map((v, i) => {
                    return (
                      <tr
                        value={JSON.stringify(v)}
                        id={`ledgerTr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                        // onDoubleClick={(e) => {
                        //   e.preventDefault();
                        //   this.handleFetchData(v.id);
                        // }}

                        onDoubleClick={(e) => {
                          if (
                            isActionExist(
                              "bank-master",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handleFetchData(v.id);
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
                        {/* <td style={{ width: "5%" }}>{i + 1}</td> */}

                        {/* <td>{v.hsnno}</td> */}
                        <td>{v.bankName}</td>
                        <td>{v.accountNumber}</td>
                        <td>{v.branch}</td>
                        {/* <td>
                          {" "}
                          <img
                            src={delete_icon}
                            className="del_icon"
                            title="Delete"
                            onClick={(e) => {
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
                                    this.deleteBankMaster(v.id);
                                  },
                                  handleFailFn: () => { },
                                },
                                () => {
                                  console.warn("return_data");
                                }
                              );
                            }}
                          />
                        </td> */}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
                {/* </div> */}
              </tbody>
              <thead
                className="tbl-footer"
                style={{ borderTop: "2px solid transparent" }}
              >
                <tr>
                  <th colSpan={3}>
                    {Array.from(Array(1), (v) => {
                      return (
                        <tr>
                          {/* <th>&nbsp;</th> */}
                          <th>Total Bank Master List :</th>
                          <th>{getBankMasters.length}</th>
                        </tr>
                      );
                    })}
                  </th>
                </tr>
              </thead>
            </Table>
            {/* )} */}
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

export default connect(mapStateToProps, mapActionsToProps)(BankMaster);
