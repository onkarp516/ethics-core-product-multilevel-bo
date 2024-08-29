import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";
import {
  updatePacking,
  getPackings,
  createPacking,
  getPackingById,
} from "@/services/api_functions";
import {
  getHeader,
  ShowNotification,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  alphaNumericRex,
} from "@/helpers";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Package extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.packageRef = React.createRef();
    this.nameInput = React.createRef();
    this.state = {
      data: [],
      orgData: [],
      getpactable: [],
      initVal: {
        id: "",
        packing_name: "",
      },
    };
  }

  lstPackings = () => {
    getPackings()
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

    let orgData_F = orgData.filter(
      (v) => v.packing_name.toString().includes(vi.toString())
      // v.packing_name.toLowerCase().includes(vi.toLowerCase())
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
      packing_name: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.nameInput.current.focus();
      this.lstPackings();
      this.setInitValue();
    }
  }

  pageReload = () => {
    this.setInitValue();
    this.componentDidMount();
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    getPackingById(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.data;

          let initVal = {
            id: res.id,
            packing_name: res.name,
            // unitCode: res.unitCode ? getValue(uomoption, res.unitCode) : "",
          };
          this.setState({ initVal: initVal, opendiv: true });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  componentDidUpdate(prevProps, prevState) {
    this.nameInput.current.focus();
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  render() {
    const { show, data, initVal, opendiv, getpactable, showDiv } = this.state;
    return (
      <div className="ledger-group-style">
        <div className="main-div mb-2 m-0">
          <h4 className="form-header">Create Package</h4>
          <Formik
            innerRef={this.myRef}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              packing_name: Yup.string()
                .trim()
                // .matches(alphaNumericRex, "Invalid Package")
                .required("Packing name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    let requestData = new FormData();
                    requestData.append("packing_name", values.packing_name);

                    if (values.id == "") {
                      createPacking(requestData)
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
                            this.myRef.current.resetForm();
                            this.props.handleRefresh(true);
                            this.pageReload();
                          } else if (res.responseStatus == 409) {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
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
                        .catch((error) => {});
                    } else {
                      requestData.append("id", values.id);
                      updatePacking(requestData)
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
                            this.myRef.current.resetForm();
                            this.props.handleRefresh(true);
                            this.pageReload();
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
                        .catch((error) => {});
                    }
                  },
                  handleFailFn: () => {},
                },
                () => {
                  console.warn("return_data");
                }
              );
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
                  <Col md={1} className="pe-0">
                    <Form.Label>Package Name</Form.Label>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Control
                        // autoFocus="true"
                        ref={(input) => {
                          this.nameInput.current = input;
                        }}
                        type="text"
                        placeholder="Package Name"
                        name="packing_name"
                        className="text-box"
                        id="packing_name"
                        onChange={handleChange}
                        value={values.packing_name}
                        isValid={touched.packing_name && !errors.packing_name}
                        isInvalid={!!errors.packing_name}
                      />
                      {/* <Form.Control.Feedback type="invalid"> */}
                      <span className="text-danger errormsg">
                        {errors.packing_name}
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
              <Form autoComplete="off">
                <Row className="p-2">
                  <Col md="3">
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
                        this.props.handleRefresh(true);
                      }}
                    >
                      <img src={refresh} alt="icon" />
                    </Button>
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
                    <th style={{ width: "38%" }}>Package Name</th>
                  </tr>
                  {/* </div> */}
                </thead>
                <tbody style={{ borderTop: "2px solid transparent" }}>
                  {getpactable.length > 0 ? (
                    getpactable.map((v, i) => {
                      return (
                        <tr
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
                          <td style={{ width: "38%" }}>{v.name}</td>
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
                            <th style={{ width: "25%" }}>Total Package :</th>
                            <td style={{ width: "60%" }}>
                              {getpactable.length}
                            </td>
                          </tr>
                        );
                      })}
                    </th>
                  </tr>
                </thead>
              </Table>
            )}
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

export default connect(mapStateToProps, mapActionsToProps)(Package);
