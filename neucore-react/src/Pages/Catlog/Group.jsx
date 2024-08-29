import React from "react";
import { Button, Col, Row, Form, InputGroup, Table } from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";

import {
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  createPro,
  eventBus,
  only_alphabets,
  AlphabetwithSpecialChars,
} from "@/helpers";

import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";

import {
  createGroup,
  updateGroup,
  get_outlet_groups,
  get_groups_by_id,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
class Group extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.groupRef = React.createRef();
    this.nameInput = React.createRef();

    this.state = {
      data: [],
      orgData: [],
      getgrouptable: [],
      initValue: { id: "", groupName: "" },
    };
  }

  setInitValue = () => {
    let initValue = { id: "", groupName: "" };
    this.setState({ initValue: initValue });
  };

  handleFetchData = (id) => {
    console.log("id", id);
    let reqData = new FormData();
    reqData.append("id", id);
    get_groups_by_id(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          this.setState({ initValue: result.responseObject });
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
      .catch((error) => { });
  };

  letgrouplst = () => {
    get_outlet_groups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            getgrouptable: res.responseObject,
            orgData: res.responseObject,
          });
        }
      })
      .catch((error) => { });
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

  componentDidUpdate(prevProps, prevState) {
    this.nameInput.current.focus();
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }
  componentWillUnmount() {
    // mousetrap.unbindGlobal("esc", this.backtomainpage);
    //  mousetrap.unbindGlobal("esc", this.backtomainpage);
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.nameInput.current.focus();
      this.setInitValue();
      this.letgrouplst();
      // mousetrap.bindGlobal("esc", this.backtomainpage);
      //  mousetrap.bindGlobal("esc", this.backtomainpage);
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
      v.groupName.toLowerCase().includes(vi.toLowerCase())
    );
    if (vi.length == 0) {
      this.setState({
        getgrouptable: orgData,
      });
    } else {
      this.setState({
        getgrouptable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  render() {
    const { initValue, getgrouptable } = this.state;

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
              groupName: Yup.string()
                .trim()
                .matches(AlphabetwithSpecialChars, "Enter only alphabet")
                .required("Group name is required"),
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
                    requestData.append("groupName", values.groupName);
                    if (values.id == "") {
                      createGroup(requestData)
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
                        .catch((error) => { });
                    } else {
                      requestData.append("id", values.id);
                      updateGroup(requestData)
                        .then((response) => {
                          let res = response.data;
                          if (res.responseStatus == 200) {
                            MyNotifications.fire({
                              show: true,
                              icon: "success",
                              title: "Success",
                              msg: res.message,
                              is_button_show: true,
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
                        .catch((error) => { });
                    }
                  },
                  handleFailFn: () => { },
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
                        <Form.Label className="pe-0 lbl">
                          Group Name:
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="">
                          <Form.Control
                            ref={(input) => {
                              this.nameInput.current = input;
                            }}
                            className="text-box"
                            placeholder="Group Name"
                            // autoFocus={true}
                            // className="formhover"
                            onChange={handleChange}
                            name="groupName"
                            id="groupName"
                            styles={createPro}
                            value={values.groupName}
                          />
                          <span className="text-danger errormsg">
                            {errors.groupName}
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

                    this.pageReload();
                  }}
                >
                  <img src={refresh} alt="icon" />
                </Button>
              </Col>
            </Row>
            {/* )} */}

            <div className="tbl-list-style">
              {/* {getgrouptable.length > 0 && ( */}
              {isActionExist("group", "list", this.props.userPermissions) && (
                <Table size="sm">
                  <thead>
                    {/* <div className="scrollbar_hd"> */}
                    <tr>
                      {/* <th>Sr.</th> */}

                      <th>Group Name</th>
                    </tr>
                    {/* </div> */}
                  </thead>
                  <tbody style={{ borderTop: "2px solid transparent" }}>
                    {/* <div className="scrollban_new"> */}
                    {getgrouptable.length > 0 ? (
                      getgrouptable.map((v, i) => {
                        return (
                          <tr
                            //   e.preventDefault();
                            //   this.handleFetchData(v.id);
                            // }}
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
                            {/* <td>{i + 1}</td> */}
                            <td>{v.groupName}</td>
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
                      <th colSpan={4}>
                        {Array.from(Array(1), (v) => {
                          return (
                            <tr>
                              {/* <th>&nbsp;</th> */}
                              <th style={{ width: "25%" }}>Total Group :</th>
                              <td style={{ width: "60%" }}>
                                {getgrouptable.length}
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

export default connect(mapStateToProps, mapActionsToProps)(Group);
