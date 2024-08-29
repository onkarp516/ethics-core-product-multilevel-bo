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

import { Formik } from "formik";
import * as Yup from "yup";
import {
  authenticationService,
  getRolePermissionList,
  updateInstituteUser,
  get_b_users,
} from "@/services/api_functions";
import Select from "react-select";
import {
  EMAILREGEXP,
  numericRegExp,
  ShowNotification,
  getValue,
  AuthenticationCheck,
  customStyles,
  eventBus,
} from "@/helpers";
import mousetrap from "mousetrap";
import "mousetrap-global-bind";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import delete_icon from "@/assets/images/delete_icon3.png";

export default class RoleList extends Component {
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
  }

  getRoleList = () => {
    getRolePermissionList()
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            this.setState({ data: data, orgData: data });
          }

          setTimeout(() => {
            if (this.props.block.prop_data.rowId >= 0) {
              document
                .getElementById("RoleTr_" + this.props.block.prop_data.rowId)
                .focus();
            } else if (
              this.props.block.prop_data.roleId !== "" &&
              this.props.block.prop_data.roleId !== undefined
            ) {
              const index = data.findIndex((object) => {
                return object.id === this.props.block.prop_data.roleId;
              });
              if (index >= 0)
                document.getElementById("RoleTr_" + index).focus();
            } else if (document.getElementById("SearchRole") != null) {
              {
                document.getElementById("SearchRole").focus();
              }
            }
          }, 1500);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSubmitForm = () => {
    this.ref.current.submitForm();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getRoleList();
      this.setInitValue();
      mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      mousetrap.bindGlobal("ctrl+c", this.setInitValue);

      // setTimeout(() => {
      //   if (this.props.block.prop_data.rowId) {
      //     document
      //       .getElementById("RoleTr_" + this.props.block.prop_data.rowId)
      //       .focus();
      //   } else if (document.getElementById("Search1") != null) {
      //     {
      //       document.getElementById("Search1").focus();
      //     }
      //   }
      // }, 100);
    }
  }

  componentWillUnmount() {
    mousetrap.unbindGlobal("ctrl+s", this.handleSubmitForm);
    mousetrap.unbindGlobal("ctrl+c", this.setInitValue);
  }

  setInitValue = () => {
    this.setState({
      opendiv: false,
      opCompanyList: [],
      data: [],
      userRole: "USER",
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  handleSearch = (vi) => {
    // console.log({ vi });
    let { orgData } = this.state;
    // console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        v.roleName != null &&
        v.roleName.toLowerCase().includes(vi.toLowerCase())
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
          from: "rolelist",
          to: "roleedit",
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
      <div className="company-form-style" style={{ overflow: "hidden" }}>
        <div className="ledger-group-style">
          <div className="cust_table">
            <Row
              onKeyDown={(e) => {
                if (e.keyCode === 40) {
                  document.getElementById("RoleTr_0")?.focus();
                }
              }}>
              {/* <Col md="3">  
                <div className="">
                  <Form>
                    <Form.Group className="mt-1" controlId="formBasicSearch">
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
                  </Form>
                </div>
              </Col> */}
              <Col md="3">
                <InputGroup className="mb-2  mdl-text">
                  <Form.Control
                    type="text"
                    name="Search"
                    id="SearchRole"
                    onChange={(e) => {
                      this.handleSearch(e.target.value);
                    }}
                    placeholder="Search"
                    className="mdl-text-box"
                    autoFocus={true}
                    autoComplete="SearchRole"
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                        document.getElementById("RL_create_btn").focus();
                      }
                    }}
                    spellcheck="false"
                  />
                  <InputGroup.Text className="int-grp" id="basic-addon1">
                    <img className="srch_box" src={search} alt="" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col md="9" className="mt-2 btn_align mainbtn_create">
                <Button
                  className="create-btn mr-2"
                  id="RL_create_btn"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    eventBus.dispatch("page_change", "role");
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      eventBus.dispatch("page_change", "role");
                    }
                  }}
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
                    <th style={{ width: "5%" }}>Sr.No.</th>
                    <th>Role Name</th>
                    {/* <th style={{ width: "10%" }}>Action</th> */}
                  </tr>
                </thead>
                <tbody
                  style={{ borderTop: "2px solid transparent" }}
                  className="tabletrcursor prouctTableTr"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.shiftKey && e.keyCode == 9) {
                      document.getElementById("RL_create_btn").focus();
                    } else if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {data.length > 0 ? (
                    data.map((v, i) => {
                      return (
                        <tr
                          value={JSON.stringify(v)}
                          id={`RoleTr_` + i}
                          // prId={v.id}
                          tabIndex={i}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            // if (isActionExist("sales-quotation", "edit")) {
                            eventBus.dispatch("page_change", {
                              from: "rolelist",
                              to: "roleedit",
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
                          <td style={{ width: "5%" }}>{i + 1}</td>
                          <td>{v.roleName}</td>
                          {/* <td style={{ width: "10%" }}>
                            {" "}
                            <img
                              src={delete_icon}
                              className="del_icon"
                              title="Delete"
                            />
                          </td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center">No Data Found</td>
                    </tr>
                  )}
                </tbody>
                <thead className="tbl-footer mb-2">
                  <tr>
                    <th
                      colSpan={7}
                      className=""
                      style={{ borderTop: " 2px solid transparent" }}
                    >
                      {Array.from(Array(1), (v) => {
                        return (
                          <tr>
                            {/* <th>&nbsp;</th> */}
                            <th>Total Role List :</th>
                            <th>{data.length}</th>
                          </tr>
                        );
                      })}
                    </th>
                  </tr>
                </thead>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
