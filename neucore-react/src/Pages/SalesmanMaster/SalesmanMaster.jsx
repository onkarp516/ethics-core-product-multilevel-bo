import React from "react";
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
import moment from "moment";
import {
  createAreaMaster,
  createSalesmanMaster,
  getAreaMasterOutlet,
  getSalesmanMasterOutlet,
  updateAreaMaster,
  updateSalesmanMaster,
  getAreaMaster,
  getSalesmanMaster,
  deleteAreaMaster,
  deleteSalesmanMaster,
  validate_pincode,
  validateSalesmanmaster,
  validateSalesmanmasterUpdate,
} from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faCirclePlus,
  faCircleQuestion,
  faFloppyDisk,
  faGear,
  faHouse,
  faPen,
  faPrint,
  faArrowUpFromBracket,
  faRightFromBracket,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  ShowNotification,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  eventBus,
  LoadingComponent,
  MyTextDatePicker,
  allEqual,
  OnlyEnterNumbers,
  handlesetFieldValue,
  handleDataCapitalised,
} from "@/helpers";
import axios from "axios";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import delete_icon from "@/assets/images/delete_icon3.png";

import mousetrap from "mousetrap";
import "mousetrap-global-bind";

class SalesmanMaster extends React.Component {
  constructor(props) {
    super(props);
    //this.areaMasterRef = React.createRef();
    this.salesmanMasterRef = React.createRef();
    this.myRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.nameInput = React.createRef();
    const curDate = new Date();
    this.inputRefs = [];
    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
      showloader: true,
      data: [],
      getSalesmanList: [],
      orgData: [],
      dt: moment(curDate).format("DD/MM/YYYY"),
      initVal: {
        id: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        mobile_number: "",
        address: "",
        pincode: "",
        dob: "",
      },
      errorArrayBorder: "",
      source: "",
    };
  }

  pageReload = () => {
    this.setInitValue();
    this.componentDidMount();
    this.handleSearch("");
    // console.log("in pageReload");
    this.myRef.current.resetForm();
  };

  // validateTax = (gst_per) => {
  //   let requestData = new FormData();
  //   requestData.append("gst_per", gst_per);
  //   validate_Tax(requestData)
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
  //     .catch((error) => { });
  // };

  letSalesmanMasterlst = () => {
    this.setState({ showloader: true });
    // console.log("showloader->", this.state.showloader);
    getSalesmanMasterOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              getSalesmanList: res.responseObject,
              orgData: res.responseObject,
              showloader: false,
            },
            () => {
              document.getElementById("searchSml").value = "";
              setTimeout(() => {
                document.getElementById("first_name").focus();
              }, 1500);
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ getSalesmanList: [] });
      });
  };

  handleSearch = (vi) => {
    this.setState({ search: vi }, () => {
      let { orgData } = this.state;
      // console.log({ orgData });
      let orgData_F = orgData.filter(
        (v) =>
          (v.firstName != null &&
            v.firstName.toLowerCase().includes(vi.toLowerCase())) ||
          (v.lastName != null &&
            v.lastName.toLowerCase().includes(vi.toLowerCase())) ||
          (v.middleName != null &&
            v.middleName.toLowerCase().includes(vi.toLowerCase())) ||
          (v.address != null &&
            v.address.toLowerCase().includes(vi.toLowerCase())) ||
          (v.pincode != null && v.pincode.toString().includes(vi)) ||
          (v.mobile != null && v.mobile.toString().includes(vi)) ||
          (v.dob != null && v.dob.toString().includes(vi))
      );
      // console.log("vi.length ", vi.length, orgData_F);
      if (vi.length == 0) {
        this.setState({
          // getTaxtable: orgData,
          getSalesmanList: orgData,
        });
      } else {
        this.setState({
          //   getTaxtable: orgData_F.length > 0 ? orgData_F : [],
          getSalesmanList: orgData_F.length > 0 ? orgData_F : [],
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

  deleteSalesmanMaster = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    deleteSalesmanMaster(formData)
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
      this.setInitValue();
      this.letSalesmanMasterlst();
      // mousetrap.bindGlobal("esc", this.backtomainpage);
      const { prop_data } = this.props.block;
      // console.log("prop_data", prop_data);
      this.setState(
        {
          source: prop_data,
        },
        () => {
          // console.log("source", this.state.source);
        }
      );

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
      first_name: "",
      last_name: "",
      middle_name: "",
      mobile_number: "",
      address: "",
      pincode: "",
      dob: "",
    };
    this.setState({ initVal: initVal, opendiv: false }, () => {
      setTimeout(() => {
        document.getElementById("first_name").focus();
      }, 500);
    });
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    getSalesmanMaster(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;
          let p = moment(res.dob, "YYYY-MM-DD").toDate();
          let initVal = {
            id: res.id,
            first_name: res.firstName,
            last_name: res.lastName,
            middle_name: res.middleName,
            mobile_number: res.mobile,
            address: res.address,
            pincode: res.pincode,
            dob: res.dob != "" ? moment(new Date(p)).format("DD/MM/YYYY") : "",
          };
          this.setState({ initVal: initVal, opendiv: true }, () => {
            setTimeout(() => {
              document.getElementById("first_name").focus();
            }, 1000);
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
            delay: 1500,
          });
          // setFieldValue("pincode", "");
          setTimeout(() => {
            document.getElementById("pincode").focus();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  ValidateSalesmanMasterFun = (first_name, middle_name, last_name) => {
    let requestData = new FormData();
    requestData.append("firstName", first_name);
    requestData.append("middleName", middle_name);
    requestData.append("lastName", last_name);
    validateSalesmanmaster(requestData)
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
            document.getElementById("last_name").focus();
          }, 1200);
          // setFieldValue("first_name", "");
        }
      })
      .catch((error) => { });
  };

  ValidateSalesmanMasterUpdateFun = (
    id,
    first_name,
    middle_name,
    last_name
  ) => {
    let requestData = new FormData();
    requestData.append("id", id);
    requestData.append("firstName", first_name);
    requestData.append("middleName", middle_name);
    requestData.append("lastName", last_name);
    validateSalesmanmasterUpdate(requestData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          console.log("res----", res);
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
            document.getElementById("last_name").focus();
          }, 1200);
          // setFieldValue("first_name", "");
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
        if (
          isActionExist("salasman-master", "edit", this.props.userPermissions)
        ) {
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
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  handleKeyDown = (e, index) => {
    // debugger;
    if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    }
    if (e.keyCode === 37) {
      // const prevIndex = (index - 1) % this.inputRefs.length;
      // if (prevIndex === -1) {
      //   this.inputRefs[index].focus();
      // } else {
      //   this.inputRefs[prevIndex].focus();
      // }
    }
    if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index).focus();
      // const index = (38) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    }
    if (e.altKey && e.keyCode === 67) {
      const index = "cancel";
      document.getElementById(index).focus();
      // const index = (39) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    }
  };

  render() {
    const {
      show,
      data,
      initVal,
      opendiv,
      dt,
      showloader,
      showDiv,
      //getTaxtable,
      getSalesmanList,
      errorArrayBorder,
    } = this.state;
    return (
      <div className="ledger-group-style">
        <div className="main-div m-0">
          <h4 className="form-header">Create Salesman Master</h4>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            innerRef={this.myRef}
            initialValues={initVal}
            // validationSchema={Yup.object().shape({
            //   first_name: Yup.string()
            //     .trim()
            //     .required("First Name is required"),
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {

              // validation start
              let errorArray = [];
              if (values.first_name.trim() == "") {
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
                  requestData.append("firstName", values.first_name);
                  requestData.append("lastName", values.last_name);
                  requestData.append("middleName", values.middle_name);
                  requestData.append("mobileNumber", values.mobile_number);
                  requestData.append("pincode", values.pincode);
                  requestData.append("address", values.address);
                  requestData.append(
                    "dob",
                    values.dob
                      ? moment(values.dob, "DD/MM/YYYY").format("YYYY-MM-DD")
                      : ""
                  );
                  // setTimeout(() => {
                  //   document.getElementById("first_name").focus();
                  // }, 2000);
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
                          // this.ValidateSalesmanMasterFun(requestData);
                          createSalesmanMaster(requestData)
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

                                if (this.state.source != "") {
                                  eventBus.dispatch("page_change", {
                                    from: "salasman-master",
                                    to: "ledgercreate",
                                    prop_data: this.state.source,
                                    isNewTab: false,
                                  });
                                  this.setState({ source: "" });
                                } else {
                                  this.pageReload();
                                  resetForm();
                                  document.getElementById("first_name").focus();
                                }

                                // this.props.handleRefresh(true);
                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: "Error in Salesman Master Creation",
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
                          updateSalesmanMaster(requestData)
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
                                if (this.state.source != "") {
                                  // eventBus.dispatch("page_change", {
                                  //   from: "salasman-master",
                                  //   to: "ledgercreate",
                                  //   isNewTab: false,
                                  // });
                                  this.setState({ source: "" });
                                } else {
                                  this.pageReload();
                                  resetForm();
                                }
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
                {/* {JSON.stringify(values)} */}
                <Row
                  style={{ background: "#CEE7F1" }}
                  className="row_padding p-2"
                >
                  <Row>
                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Label>
                            First Name<span className="text-danger">*</span>
                          </Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Group>
                            <Form.Control
                              autoComplete="off"
                              autoFocus={true}
                              type="text"
                              placeholder="First Name"
                              name="first_name"
                              // className="text-box"
                              className={`${values.first_name == "" &&
                                errorArrayBorder[0] == "Y"
                                ? "border border-danger text-box"
                                : "text-box"
                                }`}
                              id="first_name"
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.keyCode === 9 || e.keyCode === 13) {
                                  e.target.value = handleDataCapitalised(
                                    e.target.value
                                  );

                                  handlesetFieldValue(
                                    setFieldValue,
                                    "first_name",
                                    e.target.value
                                  );
                                }
                                if (e.keyCode === 9) {

                                  if (e.target.value.trim() == '') {
                                    e.preventDefault()
                                  }
                                }
                                else if (e.keyCode == 13) {
                                  if (e.target.value.trim() != '') {
                                    this.handleKeyDown(e, "middle_name")
                                  }
                                }

                              }}
                              value={values.first_name}
                              isValid={touched.first_name && !errors.first_name}
                              isInvalid={!!errors.first_name}
                            />

                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4} className="pe-0">
                          <Form.Label>Middle Name</Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Group>
                            <Form.Control
                              autoComplete="off"
                              type="text"
                              placeholder="Middle Name"
                              name="middle_name"
                              className="text-box"
                              id="middle_name"
                              // onChange={handleChange}
                              onChange={handleChange}
                              value={values.middle_name}
                              isValid={
                                touched.middle_name && !errors.middle_name
                              }
                              isInvalid={!!errors.middle_name}
                              // ref={(input) => (this.inputRefs[1] = input)}
                              onKeyDown={(e) => {
                                if (
                                  (e.shiftKey && e.keyCode === 9) ||
                                  e.keyCode === 9 ||
                                  e.keyCode === 13
                                ) {
                                  e.target.value = handleDataCapitalised(
                                    e.target.value
                                  );

                                  handlesetFieldValue(
                                    setFieldValue,
                                    "middle_name",
                                    e.target.value
                                  );
                                }

                                if (e.shiftKey && e.keyCode === 9) {
                                } else if (e.keyCode === 9) {
                                  this.handleKeyDown(e, "last_name");
                                } else if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "last_name");
                                }
                              }
                              }
                            />{" "}
                            <Form.Control.Feedback type="invalid">
                              {errors.middle_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Label>Last Name</Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              autoComplete="off"
                              placeholder="Last Name"
                              name="last_name"
                              className="text-box"
                              id="last_name"
                              onChange={handleChange}
                              value={values.last_name}
                              isValid={touched.last_name && !errors.last_name}
                              isInvalid={!!errors.last_name}
                              // ref={(input) => (this.inputRefs[2] = input)}
                              onKeyDown={(e) => {
                                if (e.keyCode === 9 || e.keyCode === 13) {
                                  e.target.value = handleDataCapitalised(
                                    e.target.value
                                  );

                                  handlesetFieldValue(
                                    setFieldValue,
                                    "last_name",
                                    e.target.value
                                  );
                                }

                                if (e.keyCode === 9) {
                                  if (values.id === "") {
                                    this.ValidateSalesmanMasterFun(
                                      values.first_name,
                                      values.middle_name,
                                      values.last_name
                                    );
                                  } else
                                    this.ValidateSalesmanMasterUpdateFun(
                                      values.id,
                                      values.first_name,
                                      values.middle_name,
                                      values.last_name
                                    );
                                  this.handleKeyDown(e, "mobile_number");

                                } else if (e.keyCode == 13) {
                                  if (values.id === "") {
                                    this.ValidateSalesmanMasterFun(
                                      values.first_name,
                                      values.middle_name,
                                      values.last_name
                                    );
                                  } else if (values.id !== "") {
                                    this.ValidateSalesmanMasterUpdateFun(
                                      values.id,
                                      values.first_name,
                                      values.middle_name,
                                      values.last_name
                                    );
                                  }
                                  this.handleKeyDown(e, "mobile_number");

                                }
                              }}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.last_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Label>Mobile No. </Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              autoComplete="off"
                              placeholder="Mobile Number"
                              name="mobile_number"
                              className="text-box"
                              id="mobile_number"
                              onChange={handleChange}
                              // ref={(input) => (this.inputRefs[3] = input)}
                              onKeyDown={(e) => {
                                // this.handleKeyDown(e, 3)
                                if (e.keyCode == 18) {
                                  e.preventDefault();
                                }
                                if (e.shiftKey && e.key === "Tab") {
                                  let mob = e.target.value.trim();
                                  // console.log("length--", mob.length);
                                  if (mob != "" && mob.length < 10) {
                                    // console.log(
                                    //   "length--",
                                    //   "plz enter 10 digit no."
                                    // );
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter 10 Digit Number. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("mobile_number")
                                        .focus();
                                    }, 1000);
                                  }
                                } else if (
                                  e.key === "Tab" ||
                                  e.key === "Enter"
                                ) {
                                  let mob = e.target.value.trim();
                                  // console.log("length--", mob.length);
                                  if (mob != "" && mob.length < 10) {
                                    // console.log(
                                    //   "length--",
                                    //   "plz enter 10 digit no."
                                    // );
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter 10 Digit Number. ",
                                      is_timeout: true,
                                      delay: 1000,
                                    });
                                    setTimeout(() => {
                                      document
                                        .getElementById("mobile_number")
                                        .focus();
                                    }, 1500);
                                  } else if (e.keyCode === 13) {
                                    this.handleKeyDown(e, "address");
                                  }
                                }
                              }}

                              onBlur={(e) => {
                                e.preventDefault();
                              }}
                              value={values.mobile_number}
                              isValid={
                                touched.mobile_number && !errors.mobile_number
                              }
                              onKeyPress={(e) => {
                                OnlyEnterNumbers(e);
                              }}
                              isInvalid={!!errors.mobile_number}
                              maxLength={10}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.mobile_number}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-1">
                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Label>Address </Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              autoComplete="off"
                              placeholder="Address"
                              name="address"
                              className="text-box"
                              id="address"
                              onChange={handleChange}
                              onInput={(e) => {
                                e.target.value = this.getDataCapitalised(
                                  e.target.value
                                );
                              }}
                              value={values.address}
                              isValid={touched.address && !errors.address}
                              isInvalid={!!errors.address}
                              // ref={(input) => (this.inputRefs[4] = input)}
                              onKeyDown={(e) => {
                                if (
                                  (e.shiftKey && e.keyCode === 9) ||
                                  e.keyCode === 9 ||
                                  e.keyCode === 13
                                ) {
                                  e.target.value = handleDataCapitalised(
                                    e.target.value
                                  );

                                  handlesetFieldValue(
                                    setFieldValue,
                                    "address",
                                    e.target.value
                                  );
                                }

                                if (e.shiftKey && e.keyCode === 9) {
                                } else if (e.keyCode === 9) {
                                  this.handleKeyDown(e, "pincode");
                                } else if (e.keyCode == 13) {
                                  this.handleKeyDown(e, "pincode");
                                }
                              }
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.address}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Label>Pincode </Form.Label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Group>
                            <Form.Control
                              autoComplete="off"
                              type="text"
                              placeholder="Pincode"
                              name="pincode"
                              className="text-box"
                              id="pincode"
                              onChange={handleChange}
                              value={values.pincode}
                              maxLength={6}
                              onKeyPress={(e) => {
                                OnlyEnterNumbers(e);
                              }}
                              onBlur={(e) => {
                                e.preventDefault();
                                if (e.target.value != "") {
                                  this.validatePincode(
                                    e.target.value,
                                    setFieldValue
                                  );
                                }
                              }}
                              isValid={touched.pincode && !errors.pincode}
                              isInvalid={!!errors.pincode}
                              // ref={(input) => (this.inputRefs[5] = input)}
                              onKeyDown={(e) => this.handleKeyDown(e, "dob")}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.pincode}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Label>Date of Birth </Form.Label>
                        </Col>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Group
                          // ref={(divElement) => (this.inputRefs[6] = divElement)}
                          >
                            <MyTextDatePicker
                              innerRef={(input) => {
                                // this.invoiceDateRef.current = input;
                                this.inputRefs[6] = input;
                              }}
                              type="text"
                              style={{ borderRadius: "none" }}
                              className="form-control px-1 text-box"
                              name="dob"
                              autoComplete="off"
                              id="dob"
                              placeholder="DD/MM/YYYY"
                              dateFormat="dd/MM/yyyy"
                              value={values.dob}
                              onChange={handleChange}
                              // ref={(input) => (this.inputRefs[6] = input)}
                              onKeyDown={(e) => {
                                if (e.keyCode == 18) {
                                  e.preventDefault();
                                }
                                if (e.shiftKey && e.key === "Tab") {
                                  let datchco = e.target.value.trim();
                                  // console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );

                                  // console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document.getElementById("dob").focus();
                                    }, 1000);
                                  }
                                } else if (e.key === "Tab" || e.keyCode == 13) {
                                  let datchco = e.target.value.trim();
                                  // console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
                                  // console.log("checkdate", checkdate);
                                  if (
                                    datchco != "__/__/____" &&
                                    datchco.includes("_")
                                  ) {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Please Enter Correct Date. ",
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    setTimeout(() => {
                                      document.getElementById("dob").focus();
                                    }, 1000);
                                  } else if (e.keyCode === 13) {
                                    this.handleKeyDown(e, "submit");
                                  }
                                }
                              }}

                              onBlur={(e) => {
                                if (
                                  e.target.value != null &&
                                  e.target.value != ""
                                ) {
                                  // console.warn(
                                  //   "sid:: isValid",
                                  //   moment(
                                  //     e.target.value,
                                  //     "DD-MM-YYYY"
                                  //   ).isValid()
                                  // );
                                  if (
                                    moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).isValid() == true
                                  ) {
                                    let cDate = moment(
                                      dt,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    let expDate = moment(
                                      e.target.value,
                                      "DD-MM-YYYY"
                                    ).toDate();
                                    // console.log(cDate <= expDate);
                                    if (cDate.getTime() >= expDate.getTime()) {
                                      // console.log(e.target.value);
                                      setFieldValue("dob", e.target.value);
                                    } else {
                                      // console.log(
                                      //   "date is greater than current date"
                                      // );
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Birth date can't be greater than Current Date",
                                        // is_button_show: true,
                                        is_timeout: true,
                                        delay: 1500,
                                      });
                                      // setFieldValue("dob", "");
                                      setTimeout(() => {
                                        document.getElementById("dob").focus();
                                      }, 1000);
                                    }
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Invalid birth date",
                                      // is_button_show: true,
                                      is_timeout: true,
                                      delay: 1500,
                                    });
                                    // setFieldValue("dob", "");
                                    setTimeout(() => {
                                      document.getElementById("dob").focus();
                                    }, 1000);
                                  }
                                } else {
                                  // setFieldValue("dob", "");
                                }
                              }}
                            />

                            <span className="text-danger errormsg">
                              {errors.dob}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>

                    <Col md="3" className="justify-content-end d-flex pe-0">
                      <Button
                        className="submit-btn"
                        type="button"
                        id="submit"
                        ref={(input) => (this.inputRefs[7] = input)}
                        onKeyDown={(e) => {
                          if (e.shiftKey && e.keyCode === 9) {
                          } else if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.myRef.current.handleSubmit();
                          } else if (e.keyCode === 9) {

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
                                  if (this.state.source != "") {
                                    // eventBus.dispatch("page_change", {
                                    //   from: "salasman-master",
                                    //   to: "ledgercreate",
                                    //   isNewTab: false,
                                    // });
                                    this.setState({ source: "" });
                                  } else {
                                    this.pageReload();
                                    resetForm();
                                  }
                                },
                                handleFailFn: () => { },
                              },
                              () => {
                                // console.warn("return_data");
                              }
                            );
                          });
                        }}
                        ref={(input) => (this.inputRefs[8] = input)}
                        onKeyDown={(e) => {
                          // this.handleKeyDown(e, "first_name");
                          if (e.shiftKey && e.keyCode === 9) {
                          } else if (e.keyCode === 32) {
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
                                    if (this.state.source != "") {
                                      // eventBus.dispatch("page_change", {
                                      //   from: "salasman-master",
                                      //   to: "ledgercreate",
                                      //   isNewTab: false,
                                      // });
                                      this.setState({ source: "" });
                                    } else {
                                      this.pageReload();
                                      resetForm();
                                    }
                                  },
                                  handleFailFn: () => { },
                                },
                                () => {
                                  // console.warn("return_data");
                                }
                              );
                            });
                          }
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
        <div className="cust_table">
          <Row className=""
            onKeyDown={(e) => {
              if (e.keyCode === 40) {
                e.preventDefault();
                document.getElementById("smTr_0")?.focus();
              }
            }}>
            <Col md="3">
              <InputGroup className="mb-2 mdl-text">
                <Form.Control
                  placeholder="Search"
                  id="searchSml"
                  // aria-label="Search"
                  // aria-describedby="basic-addon1"
                  className="mdl-text-box"
                  autoComplete="off"
                  // autoFocus="true"
                  onChange={(e) => {
                    this.handleSearch(e.target.value);
                  }}
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md="9" className="mt-2 text-end"></Col>
          </Row>

          <div className="hsn-tbl-list-style1">
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
                  <th>First Name</th>
                  {/* <th>RATIO</th> */}
                  <th>Middle Name</th>
                  <th>Last Name</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Pincode</th>
                  <th>Dob</th>
                  <th>Action</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody
                style={{ borderTop: "2px solid transparent" }}
                className="prouctTableTr"
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.shiftKey && e.keyCode == 9) {
                    document.getElementById("searchSml").focus();
                  } else if (e.keyCode != 9) {
                    this.handleTableRow(e);
                  }
                }}
              >
                {/* <div className="scrollban_new"> */}
                {getSalesmanList.length > 0 ? (
                  getSalesmanList.map((v, i) => {
                    return (
                      <tr
                        value={JSON.stringify(v)}
                        id={`smTr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                        // onDoubleClick={(e) => {
                        //   e.preventDefault();
                        //   this.handleFetchData(v.id);
                        // }}

                        onDoubleClick={(e) => {
                          if (
                            isActionExist(
                              "salasman-master",
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
                        <td>{v.firstName}</td>
                        <td>{v.middleName}</td>
                        <td>{v.lastName}</td>
                        <td>{v.mobile}</td>
                        <td>{v.address}</td>
                        <td>{v.pincode}</td>
                        {/* <td>{v.dob}</td> */}
                        <td>
                          {moment(v.dob).format("DD-MM-YYYY") === "Invalid date"
                            ? ""
                            : moment(v.dob).format("DD-MM-YYYY")}
                        </td>
                        <td>
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
                                    this.deleteSalesmanMaster(v.id);
                                  },
                                  handleFailFn: () => { },
                                },
                                () => {
                                  // console.warn("return_data");
                                }
                              );
                            }}
                          />
                        </td>
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
              {/* <thead
                className="tbl-footer"
                style={{ borderTop: "2px solid transparent" }}
              >
                <tr>
                  <th colSpan={3}>
                    {Array.from(Array(1), (v) => {
                      return (
                        <tr>
                          <th>Total Salesman Master List :</th>
                          <th>{getSalesmanList.length}</th>
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
                          <span>Salesman Master:</span>
                          <span>{getSalesmanList.length}</span>
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

export default connect(mapStateToProps, mapActionsToProps)(SalesmanMaster);
