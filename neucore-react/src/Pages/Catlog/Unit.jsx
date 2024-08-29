import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  //CloseButton,
  Collapse,
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";
import {
  createUnit,
  getAllUnit,
  updateUnit,
  get_units,
} from "@/services/api_functions";
import {
  //getHeader,
  ShowNotification,
  AuthenticationCheck,
  customStyles,
  getValue,
  isActionExist,
  //eventBus,
  MyNotifications,
  createPro,
} from "@/helpers";
import Select from "react-select";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import { only_alphabets } from "../../helpers/constants";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const uomoption = [
  { label: "BAG-Bag", value: "Services" },
  { label: "BAL-Bale", value: "BAL" },
  { label: "BDL-Bundles", value: "BDL" },
  { label: "BKL-Buckles", value: "BKL" },
  { label: "BOU-Billions Of Units", value: "BOU" },
  { label: "BOX-Box", value: "BOX" },
  { label: "BTL-Bottles", value: "BTL" },
  { label: "BUN-Bunches", value: "BUN" },
  { label: "CAN-Cans", value: "CAN" },
  { label: "CBM-Cubic Meter", value: "CBM" },
  { label: "CCM-Cubic Centimeter", value: "CCM" },
  { label: "CMS-Centimeter", value: "CMS" },
  { label: "CTN-Cartons", value: "CTN" },
  { label: "DOZ-Dozen", value: "DOZ" },
  { label: "DRM-Drum", value: "DRM" },
  { label: "GGR-Great Gross", value: "GGR" },
  { label: "GMS-Grams", value: "GMS" },
  { label: "GRS-Gross", value: "GRS" },
  { label: "GYD-Gross Yard", value: "GYD" },
  { label: "KGS-Kilograms", value: "KGS" },
  { label: "KLR-Kilo Liter", value: "KLR" },
  { label: "KME-Kilo Meter", value: "KME" },
  { label: "MLT-Milliliter", value: "MLT" },
  { label: "MTR-Meters", value: "MTR" },
  { label: "MTS-Metric Tons", value: "MTS" },
  { label: "NOS-Numbers", value: "NOS" },
  { label: "PAC-Packs", value: "PAC" },
  { label: "PCS-Pieces", value: "PCS" },
  { label: "PRS-Pairs", value: "PRS" },
  { label: "QTL-Quintal", value: "QTL" },
  { label: "ROL-Rolls", value: "ROL" },
  { label: "SET-Sets", value: "SET" },
  { label: "SQF-Square Feet", value: "SQF" },
  { label: "SQM-Square Meters", value: "SQM" },
  { label: "TBS-Tablets", value: "TBS" },
  { label: "TGM-Ten Gross", value: "TGM" },
  { label: "THD-Thousands", value: "THD" },
  { label: "TON-Tonnes", value: "TON" },
  { label: "TUB-Tubes", value: "TUB" },
  { label: "UGS-US Gallons", value: "UGS" },
  { label: "UNT-Units", value: "UNT" },
  { label: "SQY-Square Yards	", value: "SQY" },
  { label: "GYD-Gross Yards", value: "GYD" },
  { label: "YDS-Yards", value: "YDS" },
  { label: "OTH-Others", value: "OTH" },
];
class Unit extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.unitRef = React.createRef();
    this.nameInput = React.createRef();
    this.state = {
      data: [],
      orgData: [],
      getunittable: [],
      initVal: {
        id: "",
        unitName: "",
        unitCode: "",
        uom: "",
      },
    };
  }

  lstUnit = () => {
    getAllUnit()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            this.setState({ getunittable: data, orgData: data }, () => {
              this.unitRef.current.setFieldValue("search", "");
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
        v.unitName.toLowerCase().includes(vi.toLowerCase()) ||
        v.unitCode.toLowerCase().includes(vi.toLowerCase())
    );
    if (vi.length == 0) {
      this.setState({
        getunittable: orgData,
      });
    } else {
      this.setState({
        getunittable: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  setInitValue = () => {
    let initVal = {
      id: "",
      unitName: "",
      // unitCode: getValue(uomoption),
      unitCode: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.nameInput.current.focus();
      this.lstUnit();
      this.setInitValue();
    }
  }

  pageReload = () => {
    this.setInitValue();
    this.componentDidMount();
    this.unitRef.current.resetForm();
  };

  handleFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_units(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            unitName: res.unitName,
            unitCode: res.unitCode ? getValue(uomoption, res.unitCode) : "",
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
    const { show, initVal, getunittable } = this.state;
    return (
      <div className="ledger-group-style">
        <div className="main-div mb-2 m-0">
          <h4 className="form-header">Create Unit</h4>
          <Formik
            innerRef={this.myRef}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={initVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              unitName: Yup.string()
                .trim()
                // .matches(only_alphabets, "Enter Only Alphabet")
                .required("Unit name is required"),
              unitCode: Yup.object().required("Unit code is required"),
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
                    requestData.append("unitName", values.unitName);
                    requestData.append("unitCode", values.unitCode.value);

                    if (values.id == "") {
                      createUnit(requestData)
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
                      updateUnit(requestData)
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
                  <Col md={1}>
                    <Form.Label>Unit Name</Form.Label>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Control
                        ref={(input) => {
                          this.nameInput.current = input;
                        }}
                        type="text"
                        placeholder="Unit Name"
                        name="unitName"
                        className="text-box"
                        id="unitName"
                        onChange={handleChange}
                        value={values.unitName}
                        isValid={touched.unitName && !errors.unitName}
                        isInvalid={!!errors.unitName}
                      />
                      {/* <Form.Control.Feedback type="invalid"> */}
                      <span className="text-danger errormsg">
                        {errors.unitName}
                      </span>
                      {/* </Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    <Form.Label>Unit Code</Form.Label>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Select
                        className="selectTo"
                        id="unitCode"
                        placeholder="Unit Code"
                        // styles={customStyles}
                        styles={createPro}
                        isClearable
                        options={uomoption}
                        name="unitCode"
                        onChange={(value) => {
                          setFieldValue("unitCode", value);
                        }}
                        value={values.unitCode}
                      />

                      <span className="text-danger errormsg">
                        {errors.unitCode}
                      </span>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="my-auto btn_align">
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
            innerRef={this.unitRef}
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
              // {!opendiv && (
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
            {isActionExist("unit", "list", this.props.userPermissions) && (
              <Table
                // hover
                size="sm"
                // className="tbl-font"
                //responsive
              >
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Unit Name</th>
                    <th style={{ width: "60%" }}>Unit Code</th>
                  </tr>
                  {/* </div> */}
                </thead>
                <tbody style={{ borderTop: "2px solid transparent" }}>
                  {getunittable.length > 0 ? (
                    getunittable.map((v, i) => {
                      return (
                        <tr
                          onDoubleClick={(e) => {
                            if (
                              isActionExist(
                                "unit",
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
                          <td style={{ width: "40%" }}>{v.unitName}</td>
                          <td style={{ width: "60%" }}>{v.unitCode}</td>
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
                            {/* <th>&nbsp;</th> */}
                            <th style={{ width: "25%" }}>Total Unit :</th>
                            <td style={{ width: "60%" }}>
                              {getunittable.length}
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

export default connect(mapStateToProps, mapActionsToProps)(Unit);
