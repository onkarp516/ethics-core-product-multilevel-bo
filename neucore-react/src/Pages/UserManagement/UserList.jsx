import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  InputGroup,
} from "react-bootstrap";
import delete_icon from "@/assets/images/delete_icon3.png";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  get_companies_super_admin,
  createCompanyUser,
  get_c_users,
  get_user_by_id,
  updateInstituteUser,
  get_b_users,
  delete_user,
} from "@/services/api_functions";
import Select from "react-select";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  isActionExist,
  MyNotifications,
  AuthenticationCheck,
  customStyles,
  eventBus,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket, faCalculator, faCirclePlus, faCircleQuestion, faFloppyDisk, faGear, faHouse, faPen, faPrint, faQuestion, faRightFromBracket, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opendiv: false,
      opCompanyList: [],
      orgData: [],
      data: [],
      CompanyInitVal: {
        id: "",
        companyId: "",
        fullName: "",
        mobileNumber: "",
        userRole: "USER",
        email: "",
        gender: "",
        usercode: "",
        password: "",
      },
      userRole: "USER",
    };
    this.ref = React.createRef();
    this.SearchRef = React.createRef();
  }

  listUsers = () => {
    get_b_users()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            this.setState({ data: data, orgData: data });
            setTimeout(() => {
              if (this.props.block.prop_data.rowId) {
                document.getElementById("ledgerTr_" + this.props.block.prop_data.rowId).focus();
              }
              if (this.props.block.prop_data.userId) {
                document.getElementById("ledgerTr_0").focus();
              }
              else if (document.getElementById("Search") != null) {
                {
                  document.getElementById("Search").focus();
                }
              }
            }, 1000);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };
  deleteUser = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_user(formData)
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
        this.setState({ listUsers: [] });
      });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listUsers();
      this.setInitValue();
      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValue);
    }
  }

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValue);
  }

  setInitValue = () => {
    this.setState(
      {
        opendiv: false,
        opCompanyList: [],
        data: [],
        userRole: "USER",
      },
      () => {
        setTimeout(() => {
          this.SearchRef.current?.focus();
        }, 1000);
      }
    );
  };

  pageReload = () => {
    this.componentDidMount();
  };


  FocusTrRowFieldsID(fieldName) {
    console.log("fieldName", fieldName)
    // document.getElementById("TPIEProductId-packing_1").focus();
    if (document.getElementById(fieldName) != null) {
      document.getElementById(fieldName).focus();
    }
  }

  handleSearch = (vi) => {
    // console.log({ vi });
    let { orgData } = this.state;
    // console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        (v.companyName != null &&
          v.companyName.toLowerCase().includes(vi.toLowerCase())) ||
        (v.fullName != null &&
          v.fullName.toLowerCase().includes(vi.toLowerCase())) ||
        (v.mobileNumber != null && v.mobileNumber.toString().includes(vi)) ||
        (v.email != null && v.email.toLowerCase().includes(vi.toLowerCase())) ||
        (v.gender != null &&
          v.gender.toLowerCase().includes(vi.toLowerCase())) ||
        (v.usercode != null &&
          v.usercode.toLowerCase().includes(vi.toLowerCase()))
    );

    if (vi.length == 0) {
      this.setState({
        data: orgData,
      });
    } else {
      this.setState({
        data: orgData_F.length > 0 ? orgData_F : [],
      });
    }
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
        let index = JSON.parse(cuurentProduct.getAttribute("tabIndex"));
        eventBus.dispatch("page_change", {
          from: "user_mgnt_list",
          to: "user_mgnt_edit",
          // prop_data: selectedLedger,
          prop_data: { prop_data: selectedLedger, rowId: index },
          isNewTab: false,
        });

        // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
      }
    }
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        <div className="ledger-group-style" style={{ overflow: "hidden" }}>
          <div className="cust_table">
            <Row
              onKeyDown={(e) => {
                if (e.keyCode === 40) {
                  document.getElementById("ledgerTr_0")?.focus();
                }
              }}>
              <Col md="3">
                <div className="">
                  {/* <Form>
                    <Form.Group className="mt-1 " controlId="formBasicSearch">
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        className="search-box"
                        name="Search"
                        id="Search"
                        onChange={(e) => {
                          this.handleSearch(e.target.value);
                        }}
                      />
                    </Form.Group>
                  </Form> */}
                  <InputGroup className="mb-2 mdl-text">
                    <Form.Control
                      placeholder="Search"
                      ref={this.SearchRef}
                      // aria-label="Search"
                      // aria-describedby="basic-addon1"
                      // style={{ borderRight: "none" }}
                      className="mdl-text-box"
                      autoFocus="true"
                      onChange={(e) => {
                        this.handleSearch(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          this.FocusTrRowFieldsID(
                            "UL_create_btn"
                          );
                        }
                      }}
                    />
                    <InputGroup.Text
                      className="int-grp"
                      id="basic-addon1"
                      style={{ border: "1px solid #fff" }}
                    >
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </div>
              </Col>
              <Col md="9" className="text-end">
                <Button
                  className="create-btn"
                  id="UL_create_btn"
                  style={{ borderRadius: "6px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    eventBus.dispatch("page_change", "user_mgnt_create");
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      eventBus.dispatch("page_change", "user_mgnt_create");
                    }
                  }}
                  aria-controls="example-collapse-text"
                >
                  Create
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg> */}
                </Button>

                {/* <Button
                  className="ml-2 btn-refresh"
                  type="button"
                  onClick={() => {
                    this.pageReload();
                  }}
                >
                  <img src={refresh} alt="icon" />
                </Button> */}
              </Col>
            </Row>
            <div className="tbl-list-style1">
              <Table size="sm" className="tbl-font">
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>Company Name</th>
                    <th>Full Name</th>
                    <th>Mobile Number</th>
                    <th>E-mail</th>
                    <th>Gender</th>
                    <th>UserCode</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody
                  style={{ borderTop: "2px solid transparent" }}
                  className="prouctTableTr"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.shiftKey && e.keyCode == 9) {
                      document.getElementById("UL_create_btn").focus();
                    }
                    else if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      return (
                        <tr
                          value={JSON.stringify(v)}
                          id={`ledgerTr_` + i}
                          // prId={v.id}
                          tabIndex={i}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            // if (isActionExist("sales-quotation", "edit")) {
                            eventBus.dispatch("page_change", {
                              from: "user_mgnt_list",
                              to: "user_mgnt_edit",
                              prop_data: { prop_data: v, rowId: i },
                              isNewTab: false,
                            });
                            // } else {
                            //   MyNotifications.fire({
                            //     show: true,
                            //     icon: "error",
                            //     title: "Error",
                            //     msg: "Permission is denied!",
                            //     is_button_show: true,
                            //   });
                            // }
                          }}
                        >
                          <td>{i + 1}</td>
                          <td>{v.companyName}</td>
                          <td>{v.fullName}</td>
                          <td>{v.mobileNumber}</td>
                          <td>{v.email != "NA" ? v.email : ""}</td>
                          <td>{v.gender}</td>
                          <td>{v.usercode}</td>
                          {/* <td>
                            {" "}
                            <img
                              src={delete_icon}
                              className="delete-img"
                              title="Delete"
                              onClick={(e) => {
                                if (
                                  isActionExist(
                                    "user",
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
                                        this.deleteUser(v.id);
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
                      <td colSpan={8} className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
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

                            <th>Total User List :</th>
                            <th>{data.length}</th>
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
                            <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+A</span>
                          </Form.Label>
                        </Col>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">F2</span>
                          </Form.Label>
                        </Col>

                      </Row>

                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+E</span>
                          </Form.Label>
                        </Col>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+S</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+D</span>
                          </Form.Label>
                        </Col>

                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Alt+C</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">F11</span>
                          </Form.Label>
                        </Col>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+Z</span>
                          </Form.Label>
                        </Col>


                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+P</span>
                          </Form.Label>
                        </Col>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Export</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
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
                            <span>User:</span>
                            <span>{data.length}</span>
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
      </div>
    );
  }
}
