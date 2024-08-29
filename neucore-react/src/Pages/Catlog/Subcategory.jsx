import React from "react";
import { Button, Col, Row, Form, Table, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import {
  createSubCategory,
  getAllSubCategory,
  updateSubCategory,
  get_subcategory,
} from "@/services/api_functions";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";

import {
  ShowNotification,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  createPro,
  only_alphabets,
  AlphabetwithSpecialChars,
} from "@/helpers";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Subcategory extends React.Component {
  constructor(props) {
    super(props);
    this.subCategoryFormRef = React.createRef();
    this.subCategoryRef = React.createRef();
    this.nameInput = React.createRef();
    this.state = {
      getsubcategorytable: [],
      data: [],
      orgData: [],
      initVal: {
        id: "",
        subcategoryName: "",
      },
    };
  }

  setInitValue = () => {
    let initVal = {
      id: "",
      subcategoryName: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };

  letsubcategorylst = () => {
    getAllSubCategory()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              getsubcategorytable: res.responseObject,
              orgData: res.responseObject,
            },
            () => {
              this.subCategoryRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ getsubcategorytable: [] });
      });
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter((v) =>
      v.subcategoryName.toLowerCase().includes(vi.toLowerCase())
    );
    if (vi.length == 0) {
      this.setState({
        getsubcategorytable: orgData,
      });
    } else {
      this.setState({
        getsubcategorytable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    this.nameInput.current.focus();
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.nameInput.current.focus();
      this.setInitValue();
      this.letsubcategorylst();
    }
  }

  pageReload = () => {
    this.componentDidMount();
    this.subCategoryRef.current.resetForm();
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_subcategory(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            subcategoryName: res.subcategoryName,
          };
          this.setState({ initVal: initVal, opendiv: true });
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
    const { initVal, getsubcategorytable } = this.state;

    return (
      <div className="ledger-group-style m-0 ledger-group-height-style">
        <div className="main-div mb-2 m-0">
          {/* <h4 className="form-header">Create Sub-Category</h4> */}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.subCategoryRef}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              subcategoryName: Yup.string()
                .trim()
                .matches(AlphabetwithSpecialChars, "Enter only alphabet")
                .required("Sub category name is required"),
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
                    requestData.append(
                      "subcategoryName",
                      values.subcategoryName
                    );

                    if (values.id == "") {
                      createSubCategory(requestData)
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
                              is_timeout: true,
                              delay: 1000,
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
                      updateSubCategory(requestData)
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
                style={{ background: "#CEE7F1" }}
                autoComplete="off"
              >
                <Row className="p-2">
                  <Col md={3}>
                    <Row>
                      <Col md={4} className="px-0">
                        <Form.Label className="lbl">Flavour Name:</Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Control
                            ref={(input) => {
                              this.nameInput.current = input;
                            }}
                            type="text"
                            styles={createPro}
                            placeholder="Flavour Name"
                            name="subcategoryName"
                            id="subcategoryName"
                            onChange={handleChange}
                            onInput={(e) => {
                              e.target.value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                            }}
                            value={values.subcategoryName}
                            isValid={
                              touched.subcategoryName && !errors.subcategoryName
                            }
                            isInvalid={!!errors.subcategoryName}
                            className="text-box"
                          />
                          <span className="text-danger errormsg">
                            {errors.subcategoryName}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="justify-content-end pb-2">
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
                              resetForm();
                              this.pageReload();
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
                <div className="">
                  {/* <Form>
                        <Form.Group
                          className="mt-1"
                          controlId="formBasicSearch"
                        >
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

                {/* {!opendiv && (
                  <Button
                    className="create-btn mr-2"
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ opendiv: !opendiv });
                    }}

                    onClick={(e) => {
                      e.preventDefault();
                      if (isActionExist("sub-category", "create")) {
                        this.setState({ opendiv: !opendiv });
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
                    aria-controls="example-collapse-text"
                    aria-expanded={opendiv}
                  onClick={this.open}
                  >
                    {values.id == "" ? "Save" : "Update"}

                  </Button>
                )} */}
              </Col>
            </Row>

            <div className="tbl-list-style">
              {isActionExist(
                "sub-category",
                "list",
                this.props.userPermissions
              ) && (
                <Table
                  // hover
                  size="sm"
                >
                  <thead>
                    <tr>
                      <th>Flavour Name</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: "2px solid transparent" }}>
                    {/* <div className="scrollban_new"> */}
                    {getsubcategorytable.length > 0 ? (
                      getsubcategorytable.map((v, i) => {
                        return (
                          <tr
                            // onDoubleClick={(e) => {
                            //   this.handleFetchData(v.id);
                            // }}
                            onDoubleClick={(e) => {
                              if (
                                isActionExist(
                                  "sub-category",
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
                            <td>{v.subcategoryName}</td>
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
                              <th style={{ width: "25%" }}>Total Category :</th>
                              <td style={{ width: "60%" }}>
                                {getsubcategorytable.length}
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

export default connect(mapStateToProps, mapActionsToProps)(Subcategory);
