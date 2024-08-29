import React from "react";
import { Button, Col, Row, Form, InputGroup, Table } from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";
import {
  createCategory,
  getAllCategory,
  updateCategory,
  get_category_by_id,
} from "@/services/api_functions";

import {
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  createPro,
  only_alphabets,
  AlphabetwithSpecialChars,
} from "@/helpers";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.categoryFormRef = React.createRef();
    this.categoryRef = React.createRef();
    this.nameInput = React.createRef();
    this.state = {
      orgData: [],
      getcategorytable: [],
      data: [],
      initVal: {
        id: "",
        categoryName: "",
      },
    };
  }

  setInitValue = () => {
    let initVal = {
      id: "",
      categoryName: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };

  letcategorylst = () => {
    getAllCategory()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              getcategorytable: res.responseObject,
              orgData: res.responseObject,
            },
            () => {
              this.categoryRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ getcategorytable: [] });
      });
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter((v) =>
      v.categoryName.toLowerCase().includes(vi.toLowerCase())
    );
    if (vi.length == 0) {
      this.setState({
        getcategorytable: orgData,
      });
    } else {
      this.setState({
        getcategorytable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.nameInput.current.focus();
      this.setInitValue();
      this.letcategorylst();
    }
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
    this.setInitValue();
    this.categoryRef.current.resetForm();
  };

  setUpdateData = (v) => {
    let initVal = {
      id: v.id,
      categoryName: v.categoryName,
    };
    this.setState({ initVal: initVal });
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_category_by_id(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            categoryName: res.categoryName,
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
    const { initVal, getcategorytable } = this.state;

    return (
      <div className="ledger-group-style m-0 ledger-group-height-style">
        <div className="main-div mb-2 m-0">
          {/* <h4 className="form-header">Create Category</h4> */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.categoryRef}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              categoryName: Yup.string()
                .trim()
                .matches(AlphabetwithSpecialChars, "Enter only alphabet")
                .required("Category name is required"),
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
                    requestData.append("categoryName", values.categoryName);

                    if (values.id == "") {
                      createCategory(requestData)
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
                      updateCategory(requestData)
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
              // {!opendiv && (
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                autoComplete="off"
              >
                <Row style={{ background: "#CEE7F1" }} className="p-2">
                  <Col md={3}>
                    <Row>
                      <Col md={4}>
                        <Form.Label className="lbl">Category Name:</Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="">
                          <Form.Control
                            ref={(input) => {
                              this.nameInput.current = input;
                            }}
                            autoFocus="true"
                            className="text-box"
                            styles={createPro}
                            type="text"
                            placeholder="Category Name"
                            name="categoryName"
                            id="categoryName"
                            onChange={handleChange}
                            onInput={(e) => {
                              e.target.value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                            }}
                            value={values.categoryName}
                            isValid={
                              touched.categoryName && !errors.categoryName
                            }
                            isInvalid={!!errors.categoryName}
                          />
                          <span className="text-danger errormsg">
                            {errors.categoryName}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="3" className="btn_align my-auto">
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
          {/* )} */}
          <div className="cust_table">
            <Row className="p-2">
              <Col md="2">
                <div className="">
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
                </div>
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

            <div className="tbl-list-style">
              {/* {getcategorytable.length > 0 && ( */}
              {isActionExist(
                "category",
                "list",
                this.props.userPermissions
              ) && (
                <Table
                  // hover
                  size="sm"
                  // className="tbl-font"
                  //responsive
                >
                  <thead>
                    {/* <div className="scrollbar_hd"> */}
                    <tr>
                      {/* {this.state.showDiv && <th>Sr.</th>} */}
                      <th>Category Name</th>
                    </tr>
                    {/* </div> */}
                  </thead>
                  <tbody style={{ borderTop: "2px solid transparent" }}>
                    {/* <div className="scrollban_new"> */}
                    {getcategorytable.length > 0 ? (
                      getcategorytable.map((v, i) => {
                        return (
                          <tr
                            // onClick={(e) => {
                            //   this.handleFetchData(v.id);
                            // }}

                            onDoubleClick={(e) => {
                              if (
                                isActionExist(
                                  "category",
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
                            <td>{v.categoryName}</td>
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
                              <th style={{ width: "25%" }}>Total Category :</th>
                              <td style={{ width: "60%" }}>
                                {getcategorytable.length}
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

export default connect(mapStateToProps, mapActionsToProps)(Category);
