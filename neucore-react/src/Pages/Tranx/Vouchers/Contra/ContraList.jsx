import React from "react";
import {
  Button,
  Col,
  Row,
  Navbar,
  NavDropdown,
  Item,
  Nav,
  Form,
  Container,
  InputGroup,
  Table,
  Alert,
  CloseButton,
  Modal,
} from "react-bootstrap";

import {
  get_contra_list_by_outlet,
  delete_contra,
} from "@/services/api_functions";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import delete_icon from "@/assets/images/delete_icon3.png";
import moment from "moment";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import {
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faChevronRight, faCalculator, faCirclePlus, faCircleQuestion, faFloppyDisk, faGear, faHouse, faPen, faPrint, faArrowUpFromBracket, faRightFromBracket, faTrash, faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import TableEdit from "@/assets/images/1x/editnew.png";

import {
  AuthenticationCheck,
  MyDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
  LoadingComponent,
  INRformat,
} from "@/helpers";

class ContraList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      arrowToggle: true,
      brandshow: false,
      opendiv: false,
      showDiv: false,
      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      productdetaillistmodal: false,
      getContraTable: [],
      sortedColumn: null,
      sortOrder: "asc",
      productLst: [],
      orgData: [],
      showloader: false,
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  // get_contra_list = () => {
  //   this.setState({ showloader: true });
  //   get_contra_list_by_outlet()
  //     .then((response) => {
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         this.setState({
  //           getContraTable: res.data,
  //           orgData: res.data,
  //           showloader: false,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       this.setState({ getContraTable: [] });
  //     });
  // };
  //start of contra list pagination
  get_contra_list = () => {
    this.setState({ showloader: true });
    let { currentPage, pageLimit, searchText } = this.state;
    let req = {
      "pageNo": currentPage,
      "pageSize": pageLimit,
      "searchText": "",
      "sort": '{ "colId": null, "isAsc": true }',
    };
    get_contra_list_by_outlet(req)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            getContraTable: res.responseObject.data,
            orgData: res.responseObject.data,
            showloader: false,
            totalRows:
              res.responseObject != null
                ? res.responseObject.total
                : 0,
            pages:
              res.responseObject != null
                ? res.responseObject.total_pages
                : 0,
            currentPage:
              res.responseObject != null ? res.responseObject.page : 0,
          });
          setTimeout(() => {
            if (this.props.block.prop_data.rowId) {
              document.getElementById("CLTr_" + this.props.block.prop_data.rowId).focus();
            }
            else if (this.props.block.prop_data.rowId == 0) {
              document.getElementById("CLTr_0").focus();
            }
            else if (this.props.block.prop_data.isCreate) {
              document.getElementById("CLTr_0").focus();
            }
            else if (document.getElementById("SearchCL") != null) {
              {
                document.getElementById("SearchCL").focus();
              }
            }
          }, 2000);
        }
      })
      .catch((error) => {
        this.setState({ getContraTable: [] });
      });
  };
  //end of contra list pagination
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.get_contra_list();
    });
  };
  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.get_contra_list();
    });
  };
  deletecontra = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_contra(formData)
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
        }
      })
      .catch((error) => {
        this.setState({ getContraTable: [] });
      });
  };
  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log("orgData", orgData);
    let lstContra_F = orgData.filter(
      (v) =>
        (v.contra_code != "" &&
          v.narration != "" &&
          v.total_amount != "" &&
          v.transaction_dt != "" &&
          v.narration.toLowerCase().includes(vi.toLowerCase())) ||
        v.ledger_name.toLowerCase().includes(vi.toLowerCase()) ||
        v.contra_code.toLowerCase().includes(vi.toLowerCase()) ||
        v.total_amount.toString().includes(vi) ||
        moment(v.transaction_dt).format("DD-MM-YYYY").toString().includes(vi)
    );
    this.setState({
      getContraTable: lstContra_F.length > 0 ? lstContra_F : [],
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  handleFetchData = (id) => {
    eventBus.dispatch("page_change", {
      from: "productlist",
      to: "productedit",
      isNewTab: false,
      prop_data: id,
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.get_contra_list();
      console.log("isCreate", this.props.block);
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
        if (isActionExist("contra", "edit", this.props.userPermissions)) {
          eventBus.dispatch("page_change", {
            from: "voucher_contra_list",
            to: "voucher_contra_edit",
            // prop_data: selectedLedger,
            prop_data: { prop_data: selectedLedger, rowId: index },
            isNewTab: false,
          });
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
  handleSort = (columnName) => {
    const { sortedColumn, sortOrder } = this.state;

    if (columnName === sortedColumn) {
      // Toggle sorting order
      this.setState(
        (prevState) => ({
          sortOrder: prevState.sortOrder === "asc" ? "desc" : "asc",
        }),
        () => {
          // Sort the data when the state has been updated
          this.sortData();
        }
      );
    } else {
      // Sort by a new column
      this.setState(
        {
          sortedColumn: columnName,
          sortOrder: "asc",
        },
        () => {
          // Sort the data when the state has been updated
          this.sortData();
        }
      );
    }
  };
  sortData = () => {
    let { getContraTable, sortedColumn, sortOrder } = this.state;

    let sortedData = [...getContraTable];
    if (sortOrder == "asc") {
      sortedData.sort((a, b) => (a[sortedColumn] > b[sortedColumn] ? 1 : -1));
    } else {
      sortedData.sort((a, b) => (a[sortedColumn] < b[sortedColumn] ? 1 : -1));
    }

    this.setState({
      getContraTable: sortedData,
    });
  };

  handleArrowClick = () => {
    this.setState((prevState) => {
      return {
        arrowToggle: !prevState.arrowToggle,
      };
    });
  };
  handleKeyDown = (e, index) => {
    if (e.keyCode === 13) {
      document.getElementById(index).focus();
    }
  };

  render() {
    const { opendiv, arrowToggle, getContraTable, showloader, currentPage, totalRows, pages } = this.state;

    return (
      <div className="">
        <div className="ledger_form_style">
          <div className="ledger-group-style">
            <div className="cust_table">
              <div className="">
                {!opendiv && (
                  <Row className=""
                    onKeyDown={(e) => {
                      if (e.keyCode === 40) {
                        e.preventDefault();
                        document.getElementById("CLTr_0")?.focus();
                      }
                    }}>
                    <Col md="3">
                      <div className="">
                        <InputGroup className="mb-2">
                          <Form.Control
                            placeholder="Search"
                            aria-label="Search"
                            id="SearchCL"
                            aria-describedby="basic-addon1"
                            onChange={(e) => {
                              this.handleSearch(e.target.value);
                              console.log("Search Date:", e.target.value);
                            }}
                            style={{ borderRight: "none" }}
                            autoFocus="true"
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.handleKeyDown(e, "CL-create-btn");
                              }
                            }}
                          />
                          <InputGroup.Text
                            className="input_gruop"
                            id="basic-addon1"
                          >
                            <img className="srch_box" src={search} alt="" />
                          </InputGroup.Text>
                        </InputGroup>
                      </div>
                    </Col>
                    <Col md="5">
                      {/* <InputGroup className="mb-3 ">
                      <MyDatePicker
                        placeholderText="DD/MM/YYYY"
                        id="bill_dt"
                        dateFormat="dd/MM/yyyy"
                        // placeholderText="FROM DATE"
                        maxDate={new Date()}
                        className="newdate text_center mt-1"
                      />
                      <InputGroup.Text id="basic-addon2" className=" mt-1">
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      </InputGroup.Text>
                      <MyDatePicker
                        placeholderText="DD/MM/YYYY"
                        id="bill_dt"
                        dateFormat="dd/MM/yyyy"
                        // placeholderText="TO DATE"
                        maxDate={new Date()}
                        className="newdate text_center mt-1"
                      />
                    </InputGroup> */}
                    </Col>
                    <Col md="4" className="text-end">
                      {/* {this.state.hide == 'true'} */}
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
                        className="create-btn mr-2"
                        id="CL-create-btn"
                        // onClick={(e) => {
                        //   e.preventDefault();

                        //   eventBus.dispatch("page_change", {
                        //     from: "tranx_contra_list",
                        //     to: "tranx_contra",
                        //     isNewTab: false,
                        //   });
                        // }}
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            isActionExist(
                              "contra",
                              "create",
                              this.props.userPermissions
                            )
                          ) {
                            eventBus.dispatch("page_change", {
                              from: "tranx_contra_list",
                              to: "tranx_contra",
                              isNewTab: false,
                            });
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
                        Create &nbsp;
                      </Button>
                      {/* &nbsp;
                    <Button
                      className="ml-2 alterbtn"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        this.pageReload();
                      }}
                    >
                      Refresh
                    </Button> */}
                    </Col>
                  </Row>
                )}
              </div>
              <div className="accEntry-tbl-list-style">
                {/* {getContraTable.length > 0 && ( */}
                {isActionExist(
                  "contra",
                  "list",
                  this.props.userPermissions
                ) && (
                    <Table
                      size="sm"
                      className="new_tbldesign fix-height-200"
                    // responsive
                    >
                      <thead>
                        {/* <div className="scrollbar_hd"> */}
                        <tr>
                          <th>Contra No.</th>
                          <th>
                            <div className="d-flex">
                              Transcation Date
                              <div
                                className="ms-2"
                                onClick={() => this.handleSort("transaction_dt")}
                              >
                                {this.state.sortedColumn === "transaction_dt" &&
                                  this.state.sortOrder === "asc" ? (
                                  <FontAwesomeIcon
                                    icon={faArrowUp}
                                    className="plus-color"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faArrowDown}
                                    className="plus-color"
                                  />
                                )}
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="d-flex">
                              Supplier Name
                              <div
                                className="ms-2"
                                onClick={() => this.handleSort("ledger_name")}
                              >
                                {this.state.sortedColumn === "ledger_name" &&
                                  this.state.sortOrder === "asc" ? (
                                  <FontAwesomeIcon
                                    icon={faArrowUp}
                                    className="plus-color"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faArrowDown}
                                    className="plus-color"
                                  />
                                )}
                              </div>
                            </div>
                          </th>
                          <th>Narration</th>
                          <th>
                            <div
                              className="d-flex"
                              style={{ justifyContent: "end" }}
                            >
                              Total Amount
                              <div
                                className="ms-2"
                                onClick={() => this.handleSort("total_amount")}
                              >
                                {this.state.sortedColumn === "total_amount" &&
                                  this.state.sortOrder === "asc" ? (
                                  <FontAwesomeIcon
                                    icon={faArrowUp}
                                    className="plus-color"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faArrowDown}
                                    className="plus-color"
                                  />
                                )}
                              </div>
                            </div>
                          </th>
                          <th style={{ textAlign: "center" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody
                        style={{ borderTop: "2px solid transparent" }}
                        className="prouctTableTr tabletrcursor"
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (e.shiftKey && e.keyCode == 9) {
                            document.getElementById("CL-create-btn").focus();
                          }
                          else if (e.keyCode != 9) {
                            this.handleTableRow(e);
                          }
                        }}
                      >
                        {getContraTable.length > 0 ? (
                          getContraTable.map((v, i) => {
                            return (
                              <tr
                                value={JSON.stringify(v)}
                                id={`CLTr_` + i}
                                // prId={v.id}
                                tabIndex={i}
                                onDoubleClick={(e) => {
                                  e.preventDefault();
                                  if (
                                    isActionExist(
                                      "contra",
                                      "edit",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "voucher_contra_list",
                                      to: "voucher_contra_edit",
                                      // prop_data: v,
                                      prop_data: { prop_data: v, rowId: i },
                                      isNewTab: false,
                                    });
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
                                <td>{v.contra_code}</td>
                                <td>
                                  {moment(v.transaction_dt).format("DD-MM-YYYY")}
                                </td>
                                <td>{v.ledger_name}</td>
                                <td>{v.narration}</td>
                                <td style={{ textAlign: "end" }}>
                                  {/* {v.total_amount} */}
                                  {INRformat.format(v.total_amount)}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <img
                                    src={TableEdit}
                                    className="mdl-icons"
                                    title="Print"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        isActionExist(
                                          "contra",
                                          "edit",
                                          this.props.userPermissions
                                        )
                                      ) {
                                        eventBus.dispatch("page_change", {
                                          from: "voucher_contra_list",
                                          to: "voucher_contra_edit",
                                          // prop_data: v,
                                          prop_data: { prop_data: v, rowId: i },
                                          isNewTab: false,
                                        });
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
                                  <img
                                    src={delete_icon}
                                    className="mdl-icons"
                                    title="Delete"
                                    onClick={(e) => {
                                      //this.deletecontra(v.id);
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
                                            this.deletecontra(v.id);
                                          },
                                          handleFailFn: () => { },
                                        },
                                        () => {
                                          console.warn("return_data");
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
                            <td colSpan={6} className="text-center">
                              {" "}
                              No Data Found{"  "}
                              {showloader == true && LoadingComponent(showloader)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {/* <thead className="tbl-footer mb-2">
                      <tr>
                        <th
                          colSpan={6}
                          className=""
                          style={{ borderTop: " 2px solid transparent" }}
                        >
                          {Array.from(Array(1), (v) => {
                            return (
                              <tr>
                                <th>Total Contra List :</th>
                                <th>{getContraTable.length}</th>
                              </tr>
                            );
                          })}
                        </th>
                      </tr>
                    </thead> */}
                    </Table>
                  )}
                {/* )} */}
              </div>
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
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faXmark} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+C</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Alt+C</span>
                          </Form.Label>
                        </Col>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">F11</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+Z</span>
                          </Form.Label>
                        </Col>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Ctrl+P</span>
                          </Form.Label>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="2" className="">
                      <Row>
                        <Col md="6" className="">
                          <Form.Label className="btm-label d-flex">
                            <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                            <span className="shortkey">Export</span>
                          </Form.Label>
                        </Col>
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
                            <span>Contra:</span>
                            <span>{totalRows}</span>
                          </>
                        );
                      })}
                    </Col>
                    {/* <Col md="4" className="text-center">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.goToPreviousPage();
                    }}
                    disabled={currentPage <= 1}
                    className="nextbtn"
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="plus-color"
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    &nbsp;&nbsp;Prev
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.goToNextPage();
                    }}
                    disabled={currentPage === pages ? true : false}
                    className="nextbtn"
                  >
                    Next&nbsp;&nbsp;{" "}
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="plus-color"
                      style={{ verticalAlign: "middle" }}
                    />
                  </Button>
                </Col> */}
                    {/* <Col lg="6" className="my-auto">
                  Page No.
                      {/* <span>{this.state.currentPage}</span> Out of 10
                    </Col> */}
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
          {/* <Form> */}
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

export default connect(mapStateToProps, mapActionsToProps)(ContraList);
