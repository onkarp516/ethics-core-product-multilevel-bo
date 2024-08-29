import React from "react";
import { Button, Col, Row, Form, Table, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createHSN,
  getAllHSN,
  updateHSN,
  get_hsn,
  validate_HSN,
  delete_product_hsn,
  validate_HSN_Update,
} from "@/services/api_functions";
import {
  getHeader,
  ShowNotification,
  AuthenticationCheck,
  customStyles,
  getValue,
  eventBus,
  isActionExist,
  MyNotifications,
  createPro,
  Accepts_numeric_regex,
  HSNno,
  LoadingComponent,
  OnlyEnterNumbers,
  ledger_select,
  allEqual,
  handlesetFieldValue,
  handleDataCapitalised,
} from "@/helpers";
import Select from "react-select";
import search from "@/assets/images/search_icon@3x.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "mousetrap-global-bind";
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
const typeoption = [
  { label: "Services", value: "Services" },
  { label: "Goods", value: "Goods" },
];
class HSN extends React.Component {
  constructor(props) {
    super(props);
    this.hsnRef = React.createRef();
    this.invoiceDateRef = React.createRef();
    this.ref = React.createRef();
    this.hsnTypeRef = React.createRef();
    this.inputRefs = [];

    this.selectRef = React.createRef();

    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
      data: [],
      gethsntable: [],
      orgData: [],
      initVal: {
        id: "",
        hsnNumber: "",
        igst: "",
        cgst: "",
        sgst: "",
        description: "",
        type: getValue(typeoption, "Goods"),
      },
      showloader: true,
      errorArrayBorder: "",
      hsn_id: "",
      focusedInput: null,
    };
  }

  handleKeyDown = (e, index) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      document.getElementById(index).focus();
    } else if (e.keyCode === 13) {
      document.getElementById(index).focus();
    } else if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index).focus();
    } else if (e.altKey && e.keyCode === 67) {
      const index = "cancel";
      document.getElementById(index).focus();
    }
  };

  pageReload = () => {
    this.setInitValue();
    this.letHsnlst();
    // this.hsnRef.current.resetForm();
  };

  validateHSN = (hsnNumber, setFieldValue) => {
    let requestData = new FormData();
    requestData.append("hsnNumber", hsnNumber);
    if (hsnNumber.length > 8) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Invalid HSN ,Please Enter 8 digit HSN No",
        is_button_show: true,
      });
      // console.log("Invaid HSN No Please input 8 digit HSN");
    } else {
      validate_HSN(requestData)
        .then((response) => {
          let res = response.data;

          if (res.responseStatus == 409) {
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
              document.getElementById("hsnNumber").focus();
            }, 1200);
            // setFieldValue("hsnNumber", "");
          }
        })
        .catch((error) => { });
    }
  };

  validateHSNUpdate = (id, hsnNumber, setFieldValue) => {
    let requestData = new FormData();
    requestData.append("id", id);
    requestData.append("hsnNumber", hsnNumber);
    if (hsnNumber.length > 8) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Invalid HSN ,Please Enter 8 digit HSN No",
        is_button_show: true,
      });
      // console.log("Invaid HSN No Please input 8 digit HSN");
    } else {
      validate_HSN_Update(requestData)
        .then((response) => {
          let res = response.data;

          if (res.responseStatus == 409) {
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
              document.getElementById("hsnNumber").focus();
            }, 1200);
            // setFieldValue("hsnNumber", "");
          }
        })
        .catch((error) => { });
    }
  };

  letHsnlst = () => {
    this.setState({ showloader: true });
    getAllHSN()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              gethsntable: res.responseObject,
              orgData: res.responseObject,
              showloader: false,
            },
            () => {
              let { hsn_id } = this.state;
              if (hsn_id !== "" && hsn_id !== 0) {
                const index = res.responseObject.findIndex((object) => {
                  return object.id === parseInt(hsn_id);
                });
                if (index >= 0) {
                  setTimeout(() => {
                    document.getElementById("hsnTr_" + index).focus();
                  }, 1500);
                }
              } else document.getElementById("searchHl").focus();
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ gethsntable: [] });
      });
  };

  movetoNext = (current, nextFieldID) => {
    if (current.value.length >= current.maxLength) {
      document.getElementById(nextFieldID).focus();
    }
  };
  deleteproducthsn = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_product_hsn(formData)
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
      this.letHsnlst();

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
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  setInitValue = () => {
    let initVal = {
      id: "",
      hsnNumber: "",
      igst: "",
      cgst: "",
      sgst: "",
      description: "",
      type: getValue(typeoption, "Goods"),
    };
    this.setState({ initVal: initVal, errorArrayBorder: "" }, () => {
      // setTimeout(() => {
      //   document.getElementById("hsnNumber").focus();
      // }, 1000);
    });
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    // console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        v.hsnno.toLowerCase().includes(vi.toLowerCase()) ||
        // moment(v.transaction_date).format("DD-MM-YYYY").includes(vi) ||
        // moment(v.invoice_date).format("DD-MM-YYYY").includes(vi) ||
        v.hsndesc.toLowerCase().includes(vi.toLowerCase()) ||
        v.type.toLowerCase().includes(vi.toLowerCase())
      // ||
      // v.total_amount.toLowerCase().includes(vi.toLowerCase())
    );
    if (vi.length == 0) {
      this.setState({
        gethsntable: orgData,
      });
    } else {
      this.setState({
        gethsntable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };
  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_hsn(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            hsnNumber: res.hsnno,
            description: res.hsndesc,
            type: res.type ? getValue(typeoption, res.type) : "",
            igst: "",
            cgst: "",
            sgst: "",
          };
          this.setState({ initVal: initVal }, () => {
            document.getElementById("hsnNumber").focus();
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
        if (isActionExist("hsn", "edit", this.props.userPermissions)) {
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

  render() {
    const {
      show,
      data,
      initVal,
      opendiv,
      gethsntable,
      showDiv,
      showloader,
      errorArrayBorder,
    } = this.state;
    return (
      <div className="ledger-group-style">
        {/* <Collapse in={opendiv}> */}
        <div className="main-div mb-2 m-0">
          <h4 className="form-header">Create HSN</h4>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={initVal}
            innerRef={this.ref}
            validationSchema={Yup.object().shape({
              hsnNumber: Yup.string()
                .trim()
                .matches(HSNno, "HSN No is invalid")
                .required("HSN number is required"),
              // .matches(Accepts_numeric_regex, "Invalid HSN Number"),
              // description: Yup.string()
              //   .trim()
              //   .matches(only_alphabets, "Enter Only Alphabets")
              //   .required("HSN description is required"),
              // type: Yup.object().required("Select type").nullable(),
              // // igst: Yup.string().trim().required('IGST is required'),
              // // cgst: Yup.string().trim().required('CGST is required'),
              // // sgst: Yup.string().trim().required('SGST is required'),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // console.log("values-------->", values);

              // validation start

              let errorArray = [];
              if (values.hsnNumber == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              // validation end

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  let keys = Object.keys(values);
                  let requestData = new FormData();

                  keys.map((v) => {
                    if (v != "type") {
                      requestData.append(v, values[v] ? values[v] : "");
                    } else if (v == "type") {
                      requestData.append(
                        "type",
                        values.type != undefined ? values.type.value : ""
                      );
                    }
                  });
                  if (
                    isActionExist("hsn", "create", this.props.userPermissions)
                  ) {
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
                            createHSN(requestData)
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

                                  this.setState(
                                    { hsn_id: res.responseObject },
                                    () => {
                                      resetForm();
                                      this.pageReload();
                                    }
                                  );
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
                            updateHSN(requestData)
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
                                  this.setState(
                                    { hsn_id: res.responseObject },
                                    () => {
                                      resetForm();
                                      this.pageReload();
                                    }
                                  );
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
                          handleFailFn: () => { },
                        },
                        () => {
                          // console.warn("return_data");
                        }
                      );
                    }
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
                  <Col lg={2} md={2} sm={2} xs={2}>
                    <Row>
                      <Col lg={4} md={4} sm={4} xs={4}>
                        <Form.Label>
                          HSN<span className="text-danger">*</span>
                        </Form.Label>
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={8}>
                        <Form.Group>
                          <Form.Control
                            // innerRef={(input) => (this.inputRefs[0] = input)}
                            ref={this.invoiceDateRef}
                            autoComplete="off"
                            autoFocus={true}
                            type="text"
                            placeholder="HSN No"
                            name="hsnNumber"
                            // className="text-box"
                            className={`${values.hsnNumber == "" &&
                              errorArrayBorder[0] == "Y"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            id="hsnNumber"
                            onKeyPress={(e) => {
                              OnlyEnterNumbers(e);
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  if (values.id === "") {
                                    this.validateHSN(
                                      values.hsnNumber,
                                      setFieldValue
                                    );
                                  } else
                                    this.validateHSNUpdate(
                                      values.id,
                                      values.hsnNumber,
                                      setFieldValue
                                    );
                                  this.handleKeyDown(e, "description");
                                }
                              } else if (e.keyCode == 13) {
                                if (e.target.value != "") {
                                  if (values.id === "") {
                                    this.validateHSN(
                                      values.hsnNumber,
                                      setFieldValue
                                    );
                                  } else
                                    this.validateHSNUpdate(
                                      values.id,
                                      values.hsnNumber,
                                      setFieldValue
                                    );

                                  this.handleKeyDown(e, "description");
                                }
                              }
                            }}
                            maxLength={8}
                            onChange={handleChange}
                            value={values.hsnNumber}
                            isValid={touched.hsnNumber && !errors.hsnNumber}
                            isInvalid={!!errors.hsnNumber}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={3} md={3} sm={3} xs={3}>
                    <Row>
                      <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                        <Form.Label>HSN Description</Form.Label>
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={8}>
                        <Form.Group>
                          <Form.Control
                            autoComplete="off"
                            type="text"
                            placeholder="HSN Description"
                            name="description"
                            className="text-box"
                            id="description"
                            onChange={handleChange}
                            value={values.description}
                            isValid={touched.description && !errors.description}
                            isInvalid={!!errors.description}
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
                                  "description",
                                  e.target.value
                                );
                              }

                              if (e.shiftKey && e.keyCode === 9) {
                              } else if (e.keyCode === 9) {
                                e.preventDefault();
                                this.hsnTypeRef.current?.focus();
                              } else if (e.keyCode === 13) {
                                this.hsnTypeRef.current?.focus();
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={2} md={2} sm={2} xs={2}>
                    <Row>
                      <Col lg={3} md={3} sm={3} xs={3}>
                        <Form.Label>Type</Form.Label>
                      </Col>
                      <Col lg={9} md={9} sm={9} xs={9}>
                        <Form.Group
                          className=""
                          onKeyDown={(e) => {
                            if (e.shiftKey && e.keyCode === 9) {
                            } else if (e.keyCode === 9) {
                              e.preventDefault();
                              this.handleKeyDown(e, "submit");
                            } else if (e.keyCode === 13) {
                              this.handleKeyDown(e, "submit");
                            }
                          }}
                        >
                          <Select
                            ref={this.hsnTypeRef}
                            className="selectTo"
                            id="type"
                            placeholder="Select Type"
                            styles={ledger_select}
                            // styles={createPro}
                            isClearable
                            options={typeoption}
                            name="type"
                            onChange={(value) => {
                              setFieldValue("type", value);
                            }}
                            value={values.type}
                          // ref={(input) => (this.inputRefs[2] = input)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={5} md={5} sm={5} xs={5} className="text-end">
                    <Button
                      className="submit-btn"
                      id="submit"
                      type="button"
                      // ref={(input) => (this.inputRefs[3] = input)}
                      onKeyDown={(e) => {
                        if (e.shiftKey && e.keyCode === 9) {
                          e.preventDefault();
                          this.hsnTypeRef.current?.focus();
                        } else if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          e.preventDefault();
                          this.ref.current.handleSubmit();
                        } else if (e.keyCode === 9) {
                          e.preventDefault();
                          this.handleKeyDown(e, "cancel");
                        }
                      }}
                    >
                      {values.id == "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      id="cancel"
                      variant="secondary cancel-btn ms-2"
                      onClick={(e) => {
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
                      }}
                      type="button"
                      // ref={(input) => (this.inputRefs[4] = input)}
                      onKeyDown={(e) => {
                        if (e.shiftKey && e.keyCode === 9) {
                          e.preventDefault();
                          this.handleKeyDown(e, "submit");
                        } else if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
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
              </Form>
            )}
          </Formik>
        </div>
        {/* </Collapse> */}

        <div className="cust_table">
          <Row className=""
            onKeyDown={(e) => {
              if (e.keyCode === 40) {
                document.getElementById("hsnTr_0")?.focus();
              }
            }}>
            <Col md="3">
              <InputGroup className="mb-2 mdl-text">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  id="searchHl"
                  // aria-label="Search"
                  // aria-describedby="basic-addon1"
                  className="mdl-text-box"
                  autoComplete="off"
                  // autoFocus={true}
                  onChange={(e) => {
                    e.preventDefault();
                    this.handleSearch(e.target.value);
                  }}
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>

          <div className="hsn-tbl-list-style tbl-list-style">
            {/* {gethsntable.length > 0 && ( */}
            {isActionExist("hsn", "list", this.props.userPermissions) && (
              <Table
                // hover
                size="sm"
              >
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>HSN No.</th>
                    <th style={{ width: "25%" }}>HSN Description</th>
                    <th style={{ width: "25%" }}>Type</th>
                    {/* <th style={{ width: "25%" }}>Action</th> */}
                  </tr>
                  {/* <tr>
                    <td>Total</td>
                  </tr> */}
                  {/* </div> */}
                </thead>
                <tbody
                  style={{ borderTop: "2px solid transparent" }}
                  className="prouctTableTr"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.shiftKey && e.keyCode == 9) {
                      document.getElementById("searchHl").focus();
                    } else if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {/* <div className="scrollban_new"> */}
                  {gethsntable.length > 0 ? (
                    gethsntable.map((v, i) => {
                      return (
                        <tr
                          value={JSON.stringify(v)}
                          id={`hsnTr_` + i}
                          // prId={v.id}
                          tabIndex={i}
                          onDoubleClick={(e) => {
                            if (
                              isActionExist(
                                "hsn",
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
                          {/* <td style={{ width: "25%" }}>{i + 1}</td> */}
                          <td style={{ width: "25%" }}>{v.hsnno}</td>
                          <td style={{ width: "25%" }}>{v.hsndesc}</td>
                          <td style={{ width: "25%" }}>{v.type}</td>
                          {/* <td>
                            {" "}
                            <img
                              src={delete_icon}
                              
                              className="del_icon"
                              title="Delete"
                              onClick={(e) => {
                                if (
                                  isActionExist(
                                    "hsn",
                                    "delete",
                                    this.props.userPermissions
                                  )
                                ) {
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
                                        this.deleteproducthsn(v.id);
                                      },
                                      handleFailFn: () => { },
                                    },
                                    () => {
                                      console.warn("return_data");
                                    }
                                  );
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
                            <th>Total HSN :</th>
                            <th>{gethsntable.length}</th>
                          </tr>
                        );
                      })}
                    </th>
                  </tr>
                </thead> */}
              </Table>
            )}
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
                          <span>HSN:</span>
                          <span>{gethsntable.length}</span>
                        </>
                      );
                    })}
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* )} */}
          </div>
          {/* </Form> */}
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

export default connect(mapStateToProps, mapActionsToProps)(HSN);
