import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  Table,
  FormControl,
} from "react-bootstrap";
import {
  getProductLst,
  get_product_List,
  searchProduct,
  delete_Product_list,
  ProductListImport,
  transaction_product_details,
} from "@/services/api_functions";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search_icon from "@/assets/images/search_icon.png";
import { Formik } from "formik";
import refresh from "@/assets/images/refresh.png";
import delete_icon from "@/assets/images/delete_icon3.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Yup from "yup";

import {
  AuthenticationCheck,
  MyDatePicker,
  eventBus,
  MyNotifications,
  isActionExist,
  ShowNotification,
  INRformat,
  LoadingComponent,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
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

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.productRef = React.createRef();

    this.SearchRef = React.createRef();
    this.state = {
      show: false,
      brandshow: false,
      opendiv: false,
      showDiv: false,
      productdetaillistmodal: false,
      getproducttable: [],
      productLst: [],
      sortedColumn: null,
      sortOrder: "asc",
      orgData: [],
      orgData1: [],
      showloader: false,
      productData: [],
      // getProductData:[],

      currentPage: 1,
      pageLimit: 50,
      totalRows: 0,
      pages: 0,
      search: "",
      // date: new Date(),
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  // Pagination functionality
  ProductListFun = () => {
    // debugger;
    // console.log("values==========>", values)
    this.setState({ showloader: true });
    let { currentPage, pageLimit, colId, isAsc, search } = this.state;

    let req = {
      pageNo: currentPage,
      pageSize: pageLimit,
      searchText: search != null ? search : "",
      // "colId": colId,
      // "isAsc": isAsc,
      sort: '{ "colId": null, "isAsc": true }',
    };

    ProductListImport(req)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              // getproducttable: res.data,
              orgData: res.responseObject.data,
              showloader: false,
              getproducttable:
                res.responseObject.data != null ? res.responseObject.data : [],

              totalRows:
                res.responseObject != null ? res.responseObject.total : 0,
              pages:
                res.responseObject != null ? res.responseObject.total_pages : 0,
            },
            () => {
              // document.getElementById("SearchPL").value = search;
              // this.productRef.current.setFieldValue("search", "");
              // console.log("<<<<<<<<<<<<pages", this.state.pages);
            }
          );
          // console.log("List productId", this.props.block.prop_data);
          setTimeout(() => {
            if (this.props.block.prop_data.rowId) {
              document
                .getElementById("productTr_" + this.props.block.prop_data.rowId)
                .focus();
            } else if (
              this.props.block.prop_data.productId !== "" &&
              this.props.block.prop_data.productId !== undefined
            ) {
              const index = res.responseObject.data.findIndex((object) => {
                return object.id === this.props.block.prop_data.productId;
              });
              if (index >= 0)
                document.getElementById("productTr_" + index).focus();
            } else if (document.getElementById("SearchPL") != null) {
              document.getElementById("SearchPL").focus();
            }
          }, 1500);
        }
      })
      .catch((error) => {
        this.setState({ getproducttable: [] });
      });
  };

  goToNextPage = () => {
    // not yet implemented
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page + 1 }, () => {
      this.ProductListFun();
    });
  };

  goToPreviousPage = () => {
    // not yet implemented
    let page = parseInt(this.state.currentPage);
    this.setState({ currentPage: page - 1 }, () => {
      this.ProductListFun();
    });
  };

  pageReload = () => {
    this.componentDidMount();
  };

  handleFetchData = (id, i) => {
    eventBus.dispatch("page_change", {
      from: "productlist",
      to: "newproductedit",
      // prop_data: id,
      prop_data: { prop_data: id, rowId: i },
      isNewTab: false,
    });
  };
  deleteproduct = (id) => {
    // debugger;
    let formData = new FormData();
    formData.append("id", id);
    formData.append("source", "");
    delete_Product_list(formData)
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

  OpenProductCreate = (e) => {
    eventBus.dispatch("page_change", {
      to: "newproductcreate",
      from: "productlist",
      isNewTab: false,
    });
  };
  OpenLedgerList = (e) => {
    eventBus.dispatch("page_change", "ledgerlist");
  };

  handleKeyPress = (event) => {
    // console.log("event", event);
    if (event.key === "F2") {
      event.preventDefault();
      this.OpenProductCreate();
    } else if (event.altKey && event.key == "l") {
      event.preventDefault();
      this.OpenLedgerList();
    }
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    if (AuthenticationCheck()) {
      this.ProductListFun();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  transaction_product_detailsFun = (product_id = 0) => {
    if (product_id > 0) {
      let requestData = new FormData();
      requestData.append("product_id", product_id);
      transaction_product_details(requestData)
        .then((response) => {
          let res = response.data;
          // console.log("res--product", res);
          if (res.responseStatus == 200) {
            this.setState({
              productData: res.result,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
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
        this.transaction_product_detailsFun(val.id);

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
        this.transaction_product_detailsFun(val.id);
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else {
      // debugger;
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
        let index = JSON.parse(cuurentProduct.getAttribute("tabIndex"));
        if (isActionExist("product", "edit", this.props.userPermissions)) {
          this.handleFetchData(selectedLedger.id, index);
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
    let { getproducttable, sortedColumn, sortOrder } = this.state;

    let sortedData = [...getproducttable];
    if (sortOrder == "asc") {
      sortedData.sort((a, b) => (a[sortedColumn] > b[sortedColumn] ? 1 : -1));
    } else {
      sortedData.sort((a, b) => (a[sortedColumn] < b[sortedColumn] ? 1 : -1));
    }

    this.setState({
      getproducttable: sortedData,
    });
  };

  render() {
    const {
      show,
      brandshow,
      productLst,
      productdetaillistmodal,
      showDiv,
      opendiv,
      getproducttable,
      orgData,
      showloader,
      productData,
      currentPage,
      pageLimit,
      totalRows,
      pages,
      search,
    } = this.state;
    return (
      <div className="product_list_style" style={{ overflow: "hidden" }}>
        <div className="">
          <Row style={{ padding: "8px" }}
            onKeyDown={(e) => {
              if (e.keyCode === 40) {
                e.preventDefault();

                document.getElementById("productTr_0")?.focus();

              }
            }}>
            <Col md="3">
              <InputGroup className="mdl-text">
                <Form.Control
                  ref={(input) => {
                    this.SearchRef = input;
                  }}
                  type="text"
                  name="Search"
                  id="SearchPL"
                  onChange={(e) => {
                    let v = e.target.value;
                    this.setState({ search: v }, () => {
                      this.ProductListFun();
                    });
                  }}
                  placeholder="Search"
                  className="mdl-text-box"
                  autoFocus="true"
                  autoComplete="SearchPL"
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                      document.getElementById("PL_create_btn").focus();
                    }
                  }}
                />
                <InputGroup.Text
                  className="int-grp"
                  id="basic-addon1"
                  style={{ border: "1px solid #fff" }}
                >
                  <img className="srch_box" src={search_icon} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md="9" className="btn_align mainbtn_create">
              {/* {this.state.hide == 'true'} */}
              {/* <Button
                      className="ml-2 btn-refresh"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        this.pageReload();
                      }}
                    >
                      <img src={refresh} alt="icon" />
                    </Button> */}
              <Button
                className="create-btn mr-2"
                id="PL_create_btn"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    isActionExist(
                      "product",
                      "create",
                      this.props.userPermissions
                    )
                  ) {
                    eventBus.dispatch("page_change", "newproductcreate");
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
                    e.preventDefault();
                    if (
                      isActionExist(
                        "product",
                        "create",
                        this.props.userPermissions
                      )
                    ) {
                      eventBus.dispatch("page_change", "newproductcreate");
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
                        class="bi bi-plus-square-dotted svg-style ms-1"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                      </svg> */}
              </Button>
              {/* <Button
                  className="create-btn mr-2"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   // this.setState({ opendiv: !opendiv });
                  //   // window.electron.ipcRenderer.webPageChange(
                  //   //   "productcreate"
                  //   // );
                  //   eventBus.dispatch("page_change", "productcreate");
                  // }}

                  onClick={(e) => {
                    e.preventDefault();
                    if (isActionExist("productlist", "create")) {
                      eventBus.dispatch("page_change", "productcreate");
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style ms-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                </Button> */}
            </Col>
          </Row>

          <div className="product_tbl_style">
            {isActionExist("product", "list", this.props.userPermissions) && (
              <>
                <Table>
                  <thead>
                    {/* <div className="scrollbar_hd"> */}
                    <tr>
                      {/* <th>Sr. #.</th> */}

                      <th>Search Code</th>
                      <th>
                        <div className="d-flex">
                          Product Name
                          <div
                            className="ms-2"
                            onClick={() => this.handleSort("product_name")}
                          >
                            {this.state.sortedColumn === "product_name" &&
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
                      <th>Packing</th>
                      <th>Barcode</th>
                      <th>
                        <div className="d-flex">
                          Brand
                          <div
                            className="ms-2"
                            onClick={() => this.handleSort("brand")}
                          >
                            {this.state.sortedColumn === "brand" &&
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
                      <th className="text-end">
                        <div
                          className="d-flex"
                          style={{ justifyContent: "end" }}
                        >
                          M.R.P
                          <div
                            className="ms-2"
                            onClick={() => this.handleSort("mrp")}
                          >
                            {this.state.sortedColumn === "mrp" &&
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

                      {/* <th className="text-end">Opening Stock</th> */}
                      <th className="text-end">Current Stock</th>
                      <th className="text-end">Unit</th>
                      <th className="text-end">Sale Rate</th>
                      <th style={{ width: "5%" }} className="text-end">
                        Action
                      </th>
                      {/* <th>Group</th>
                    <th>Category</th>
                    <th>Subcategoty</th> */}
                      {/* <th style={{ textAlign: "center" }}>Quantity</th> */}
                      {/* <th style={{ textAlign: "center" }}>Rate</th> */}
                    </tr>
                  </thead>
                  <tbody
                    style={{ border: "2px solid #e1e0e0" }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                      if (e.shiftKey && e.keyCode == 9) {
                        document.getElementById("PL_create_btn").focus();
                      } else if (e.keyCode != 9) {
                        this.handleTableRow(e);
                      }
                    }}
                    className="prouctTableTr"
                  >
                    {/* <div className="scrollban_new"> */}
                    {getproducttable.length > 0 ? (
                      getproducttable.map((v, i) => {
                        return (
                          <tr
                            value={JSON.stringify(v)}
                            id={`productTr_` + i}
                            // prId={v.id}
                            tabIndex={i}
                            onFocus={(e) => {
                              this.transaction_product_detailsFun(v.id);
                            }}
                            // onDoubleClick={(e) => {
                            //   e.preventDefault();
                            //   this.handleFetchData(v.id);
                            // }}
                            // onMouseOver={(e) => {
                            //   this.transaction_product_detailsFun(v.id);

                            // }}
                            onClick={(e) => {
                              this.transaction_product_detailsFun(v.id);
                            }}
                            onDoubleClick={(e) => {
                              if (
                                isActionExist(
                                  "product",
                                  "edit",
                                  this.props.userPermissions
                                )
                              ) {
                                this.handleFetchData(v.id, i);
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

                            <td>{v.search_code}</td>
                            <td>{v.product_name}</td>
                            <td>{v.packing}</td>
                            <td>{v.barcode}</td>
                            <td>{v.brand}</td>
                            <td className="text-end">
                              {/* {parseFloat(v.mrp).toFixed(2)} */}
                              {INRformat.format(v.mrp)}
                            </td>
                            {/* <td className="text-end">{v.opening_stocks}</td> */}
                            <td className="text-end">{v.closing_stocks}</td>
                            <td className="text-end">{v.unit}</td>
                            <td className="text-end">
                              {INRformat.format(v.sales_rate)}
                            </td>
                            <td className="text-end" style={{ width: "5%" }}>
                              {" "}
                              {/* <img
                                src={TableEdit}
                                alt=""
                                className="mdl-icons"
                              /> */}
                              <img
                                src={delete_icon}
                                className="mdl-icons ms-2"
                                title="Delete"
                                onClick={(e) => {
                                  if (
                                    isActionExist(
                                      "product",
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
                                          // debugger;
                                          this.deleteproduct(v.id);
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
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colspan="11" className="text-center">
                          No Data Found
                        </td>
                        {showloader == true && LoadingComponent(showloader)}
                      </tr>
                    )}
                    {/* </div> */}
                  </tbody>
                </Table>
              </>
            )}
          </div>

          <div>
            <div className="ledger_details_style">
              <Row className="mx-1">
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td style={{ width: "30%" }}>Group:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != "" ? productData.group : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "30%" }}>Subgroup:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != "" ? productData.subgroup : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "30%" }}>Category:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != "" ? productData.category : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "30%" }}>Shelf ID:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != "" ? productData.shelf_id : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td style={{ width: "30%" }}>HSN:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != "" ? productData.hsn : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "30%" }}>Tax Type:</td>
                        <td>
                          <p
                            className="colored_sub_text mb-0"
                            style={{ textTransform: "capitalize" }}
                          >
                            {productData != "" ? productData.tax_type : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "30%" }}>Tax%:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != "" ? productData.tax_per : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "30%" }}>Margin%:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != "" ? productData.margin_per : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td style={{ width: "30%" }}>Cost:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != ""
                              ? // productData.cost
                              INRformat.format(productData.cost)
                              : ""}
                          </p>
                        </td>
                      </tr>
                      {/* <tr>
                        <td style={{ width: "30%" }}>Shelf ID:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != "" ? productData.shelf_id : ""}
                          </p>
                        </td>
                      </tr> */}
                      <tr>
                        <td style={{ width: "30%" }}>Purchase Rate:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {productData != ""
                              ? //  productData.purchase_rate
                              INRformat.format(productData.purchase_rate)
                              : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "30%" }}>Min Stock:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {productData != "" ? productData.min_stocks : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "30%" }}>Max Stock:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {productData != "" ? productData.max_stocks : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
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
                        <Col
                          className="btm_text pe-4 my-auto"
                          style={{ margin: "0px" }}
                        >
                          Products:{totalRows}
                        </Col>
                        {/* <Col lg={4} className="text-center">
                      <Button
                        type="button"
                        // onClick={this.goToPreviousPage.bind(this)}
                        // disabled={this.state.currentPage <= 1}
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
                        />{" "}
                        &nbsp;&nbsp;Prev
                      </Button>
                      {console.log("pages", pages)}
                      <Button
                        className="nextbtn"
                        type="button"
                        // onClick={this.goToNextPage.bind(this)}
                        onClick={(e) => {
                          e.preventDefault();
                          this.goToNextPage();
                        }}
                        // disabled={
                        //   this.state.getproducttable.length == 0 ? true : false
                        // }
                        disabled={currentPage === pages ? true : false}
                      >
                        Next&nbsp;&nbsp;{" "}
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="plus-color"
                        />
                      </Button>
                    </Col> */}
                        {/* <Col lg={6} className="my-auto pe-4">
                          Page No.{currentPage} Out of 10
                        </Col> */}
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

export default connect(mapStateToProps, mapActionsToProps)(ProductList);
