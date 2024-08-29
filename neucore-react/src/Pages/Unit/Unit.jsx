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
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

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
class Unit extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.unitRef = React.createRef();
    this.state = {
      show: false,
      opendiv: false,
      showDiv: false,
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

  handleClose = () => {
    this.setState({ show: false });
  };

  callPrint = () => {
    // await window.Neutralino.window.create("/neucore-react/build/index.html", {
    //   title: "About my awesome app",
    //   alwaysOnTop: true,
    //   width: 500,
    //   height: 300,
    // });
    // this.printSingleFunc("printDiv");
    // let new_window = window.Neutralino.window.create("/", {
    //   enableInspector: true,
    //   width: 500,
    //   height: 300,
    //   maximizable: true,
    //   hidden: false,
    //   exitProcessOnClose: true,
    //   resizable: false,
    // });
    // var newIframe = document.createElement("iframe");
    // var content =
    //   '<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">' +
    //   '<head><link href="/css/print.css" media="all" rel="stylesheet" type="text/css"></head>' +
    //   "<body>(rest of body content)" +
    //   '<script type="text/javascript">function printPage() { window.focus(); window.print();return; }</script>' +
    //   "</body></html>";
    // newIframe.width = "0";
    // newIframe.height = "0";
    // newIframe.src = "about:blank";
    // document.body.appendChild(newIframe);
    // var body = "dddddd";
    // var newWin = document.createElement("iframe");
    // newWin.document.write(body);
    // newWin.document.close(); //important!
    // newWin.focus(); //IE fix
    // newWin.print();
    var newWin = window.frames["printf"];
    var divToPrint = document.getElementById("printDiv");
    let data = divToPrint.outerHTML;
    let htmlToPrint = '<body onload="window.print()">';
    // htmlToPrint +=
    //   "<script language='VBScript'>" +
    //   "Sub Print()" +
    //   "OLECMDID_PRINT = 6" +
    //   "OLECMDEXECOPT_DONTPROMPTUSER = 2" +
    //   "OLECMDEXECOPT_PROMPTUSER = 1" +
    //   "call WB.ExecWB(OLECMDID_PRINT, OLECMDEXECOPT_DONTPROMPTUSER,1)" +
    //   "End Sub" +
    //   "document.write \"<object ID='WB' WIDTH=0 HEIGHT=0 CLASSID='CLSID:8856F961-340A-11D0-A96B-00C04FD705A2'></object>\"" +
    //   '</script>"';
    htmlToPrint +=
      "<style>@media print {" +
      "body {" +
      "margin: 0;" +
      "color: #000;" +
      "background-color: #FFF;" +
      "}" +
      ".cust-text-success{" +
      "color:green;}" +
      +"table{" +
      "width: 100%;" +
      "border: 1px solid;" +
      "border-collapse: collapse;" +
      "margin-bottom: 5px;" +
      "}" +
      // ".cart_tbl{" +
      // "width: 50%;" +
      // "float: left;" +
      // "}" +
      "table td{" +
      "text-align:right;" +
      "border:1px solid #000;" +
      // "border-right:1px solid #000;" +
      // "border-bottom:1px solid #000;" +
      "padding:0.5em;" +
      "}" +
      "table th{" +
      "text-align:right;" +
      "border:1px solid #000;" +
      // "border-right:1px solid #000;" +
      // "border-bottom:1px solid #000;" +
      "padding:0.5em;" +
      "}" +
      "}</style>";
    htmlToPrint += data;
    htmlToPrint += "</body>";
    // newWin.focos();
    // newWin.document.print();
    newWin.document.write(htmlToPrint);
    // newWin.print();
    // newWin.close();
    newWin.document.close();
  };
  printSingleFunc = (DivID) => {
    var divToPrint = document.getElementById(DivID);

    var htmlToPrint =
      "" +
      '<style type="text/css">' +
      "table{" +
      "width: 100%;" +
      "border: 1px solid;" +
      "border-right: none;" +
      "border-bottom: none;" +
      "border-collapse: collapse;" +
      "margin-bottom: 5px;" +
      "}" +
      // ".cart_tbl{" +
      // "width: 50%;" +
      // "float: left;" +
      // "}" +
      "table td{" +
      "text-align:right;" +
      "border-right:1px solid #000;" +
      "border-bottom:1px solid #000;" +
      "padding:0.5em;" +
      "}" +
      "table th{" +
      "text-align:right;" +
      "border-right:1px solid #000;" +
      "border-bottom:1px solid #000;" +
      "padding:0.5em;" +
      "}" +
      ".lot_type h6{" +
      // "display:inline-block;" +
      "text-transform: uppercase;" +
      "font-size: 13px;" +
      "}" +
      ".div3 h3{" +
      "margin-top:0;" +
      "margin-bottom:0;" +
      "}" +
      ".div1{" +
      "display:inline-block;" +
      "}" +
      ".div2{" +
      "display:inline-block;" +
      "float:right;" +
      "}" +
      ".div3{" +
      "display:inline-block;" +
      "}" +
      ".div4{" +
      "display:inline-block;" +
      "}" +
      ".lot_type h5{" +
      // "display:inline-block;" +
      // "float:left;" +
      "}" +
      ".float-right{" +
      "float:right;" +
      "}" +
      ".cart_tbl{" +
      "margin-bottom:25px;" +
      "width: 49%;" +
      "margin-right: 11px;" +
      "overflow: hidden;" +
      "display: inline-block;" +
      "vertical-align: top;" +
      "}" +
      "</style>";

    htmlToPrint += divToPrint.outerHTML;
    // let data = divToPrint.outerHTML;
    // let newWin = window.open("");
    // selected_customer_list.length
    // newWin.document.write(htmlToPrint);
    // newWin.print();
    // newWin.close();
    // let window = Neutralino.window.create("https://localhost:7167/", {
    //   enableInspector: false,
    //   width: 500,
    //   height: 300,
    //   maximizable: false,
    //   hidden: false,
    //   exitProcessOnClose: true,
    // });

    // window.events.on("ready", (event) => {
    //   console.log("new window ready");
    // });
  };
  render() {
    const { show, data, initVal, opendiv, getunittable, showDiv } = this.state;
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
              unitName: Yup.string().trim().required("Unit name is required"),
              unitCode: Yup.object().required("Unit code is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                      this.pageReload();
                    } else {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: res.message,
                        is_timeout: true,
                        delay: 1000,
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
                      //  ShowNotification("Success", res.message);
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
                    } else {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: res.message,
                        is_timeout: true,
                        delay: 1000,
                      });
                    }
                  })
                  .catch((error) => {});
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
                autoComplete="off"
              >
                <Row style={{ background: "#CEE7F1" }} className="p-2">
                  <Col md={1}>
                    <Form.Label>Unit Name</Form.Label>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Control
                        autoFocus="true"
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
                        this.pageReload();
                        resetForm();
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
              <Form>
                <Row className="p-2">
                  <Col md="3">
                    {/* <Form>
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
                      }}
                    >
                      <img src={refresh} alt="icon" />
                    </Button>

                    {/* <Button
                className="ms-2 refresh-btn"
                onClick={(e) => {
                  e.preventDefault();
                  // this.pageReload();
                  this.setState({ show: true });

                  // this.callPrint();
                }}
              >
                Print
              </Button> */}
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
                  {/* <div className="scrollbar_hd"> */}
                  <tr>
                    {/* {this.state.showDiv && ( */}
                    {/* <th style={{ width: "20%" }}>Sr#</th> */}
                    {/* )} */}
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
                          // onDoubleClick={(e) => {
                          //   e.preventDefault();
                          //   this.handleFetchData(v.id);
                          // }}

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
                          {/* <td style={{ width: "20%" }}>{i + 1}</td> */}
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
                      {/* {Array.from(Array(1), (v) => {
                        return (
                          <tr>
                            <th>&nbsp;</th>
                          </tr>
                        );
                      })} */}
                      .
                    </th>
                  </tr>
                </thead>
              </Table>
            )}
            {/* )} */}
            {/* <iframe id="printf" name="printf" className="d-none"></iframe>
            <div id="printDiv" className="d-none">
              <h6 className="text-center">
                Woohoo, you're reading this text in a modal!
              </h6>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptas quas consequuntur, cupiditate, minus optio ratione ut
                modi vitae quasi enim, cumque delectus deserunt facere
                reprehenderit saepe! Et distinctio facere natus.
              </p>
            </div> */}
          </div>

          <Modal
            show={show}
            onHide={this.handleClose}
            animation={false}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <iframe id="printf" name="printf" className="d-none"></iframe>
              <div id="printDiv">
                <h6 className="cust-text-success">YASH MEDICAL</h6>

                <Table className="cust-table">
                  <tr>
                    <th>QTY</th>
                    <th>PRODUCT NAME</th>
                    <th>PACK</th>
                    <th>COMP</th>
                    <th>BATCH</th>
                    <th>EXP.</th>
                    <th>MRP</th>
                    <th>AMOUNT</th>
                  </tr>
                  <tr>
                    <td>10 Tab</td>
                    <td>TELMA 80 H</td>
                    <td>TAB</td>
                    <td>GLEN</td>
                    <td>18201063</td>
                    <td>10/23</td>
                    <td>400.00</td>
                    <td>266.67</td>
                  </tr>
                  <tr>
                    <td>10 Tab</td>
                    <td>TELMA 80 H</td>
                    <td>TAB</td>
                    <td>GLEN</td>
                    <td>18201063</td>
                    <td>10/23</td>
                    <td>400.00</td>
                    <td>266.67</td>
                  </tr>
                  <tr>
                    <td>10 Tab</td>
                    <td>TELMA 80 H</td>
                    <td>TAB</td>
                    <td>GLEN</td>
                    <td>18201063</td>
                    <td>10/23</td>
                    <td>400.00</td>
                    <td>266.67</td>
                  </tr>
                  <tr>
                    <td>10 Tab</td>
                    <td>TELMA 80 H</td>
                    <td>TAB</td>
                    <td>GLEN</td>
                    <td>18201063</td>
                    <td>10/23</td>
                    <td>400.00</td>
                    <td>266.67</td>
                  </tr>
                </Table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  this.callPrint();
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
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
