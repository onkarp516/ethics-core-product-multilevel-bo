import React from "react";
import { Button, Col, Row, Form, InputGroup, Table } from "react-bootstrap";
import {
  AuthenticationCheck,
  MyNotifications,
  eventBus,
  isActionExist,
  only_alphabets,
  AlphabetwithSpecialChars,
} from "@/helpers";
import { Formik } from "formik";
import * as Yup from "yup";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

import {
  createBrand,
  getAllBrands,
  updateBrand,
  removeBrandlist,
  get_brand,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
class Brand extends React.Component {
  constructor(props) {
    super(props);
    this.brandRef = React.createRef();
    this.brandFormRef = React.createRef();
    this.nameInput = React.createRef();
    this.state = {
      brandList: [],
      data: [],
      orgData: [],
      initVal: {
        id: "",
        brandName: "",
      },
      brandModalShow: false,
    };
  }

  setInitValue = () => {
    let initVal = {
      id: "",
      brandName: "",
    };
    this.setState({ initVal: initVal });
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter((v) =>
      v.brandName.toLowerCase().includes(vi.toLowerCase())
    );

    if (vi.length == 0) {
      this.setState({
        brandList: orgData,
      });
    } else {
      this.setState({
        brandList: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  letbrandlst = () => {
    getAllBrands()
      .then((response) => {
        let res = response.data;
        console.log("rahul::res", res);
        if (res.responseStatus == 200) {
          this.setState(
            {
              brandList: res.responseObject,
              orgData: res.responseObject,
            },
            () => {
              this.brandRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ brandList: [] });
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

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.nameInput.current.focus();
      this.setInitValue();
      this.letbrandlst();
      // mousetrap.bindGlobal("esc", this.backtomainpage);
    }
  }

  componentWillUnmount() {
    // mousetrap.unbindGlobal("esc", this.backtomainpage);
  }

  componentDidUpdate(prevProps, prevState) {
    this.nameInput.current.focus();
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  pageReload = () => {
    this.componentDidMount();
    this.brandRef.current.resetForm();
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_brand(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let ob = result.responseObject;
          let initVal = {
            id: ob.id,
            brandName: ob.brandName,
          };
          this.setState({ initVal: initVal });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: result.message,
            is_button_show: true,
          });
        }
      })
      .catch((error) => {});
  };

  render() {
    const { initVal, brandList } = this.state;

    return (
      <div className="ledger-group-style m-0 ledger-group-height-style">
        <div className="main-div mb-2 m-0">
          {/* <h4 className="form-header">Create Brand</h4> */}
          {/* //Upper Desing Form */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.brandRef}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              brandName: Yup.string()
                .nullable()
                .trim()
                .matches(AlphabetwithSpecialChars, "Enter only alphabet")
                .required("Brand name is required"),
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
                    requestData.append("brandName", values.brandName);

                    if (values.id == "") {
                      createBrand(requestData)
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
                            resetForm();
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
                      updateBrand(requestData)
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
                            resetForm();
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
              setFieldValue,
              resetForm,
            }) => (
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                autoComplete="off"
              >
                <Row style={{ background: "#CEE7F1" }} className="p-2">
                  <Col md={3}>
                    <Row>
                      <Col md={4}>
                        <Form.Label className="lbl">Brand Name:</Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="">
                          <Form.Control
                            ref={(input) => {
                              this.nameInput.current = input;
                            }}
                            type="text"
                            placeholder=" Brand Name"
                            name="brandName"
                            id="brandName"
                            onChange={handleChange}
                            onInput={(e) => {
                              e.target.value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                            }}
                            value={values.brandName}
                            isValid={touched.brandName && !errors.brandName}
                            isInvalid={!!errors.brandName}
                            // styles={createPro}
                            // className="formhover"
                            className="text-box"
                          />
                          <span className="text-danger errormsg">
                            {errors.brandName}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        {/* <Button
                          className="add-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ groupModalShow: true });
                          }}
                        >
                          +
                        </Button> */}
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6" className="btn_align my-auto">
                    <Button className="submit-btn ms-2" type="submit">
                      {values.id == "" ? "Save" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn"
                      type="button"
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

          <div className="cust_table">
            <Row className="p-2">
              <Col md="2">
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
                  <InputGroup.Text className="input_gruop" id="basic-addon1">
                    <img className="srch_box" src={search} alt="" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col md="10" className="mt-2 text-end">
                {/* {this.state.hide == 'true'} */}
                <Button
                  className="ml-2 btn-refresh"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.handleRefresh(true);
                  }}
                >
                  <img src={refresh} alt="icon" />
                </Button>
              </Col>
            </Row>
            {/* )} */}
            <div className="tbl-list-style">
              {/* {brandList.length > 0 && ( */}
              {isActionExist(
                "sub-group",
                "list",
                this.props.userPermissions
              ) && (
                <Table size="sm">
                  <thead>
                    {/* <div className="scrollbar_hd"> */}
                    <tr>
                      {/* {this.state.showDiv && <th> #.</th>} */}
                      <th>Brand Name</th>
                    </tr>
                    {/* </div> */}
                  </thead>
                  <tbody style={{ borderTop: "2px solid transparent" }}>
                    {/* <div className="scrollban_new"> */}

                    {brandList.length > 0 ? (
                      brandList.map((v, i) => {
                        return (
                          <tr
                            // onDoubleClick={(e) => {
                            //   this.handleFetchData(v.id);
                            // }}

                            onDoubleClick={(e) => {
                              if (
                                isActionExist(
                                  "sub-group",
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
                            {/* <td>{i + 1}</td> */}
                            <td>{v.brandName}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colspan="3" className="text-center">
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
                      <th colSpan={4}>
                        {Array.from(Array(1), (v) => {
                          return (
                            <tr>
                              {/* <th>&nbsp;</th> */}
                              <th style={{ width: "25%" }}>Total Brand :</th>
                              <td style={{ width: "60%" }}>
                                {brandList.length}
                              </td>
                            </tr>
                          );
                        })}
                      </th>
                    </tr>
                  </thead>
                </Table>
              )}
              {/* )} */}
            </div>
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

export default connect(mapStateToProps, mapActionsToProps)(Brand);
