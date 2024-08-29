import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  Table,
  Modal,
  CloseButton,
} from "react-bootstrap";
import Select from "react-select";
import {
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  MyNotifications,
  eventBus,
  isActionExist,
  createPro,
  characterRegEx,
} from "@/helpers";
import { Formik } from "formik";
// import { Link } from "react-router-dom";
import * as Yup from "yup";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
// import refresh from "@render/assets/images/refresh.png";

import {
  createGroup,
  getGroups,
  createBrand,
  getAllBrands,
  updateBrand,
  get_subgroups,
  validate_subgroup,
  create_sub_filter,
  get_filter_list,
  update_sub_filter,
  validate_sub_filter,
  get_sub_filter_list,
  get_sub_filter,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class SubFilters extends React.Component {
  constructor(props) {
    super(props);
    this.brandRef = React.createRef();
    this.brandFormRef = React.createRef();
    // this.nameInput = React.createRef();

    this.state = {
      show: false,
      groupModalShow: false,
      showDiv: true,
      opendiv: false,
      groupLst: [],
      getsubgrouptable: [],
      data: [],
      orgData: [],
      initVal: {
        id: "",
        filterId: "",
        subfilterName: "",
      },
      brandModalShow: false,
    };
  }

  handelgroupModalShow = (status) => {
    this.setState({ groupModalShow: status });
  };
  handleClose = () => {
    this.setState({ show: false }, () => {
      this.pageReload();
    });
  };
  setInitValue = () => {
    let initVal = {
      id: "",
      filterId: "",
      subfilterName: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };

  validateSubFilter = (filterId, subfilterName) => {
    let requestData = new FormData();
    requestData.append("filterId", filterId);
    requestData.append("subfilterName", subfilterName);
    validate_sub_filter(requestData)
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
        // this.pageReload();
      })
      .catch((error) => {});
  };

  lstFilters = (id = "") => {
    get_filter_list()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.filterName };
            });
            this.setState({ groupLst: Opt }, () => {
              if (id != "") {
                console.log("id---", id);

                let filterId = getSelectValue(
                  this.state.groupLst,
                  parseInt(id)
                );
                this.brandRef.current.setFieldValue("filterId", filterId);
              }
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
      (v) =>
        v.filterName.toLowerCase().includes(vi.toLowerCase()) ||
        v.subfilterName.toLowerCase().includes(vi.toLowerCase())
    );

    if (vi.length == 0) {
      this.setState({
        getsubgrouptable: orgData,
      });
    } else {
      this.setState({
        getsubgrouptable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  letsubfilterslst = () => {
    get_sub_filter_list()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              getsubgrouptable: res.responseObject,
              orgData: res.responseObject,
            },
            () => {
              this.brandRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ getsubgrouptable: [] });
      });
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

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstFilters();
      this.setInitValue();
      this.letsubfilterslst();
      // mousetrap.bindGlobal("esc", this.backtomainpage);
    }
  }

  componentWillUnmount() {
    // mousetrap.unbindGlobal("esc", this.backtomainpage);
  }

  componentDidUpdate(prevProps) {
    console.log("pkg", { prevProps });
    // this.nameInput.focus();
    if (this.props.isRefresh == true) {
      this.pageReload();
      // prevProps.handleRefresh(false);
    }
  }

  pageReload = () => {
    this.componentDidMount();
    this.brandRef.current.resetForm();
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_sub_filter(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let ob = result.responseObject;
          let initVal = {
            id: ob.id,
            filterId: getSelectValue(this.state.groupLst, ob.filterId),
            subfilterName: ob.subfilterName,
          };
          this.setState({ initVal: initVal, opendiv: true });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  render() {
    const { groupLst, initVal, groupModalShow, getsubgrouptable } = this.state;

    return (
      <div className="ledger-group-style m-0 ledger-group-height-style">
        <div className="main-div mb-2 m-0">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.brandRef}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              filterId: Yup.object()
                .nullable()
                .required("Group name is required"),
              subfilterName: Yup.string()
                .nullable()
                .trim()
                .matches(characterRegEx, "Enter only alphabet")
                .required("Brand name is required"),
            })}
            onSubmit={(values, { resetForm }) => {
              // ;
              let requestData = new FormData();
              requestData.append("filterId", values.filterId.value);
              requestData.append("subfilterName", values.subfilterName);

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
                      create_sub_filter(requestData)
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
                      update_sub_filter(requestData)
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
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
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
                        <Form.Label className="pe-0 lbl">
                          Filter Name:
                        </Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="">
                          <Select
                            className="selectTo"
                            styles={createPro}
                            // ref={(input) => {
                            //   this.nameInput = input;
                            // }}
                            autoFocus
                            onChange={(v) => {
                              setFieldValue("filterId", v);
                            }}
                            // onBlur={(e)=>{if(this.value==v){

                            // }}}
                            name="filterId"
                            options={groupLst}
                            value={values.filterId}
                            invalid={errors.filterId ? true : false}
                          />
                          <span className="text-danger">{errors.filterId}</span>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Button
                          className="add-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ groupModalShow: true });
                          }}
                        >
                          +
                        </Button>
                      </Col>
                    </Row>
                  </Col>

                  <Col md={3}>
                    <Row>
                      <Col md={4}>
                        <Form.Label className="lbl">SubFilter Name:</Form.Label>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="">
                          <Form.Control
                            type="text"
                            placeholder=" Subfilter Name"
                            className="text-box:focus"
                            // className="text-box"
                            name="subfilterName"
                            id="subfilterName"
                            autoFocus={true}
                            onBlur={(e) => {
                              e.preventDefault();
                              this.validateSubFilter(
                                values.filterId.value,
                                values.subfilterName
                              );
                            }}
                            onChange={handleChange}
                            onInput={(e) => {
                              e.target.value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                            }}
                            value={values.subfilterName}
                            isValid={
                              touched.subfilterName && !errors.subfilterName
                            }
                            isInvalid={!!errors.subfilterName}
                            styles={createPro}
                          />
                          <span className="text-danger errormsg">
                            {errors.subfilterName}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md={2}></Col>
                    </Row>
                  </Col>
                  <Col md="6" className="btn_align my-auto">
                    <Button className="submit-btn ms-2" type="submit">
                      {values.id == "" ? "Submit" : "Update"}
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
                    // debugger;
                    e.preventDefault();
                    this.pageReload();

                    // this.props.handleRefresh(true);
                  }}
                >
                  <img src={refresh} alt="icon" />
                </Button>
              </Col>
            </Row>
            <div className="tbl-list-style">
              {isActionExist(
                "sub-group",
                "list",
                this.props.userPermissions
              ) && (
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Filters Name</th>
                      <th>SubFilters Name</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderTop: "2px solid transparent" }}>
                    {getsubgrouptable.length > 0 ? (
                      getsubgrouptable.map((v, i) => {
                        return (
                          <tr
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
                            <td>{v.filterName}</td>
                            <td>{v.subfilterName}</td>
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
                              <th style={{ width: "25%" }}>
                                Total SubFilters :
                              </th>
                              <td style={{ width: "60%" }}>
                                {getsubgrouptable.length}
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

            {/* Group Create Modal */}
            <Modal
              show={groupModalShow}
              size="md"
              className=" mt-5 mainmodal"
              onHide={() => this.handelgroupModalShow(false)}
              dialogClassName="modal-400w"
              aria-labelledby="contained-modal-title-vcenter"
            >
              <Modal.Header>
                <Modal.Title>Filter</Modal.Title>
                <CloseButton
                  className="pull-right"
                  onClick={() => this.handelgroupModalShow(false)}
                />
              </Modal.Header>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{
                  filterName: "",
                }}
                validationSchema={Yup.object().shape({
                  filterName: Yup.string()
                    .trim()
                    .required("Group name is required"),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let requestData = new FormData();
                  requestData.append("filterName", values.filterName);
                  createGroup(requestData)
                    .then((response) => {
                      let res = response.data;
                      if (res.responseStatus == 200) {
                        resetForm();
                        ShowNotification("Success", res.message);
                        this.lstGroups(res.responseObject);
                        this.handelgroupModalShow(false);
                      } else {
                        ShowNotification("Error", res.message);
                      }
                    })
                    .catch((error) => {});
                }}
              >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                  <Form onSubmit={handleSubmit} className="form-style">
                    <Modal.Body className=" p-2">
                      <div className="form-style">
                        <Row>
                          <Col md="9">
                            <Form.Group>
                              <Form.Label>Filter Name</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Filter Name"
                                name="filterName"
                                id="filterName"
                                onChange={handleChange}
                                value={values.filterName}
                                isValid={
                                  touched.filterName && !errors.filterName
                                }
                                isInvalid={!!errors.filterName}
                              />
                              <span className="text-danger errormsg">
                                {errors.filterName}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="successbtn-style" type="submit">
                        Submit
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </Modal>
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

export default connect(mapStateToProps, mapActionsToProps)(SubFilters);
