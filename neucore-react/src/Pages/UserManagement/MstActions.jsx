import React, { Component } from "react";
import { Button, Col, Row, Form, Table, Collapse } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createAccessActions,
  getMasterActions,
  updateUnit,
  get_units,
} from "@/services/api_functions";
import {
  getHeader,
  ShowNotification,
  AuthenticationCheck,
  getValue,
  convertToSlug,
  MyNotifications,
  OnlyAlphabets,
} from "@/helpers";
import Select from "react-select";
import refresh from "@/assets/images/refresh.png";
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
export default class MstActions extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
      data: [],
      getunittable: [],
      initVal: {
        id: "",
        unitName: "",
        unitCode: "",
        uom: "",
      },
    };
  }

  lstActions = () => {
    getMasterActions()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            this.setState({ getunittable: data });
          }
        }
      })
      .catch((error) => {});
  };

  setInitValue = () => {
    let initVal = {
      id: "",
      name: "",
      // unitCode: getValue(uomoption),
      slug: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstActions();
      this.setInitValue();
    }
  }

  pageReload = () => {
    // this.setInitValue();
    this.componentDidMount();
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

  render() {
    const { show, data, initVal, opendiv, getunittable, showDiv } = this.state;
    return (
      <div className="company-form-style">
        <Collapse in={opendiv}>
          <div className="main-div mb-2 m-0">
            <h4 className="form-header">Create Action</h4>
            <Formik
              innerRef={this.myRef}
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={initVal}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({
                name: Yup.string().trim().required("Name is required"),
                slug: Yup.string().required("Slug is required"),
              })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let requestData = new FormData();
                requestData.append("name", values.name);
                requestData.append("slug", values.slug);
                if (values.id == "") {
                  MyNotifications.fire({
                    show: true,
                    icon: "confirm",
                    title: "Confirm",
                    msg: "Do you want to save",
                    is_button_show: false,
                    is_timeout: false,
                    delay: 0,
                    handleSuccessFn: () => {
                      createAccessActions(requestData)
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
                            this.pageReload();
                            this.setInitValue();
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Error While Creating Action",
                              is_timeout: true,
                              delay: 1000,
                            });
                          }
                        })
                        .catch((error) => {
                          setSubmitting(false);
                          console.log("error", error);
                        });
                    },
                    handleFailFn: () => {
                      setSubmitting(false);
                    },
                  });
                } else {
                  requestData.append("id", values.id);
                  // updateUnit(requestData)
                  //   .then((response) => {
                  //     let res = response.data;
                  //     if (res.responseStatus == 200) {
                  //       ShowNotification("Success", res.message);
                  //       this.myRef.current.resetForm();
                  //       this.pageReload();
                  //     } else {
                  //       ShowNotification("Error", res.message);
                  //     }
                  //   })
                  //   .catch((error) => {});
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
                <Form onSubmit={handleSubmit} className="form-style">
                  <Row className="my-3">
                    <Col md="1">
                      <Form.Label>Action Name</Form.Label>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <Form.Control
                          className="text-box"
                          autoFocus="true"
                          type="text"
                          placeholder="Action Name"
                          name="name"
                          id="name"
                          onChange={(e) => {
                            let v = e.target.value;
                            setFieldValue("name", v);
                            setFieldValue("slug", convertToSlug(v));
                          }}
                          value={values.name}
                          isValid={touched.name && !errors.name}
                          isInvalid={!!errors.name}
                        />
                        {/* <Form.Control.Feedback type="invalid"> */}
                        <span className="text-danger errormsg">
                          {errors.name}
                        </span>
                        {/* </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>

                    <Col md="1">
                      <Form.Label>Action Slug</Form.Label>
                    </Col>
                    <Col md="3">
                      <Form.Group>
                        <Form.Control
                          className="text-box"
                          autoFocus="true"
                          type="text"
                          placeholder="Action Slug"
                          name="slug"
                          id="slug"
                          onChange={handleChange}
                          value={values.slug}
                          isValid={touched.slug && !errors.slug}
                          isInvalid={!!errors.slug}
                        />
                        {/* <Form.Control.Feedback type="invalid"> */}
                        <span className="text-danger errormsg">
                          {errors.slug}
                        </span>
                        {/* </Form.Control.Feedback> */}
                      </Form.Group>
                    </Col>
                    <Col md="4" className=" text-end">
                      <Button className="submit-btn" type="submit">
                        {values.id == "" ? "Save" : "Update"}
                      </Button>
                      <Button
                        variant="secondary cancel-btn ms-2"
                        onClick={(e) => {
                          e.preventDefault();
                          // console.log("reset");
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
                                this.myRef.current.resetForm();
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
          </div>
        </Collapse>
        <div className="cust_table">
          <Row className="py-2 mx-0">
            <Col md="3">
              <Form>
                <Form.Group className="mt-1" controlId="formBasicSearch">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className="search-box"
                  />
                  {/* <Button type="submit">x</Button> */}
                </Form.Group>
              </Form>
            </Col>
            <Col md="9" className="mt-2 btn_align mainbtn_create">
              {!opendiv && (
                <Button
                  className="create-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ opendiv: !opendiv });
                  }}
                  aria-controls="example-collapse-text"
                  aria-expanded={opendiv}
                  // onClick={this.open}
                >
                  Create
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style pt-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg> */}
                </Button>
              )}
              {/* <Button
                className="ml-2 btn-refresh"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  this.pageReload();
                }}
              >
                <img src={refresh} alt="icon" />
              </Button> */}
            </Col>
          </Row>
          {/* )} */}

          <div className="tbl-list-style">
            {/* {getunittable.length > 0 && ( */}
            <Table size="sm" hover className="tbl-font">
              <thead>
                {/* <div className="scrollbar_hd"> */}
                <tr>
                  {/* {this.state.showDiv && ( */}
                  <th>Sr.</th>
                  {/* )} */}
                  <th>Action Name</th>
                  <th>Action Slug</th>
                </tr>
                {/* </div> */}
              </thead>
              <tbody>
                {/* {JSON.stringify(getunittable)} */}
                {getunittable.length > 0 ? (
                  getunittable.map((v, i) => {
                    return (
                      <tr
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          this.handleFetchData(v.id);
                        }}
                      >
                        <td>{i + 1}</td>
                        <td>{v.name}</td>
                        <td>{v.slug}</td>
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
            </Table>
            {/* )} */}
          </div>
        </div>
      </div>
    );
  }
}
