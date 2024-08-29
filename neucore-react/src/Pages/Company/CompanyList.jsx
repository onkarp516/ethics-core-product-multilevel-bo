import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  get_companies_super_admin,
  delete_company,
} from "@/services/api_functions";
import {
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  isActionExist,
  MyNotifications,
  LoadingComponent,
} from "@/helpers";
import search from "@/assets/images/search_icon.png";
export default class CompanyList extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      orgData: [],
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listGetCompany();
      //   mousetrap.bindGlobal("ctrl+s", this.handleSubmitForm);
      //   mousetrap.bindGlobal("ctrl+c", this.setInitValues);
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
        (v.companyCode != null &&
          v.companyCode.toLowerCase().includes(vi.toLowerCase())) ||
        (v.registeredAddress != null &&
          v.registeredAddress.toLowerCase().includes(vi.toLowerCase())) ||
        (v.corporateAddress != null &&
          v.corporateAddress.toLowerCase().includes(vi.toLowerCase())) ||
        (v.mobile != null && v.mobile.toString().includes(vi))
      // (v.companyName != null &&
      //   v.companyCode != null
      //  ) ||
      //  v.companyName.toLowerCase().includes(vi.toLowerCase()) ||
      // v.companyCode.includes(vi)
      //  v.fullName.toLowerCase().includes(vi.toLowerCase()))
      // v.mobile.includes(vi.mobile)
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
  listGetCompany = () => {
    get_companies_super_admin()
      .then((response) => {
        // console.log('response', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          this.setState({ data: data, orgData: data }, () => {
            setTimeout(() => {
              if (
                this.props.block.prop_data.rowId !== "" &&
                this.props.block.prop_data.rowId !== undefined
              ) {
                document
                  .getElementById("CLTr_" + this.props.block.prop_data.rowId)
                  .focus();
              } else if (
                this.props.block.prop_data.companyId !== "" &&
                this.props.block.prop_data.companyId !== undefined
              ) {
                const index = data.findIndex((object) => {
                  return object.id === this.props.block.prop_data.companyId;
                });
                if (index >= 0)
                  document.getElementById("CLTr_" + index).focus();
              } else if (document.getElementById("searchCL") != null) {
                document.getElementById("searchCL").focus();
              }
            }, 1500);
          });
        }
      })
      .catch((error) => {
        this.setState({ data: [], orgData: [] });
        console.log("error", error);
      });
  };

  deletecompanygroup = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_company(formData)
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
        this.setState({ data: [], orgData: [] });
      });
  };
  setUpdateValue = (v, i) => {
    eventBus.dispatch("page_change", {
      from: "companyList",
      to: "newCompanyEdit",
      // prop_data: v,
      prop_data: { prop_data: v, rowId: i },
      isNewTab: false,
    });
  };

  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    const k = event.keyCode;
    if (k === 40) {
      //down

      const next = t.nextElementSibling;
      if (next) {
        next.focus();
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));

        let index = JSON.parse(cuurentProduct.getAttribute("tabIndex"));
        if (isActionExist("Company", "edit", this.props.userPermissions)) {
          this.setUpdateValue(selectedLedger, index);
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
    const { data } = this.state;
    return (
      <div className="ledger-group-style" style={{ overflow: "hidden" }}>
        <div className="cust_table">
          <Row
            onKeyDown={(e) => {
              if (e.keyCode == 40) {
                e.preventDefault();
                document.getElementById("CLTr_0")?.focus();
              }
            }}>
            <Col md="3">
              <InputGroup className="mb-2  mdl-text">
                <Form.Control
                  type="text"
                  name="Search"
                  id="searchCL"
                  onChange={(e) => {
                    this.handleSearch(e.target.value);
                  }}
                  placeholder="Search"
                  className="mdl-text-box"
                  autoFocus={true}
                  autoComplete="searchCL"
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                      document.getElementById("CL_create_btn").focus();
                    }
                  }}
                  spellcheck="false"
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                  {/* <img src={search} alt="" /> */}
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md="9" className="btn_align mainbtn_create">
              <div id="example-collapse-text">
                <div className="mb-2 me-1">
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
                  <Button
                    className="create-btn ms-2"
                    id="CL_create_btn"
                    type="button"
                    style={{ borderRadius: "6px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        isActionExist(
                          "ledger",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        eventBus.dispatch("page_change", "newCompany");
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
                    onKeyDown={(e) => {
                      // e.preventDefault();
                      if (e.keyCode === 13) {
                        if (
                          isActionExist(
                            "ledger",
                            "create",
                            this.props.userPermissions
                          )
                        ) {
                          eventBus.dispatch("page_change", "newCompany");
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Permission is denied!",
                            is_button_show: true,
                          });
                        }
                      } else if (e.keyCode === 32) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <div className="tbl-list-style1">
            <Table size="sm" className="tbl-font">
              <thead>
                <tr>
                  {/* <th>Sr.</th> */}
                  <th style={{ width: "25%" }}>Company Name</th>
                  {/* <th style={{ width: "10%" }}>Company Admin</th> */}
                  <th style={{ width: "10%" }}>Company Code</th>
                  <th>Registered Address</th>
                  <th>Corporate Address</th>
                  <th>Mobile No.</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody
                style={{ borderTop: "2px solid transparent" }}
                className="tabletrcursor prouctTableTr"
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.shiftKey && e.keyCode == 9) {
                    document.getElementById("CL_create_btn").focus();
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
                        id={`CLTr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                        onDoubleClick={(e) => {
                          if (
                            isActionExist(
                              "Company",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.setUpdateValue(v, i);
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
                        {/* <td>{i + 1}</td> */}
                        <td style={{ width: "25%" }}>{v.companyName}</td>
                        {/* <td>{v.fullName}</td> */}
                        <td style={{ width: "10%" }}>{v.companyCode}</td>
                        <td>{v.registeredAddress}</td>
                        <td>{v.corporateAddress}</td>
                        <td>{v.mobile}</td>

                        {/* <td>
                          {" "}
                          <img
                            src={delete_icon}
                            style={{
                              // width: "12%",
                              margin: "0px 10px 0px 3px",
                              height: "35px",
                            }}
                            title="Delete"
                            onClick={(e) => {
                              if (
                                isActionExist(
                                  "compamy",
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
                                      this.deletecompanygroup(v.id);
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
                    <tr>
                      <th>Total Company List :</th>
                      <th>{data.length}</th>
                    </tr>
                  </th>
                </tr>
              </thead>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
