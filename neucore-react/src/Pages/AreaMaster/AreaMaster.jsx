import React from "react";
import { Button, Col, Row, Form, Table, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCalculator,
  faCirclePlus,
  faCircleQuestion,
  faFloppyDisk,
  faGear,
  faHouse,
  faPen,
  faPrint,
  faQuestion,
  faRightFromBracket,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import {
  createAreaMaster,
  getAreaMasterOutlet,
  updateAreaMaster,
  getAreaMaster,
  deleteAreaMaster,
  validate_pincode,
  validate_area_master,
  validate_area_master_update,
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
  LoadingComponent,
  OnlyEnterNumbers,
  allEqual,
  handlesetFieldValue,
  handleDataCapitalised,
} from "@/helpers";
import search from "@/assets/images/search_icon@3x.png";
import "mousetrap-global-bind";

class AreaMaster extends React.Component {
  constructor(props) {
    super(props);

    this.areaMasterRef = React.createRef();
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
      getAreaMasters: [],
      orgData: [],
      initVal: {
        id: "",
        area_name: "",
        area_code: "",
        pincode: "",
      },
      errorArrayBorder: "",
    };
  }

  pageReload = () => {
    this.setInitValue();
    this.letAreaMasterlst();
    this.handleSearch("");
    // console.log("in pageReload");
    this.myRef.current.resetForm();
  };

  letAreaMasterlst = () => {
    this.setState({ showloader: true });
    // console.log("showloader->", this.state.showloader);
    getAreaMasterOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              getAreaMasters: res.responseObject,
              orgData: res.responseObject,
              showloader: false,
            },
            () => {
              document.getElementById("searchAl").value = "";
              setTimeout(() => {
                document.getElementById("area_name").focus();
              }, 1500);
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ getAreaMasters: [] });
      });
  };

  handleSearch = (vi) => {
    this.setState({ search: vi }, () => {
      let { orgData } = this.state;
      // console.log({ orgData });
      let orgData_F = orgData.filter(
        (v) =>
          (v.areaName != null &&
            v.areaCode != null &&
            v.pincode != null &&
            v.areaName.toLowerCase().includes(vi.toLowerCase())) ||
          v.areaCode.toString().includes(vi) ||
          v.pincode.toString().includes(vi)
      );
      // console.log("vi.length ", vi.length, orgData_F);
      if (vi.length == 0) {
        this.setState({
          // getTaxtable: orgData,
          getAreaMasters: orgData,
        });
      } else {
        this.setState({
          //   getTaxtable: orgData_F.length > 0 ? orgData_F : [],
          getAreaMasters: orgData_F.length > 0 ? orgData_F : [],
        });
      }
    });
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

  deleteAreaMaster = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    deleteAreaMaster(formData)
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
      this.letAreaMasterlst();
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
      area_name: "",
      area_code: "",
      pincode: "",
    };
    this.setState({ initVal: initVal, errorArrayBorder: "" });
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    getAreaMaster(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;
          let initVal = {
            id: res.id,
            area_name: res.areaName,
            area_code: res.areaCode,
            pincode: res.pincode,
          };
          this.setState({ initVal: initVal }, () => {
            document.getElementById("area_name").focus();
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
  validatePincode = (pincode, setFieldValue) => {
    let reqData = new FormData();
    reqData.append("pincode", pincode);
    validate_pincode(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "warning",
            title: "Warning",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          setTimeout(() => {
            document.getElementById("pincode").focus();
          }, 1300);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  validateareamaster = (area_name, setFieldValue) => {
    let requestData = new FormData();
    // console.log("id", id);
    // requestData.append("outletId", id);
    requestData.append("areaName", area_name);
    // console.log("area", area_name);
    validate_area_master(requestData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          // console.log("res----", res);
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            // is_button_show: true,
            delay: 1000,
            is_timeout: true,
          });
          setTimeout(() => {
            document.getElementById("area_name").focus();
          }, 1200);
          // setFieldValue("area_name", "");
        } else {
          document.getElementById("area_code").focus();
        }
      })
      .catch((error) => { });
  };

  validateareamasterUpdate = (id, area_name, setFieldValue) => {
    let requestData = new FormData();
    requestData.append("id", id);
    requestData.append("areaName", area_name);
    // console.log("area", area_name);
    validate_area_master_update(requestData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          // console.log("res----", res);
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            // is_button_show: true,
            delay: 1000,
            is_timeout: true,
          });
          setTimeout(() => {
            document.getElementById("area_name").focus();
          }, 1200);
          // setFieldValue("area_name", "");
        }
      })
      .catch((error) => { });
  };

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
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
        if (isActionExist("area-master", "edit", this.props.userPermissions)) {
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

        // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
      }
    }
  }

  handleKeyDown = (e, index) => {
    // debugger;
    if (e.keyCode === 9) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    } else if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    } else if (e.keyCode === 37) {
      // const prevIndex = (index - 1) % this.inputRefs.length;
      // if (prevIndex === -1) {
      //   this.inputRefs[index].focus();
      // } else {
      //   this.inputRefs[prevIndex].focus();
      // }
    } else if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index).focus();
    } else if (e.altKey && e.keyCode === 67) {
      const index = "cancel";
      document.getElementById(index).focus();
    }
  };

  render() {
    const {
      show,
      data,
      initVal,
      opendiv,
      showloader,
      showDiv,
      errorArrayBorder,
      //getTaxtable,
      getAreaMasters,
    } = this.state;
    return (
      <div className="ledger-group-style">
        <div className="main-div mb-2 m-0">
          <h4 className="form-header">Create Area Master</h4>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            innerRef={this.myRef}
            initialValues={initVal}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // console.log("value------->", values);
              // validation start
              let errorArray = [];
              if (values.area_name.trim() == "") {
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
                  requestData.append("areaName", values.area_name);
                  requestData.append("areaCode", values.area_code);
                  requestData.append("pincode", values.pincode);
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
                          createAreaMaster(requestData)
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
                                  msg: "Error in Area Master Creation",
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
                        // console.warn("return_data");
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
                          updateAreaMaster(requestData)
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
                        // console.warn("return_data");
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
                          Area Name<span className="text-danger">*</span>
                        </Form.Label>
                      </Col>
                      <Col lg={9} md={9} sm={9} xs={9}>
                        <Form.Group>
                          <Form.Control
                            autoComplete="off"
                            autoFocus={true}
                            type="text"
                            placeholder="Area Name"
                            name="area_name"
                            // className="text-box"
                            className={`${values.area_name == "" &&
                              errorArrayBorder[0] == "Y"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            // ref={(input) => (this.inputRefs[0] = input)}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9 || e.keyCode === 13) {
                                e.target.value = handleDataCapitalised(
                                  e.target.value
                                );

                                handlesetFieldValue(
                                  setFieldValue,
                                  "area_name",
                                  e.target.value
                                );
                              }

                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() != "") {
                                  if (values.id === "") {
                                    this.validateareamaster(
                                      e.target.value,
                                      setFieldValue
                                    );
                                  } else
                                    this.validateareamasterUpdate(
                                      values.id,
                                      e.target.value,
                                      setFieldValue
                                    );
                                  this.handleKeyDown(e, "area_code");
                                }
                              } else if (e.keyCode == 13) {
                                if (e.target.value.trim() != "") {
                                  if (values.id === "") {
                                    this.validateareamaster(
                                      e.target.value,
                                      setFieldValue
                                    );
                                  } else if (values.id !== "") {
                                    this.validateareamasterUpdate(
                                      values.id,
                                      e.target.value,
                                      setFieldValue
                                    );
                                  }
                                  this.handleKeyDown(e, "area_code");
                                }
                              }
                            }}
                            id="area_name"
                            onChange={handleChange}
                            value={values.area_name}
                            isValid={touched.area_name && !errors.area_name}
                            isInvalid={!!errors.area_name}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={2} md={2} sm={2} xs={2}>
                    <Row>
                      <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                        <Form.Label>Area Code</Form.Label>
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={8}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            autoComplete="off"
                            placeholder="Area Code"
                            name="area_code"
                            className="text-box"
                            id="area_code"
                            // onChange={handleChange}
                            onChange={handleChange}
                            value={values.area_code}
                            isValid={touched.area_code && !errors.area_code}
                            isInvalid={!!errors.area_code}
                            // ref={(input) => (this.inputRefs[1] = input)}
                            onKeyDown={(e) => {
                              if (
                                (e.shiftKey && e.keyCode === 9) ||
                                e.keyCode === 9 ||
                                e.keyCode === 13
                              ) {
                                handlesetFieldValue(
                                  setFieldValue,
                                  "area_code",
                                  e.target.value
                                );
                              }

                              if (e.shiftKey && e.keyCode === 9) {
                              } else if (e.keyCode === 9) {
                                e.preventDefault();
                                this.handleKeyDown(e, "pincode");
                              } else if (e.keyCode == 13) {
                                this.handleKeyDown(e, "pincode");
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={2} md={2} sm={2} xs={2}>
                    <Row>
                      <Col lg={4} md={4} sm={4} xs={4}>
                        <Form.Label>Pincode</Form.Label>
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={8}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Pincode"
                            autoComplete="off"
                            name="pincode"
                            className="text-box"
                            id="pincode"
                            onChange={handleChange}
                            value={values.pincode}
                            maxLength={6}
                            onKeyPress={(e) => {
                              OnlyEnterNumbers(e);
                            }}
                            isValid={touched.pincode && !errors.pincode}
                            isInvalid={!!errors.pincode}
                            // ref={(input) => (this.inputRefs[2] = input)}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.keyCode === 9) {
                              } else if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  this.validatePincode(
                                    e.target.value,
                                    setFieldValue
                                  );
                                }
                                this.handleKeyDown(e, "submit");
                              } else if (e.keyCode == 13) {
                                if (e.target.value.trim() !== "") {
                                  this.validatePincode(
                                    e.target.value,
                                    setFieldValue
                                  );
                                }
                                this.handleKeyDown(e, "submit");
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col md="4" className="my-auto text-end">
                    <Button
                      className="submit-btn"
                      id="submit"
                      type="button"
                      onKeyDown={(e) => {
                        if (e.shiftKey && e.keyCode === 9) {
                        } else if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.myRef.current.handleSubmit();
                        } else if (e.keyCode === 9) {
                          e.preventDefault();
                          this.handleKeyDown(e, "cancel");
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
                                resetForm();
                                this.pageReload();
                              },
                              handleFailFn: () => { },
                            },
                            () => {
                              // console.warn("return_data");
                            }
                          );
                        });
                      }}
                      // ref={(input) => (this.inputRefs[4] = input)}
                      onKeyDown={(e) => {
                        if (e.shiftKey && e.keyCode === 9) {
                        } else if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode == 13) {
                          e.preventDefault();
                          MyNotifications.fire({
                            show: true,
                            icon: "confirm",
                            title: "Confirm",
                            msg: "Do you want to Clear",
                            is_button_show: false,
                            is_timeout: false,
                            delay: 0,
                            handleSuccessFn: () => {
                              resetForm();
                              this.pageReload();
                            },
                          });
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
          <Row className=""
            onKeyDown={(e) => {

              if (e.keyCode === 40) {
                e.preventDefault();
                document.getElementById("ledgerTr_0")?.focus();
              }
            }}>
            <Col md="3">
              <InputGroup className="mb-2 mdl-text">
                <Form.Control
                  placeholder="Search"
                  id="searchAl"
                  className="mdl-text-box"
                  autoComplete="off"
                  // autoFocus="true"
                  onChange={(e) => {
                    let v = e.target.value;
                    this.handleSearch(v);
                  }}
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col md="9" className="mt-2 text-end"></Col>
          </Row>

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
                  <th>Area Name</th>
                  {/* <th>RATIO</th> */}
                  <th>Area Code</th>
                  <th>Pincode</th>
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
                    document.getElementById("searchAl").focus();
                  } else if (e.keyCode != 9) {
                    this.handleTableRow(e);
                  }
                }}
              >
                {/* <div className="scrollban_new"> */}
                {getAreaMasters.length > 0 ? (
                  getAreaMasters.map((v, i) => {
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
                              "area-master",
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
                        <td>{v.areaName}</td>
                        <td>{v.areaCode}</td>
                        <td>{v.pincode}</td>
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
                                    this.deleteAreaMaster(v.id);
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
              {/* <thead
                className="tbl-footer"
                style={{ borderTop: "2px solid transparent" }}
              >
                <tr>
                  <th colSpan={3}>
                    {Array.from(Array(1), (v) => {
                      return (
                        <tr>
                          <th>Total Area Master List :</th>
                          <th>{getAreaMasters.length}</th>
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
                          <span>Area Master:</span>
                          <span>{getAreaMasters.length}</span>
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

export default connect(mapStateToProps, mapActionsToProps)(AreaMaster);
