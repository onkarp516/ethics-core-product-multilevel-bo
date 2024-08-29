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
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  isActionExist,
  MyNotifications,
  LoadingComponent,
} from "@/helpers";
import {
  faEye,
  faEyedropper,
  faEyeSlash,
  faHouse,
  faCirclePlus,
  faPen,
  faFloppyDisk,
  faTrash,
  faXmark,
  faCalculator,
  faGear,
  faRightFromBracket,
  faPrint,
  faArrowUpFromBracket,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get_branches_superAdmin } from "@/services/api_functions";

import search from "@/assets/images/search_icon.png";
import delete_icon from "@/assets/images/delete_icon3.png";
export default class NewBranchList extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.ref = React.createRef();
  }
  listGetBranch = (status = false) => {
    get_branches_superAdmin()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            data: res.responseObject,
            orgData: res.responseObject,
          });
          setTimeout(() => {
            if (this.props.block.prop_data.rowId) {
              document.getElementById("NewBTr_" + this.props.block.prop_data.rowId).focus();
            } else if (document.getElementById("SearchNBL") != null) {
              {
                document.getElementById("SearchNBL").focus();
              }
            }
          }, 1000);
          //   let d = res.responseObject;
          //   let Opt = [];
          //   if (d.length > 0) {
          //     Opt = d.map(function (values) {
          //       return { value: values.id, label: values.branchName };
          //     });
          //   }
          //   this.setState({ data: Opt }, () => {
          //     // let instituteId = getValue(
          //     //   Opt,
          //     //   authenticationService.currentUserValue.instituteId
          //     // );
          //     // this.ref.current.setFieldValue("instituteId", instituteId);
          //   });
        }
      })
      .catch((error) => {
        this.setState({ data: [] });
        console.log("error", error);
      });
  };
  handleSearch = (vi) => {
    // debugger;
    console.log({ vi });
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        v.companyName.toLowerCase().includes(vi.toLowerCase()) ||
        v.branchName.toLowerCase().includes(vi.toLowerCase()) ||
        v.registeredAddress.toLowerCase().includes(vi.toLowerCase()) ||
        v.corporateAddress.toLowerCase().includes(vi.toLowerCase()) ||
        v.branchCode.toLowerCase().includes(vi.toLowerCase())
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
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.listGetBranch();
    }
  }
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
          from: " newBranchList",
          to: "newbranchedit",
          // prop_data: selectedLedger,
          prop_data: { prop_data: selectedLedger, rowId: index },
          // isNewTab: false,
        });

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
              if (e.keyCode === 40) {
                e.preventDefault();
                document.getElementById("NewBTr_0")?.focus();
              } else if (e.keyCode === 13) {
                e.preventDefault();
                document.getElementById("NBL_create_btn")?.focus();
              }
            }}>
            <Col md="3">
              <InputGroup className="mb-2  mdl-text">
                <Form.Control
                  type="text"
                  name="Search"
                  id="SearchNBL"
                  onChange={(e) => {
                    let v = e.target.value;
                    console.log({ v });
                    this.handleSearch(v);
                    // if(v == ""){
                    //   document.getElementById("Search").focus() ;
                    // }
                  }}
                  placeholder="Search"
                  autoFocus="true"
                  autoComplete="off"
                  className="mdl-text-box"
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md="9" className="text-end">
              <div id="example-collapse-text">
                <div className="">
                  <Button
                    className="create-btn"
                    id="NBL_create_btn"
                    type="submit"
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
                        eventBus.dispatch("page_change", "newBranchCreate");
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
                      if (e.keyCode === 32) {
                        e.preventDefault();
                      } else if (e.keyCode === 13) {
                        if (
                          isActionExist(
                            "ledger",
                            "create",
                            this.props.userPermissions
                          )
                        ) {
                          eventBus.dispatch("page_change", "newBranchCreate");
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: "Permission is denied!",
                            is_button_show: true,
                          });
                        }
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
            <Table>
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>Sr.</th>
                  <th>Company Name</th>
                  <th>Branch Name</th>
                  <th>Branch Code</th>
                  <th>Registered Address</th>
                  <th>Corporate Address</th>
                  {/* <th

                  >
                    Action
                  </th> */}
                </tr>
              </thead>
              {/* {JSON.stringify(data, 2, undefined)} */}
              <tbody
                style={{ borderTop: "2px solid transparent" }}
                className="tabletrcursor prouctTableTr"
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.shiftKey && e.keyCode == 9) {
                    document.getElementById("NBL_create_btn").focus();
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
                        id={`NewBTr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", {
                            from: " newBranchList",
                            to: "newbranchedit",
                            prop_data: { prop_data: v, rowId: i },
                            // isNewTab: false,
                          });
                        }}
                      >
                        <td style={{ width: "5%" }}>{i + 1}</td>
                        <td>{v.companyName}</td>
                        <td>{v.branchName}</td>
                        <td>{v.branchCode}</td>
                        <td>{v.registeredAddress}</td>
                        <td>{v.corporateAddress}</td>
                        {/* <td>
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
                    <td colSpan={7} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
              {/* <thead className="tbl-footer">
                <tr>
                  <th
                    colSpan={7}
                    className=""
                    style={{ borderTop: " 2px solid transparent" }}
                  >
                    {Array.from(Array(1), (v) => {
                      return (
                        <tr>
                         
                          <th>Total Branch List :</th>
                          <th>{data.length}</th>
                        </tr>
                      );
                    })}
                  </th>
                </tr>
              </thead> */}
            </Table>
          </div>
          <Row className="style-footr">
            <Col lg={12}>
              {Array.from(Array(1), (v) => {
                return (
                  <Row>
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

                    <Col lg={2} className="text-end">
                      <Row>
                        <Col className="my-auto">Branch :{data.length}</Col>
                      </Row>
                    </Col>
                  </Row>
                );
              })}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
