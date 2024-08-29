import React from "react";
import { Button, Col, Row, Form, InputGroup, Table } from "react-bootstrap";
import { get_receipt_list, delete_receipts } from "@/services/api_functions";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import delete_icon from "@/assets/images/delete_icon3.png";
import {
  AuthenticationCheck,
  MyDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
  INRformat,
  LoadingComponent,
} from "@/helpers";
import TableEdit from "@/assets/images/1x/editnew.png";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import {
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faChevronRight,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import moment from "moment";
class ReceiptList extends React.Component {
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
      getreceiptTable: [],
      getreceiptTableId: [],
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

  // letReceiptlst = () => {
  //   this.setState({ showloader: true });
  //   get_receipt_list()
  //     .then((response) => {
  //       console.log("response==---->", response);
  //       let res = response.data;
  //       if (res.responseStatus == 200) {
  //         this.setState({
  //           getreceiptTable: res.data,
  //           orgData: res.data,
  //           showloader: false,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       this.setState({ getreceiptTable: [] });
  //     });
  // };
  //@sanjiv  @start of receipt list for pagination
  letReceiptlst = () => {
    this.setState({ showloader: true });
    let { currentPage, pageLimit, searchText } = this.state;

    let req = {
      pageNo: currentPage,
      pageSize: pageLimit,
      searchText: "",
      sort: '{ "colId": null, "isAsc": true }',
      startDate: "",
      endDate: "",
    };
    get_receipt_list(req)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              getreceiptTable: res.responseObject.data,
              orgData: res.responseObject.data,
              showloader: false,
              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
              currentPage:
                res.responseObject != null ? res.responseObject.page : 0,
            },
            () => {
              if (this.props.block.prop_data.opType == "create") {
                let receiptidCount = this.state.getreceiptTable.length - 1;
                setTimeout(() => {
                  document.getElementById("RLTr_" + receiptidCount)?.focus();
                }, 1200);
              }
            }
          );
          setTimeout(() => {
            if (this.props.block.prop_data.rowId) {
              document
                .getElementById("RLTr_" + this.props.block.prop_data.rowId)
                ?.focus();
            } else if (this.props.block.prop_data.rowId == 0) {
              document.getElementById("RLTr_0").focus();
            } else if (document.getElementById("Search") != null) {
              {
                document.getElementById("search_receipt_list")?.focus();
              }
            }
          }, 1200);
        }
      })
      .catch((error) => {
        this.setState({ getreceiptTable: [] });
      });
  };
  //end of receipt list for pagination
  goToNextPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.letReceiptlst();
    });
  };

  goToPreviousPage = () => {
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.letReceiptlst();
    });
  };
  deleteReceipt = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_receipts(formData)
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
        this.setState({ letReceiptlst: [] });
      });
  };
  handleSearch = (vi) => {
    let { orgData } = this.state;
    //console.log("orgData", orgData);
    let lstReceipt_F = orgData.filter(
      (v) =>
        (v.ledger_name != "" &&
          v.receipt_code != "" &&
          v.transaction_dt != "" &&
          v.total_amount != "" &&
          v.ledger_name.toLowerCase().includes(vi.toLowerCase())) ||
        v.receipt_code.toLowerCase().includes(vi.toLowerCase()) ||
        moment(v.transaction_dt).format("DD-MM-YYYY").toString().includes(vi) ||
        (v.narration.toLowerCase() != null &&
          v.narration.toLowerCase().includes(vi)) ||
        (v.total_amount != null && v.total_amount.toString().includes(vi))
    );
    this.setState({
      getreceiptTable: lstReceipt_F.length > 0 ? lstReceipt_F : [],
    });
  };
  pageReload = () => {
    this.componentDidMount();
  };

  handleFetchData = (id) => {
    eventBus.dispatch("page_change", {
      from: "voucher_receipt_list",
      to: "voucher_receipt",
      isNewTab: false,
      prop_data: id,
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.letReceiptlst();
    }
  }
  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let {
      ledgerModalStateChange,
      transactionType,
      invoice_data,
      ledgerData,
    } = this.props;
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
        if (isActionExist("receipt", "edit", this.props.userPermissions)) {
          eventBus.dispatch("page_change", {
            from: "voucher_receipt_list",
            to: "voucher_receipt_edit",
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
    let { getreceiptTable, sortedColumn, sortOrder } = this.state;

    let sortedData = [...getreceiptTable];
    if (sortOrder == "asc") {
      sortedData.sort((a, b) => (a[sortedColumn] > b[sortedColumn] ? 1 : -1));
    } else {
      sortedData.sort((a, b) => (a[sortedColumn] < b[sortedColumn] ? 1 : -1));
    }

    this.setState({
      getreceiptTable: sortedData,
    });
  };

  handleArrowClick = () => {
    this.setState((prevState) => {
      return {
        arrowToggle: !prevState.arrowToggle,
      };
    });
  };

  render() {
    const {
      show,
      arrowToggle,
      brandshow,
      productLst,
      productdetaillistmodal,
      showDiv,
      opendiv,
      getreceiptTable,
      getreceiptTableId,
      showloader,
      currentPage,
      totalRows,
      pages,
    } = this.state;
    return (
      <div className="ledger_form_style">
        <div className="ledger-group-style">
          <div className="cust_table">
            {!opendiv && (
              <Row className=""
                onKeyDown={(e) => {
                  if (e.keyCode === 40) {
                    e.preventDefault();
                    document.getElementById("RLTr_0")?.focus();
                  }
                }}>
                <Col md="3">
                  {/* <Form.Group
                  className="search_btn_style mt-1"
                  controlId="formBasicSearch"
                >
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className="main_search"
                  />
                  <Button type="submit">x</Button>
                </Form.Group> */}
                  <InputGroup className="mb-2">
                    <Form.Control
                      id="search_receipt_list"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      style={{ borderRight: "none" }}
                      autoFocus="true"
                      onChange={(e) => {
                        this.handleSearch(e.target.value);
                        //console.log("Name Page:");
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode == 13) {
                          e.preventDefault();
                          document.getElementById("RCL-create-btn")?.focus();
                        }
                      }}
                    />
                    <InputGroup.Text className="input_gruop" id="basic-addon1">
                      <img className="srch_box" src={search} alt="" />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col md="5">
                  {/* <InputGroup className="mb-3 ">
                  <MyDatePicker
                    placeholderText="DD/MM/YYYY"
                    id="bill_dt"
                    dateFormat="dd/MM/yyyy"
                    // placeholderText="FROM DATE"
                    // onChange={(date) => {
                    //   setFieldValue('bill_dt', date);
                    // }}
                    // selected={values.bill_dt}
                    maxDate={new Date()}
                    className="date-style text_center mt-1"
                  />
                  <InputGroup.Text id="basic-addon2" className=" mt-1">
                    <i class="fa fa-arrow-right" aria-hidden="true"></i>
                  </InputGroup.Text>
                  <MyDatePicker
                    placeholderText="DD/MM/YYYY"
                    id="bill_dt"
                    dateFormat="dd/MM/yyyy"
                    // placeholderText="TO DATE"
                    // onChange={(date) => {
                    //   setFieldValue('bill_dt', date);
                    // }}
                    // selected={values.bill_dt}
                    maxDate={new Date()}
                    className="date-style text_center mt-1"
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
                    className="create-btn"
                    id="RCL-create-btn"
                    // onClick={(e) => {
                    //   e.preventDefault();

                    //   eventBus.dispatch("page_change", {
                    //     from: "voucher_receipt_list",
                    //     to: "voucher_receipt",
                    //     isNewTab: false,
                    //   });
                    // }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        isActionExist(
                          "receipt",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        eventBus.dispatch("page_change", {
                          from: "voucher_receipt_list",
                          to: "voucher_receipt",
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
                    Create
                    {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style ms-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg> */}
                  </Button>
                </Col>
              </Row>
            )}
            <div className="accEntry-tbl-list-style">
              {/* {getreceiptTable.length > 0 && ( */}
              <Table size="sm" className="tbl-font">
                <thead>
                  {/* <div className="scrollbar_hd"> */}
                  <tr>
                    {/* <th style={{ width: "5%" }}>Sr. #.</th> */}

                    {/* <th>Payment#</th> */}
                    <th>Receipt No.</th>
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
                    <th>Narration </th>
                    <th>
                      {" "}
                      <div className="d-flex" style={{ justifyContent: "end" }}>
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
                      document.getElementById("RCL-create-btn")?.focus();
                    } else if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {/* <div className="scrollban_new"> */}
                  {/* {JSON.stringify(getreceiptTable)} */}
                  {getreceiptTable.length > 0 ? (
                    getreceiptTable.map((v, i) => {
                      return (
                        <tr
                          value={JSON.stringify(v)}
                          id={`RLTr_` + i}
                          // prId={v.id}
                          tabIndex={i}
                          // onDoubleClick={(e) => {
                          //   e.preventDefault();
                          //   // console.log("v", v);

                          //   eventBus.dispatch("page_change", {
                          //     from: "voucher_receipt_list",
                          //     to: "voucher_receipt_edit",
                          //     prop_data: v,
                          //     isNewTab: false,
                          //   });
                          // }}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            if (
                              isActionExist(
                                "receipt",
                                "edit",
                                this.props.userPermissions
                              )
                            ) {
                              eventBus.dispatch("page_change", {
                                from: "voucher_receipt_list",
                                to: "voucher_receipt_edit",
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
                          {/* <td style={{ width: "3%" }}>{i + 1}</td> */}
                          {/* <td>{v.payment_sr_no}</td> */}
                          <td>{v.receipt_code}</td>
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
                              title="Edit"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  isActionExist(
                                    "receipt",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  eventBus.dispatch("page_change", {
                                    from: "voucher_receipt_list",
                                    to: "voucher_receipt_edit",
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
                              // style={{
                              //   // width: "12%",
                              //   margin: "0px 10px 0px 3px",
                              //   height: "35px",
                              // }}
                              className="mdl-icons"
                              title="Delete"
                              onClick={(e) => {
                                if (
                                  isActionExist(
                                    "receipt",
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
                                        this.deleteReceipt(v.id);
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
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        {" "}
                        No Data Found{" "}
                      </td>
                      {showloader == true && LoadingComponent(showloader)}
                    </tr>
                  )}
                  {/* </div> */}
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
                            <th>Total Receipt List :</th>
                            <th>{getreceiptTable.length}</th>
                          </tr>
                        );
                      })}
                    </th>
                  </tr>
                </thead> */}
              </Table>

              {/* )} */}
            </div>
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
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faXmark}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+C</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faCalculator}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Alt+C</span>
                        </Form.Label>
                      </Col>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faGear}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">F11</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faRightFromBracket}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+Z</span>
                        </Form.Label>
                      </Col>
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faPrint}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+P</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faArrowUpFromBracket}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Export</span>
                        </Form.Label>
                      </Col>
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
                          <span>Receipt:</span>
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
                  {/* <Col lg="6" className="text-end">
                Page No.
                    <span>{this.state.currentPage} Out of 10</span>
                  </Col> */}
                </Row>
              </Col>
            </Row>
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

export default connect(mapStateToProps, mapActionsToProps)(ReceiptList);
