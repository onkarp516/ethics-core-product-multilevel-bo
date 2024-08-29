import React from "react";
import { Button, Col, Row, Form, Table, InputGroup } from "react-bootstrap";

import {
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  isActionExist,
  MyNotifications,
  LoadingComponent,
  ledger_select,
  getSelectValue,
  INRformat,
} from "@/helpers";
import * as Yup from "yup";
import {
  getLedgers,
  delete_ledger,
  getAllLedgersPagination,
} from "@/services/api_functions";
import { Formik } from "formik";
import {
  faArrowDown,
  faArrowUp,
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

import delete_icon from "@/assets/images/delete_icon3.png";
import view_icon from "@/assets/images/view_icon_3.svg";
import refresh from "@/assets/images/refresh.png";
import search_icon from "@/assets/images/search_icon@3x.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Select from "react-select";
import Vector from "@/assets/images/Vector.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { propTypes } from "react-bootstrap/esm/Image";

const ledgerFilterOps = [
  { label: "All", value: "All" },
  { label: "With Balance", value: "Balancing" },
  // more options...
];
class LedgerList extends React.Component {
  constructor(props) {
    super(props);
    this.LedgerRef = React.createRef();
    this.FilterRef = React.createRef();
    this.tableManager = React.createRef(null);
    this.state = {
      show: false,
      lstLedger: [],
      lstLedger1: [],
      sortedColumn: null,
      sortOrder: "asc",
      lstLedgerFiltered: [],
      isLedgerFilterd: true,
      opendiv: false,
      showDiv: true,
      orgData: [],
      orgData1: [],
      totalDr: 0,
      totalCr: 0,
      showloader: false,
      search: "",
      selectedFilter: getSelectValue(ledgerFilterOps, "All"),

      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      date: new Date(),
      createId: 0,
    };
  }
  getlstLedger = () => {
    this.setState({ showloader: true });
    getLedgers()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          this.setState(
            {
              lstLedger1: res.responseList,
              orgData1: res.responseList,
              showloader: false,
              search: "",
            },
            () => {
              this.getFilterLstLedger();
              const { prop_data } = this.props.block;
              if (prop_data.filter_data) {
                this.setState({ selectedFilter: prop_data.filter_data }, () => {
                  // callback function

                  this.handleLstChange(this.state.selectedFilter); //with balance is showing but filtering as All
                });
              } else if (prop_data.filter_list) {
                this.setState({ selectedFilter: prop_data.filter_list }, () => {
                  this.handleLstChange(this.state.selectedFilter);
                });
              }
            }
          );
          // setTimeout(() => {
          //   if (this.props.block.prop_data.rowId) {
          //     document
          //       .getElementById("ledgerTr_" + this.props.block.prop_data.rowId)
          //       .focus();
          //   } else if (document.getElementById("SearchL") != null) {
          //     {
          //       document.getElementById("SearchL").focus();
          //     }
          //   }
          // }, 100);
        }
      })
      .catch((error) => {
        console.log("error", error);
        ShowNotification("Error", "Unable to connect the server");
      });
  };

  // Pagination functionality
  LedgerListFun = () => {
    // debugger;
    // console.log("values==========>", values)
    this.setState({ showloader: true });
    let { currentPage, pageLimit, colId, isAsc, search } = this.state;

    let req = {
      "pageNo": currentPage,
      "pageSize": pageLimit,
      "searchText": search != null ? search : "",
      // "colId": colId,
      // "isAsc": isAsc,
      "sort": '{ "colId": null, "isAsc": true }',
      // "startDate": startDate != null ?
      //   moment(startDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
      // "endDate": endDate != null ?
      //   moment(endDate, "DD-MM-YYYY").format("YYYY-MM-DD") : "",
    };
    getAllLedgersPagination(req)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              // getproducttable: res.data,
              orgData: res.responseObject.data,
              showloader: false,
              lstLedger:
                res.responseObject.data != null ? res.responseObject.data : [],

              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
            },
            () => {
              this.handleLstChange();

              setTimeout(() => {
                if (this.props.block.prop_data.createId != null) {
                  document.getElementById("ledgerTr_" + this.props.block.prop_data.createId)?.focus();
                }
                else if (this.props.block.prop_data.rowId) {
                  document.getElementById("ledgerTr_" + this.props.block.prop_data.rowId)?.focus();
                } else if (this.props.block.prop_data.viewId) {
                  document.getElementById("ledgerTr_" + this.props.block.prop_data.viewId)?.focus();
                }

                else if (document.getElementById("SearchL") != null) {

                  document.getElementById("SearchL")?.focus();

                }

              }, 1200);
              // this.LedgerRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };

  goToNextPage = () => {
    // not yet implemented
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.LedgerListFun();
    });
  };

  goToPreviousPage = () => {
    // not yet implemented
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.LedgerListFun();
    });
  };

  handleSearch = (vi) => {
    this.setState({ search: vi }, () => {
      let { orgData1, orgData } = this.state;
      let orgData_F = orgData1.filter((v) => {
        const foundationsName = v.foundations_name
          ? v.foundations_name.toLowerCase()
          : "";
        const principleName = v.principle_name
          ? v.principle_name.toLowerCase()
          : "";
        const subprincipleName = v.subprinciple_name
          ? v.subprinciple_name.toLowerCase()
          : "";
        const ledgerName = v.ledger_name ? v.ledger_name.toLowerCase() : "";
        const dr = v.dr ? v.dr.toString() : "";
        const cr = v.cr ? v.cr.toString() : "";

        return (
          foundationsName.includes(vi.toLowerCase()) ||
          principleName.includes(vi.toLowerCase()) ||
          subprincipleName.includes(vi.toLowerCase()) ||
          ledgerName.includes(vi.toLowerCase()) ||
          dr.includes(vi) ||
          cr.includes(vi)
        );
      });
      //     (v.foundations_name != null &&
      //       v.principle_name != null &&
      //       v.subprinciple_name != null &&
      //       v.ledger_name != null &&
      //       v.dr != null &&
      //       v.cr != null &&
      //       v.foundations_name.toLowerCase().includes(vi.toLowerCase())) ||
      //     v.principle_name.toLowerCase().includes(vi.toLowerCase()) ||
      //     v.subprinciple_name.toLowerCase().includes(vi.toLowerCase()) ||
      //     v.ledger_name.toLowerCase().includes(vi.toLowerCase()) ||
      //     v.dr.toString().includes(vi) ||
      //     v.cr.toString().includes(vi)
      // );

      // this.setState({
      //   lstLedger: orgData_F.length > 0 ? orgData_F : orgData,
      // });
      // if (this.state.lstLedger.ledger_name != orgData_F) {
      //   MyNotifications.fire({
      //     show: true,
      //     icon: "error",
      //     title: "Error",
      //     msg: "No result found",
      //     is_button_show: true,
      //   });
      // }

      if (vi.length == 0) {
        this.setState({
          lstLedger: orgData,
        });
      } else {
        this.setState({
          lstLedger: orgData_F.length > 0 ? orgData_F : [],
        });
      }
    });
  };

  getFilterLstLedger = () => {
    let { isLedgerFilterd, lstLedger } = this.state;

    if (lstLedger.length > 0) {
      let filterLst = lstLedger;
      // console.log("all_filterLst",);
      if (isLedgerFilterd) {
        filterLst = filterLst.filter(
          (v) => v.dr > 0 || v.cr > 0 || v.rdr > 0 || v.rcr > 0
        );
      }
      this.setState({ lstLedgerFiltered: filterLst });
      // console.log("filterLst", filterLst);
    }
  };

  handleLstChange = (selectedAll) => {
    let { orgData, selectedFilter } = this.state;
    if (orgData.length > 0) {
      // const selectedAll = e.value;
      let filterLst = orgData;
      if (selectedFilter.value === "Balancing") {
        filterLst = filterLst.filter(
          (v) => v.dr > 0 || v.cr > 0 || v.rdr > 0 || v.rcr > 0
        );
        // console.warn("filterLst->>>>>>>>", filterLst);
        this.setState({
          selectedAll: selectedAll,
          lstLedger: filterLst,
          // selectedFilter: getSelectValue(ledgerFilterOps, selectedAll.value),
        });
        // alert(JSON.stringify(filterLst.length));
      } else {
        this.setState({
          selectedAll: selectedAll,
          lstLedger: orgData,
          // selectedFilter: getSelectValue(ledgerFilterOps, selectedAll.value),
        });
        // alert(JSON.stringify(lstLedger.length));
      }
    }
  };

  getDebitTotalAmount = () => {
    let { lstLedger } = this.state;
    let debitamt = 0;
    lstLedger.map((v) => {
      debitamt = parseFloat(debitamt) + parseFloat(v["dr"]);
    });

    return isNaN(debitamt) ? 0 : parseFloat(debitamt).toFixed(2);
  };

  getCreditTotalAmount = () => {
    let { lstLedger } = this.state;
    let creditamt = 0;
    lstLedger.map((v) => {
      creditamt = parseFloat(creditamt) + parseFloat(v["cr"]);
    });

    return isNaN(creditamt) ? 0 : parseFloat(creditamt).toFixed(2);
  };

  getBalanceTotalAmount = () => {
    let { lstLedger } = this.state;
    let balanceamt = 0;
    lstLedger.map((v) => {
      balanceamt = parseFloat(balanceamt) + parseFloat(v["balance"]);
    });

    return isNaN(balanceamt) ? 0 : parseFloat(balanceamt).toFixed(2);
  };
  pageReload = () => {
    this.componentDidMount();
  };

  setUpdateValue = (id, i) => {
    const { filter_list } = this.props;
    let { selectedFilter, search } = this.state;
    eventBus.dispatch("page_change", {
      from: "ledgerlist",
      to: "ledgeredit",
      prop_data: {
        prop_data: id,
        rowId: i,
        selectedFilter: selectedFilter,
        searchValue: search,
      },

      isNewTab: false,
    });
  };
  deleteledger = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_ledger(formData)
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
        this.setState({ lstLedger: [] });
      });
  };

  OpenLedgerCreate = (e) => {
    eventBus.dispatch("page_change", "ledgercreate");
  };
  OpenProductList = (e) => {
    eventBus.dispatch("page_change", "productlist");
  };

  handleKeyPress = (event) => {
    if (event.key === "F2") {
      event.preventDefault();
      this.OpenLedgerCreate();
    } else if (event.altKey && event.key == "p") {
      event.preventDefault();
      this.OpenProductList();
    }
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    if (AuthenticationCheck()) {
      const { prop_data } = this.props.block;
      console.warn("prop_data ", prop_data);
      if (prop_data != "") {
        // debugger;
        let selectedFilter = "";
        let searchValue = "";
        if ("selectedFilter" in prop_data) {
          if (
            prop_data.selectedFilter != null &&
            prop_data.selectedFilter != undefined
          ) {
            selectedFilter = prop_data.selectedFilter;
          }
        }
        if ("searchValue" in prop_data) {
          if (
            prop_data.searchValue != null &&
            prop_data.searchValue != undefined
          ) {
            searchValue = prop_data.searchValue;
          }
        }

        this.setState(
          {
            selectedFilter: selectedFilter,
            search: searchValue,
          },
          () => {
            this.LedgerListFun();
          }
        );
      } else {
        this.LedgerListFun();
      }
      // this.getlstLedger();
    }
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  handleTableRow(event) {
    const t = event.target;

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
        if (isActionExist("ledger", "edit", this.props.userPermissions)) {
          if (selectedLedger.default_ledger === false) {
            this.setUpdateValue(selectedLedger.id, index);
          } else {
            ShowNotification(
              "Error",
              "Permission denied to update (Default Ledgers)"
            );
          }
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
    let { lstLedger, sortedColumn, sortOrder } = this.state;

    let sortedData = [...lstLedger];
    if (sortOrder == "asc") {
      sortedData.sort((a, b) => (a[sortedColumn] > b[sortedColumn] ? 1 : -1));
    } else {
      sortedData.sort((a, b) => (a[sortedColumn] < b[sortedColumn] ? 1 : -1));
    }

    this.setState({
      lstLedger: sortedData,
    });
  };

  render() {
    const {
      show,
      lstLedgerFiltered,
      isLedgerFilterd,
      lstLedger,
      totalDr,
      totalCr,
      showloader,
      search,
      selectedAll,
      currentPage,
      pages,
      totalRows,
      pageNo,
      selectedFilter,
      createId
    } = this.state;

    return (
      <div
        className="wrapper_div ledger-group-style"
        style={{ overflow: "hidden" }}
      >
        <div className="cust_table">
          <Row
            onKeyDown={(e) => {
              if (e.keyCode === 40) {
                e.preventDefault();
                document.getElementById("ledgerTr_0")?.focus();
              }
            }}>
            <Col md="3">
              <InputGroup className="mb-2  mdl-text">
                <Form.Control
                  type="text"
                  innerRef={this.productRef}
                  name="Search"
                  id="SearchL"
                  onChange={(e) => {
                    let v = e.target.value;
                    this.setState({ search: v }, () => {
                      this.LedgerListFun();
                    });
                    // this.handleSearch(v);
                  }}
                  placeholder="Search"
                  onKeyDown={(e) => {
                    if (e.keyCode == 13)
                      this.FilterRef.current?.focus();
                  }
                  }
                  className="mdl-text-box"
                  autoFocus={true}
                  autoComplete="off"
                  value={search}
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search_icon} alt="" />
                  {/* <img src={search} alt="" /> */}
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col lg={2}>
              <Row>
                <Col lg={3}>
                  <Form.Label>Filter</Form.Label>
                </Col>
                <Col lg={6}>
                  {/* <Form.Group className="">
                    <Form.Select
                      className="selectTo"
                      styles={ledger_select}
                      onChange={this.handleLstChange}
                      value={selectedAll}
                      style={{ boxShadow: "none", width: "104%" }}
                    >
                      <option value="All" selected>
                        All
                      </option>
                      <option value="Balancing">With Balance</option>
                    </Form.Select>
                  </Form.Group> */}
                  <Select
                    className="selectTo"
                    ref={this.FilterRef}
                    onChange={(e) => {
                      this.setState(
                        {
                          selectedFilter: e,
                        },
                        () => {
                          this.handleLstChange();
                        }
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        e.preventDefault();
                        document
                          .getElementById("LL-create-btn")
                          .focus();
                      }
                    }}
                    // name="opening_balancing_method"
                    // styles={customStyles}
                    styles={ledger_select}
                    options={ledgerFilterOps}
                    value={selectedFilter}
                  //styles={customStyles}
                  />
                </Col>
              </Row>
            </Col>

            {/* <Col md="1">
            </Col> */}

            <Col md="7" className="text-end ">
              <div id="example-collapse-text">
                <div className="">
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
                    id="LL-create-btn"
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
                        // eventBus.dispatch("page_change", "ledgercreate");
                        eventBus.dispatch("page_change", {
                          from: "ledgerlist",
                          to: "ledgercreate",
                          prop_data: {
                            rowId: 0,
                            selectedFilter: selectedFilter,
                            searchValue: search,
                            createId: 0
                          },

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
                          // eventBus.dispatch("page_change", "ledgercreate");
                          eventBus.dispatch("page_change", {
                            from: "ledgerlist",
                            to: "ledgercreate",
                            prop_data: {
                              rowId: 0,
                              selectedFilter: selectedFilter,
                              searchValue: search,
                            },

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
                </div>
              </div>
            </Col>
          </Row>
          {/* {lstLedger.length > 0 && ( */}
          <div className="tbl-list-style1">
            {isActionExist("ledger", "list", this.props.userPermissions) && (
              <Table size="sm" className="tbl-font">
                <thead>
                  <tr>
                    {/* {this.state.showDiv && (
                      <th
                        style={{
                          // width: "114px",
                          width: "10%",
                        }}
                      >
                        Sr#
                      </th>
                    )} */}
                    <th
                      style={
                        {
                          // width: "169px",
                          // width: "203px",
                        }
                      }
                    >
                      <div className="d-flex">
                        Ledger Name
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
                    <th
                      style={
                        {
                          // width: "169px",
                          // width: "203px",
                        }
                      }
                    >
                      Foundation
                    </th>
                    <th
                      style={
                        {
                          // width: "205px",
                          // width: "203px",
                        }
                      }
                    >
                      Principle
                    </th>
                    <th
                      style={
                        {
                          // width: "205px",
                          // width: "203px",
                        }
                      }
                    >
                      Sub Principle
                    </th>

                    <th
                      style={{
                        // textAlign: "end",
                        width: "146px",
                      }}
                    >
                      <div className="d-flex" style={{ justifyContent: "end" }}>
                        Debit
                        <div
                          className="ms-2"
                          onClick={() => this.handleSort("dr")}
                        >
                          {this.state.sortedColumn === "dr" &&
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

                    <th
                      style={{
                        width: "146px",
                      }}
                    >
                      <div className="d-flex" style={{ justifyContent: "end" }}>
                        Credit
                        <div
                          className="ms-2"
                          onClick={() => this.handleSort("cr")}
                        >
                          {this.state.sortedColumn === "cr" &&
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
                    <th
                      style={{
                        textAlign: "center",
                        width: "146px",
                      }}
                    >
                      Action
                    </th>
                    {/* <th
                      className="text-end"
                      style={{ width: "15%", paddingRight: "30px" }}
                    >
                      Action
                    </th> */}
                  </tr>
                </thead>
                {/* <tfoot>
                <tr>
                  {this.state.showDiv && <th>Sr.</th>}
                  <th>Ledger Name</th>
                  <th>Group Name</th>
                  <th className="btn_align">Debit</th>
                  <th className="btn_align">Credit</th>
                </tr>
              </tfoot> */}
                <tbody
                  style={{ borderTop: "2px solid transparent" }}
                  className="prouctTableTr"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.shiftKey && e.keyCode == 9) {
                      document.getElementById("LL-create-btn").focus();
                    } else if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {lstLedger.map((v, i) => {
                    let grpName = "";
                    if (v.subprinciple_name !== "") {
                      grpName = v.subprinciple_name;
                    } else if (v.principle_name !== "") {
                      grpName = v.principle_name;
                    }
                    return (
                      <tr
                        value={JSON.stringify(v)}
                        id={`ledgerTr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          if (
                            isActionExist(
                              "ledger",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            if (v.default_ledger === false) {
                              this.setUpdateValue(v.id, i);
                            } else {
                              ShowNotification(
                                "Error",
                                "Permission denied to update (Default Ledgers)"
                              );
                            }
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
                        className="cursur_pointer"
                      >
                        {/* <td style={{ width: "10%" }}>{i + 1}</td> */}
                        <td>{v.ledger_name}</td>
                        <td>{v.foundations_name}</td>
                        <td>{v.principle_name}</td>
                        <td>{v.subprinciple_name}</td>
                        <td style={{ width: "146px", textAlign: "end" }}>
                          {/* {v.dr} */}
                          {INRformat.format(v.dr)}
                        </td>
                        <td style={{ width: "146px", textAlign: "end" }}>
                          {/* {v.cr} */}
                          {INRformat.format(v.cr)}
                        </td>
                        <td style={{ width: "146px", textAlign: "center" }}>
                          {" "}
                          <img
                            src={view_icon}
                            // style={{ width: "8%" }}
                            title="View"
                            onClick={(e) => {
                              let { selectedFilter } = this.state;
                              e.preventDefault();
                              if (
                                isActionExist(
                                  "ledger",
                                  "view",
                                  this.props.userPermissions
                                )
                              ) {
                                eventBus.dispatch("page_change", {
                                  to: "ledgerdetails",
                                  // prop_data: v.id,
                                  prop_data: {
                                    prop_data: v.id,
                                    viewId: i,
                                    selectedFilter: selectedFilter,
                                    searchValue: search,
                                  },
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
                            className="del_iconWp"
                            title="Delete"
                            onClick={(e) => {
                              if (
                                isActionExist(
                                  "ledger",
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
                                      this.deleteledger(v.id);
                                    },
                                    handleFailFn: () => { },
                                  },
                                  () => {
                                    // console.warn("return_data");
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

                        {/* <td className="text-end" style={{ width: "15%" }}>
                          <img
                            src={view_icon}
                            style={{ width: "8%" }}
                            title="View"
                          />
                          <img
                            src={delete_icon}
                            style={{ width: "6%", margin: "0px 15px 0px 20px" }}
                            title="Delete"
                          />
                        </td> */}
                      </tr>
                    );
                  })}
                  {lstLedger.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Data Found
                      </td>
                      {showloader == true && LoadingComponent(showloader)}
                    </tr>
                  )}
                </tbody>
                {/* <thead className="tbl-footer mb-2">
                  <tr>
                    <th
                      colSpan={7}
                      className=""
                      style={{ borderTop: " 2px solid transparent" }}
                    >
                      {Array.from(Array(1), (v) => {
                        return (
                          <tr>
                           
                            <th>Total Ledger List :</th>
                            <th>{lstLedger.length}</th>
                          </tr>
                        );
                      })}
                    </th>
                  </tr>
                </thead> */}
              </Table>
            )}
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

                              <Col md="6">
                                <Form.Label className="btm-label d-flex">
                                  <FontAwesomeIcon
                                    icon={faCalculator}
                                    className="svg-style icostyle mt-0 mx-2"
                                  />
                                  <span className="shortkey">Alt+C</span>
                                </Form.Label>
                              </Col>
                            </Row>
                          </Col>
                          <Col md="2" className="">
                            <Row>
                              <Col md="6">
                                <Form.Label className="btm-label d-flex">
                                  <FontAwesomeIcon
                                    icon={faGear}
                                    className="svg-style icostyle mt-0 mx-2"
                                  />
                                  <span className="shortkey">F11</span>
                                </Form.Label>
                              </Col>
                              <Col md="6">
                                <Form.Label className="btm-label d-flex">
                                  <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    className="svg-style icostyle mt-0 mx-2"
                                  />
                                  <span className="shortkey">Ctrl+Z</span>
                                </Form.Label>
                              </Col>
                            </Row>
                          </Col>
                          <Col md="2" className="">
                            <Row>
                              <Col md="6" className="">
                                <Form.Label className="btm-label d-flex">
                                  <FontAwesomeIcon
                                    icon={faPrint}
                                    className="svg-style icostyle mt-0 mx-2"
                                  />
                                  <span className="shortkey">Ctrl+P</span>
                                </Form.Label>
                              </Col>
                              <Col md="6" className="">
                                <Form.Label className="btm-label d-flex">
                                  <FontAwesomeIcon
                                    icon={faArrowUpFromBracket}
                                    className="svg-style icostyle mt-0 mx-2"
                                  />
                                  <span className="shortkey">Export</span>
                                </Form.Label>
                              </Col>
                            </Row>
                          </Col>
                          <Col md="2" className="">
                            <Row>
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

                      <Col lg={2} className="text-end">
                        <Row>
                          <Col className="my-auto">Ledger :{totalRows}</Col>
                          {/* <Col lg={4} className="text-center">
                        <Button
                          type="button"
                          onClick={this.goToPreviousPage.bind(this)}
                          disabled={currentPage <= 1}
                          className="nextbtn"
                        >
                          <FontAwesomeIcon
                            icon={faChevronLeft}
                            className="plus-color"
                          />{" "}
                          &nbsp;&nbsp;Prev
                        </Button>
                        <Button
                          type="button"
                          onClick={this.goToNextPage.bind(this)}
                          className="nextbtn"
                          disabled={currentPage === pages ? true : false}
                        >
                          Next&nbsp;&nbsp;{" "}
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="plus-color"
                          />
                        </Button>
                      </Col> */}
                          {/* <Col lg="6" className="my-auto">
                            Page No.{currentPage} Out of 10
                        {/* <span>{this.state.currentPage}</span> 
                          </Col> */}
                        </Row>
                      </Col>
                    </Row>
                  );
                })}
              </Col>
            </Row>
          </div>

          {/* )} */}
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

export default connect(mapStateToProps, mapActionsToProps)(LedgerList);
