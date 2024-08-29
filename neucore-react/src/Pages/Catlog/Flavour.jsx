import React, { Component } from "react";
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
import {
  updateFlavour,
  getFlavour,
  createFlavour,
  getFlavourById,
} from "@/services/api_functions";
import {
  getHeader,
  ShowNotification,
  AuthenticationCheck,
  customStyles,
  getValue,
  isActionExist,
  eventBus,
  MyNotifications,
  only_alphabets,
} from "@/helpers";
import Select from "react-select";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Flavour extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.packageRef = React.createRef();
    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
      data: [],
      orgData: [],
      getpactable: [],
      initVal: {
        id: "",
        flavour_name: "",
      },
    };
  }

  lstPackings = () => {
    console.log("Hi---");
    getFlavour()
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            this.setState({ getpactable: data, orgData: data }, () => {
              this.packageRef.current.setFieldValue("search", "");
            });
          }
        }
      })
      .catch((error) => {});
  };
  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter((v) =>
      v.flavour_name.toLowerCase().includes(vi.toLowerCase())
    );
    if (vi.length == 0) {
      this.setState({
        getpactable: orgData,
      });
    } else {
      this.setState({
        getpactable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  setInitValue = () => {
    let initVal = {
      id: "",
      flavour_name: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPackings();
      this.setInitValue();
    }
  }

  pageReload = () => {
    this.setInitValue();
    this.componentDidMount();
    this.myRef.current.resetForm();
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    getFlavourById(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.data;

          let initVal = {
            id: res.id,
            flavour_name: res.flavour_name,
            // unitCode: res.unitCode ? getValue(uomoption, res.unitCode) : "",
          };
          this.setState({ initVal: initVal, opendiv: true });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  callPrint = () => {
    var newWin = window.frames["printf"];
    var divToPrint = document.getElementById("printDiv");
    let data = divToPrint.outerHTML;
    let htmlToPrint = '<body onload="window.print()">';
    htmlToPrint += data;
    htmlToPrint += "</body>";
    // newWin.focos();
    // newWin.document.print();
    newWin.document.write(htmlToPrint);
    // newWin.print();
    // newWin.close();
    newWin.document.close();
  };
  printSingleFunc = (DivID) => {
    var divToPrint = document.getElementById(DivID);

    var htmlToPrint =
      "" +
      '<style type="text/css">' +
      "table{" +
      "width: 100%;" +
      "border: 1px solid;" +
      "border-right: none;" +
      "border-bottom: none;" +
      "border-collapse: collapse;" +
      "margin-bottom: 5px;" +
      "}" +
      // ".cart_tbl{" +
      // "width: 50%;" +
      // "float: left;" +
      // "}" +
      "table td{" +
      "text-align:right;" +
      "border-right:1px solid #000;" +
      "border-bottom:1px solid #000;" +
      "padding:0.5em;" +
      "}" +
      "table th{" +
      "text-align:right;" +
      "border-right:1px solid #000;" +
      "border-bottom:1px solid #000;" +
      "padding:0.5em;" +
      "}" +
      ".lot_type h6{" +
      // "display:inline-block;" +
      "text-transform: uppercase;" +
      "font-size: 13px;" +
      "}" +
      ".div3 h3{" +
      "margin-top:0;" +
      "margin-bottom:0;" +
      "}" +
      ".div1{" +
      "display:inline-block;" +
      "}" +
      ".div2{" +
      "display:inline-block;" +
      "float:right;" +
      "}" +
      ".div3{" +
      "display:inline-block;" +
      "}" +
      ".div4{" +
      "display:inline-block;" +
      "}" +
      ".lot_type h5{" +
      // "display:inline-block;" +
      // "float:left;" +
      "}" +
      ".float-right{" +
      "float:right;" +
      "}" +
      ".cart_tbl{" +
      "margin-bottom:25px;" +
      "width: 49%;" +
      "margin-right: 11px;" +
      "overflow: hidden;" +
      "display: inline-block;" +
      "vertical-align: top;" +
      "}" +
      "</style>";

    htmlToPrint += divToPrint.outerHTML;
    // let data = divToPrint.outerHTML;
    // let newWin = window.open("");
    // selected_customer_list.length
    // newWin.document.write(htmlToPrint);
    // newWin.print();
    // newWin.close();
    // let window = Neutralino.window.create("https://localhost:7167/", {
    //   enableInspector: false,
    //   width: 500,
    //   height: 300,
    //   maximizable: false,
    //   hidden: false,
    //   exitProcessOnClose: true,
    // });

    // window.events.on("ready", (event) => {
    //   console.log("new window ready");
    // });
  };
  render() {
    const { show, data, initVal, opendiv, getpactable, showDiv } = this.state;
    return (
      <div className="ledger-group-style">
        <div className="main-div mb-2 m-0">
          <h4 className="form-header">Create Flavour</h4>
          <Formik
            innerRef={this.myRef}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              flavour_name: Yup.string()
                .trim()
                .matches(only_alphabets, "Enter only alphabet")
                .required("flavours name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();
              requestData.append("flavour_name", values.flavour_name);
              // MyNotifications.fire(
              //   {
              //     show: true,
              //     icon: "confirm",
              //     title: "Confirm",
              //     msg: "Do you want to save",
              //     is_button_show: false,
              //     is_timeout: false,
              //     delay: 0,
              //     handleSuccessFn: () => {
              //       if (values.id == "") {
              //         createFlavour(requestData)
              //           .then((response) => {
              //             let res = response.data;
              //             if (res.responseStatus == 200) {
              //               //  ShowNotification("Success", res.message);
              //               //  this.myRef.current.resetForm();
              //               MyNotifications.fire({
              //                 show: true,
              //                 icon: "success",
              //                 title: "Success",
              //                 msg: res.message,
              //                 is_timeout: true,
              //                 delay: 1000,
              //               });
              //               this.setInitValue();
              //               this.pageReload();
              //               resetForm();
              //               this.handleModalStatus(false);
              //               this.props.handleRefresh(true);
              //             } else {
              //               //ShowNotification("Error", res.message);
              //               MyNotifications.fire({
              //                 show: true,
              //                 icon: "error",
              //                 title: "Error",
              //                 msg: res.message,
              //                 is_timeout: true,
              //                 delay: 1000,
              //               });
              //               this.myRef.current.resetForm();
              //               this.pageReload();
              //             }
              //           })
              //           .catch((error) => {});
              //       } else {
              //         requestData.append("id", values.id);
              //         updateFlavour(requestData)
              //           .then((response) => {
              //             let res = response.data;
              //             if (res.responseStatus == 200) {
              //               ShowNotification("Success", res.message);
              //               //this.myRef.current.resetForm();
              //               this.setInitValue();
              //               this.pageReload();
              //               this.handleModalStatus(false);
              //               resetForm();
              //               this.props.handleRefresh(true);
              //             } else {
              //               ShowNotification("Error", res.message);
              //             }
              //           })
              //           .catch((error) => {});
              //       }
              //     },
              //     handleFailFn: () => {
              //       // this.myRef.current.resetForm();
              //       // this.setInitValue();
              //       // this.pageReload();
              //     },
              //   },
              //   () => {
              //     console.warn("return_data");
              //   }
              // );

              if (values.id == "") {
                createFlavour(requestData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      //  ShowNotification("Success", res.message);
                      //  this.myRef.current.resetForm();
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to save",
                          is_button_show: false,
                          is_timeout: false,
                          delay: 0,
                          handleSuccessFn: () => {
                            MyNotifications.fire({
                              show: true,
                              icon: "success",
                              title: "Success",
                              msg: res.message,
                              is_timeout: true,
                              delay: 1000,
                            });
                            this.setInitValue();
                            this.pageReload();
                            resetForm();
                            // this.handleModalStatus(false);
                            this.props.handleRefresh(true);
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
                    } else {
                      //ShowNotification("Error", res.message);
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: res.message,
                        is_timeout: true,
                        delay: 1000,
                      });
                      this.myRef.current.resetForm();
                      this.pageReload();
                    }
                  })
                  .catch((error) => {});
              } else {
                requestData.append("id", values.id);
                updateFlavour(requestData)
                  .then((response) => {
                    let res = response.data;
                    if (res.responseStatus == 200) {
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to update",
                          is_button_show: false,
                          is_timeout: false,
                          delay: 0,
                          handleSuccessFn: () => {
                            MyNotifications.fire({
                              show: true,
                              icon: "success",
                              title: "Success",
                              msg: res.message,
                              is_timeout: true,
                              delay: 1000,
                            });
                            // this.myRef.current.resetForm();
                            // this.setInitValue();
                            // this.pageReload();

                            //this.myRef.current.resetForm();
                            this.setInitValue();
                            this.pageReload();
                            // this.handleModalStatus(false);
                            resetForm();
                            this.props.handleRefresh(true);
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
                    } else {
                      ShowNotification("Error", res.message);
                    }
                  })
                  .catch((error) => {});
              }
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
                autoComplete="off"
              >
                <Row style={{ background: "#CEE7F1" }} className="p-2">
                  <Col md={1}>
                    <Form.Label>Flavour Name</Form.Label>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Control
                        autoFocus="true"
                        // ref={(input) => {
                        //   input && input.focus();
                        // }}
                        type="text"
                        placeholder="Flavour Name"
                        name="flavour_name"
                        className="text-box"
                        id="flavour_name"
                        onChange={handleChange}
                        value={values.flavour_name}
                        isValid={touched.flavour_name && !errors.flavour_name}
                        isInvalid={!!errors.flavour_name}
                      />
                      {/* <Form.Control.Feedback type="invalid"> */}
                      <span className="text-danger errormsg">
                        {errors.flavour_name}
                      </span>
                      {/* </Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>
                  <Col md={8} className="my-auto btn_align">
                    <Button className="submit-btn ms-2" type="submit">
                      {values.id == "" ? "Save" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        MyNotifications.fire(
                          {
                            show: true,
                            icon: "confirm",
                            title: "Confirm",
                            msg: "Do you want to cancel",
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
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
        <div className="cust_table">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.packageRef}
            initialValues={{ search: "" }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              // groupName: Yup.string().trim().required("Group name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm,
            }) => (
              // {!opendiv && (
              <Form autoComplete="off">
                <Row className="p-2">
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
                    <InputGroup className="mb-3">
                      <Form.Control
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        style={{ borderRight: "none" }}
                        onChange={(e) => {
                          this.handleSearch(e.target.value);
                        }}
                      />
                      <InputGroup.Text
                        className="input_gruop"
                        id="basic-addon1"
                      >
                        <img className="srch_box" src={search} alt="" />
                      </InputGroup.Text>
                    </InputGroup>
                  </Col>
                  <Col md="9" className="mt-2 text-end">
                    <Button
                      className="ms-2 btn-refresh"
                      onClick={(e) => {
                        e.preventDefault();
                        this.pageReload();
                        //  resetForm();
                        this.props.handleRefresh(true);
                      }}
                    >
                      <img src={refresh} alt="icon" />
                    </Button>
                    {/* <Button
                      className="ms-2 refresh-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        // this.pageReload();
                        // this.setState({ show: true });

                        this.callPrint();
                      }}
                    >
                      Print
                    </Button> */}
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>

          <div className="tbl-list-style">
            {/* {getunittable.length > 0 && ( */}
            {isActionExist("package", "list", this.props.userPermissions) && (
              <Table
                // hover
                size="sm"
                // className="tbl-font"
                //responsive
              >
                <thead>
                  {/* <div className="scrollbar_hd"> */}
                  <tr>
                    {/* {this.state.showDiv && ( */}
                    {/* <th style={{ width: "10%" }}>Sr#</th> */}
                    {/* )} */}
                    <th style={{ width: "38%" }}>Flavour Name</th>
                  </tr>
                  {/* </div> */}
                </thead>
                <tbody style={{ borderTop: "2px solid transparent" }}>
                  {getpactable.length > 0 ? (
                    getpactable.map((v, i) => {
                      return (
                        <tr
                          // onDoubleClick={(e) => {
                          //   e.preventDefault();
                          //   this.handleFetchData(v.id);
                          // }}

                          onDoubleClick={(e) => {
                            if (
                              isActionExist(
                                "package",
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
                          {/* <td style={{ width: "10%" }}>{i + 1}</td> */}
                          <td style={{ width: "38%" }}>{v.flavour_name}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
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
                            <th style={{ width: "25%" }}>Total Flavour :</th>
                            <td style={{ width: "60%" }}>
                              {getpactable.length}
                            </td>
                          </tr>
                        );
                      })}
                      .
                    </th>
                  </tr>
                </thead>
              </Table>
            )}
            {/* )} */}
            <iframe id="printf" name="printf" className="d-none"></iframe>
            <div id="printDiv" className="d-none">
              <h6>Woohoo, you're reading this text in a modal!</h6>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptas quas consequuntur, cupiditate, minus optio ratione ut
                modi vitae quasi enim, cumque delectus deserunt facere
                reprehenderit saepe! Et distinctio facere natus.
              </p>
            </div>
          </div>

          <Modal
            show={show}
            onHide={this.handleClose}
            animation={false}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <iframe id="printf" name="printf" className="d-none"></iframe>
              <div id="printDiv">
                <h6>Woohoo, you're reading this text in a modal!</h6>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas quas consequuntur, cupiditate, minus optio ratione ut
                  modi vitae quasi enim, cumque delectus deserunt facere
                  reprehenderit saepe! Et distinctio facere natus.
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  this.callPrint();
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
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

export default connect(mapStateToProps, mapActionsToProps)(Flavour);
