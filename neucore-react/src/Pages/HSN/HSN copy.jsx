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
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createHSN,
  getAllHSN,
  updateHSN,
  get_hsn,
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
} from "@/helpers";
import axios from "axios";
import Select from "react-select";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const typeoption = [
  { label: "Services", value: "Services" },
  { label: "Goods", value: "Goods" },
];
const uomoption = [
  { label: "BAG", value: "Services" },
  { label: "BAL", value: "BAL" },
  { label: "BDL", value: "BDL" },
  { label: "BKL", value: "BKL" },
  { label: "BOU", value: "BOU" },
  { label: "BOX", value: "BOX" },
  { label: "BTL", value: "BTL" },
  { label: "BUN", value: "BUN" },
  { label: "CAN", value: "CAN" },
  { label: "CBM", value: "CBM" },
  { label: "CCM", value: "CCM" },
  { label: "CMS", value: "CMS" },
  { label: "CTN", value: "CTN" },
  { label: "DOZ", value: "DOZ" },
  { label: "DRM", value: "DRM" },
  { label: "GGK", value: "GGK" },
  { label: "GMS", value: "GMS" },
  { label: "GRS", value: "GRS" },
  { label: "GYD", value: "GYD" },
  { label: "KGS", value: "KGS" },
  { label: "KLR", value: "KLR" },
  { label: "KME", value: "KME" },
  { label: "MLT", value: "MLT" },
  { label: "MTR", value: "MTR" },
  { label: "MTS", value: "MTS" },
  { label: "NOS", value: "NOS" },
  { label: "PAC", value: "PAC" },
  { label: "PCS", value: "PCS" },
  { label: "PRS", value: "PRS" },
  { label: "QTL", value: "QTL" },
  { label: "ROL", value: "ROL" },
  { label: "SET", value: "SET" },
  { label: "SQF", value: "SQF" },
  { label: "SQM", value: "SQM" },
  { label: "TBS", value: "TBS" },
  { label: "TGM", value: "TGM" },
  { label: "THD", value: "THD" },
  { label: "TON", value: "TON" },
  { label: "TUB", value: "TUB" },
  { label: "UGS", value: "UGS" },
  { label: "UNT", value: "UNT" },
  { label: "YDS", value: "YDS" },
  { label: "OTH", value: "OTH" },
];

class HSN extends React.Component {
  constructor(props) {
    super(props);
    this.hsnRef = React.createRef();
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
        type: "",
      },
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  };
  handleModalStatus = (status) => {
    if (status == true) {
      this.setInitValue();
    }
    this.setState({ show: status }, () => {
      this.pageReload();
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  letHsnlst = () => {
    getAllHSN()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            { gethsntable: res.responseObject, orgData: res.responseObject },
            () => {
              this.hsnRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ gethsntable: [] });
      });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setInitValue();
      this.letHsnlst();
    }
  }

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
    this.setState({ initVal: initVal, opendiv: false });
  };

  handleGstChange = (value, element, setFieldValue) => {
    let flag = false;
    if (element == "igst") {
      if (value != "") {
        let igst = parseFloat(value);
        let hgst = parseFloat(igst / 2);
        setFieldValue("igst", igst);
        setFieldValue("cgst", hgst);
        setFieldValue("sgst", hgst);
      } else {
        flag = true;
      }
    } else {
      if (value != "") {
        let hgst = parseFloat(value);
        let igst = hgst + hgst;
        setFieldValue("igst", igst);
        setFieldValue("cgst", hgst);
        setFieldValue("sgst", hgst);
      } else {
        flag = true;
      }
    }

    if (flag == true) {
      setFieldValue("igst", "");
      setFieldValue("cgst", "");
      setFieldValue("sgst", "");
    }
  };

  handleClose = () => {
    this.setState({ show: false }, () => {
      this.pageReload();
    });
  };

  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
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
    this.setState({
      gethsntable: orgData_F.length > 0 ? orgData_F : orgData,
    });
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
          this.setState({ initVal: initVal, opendiv: true });
        } else {
          ShowNotification("Error", result.message);
        }
      })
      .catch((error) => {});
  };

  render() {
    const { show, data, initVal, opendiv, gethsntable, showDiv } = this.state;
    return (
      <div className="">
        <Collapse in={opendiv}>
          <div id="example-collapse-text" className="common-form-style m-2 p-2">
            <div className="main-div mb-2 m-0">
              <h4 className="form-header">Create HSN</h4>
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                enableReinitialize={true}
                initialValues={initVal}
                validationSchema={Yup.object().shape({
                  hsnNumber: Yup.string()
                    .trim()
                    .required("HSN number is required"),
                  description: Yup.string()
                    .trim()
                    .required("HSN description is required"),
                  type: Yup.object().required("Select type").nullable(),
                  // igst: Yup.string().trim().required('IGST is required'),
                  // cgst: Yup.string().trim().required('CGST is required'),
                  // sgst: Yup.string().trim().required('SGST is required'),
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let keys = Object.keys(values);
                  let requestData = new FormData();

                  keys.map((v) => {
                    if (v != "type") {
                      requestData.append(v, values[v] ? values[v] : "");
                    } else if (v == "type") {
                      requestData.append("type", values.type.value);
                    }
                  });

                  if (values.id == "") {
                    createHSN(requestData)
                      .then((response) => {
                        resetForm();
                        setSubmitting(false);
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          this.handleModalStatus(false);
                          ShowNotification("Success", res.message);
                          resetForm();
                          this.props.handleRefresh(true);
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                      });
                  } else {
                    updateHSN(requestData)
                      .then((response) => {
                        resetForm();
                        setSubmitting(false);
                        let res = response.data;
                        if (res.responseStatus == 200) {
                          this.handleModalStatus(false);
                          ShowNotification("Success", res.message);
                          resetForm();
                          this.props.handleRefresh(true);
                        } else {
                          ShowNotification("Error", res.message);
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                      });
                  }
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
                  >
                    <Row>
                      <Col md="2">
                        <Form.Group>
                          <Form.Label>HSN</Form.Label>
                          <Form.Control
                            autoFocus="true"
                            type="text"
                            placeholder="HSN No"
                            name="hsnNumber"
                            id="hsnNumber"
                            onChange={handleChange}
                            value={values.hsnNumber}
                            isValid={touched.hsnNumber && !errors.hsnNumber}
                            isInvalid={!!errors.hsnNumber}
                          />
                          {/* <Form.Control.Feedback type="invalid"> */}
                          <span className="text-danger errormsg">
                            {errors.hsnNumber}
                          </span>
                          {/* </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>
                      <Col md="5">
                        <Form.Group>
                          <Form.Label>HSN Description</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="HSN Description"
                            name="description"
                            id="description"
                            onChange={handleChange}
                            value={values.description}
                            isValid={touched.description && !errors.description}
                            isInvalid={!!errors.description}
                          />
                          {/* <Form.Control.Feedback type="invalid"> */}
                          <span className="text-danger errormsg">
                            {errors.description}
                          </span>
                          {/* </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>
                      <Col md="2">
                        <Form.Group className="">
                          <Form.Label>Type</Form.Label>
                          <Select
                            className="selectTo"
                            id="type"
                            placeholder="Select Type"
                            styles={customStyles}
                            isClearable
                            options={typeoption}
                            name="type"
                            onChange={(value) => {
                              setFieldValue("type", value);
                            }}
                            value={values.type}
                          />
                          <span className="text-danger errormsg">
                            {errors.type}
                          </span>
                        </Form.Group>
                      </Col>
                      {/* <Col md="1">
                              <Form.Group className="">
                                <Form.Label>UOM/ UQC</Form.Label>
                                <Select
                                  className="selectTo"
                                  id="uom"
                                  placeholder="UOM"
                                  styles={customStyles}
                                  isClearable
                                  options={uomoption}
                                  name="uom"
                                />
                                {/* <Form.Control.Feedback type="invalid"> */}
                      {/* <span className="text-danger errormsg">
                                  {errors.cgst}
                                  </span> */}
                      {/* </Form.Control.Feedback> */}
                      {/* </Form.Group> */}
                      {/* </Col> */}
                      <Col md="3" className="mt-4 pt-1 btn_align">
                        <Button
                          className="submit-btn successbtn-style"
                          type="submit"
                        >
                          {values.id == "" ? "Submit" : "Update"}
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          // onClick={(e) => {
                          //   e.preventDefault();
                          //   this.setState({ opendiv: !opendiv }, () => {
                          //     this.pageReload();
                          //   });
                          // }}
                          // onClick={(e) => {
                          //   e.preventDefault();
                          //   this.pageReload();
                          // }}
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ opendiv: !opendiv }, () => {
                              this.pageReload();
                            });
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
          </div>
        </Collapse>
        <div className="wrapper_div">
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            innerRef={this.hsnRef}
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
              <Form>
                <Row className="p-2">
                  <Col md="3">
                    <Form>
                      <Form.Group className="mt-1" controlId="formBasicSearch">
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
                        {/* <Button type="submit">x</Button> */}
                      </Form.Group>
                    </Form>
                  </Col>

                  <Col md="9" className="mt-2 text-end">
                    {/* {this.state.hide == 'true'} */}
                    {!opendiv && (
                      <Button
                        className="create-btn mr-2"
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   this.setState({ opendiv: !opendiv });
                        // }}

                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            isActionExist(
                              "hsn",
                              "create",
                              this.props.userPermissions
                            )
                          ) {
                            // eventBus.dispatch("page_change", "hsn");
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
                        // onClick={this.open}
                      >
                        Create
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          class="bi bi-plus-square-dotted svg-style"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                        </svg>
                      </Button>
                    )}

                    <Button
                      className="ml-2 refresh-btn"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   this.props.handleRefresh(true);
                      // }}
                      onClick={(e) => {
                        e.preventDefault();
                        this.pageReload();
                      }}
                    >
                      Refresh
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
          {/* )} */}

          <div className="table_wrapper row-inside tblresponsive">
            {/* {gethsntable.length > 0 && ( */}
            {isActionExist("hsn", "list", this.props.userPermissions) && (
              <Table
                hover
                size="sm"
                className="tbl-font"

                // responsive
              >
                <thead>
                  {/* <div className="scrollbar_hd"> */}
                  <tr>
                    {/* {this.state.showDiv && ( */}
                    <th>Sr.</th>
                    {/* )} */}

                    <th>HSN No.</th>
                    <th>Description</th>
                    <th>Type</th>
                  </tr>
                  {/* </div> */}
                </thead>
                <tbody className="tabletrcursor">
                  {/* <div className="scrollban_new"> */}
                  {gethsntable.length > 0 ? (
                    gethsntable.map((v, i) => {
                      return (
                        <tr
                          // onDoubleClick={(e) => {
                          //   e.preventDefault();
                          //   this.handleFetchData(v.id);
                          // }}
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
                          <td>{i + 1}</td>

                          <td>{v.hsnno}</td>
                          <td>{v.hsndesc}</td>
                          <td>{v.type}</td>
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
              </Table>
            )}
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
