import React from "react";
import { Button, Col, Row, Form, InputGroup, Table } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  ShowNotification,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  createPro,
  eventBus,
  characterRegEx,
} from "@/helpers";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

import {
  update_filter,
  get_filter,
  get_filters_lists,
  create_filter,
  validate_filter,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.groupRef = React.createRef();
    this.state = {
      show: false,
      showDiv: false,
      opendiv: false,
      data: [],
      orgData: [],
      getfiltertable: [],
      initValue: { id: "", filterName: "" },
      brandModalShow: false,
      groupModalShow: false,
    };
  }

  setInitValue = () => {
    let initValue = { id: "", filterName: "" };
    this.setState({ initValue: initValue });
  };
  // validateGroup = (filterName) => {
  //   let requestData = new FormData();
  //   requestData.append("filterName", filterName);
  //   validate_group(requestData)
  //     .then((response) => {
  //       let res = response.data;

  //       if (res.responseStatus == 409) {
  //         console.log("res----", res);
  //         MyNotifications.fire({
  //           show: true,
  //           icon: "error",
  //           title: "Error",
  //           msg: res.message,
  //           is_button_show: true,
  //         });
  //       }
  //     })
  //     .catch((error) => {});
  // };
  validateFilter = (filterName) => {
    let requestData = new FormData();
    requestData.append("filterName", filterName);
    validate_filter(requestData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          console.log("res----", res);
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
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    console.log("id", id);
    reqData.append("id", id);
    get_filter(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          this.setState({ initValue: result.responseObject, opendiv: true });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  letfilterlst = () => {
    get_filters_lists()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            { getfiltertable: res.responseObject, orgData: res.responseObject },
            () => {}
          );
        }
      })
      .catch((error) => {});
  };
  handleModal = (status) => {
    if (status == true) {
      this.setInitValue();
    }
    this.setState({ show: status }, () => {});
  };

  backtomainpage = () => {
    let { edit_data } = this.state;
    console.log("ESC:2", edit_data);
    eventBus.dispatch("page_change", {
      from: "catlog",
      to: "dashboard",
      isNewTab: false,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }
  componentWillUnmount() {
    // mousetrap.unbindGlobal("esc", this.backtomainpage);
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setInitValue();
      this.letfilterlst();
      // mousetrap.bindGlobal("esc", this.backtomainpage);
    }
  }

  pageReload = () => {
    this.componentDidMount();
    this.myRef.current.resetForm();
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter((v) =>
      v.filterName.toLowerCase().includes(vi.toLowerCase())
    );
    if (vi.length == 0) {
      this.setState({
        getfiltertable: orgData,
      });
    } else {
      this.setState({
        getfiltertable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  render() {
    const { initValue, getfiltertable } = this.state;

    return (
      <div className="ledger-group-style m-0 ledger-group-height-style">
        <div className="main-div mb-2 m-0">
          {/* <h4 className="form-header">Create Group</h4> */}

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.myRef}
            initialValues={initValue}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              filterName: Yup.string()
                .nullable()
                .trim()
                .matches(characterRegEx, "Enter only alphabet")
                .required("filter Name is required"),
            })}
            onSubmit={(values, { setSubmitting, pageReload }) => {
              let requestData = new FormData();
              requestData.append("filterName", values.filterName);

              if (values.id == "") {
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
                      create_filter(requestData)
                        .then((response) => {
                          // debugger;
                          let res = response.data;
                          console.log("res", res);
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
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",

                            is_button_show: true,
                          });
                        });
                    },
                    handleFailFn: () => {},
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
                    msg: "Do you want to update",
                    is_button_show: false,
                    is_timeout: false,
                    delay: 0,
                    handleSuccessFn: () => {
                      update_filter(requestData)
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
                            // this.handleModal(false);
                            this.pageReload();
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
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",

                            is_button_show: true,
                          });
                        });
                    },
                    handleFailFn: () => {},
                  },
                  () => {
                    console.warn("return_data");
                  }
                );
              }
            }}
          >
            {({ values, errors, handleChange, handleSubmit, resetForm }) => (
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                autoComplete="off"
              >
                <Row style={{ background: "#CEE7F1" }} className="p-2">
                  <Col md={3}>
                    <Row>
                      <Col md={4}>
                        <Form.Label className="pe-0 lbl">
                          Filter Name:
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="">
                          <Form.Control
                            className="text-box:focus"
                            placeholder="Filter Name"
                            ref={(input) => {
                              input && input.focus();
                            }}
                            onBlur={(e) => {
                              e.preventDefault();
                              this.validateFilter(values.filterName);
                            }}
                            onChange={handleChange}
                            name="filterName"
                            id="filterName"
                            styles={createPro}
                            value={values.filterName}
                          />
                          <span className="text-danger">
                            {errors.filterName}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={9} className="btn_align my-auto">
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
                            handleFailFn: () => {},
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
                <Button
                  className="ml-2 btn-refresh"
                  onClick={(e) => {
                    e.preventDefault();

                    this.pageReload();
                  }}
                >
                  <img src={refresh} alt="icon" />
                </Button>
              </Col>
            </Row>

            <div className="tbl-list-style">
              {isActionExist("group", "list", this.props.userPermissions) && (
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Filter Name</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: "2px solid transparent" }}>
                    {getfiltertable.length > 0 ? (
                      getfiltertable.map((v, i) => {
                        return (
                          <tr
                            onDoubleClick={(e) => {
                              if (
                                isActionExist(
                                  "group",
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
                            <td>{v.filterName}</td>
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
                              <th style={{ width: "25%" }}>Total Filter :</th>
                              <td style={{ width: "60%" }}>
                                {getfiltertable.length}
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

export default connect(mapStateToProps, mapActionsToProps)(Filters);
