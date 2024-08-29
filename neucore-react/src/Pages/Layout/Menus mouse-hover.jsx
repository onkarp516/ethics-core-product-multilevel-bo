import React, { Component } from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";

import { DropdownSubmenu, NavDropdownMenu } from "@/CustMenu";

import Datetime from "./Datetime";
import Profile_menu from "./Profile_menu";
import dashboard from "@/assets/images/1x/menu_dashboard.png";
import menu_master from "@/assets/images/1x/menu_master.png";
import mainLogo from "@/assets/images/logo.svg";
import master from "@/assets/images/icon/master2.png";
import transaction from "@/assets/images/icon/transaction2.png";
import accentry from "@/assets/images/icon/accentry2.png";
import report from "@/assets/images/icon/report2.png";
import utilities from "@/assets/images/icon/utilities2.png";
import menu_transaction from "@/assets/images/1x/menu_transaction.png";
import menu_account_entry from "@/assets/images/1x/menu_account_entry.png";
import menu_reports from "@/assets/images/1x/menu_reports.png";
import menu_utilities from "@/assets/images/1x/menu_utilities.png";
import top_icon from "@/assets/images/top_icon.svg";
import nav_select_icon from "@/assets/images/nav_select_icon.svg";
import close_icon from "@/assets/images/close_icon.svg";
import { eventBus } from "@/helpers";
import { authenticationService } from "@/services/api_functions";
import { isParentExist, isActionExist } from "@/helpers";
export default class Menus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMstMain: false,
      showMstSub1: false,
      showMstSub2: false,
      showTranxMain: false,
      showTranxSub1: false,
      showTranxSub2: false,
      showAccMain: false,
      showAccSub1: false,
      showAccSub2: false,
      showRepMain: false,
      showRepSub1: false,
      showRepSub2: false,
      showRepSub3: false,
    };
  }

  componentDidMount() {}

  showDropdown = (id, e) => {
    this.setState({ [id]: true });
  };
  hideDropdown = (id, e) => {
    this.setState({ [id]: "" });
  };

  render() {
    const {
      showMstMain,
      showMstSub1,
      showMstSub2,
      showTranxMain,
      showTranxSub1,
      showTranxSub2,
      showAccMain,
      showAccSub1,
      showAccSub2,
      showRepMain,
      showRepSub1,
      showRepSub2,
      showRepSub3,
    } = this.state;
    return (
      <>
        <div style={{ height: "32px", background: "#EBEBEB" }}>
          <img
            src={top_icon}
            alt=""
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "-4px",
            }}
          />
          <span
            style={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "33px",
              color: "#000000",
            }}
          >
            Core Product | Ethics 2.0
          </span>
          <div style={{ display: "inline", float: "right", display: "flex" }}>
            <div>
              <FontAwesomeIcon icon={faMinus} className="minus_icon_style" />
            </div>

            {/* <FontAwesomeIcon icon={faMaximize} className="minus_icon_style" /> */}
            {/* <img
              className="maximize_icon"
              onClick={(e) => {
                e.preventDefault();
                window.Neutralino.app.exit();
              }}
              src={Max}
              alt=""
              // style={{
              //   float: "right",
              //   marginTop: "11px",
              //   height: "9px",
              //   marginRight: "20px",
              // }}
            /> */}
            <img
              onClick={(e) => {
                e.preventDefault();
                window.Neutralino.app.exit();
              }}
              src={close_icon}
              alt=""
              style={{
                float: "right",
                marginTop: "11px",
                height: "9px",
                marginRight: "20px",
              }}
            />
          </div>
        </div>
        <Navbar bg="light" expand="lg" sticky="top">
          <Container
            fluid
            className="menu-style"
            style={{ padding: "12px 0 0 9px" }}
            // style={{ height: "56px", background: "#0A223F" }}
          >
            {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
            {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
            <Navbar.Collapse id="responsive-navbar-nav">
              {" "}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole ===
                  "SADMIN" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    <img
                      alt=""
                      src={mainLogo}
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                      style={{
                        cursor: "pointer",
                        height: "41px",
                        width: "41px",
                      }}
                    />
                    <p
                      style={{
                        margin: "-12px 10px 0px 10px",
                        borderRight: "0.1px solid #2B415C",
                      }}
                    ></p>
                    {/* <Nav.Link
                      className="my-auto"
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <span>

                        <img alt="" src={mainLogo} />
                      </span>
                    </Nav.Link> */}
                    <NavDropdown
                      // show={true}
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={master} /> Master
                        </span>
                      }
                      show={showMstMain}
                      onMouseEnter={(e) => {
                        this.showDropdown("showMstMain", e);
                      }}
                      onMouseLeave={(e) => {
                        this.hideDropdown("showMstMain", e);
                      }}
                    >
                      {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "company");
                        }}
                      >
                        Company
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "companyAdmin");
                        }}
                      >
                        Company Admin
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "branch");
                        }}
                      >
                        Branch
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "branchAdmin");
                        }}
                      >
                        Branch Admin
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={master} /> User Management
                        </span>
                      }
                      show={showTranxMain}
                      onMouseEnter={(e) => {
                        this.showDropdown("showTranxMain", e);
                      }}
                      onMouseLeave={(e) => {
                        this.hideDropdown("showTranxMain", e);
                      }}
                    >
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "user_mgnt_mst_actions"
                          );
                        }}
                      >
                        Actions
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "user_mgnt_mst_modules"
                          );
                        }}
                      >
                        Modules
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "user_mgnt_mst_module_mapping"
                          );
                        }}
                      >
                        Modules Mapping
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                )}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole ===
                  "CADMIN" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    {/* <Nav.Link
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <span className="logoLabelStyle">
                        <img alt="" src={dashboard} /> Dashboard
                      </span>
                    </Nav.Link> */}
                    <img
                      alt=""
                      src={mainLogo}
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                      style={{
                        cursor: "pointer",
                        height: "41px",
                        width: "41px",
                      }}
                    />
                    <p
                      style={{
                        margin: "-12px 10px 0px 10px",
                        borderRight: "0.1px solid #2B415C",
                      }}
                    ></p>
                    <NavDropdown
                      // show={true}
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={master} /> Master
                        </span>
                      }
                      show={showMstMain}
                      onMouseEnter={(e) => {
                        this.showDropdown("showMstMain", e);
                      }}
                      onMouseLeave={(e) => {
                        this.hideDropdown("showMstMain", e);
                      }}
                    >
                      {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   eventBus.dispatch("page_change", "companyuser");
                        // }}
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "user_mgnt_create");
                        }}
                      >
                        Company User
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "branch");
                        }}
                      >
                        Branch
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "branchAdmin");
                        }}
                      >
                        Branch Admin
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   eventBus.dispatch("page_change", "branchAdmin");
                        // }}
                      >
                        Transport master
                      </NavDropdown.Item>
                    </NavDropdown>
                    {/* <NavDropdownMenu title={<span>User Management</span>}>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "user_mgnt_create");
                        }}
                      >
                        User Access Management
                      </NavDropdown.Item>
                    </NavDropdownMenu> */}
                  </Nav>
                )}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole ===
                  "BADMIN" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    {/* <Nav.Link
                      className="logoLabelStyle"
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <img alt="" src={dashboard} /> Dashboard
                    </Nav.Link> */}
                    <img
                      alt=""
                      src={mainLogo}
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                      style={{
                        cursor: "pointer",
                        height: "41px",
                        width: "41px",
                      }}
                    />
                    <p
                      style={{
                        margin: "-12px 10px 0px 10px",
                        borderRight: "0.1px solid #2B415C",
                      }}
                    ></p>
                    <NavDropdown
                      // show={true}
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={master} /> Master
                        </span>
                      }
                      show={showMstMain}
                      onMouseEnter={(e) => {
                        this.showDropdown("showMstMain", e);
                      }}
                      onMouseLeave={(e) => {
                        this.hideDropdown("showMstMain", e);
                      }}
                    >
                      {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   eventBus.dispatch("page_change", "companyuser");
                        // }}
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "user_mgnt_list");
                        }}
                      >
                        Branch User
                      </NavDropdown.Item>
                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "branch");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Branch
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "branchAdmin");
                        }}
                      >
                        <img alt="" src={menu_master} />
                        Branch Admin
                      </NavDropdown.Item> */}
                    </NavDropdown>
                  </Nav>
                )}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole === "USER" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    <img
                      alt=""
                      src={mainLogo}
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                      style={{
                        cursor: "pointer",
                        height: "41px",
                        width: "41px",
                      }}
                    />
                    <p
                      style={{
                        margin: "-12px 10px 0px 10px",
                        borderRight: "0.1px solid #2B415C",
                      }}
                    ></p>
                    {/* <Nav.Link
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashboard");
                      }}
                    >
                      <img alt="" src={dashboard} /> Dashboard
                    </Nav.Link> */}
                    {/* {isParentExist("master") && ( */}
                    <NavDropdown
                      className="drop-icon-style"
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={master} /> Master
                        </span>
                      }
                      show={showMstMain}
                      onMouseEnter={(e) => {
                        this.showDropdown("showMstMain", e);
                      }}
                      onMouseLeave={(e) => {
                        this.hideDropdown("showMstMain", e);
                      }}
                    >
                      {/* {isParentExist("account") && ( */}
                      <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#"
                        title={
                          <span>
                            Account
                            <img
                              alt=""
                              src={nav_select_icon}
                              // className="ms-auto"
                              style={{ float: "right", marginTop: "7px" }}
                            />
                          </span>
                        }
                        show={showMstSub1}
                        onMouseEnter={(e) => {
                          this.showDropdown("showMstSub1", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showMstSub1", e);
                        }}
                      >
                        {/* {isActionExist("ledger-list", "list") && ( */}
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "ledgerlist");
                          }}
                        >
                          Ledger
                        </NavDropdown.Item>
                        {/* )} */}
                        {/* {isActionExist("associate-group", "list") && ( */}
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "associategroup");
                          }}
                        >
                          Ledger Group
                        </NavDropdown.Item>
                        {/* )} */}
                      </NavDropdown>

                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "filters");
                        }}
                      >
                        <img alt="" src={master} />
                        Filters
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "subfilters");
                        }}
                      >
                        <img alt="" src={master} />
                        SubFilters
                      </NavDropdown.Item> */}

                      <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#."
                        title={
                          <span>
                            Inventory
                            <img
                              alt=""
                              src={nav_select_icon}
                              // className="ms-auto"
                              style={{ float: "right", marginTop: "7px" }}
                            />
                          </span>
                        }
                        show={showMstSub2}
                        onMouseEnter={(e) => {
                          this.showDropdown("showMstSub2", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showMstSub2", e);
                        }}
                        // show={true}
                      >
                        {/* {isActionExist("catlog", "list") && ( */}
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "catlog");
                          }}
                        >
                          Catlog
                        </NavDropdown.Item>

                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "hsn");
                          }}
                        >
                          HSN
                        </NavDropdown.Item>
                        {/* <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "flavour");
                          }}
                        >
                          Flavour
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "package");
                          }}
                        >
                          Package
                        </NavDropdown.Item>

                        {/* {isActionExist("unit", "list") && ( */}
                        {/* <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "unit");
                          }}
                        >
                          Unit
                        </NavDropdown.Item>  */}
                        {/* )} */}
                        {/* {isActionExist("productlist", "list") && ( */}
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "productlist");
                          }}
                        >
                          Product
                        </NavDropdown.Item>
                        {/* <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "newproductcreatedesign"
                            );
                          }}
                        >
                          Create Product
                        </NavDropdown.Item> */}
                        {/* )} */}
                      </NavDropdown>
                      {/* {isActionExist("tax", "list") && ( */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "tax");
                        }}
                      >
                        Tax Management
                      </NavDropdown.Item>
                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "login1");
                        }}
                      >
                        <img alt="" src={master} />
                        Login1{" "}
                      </NavDropdown.Item> */}
                    </NavDropdown>

                    <NavDropdown
                      className="drop-icon-style"
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={transaction} /> Transaction
                        </span>
                      }
                      show={showTranxMain}
                      onMouseEnter={(e) => {
                        this.showDropdown("showTranxMain", e);
                      }}
                      onMouseLeave={(e) => {
                        this.hideDropdown("showTranxMain", e);
                      }}
                    >
                      <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#"
                        title={
                          <span>
                            Purchase
                            <img
                              alt=""
                              src={nav_select_icon}
                              // className="ms-auto"
                              style={{ float: "right", marginTop: "7px" }}
                            />
                          </span>
                        }
                        show={showTranxSub1}
                        onMouseEnter={(e) => {
                          this.showDropdown("showTranxSub1", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showTranxSub1", e);
                        }}
                      >
                        {/* {isActionExist("tranx_purchase_order_list", "list") && ( */}
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>

                        {/* {isActionExist(
                          "tranx_purchase_challan_list",
                          "list"
                        ) && ( */}
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>

                        {/* {isActionExist(
                          "tranx_purchase_invoice_list",
                          "list"
                        ) && ( */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_purchase_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>
                        {/* <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "create_purchase_invoice"
                            );
                          }}
                        >
                          Create Invoice
                        </NavDropdown.Item> */}

                        {/* {isActionExist("tranx_debit_note_list", "list") && ( */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_debit_note_list"
                            );
                          }}
                        >
                          Purchase Return
                        </NavDropdown.Item>
                        {/* )} */}

                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_debit_note_list_B2B"
                            );
                          }}
                        >
                          Purchase Return B2B
                        </NavDropdown.Item>
                      </NavDropdown>

                      <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#action/3.7"
                        title={
                          <span>
                            Sales
                            <img
                              alt=""
                              src={nav_select_icon}
                              // className="ms-auto"
                              style={{ float: "right", marginTop: "7px" }}
                            />
                          </span>
                        }
                        show={showTranxSub2}
                        onMouseEnter={(e) => {
                          this.showDropdown("showTranxSub2", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showTranxSub2", e);
                        }}
                      >
                        {/* {isActionExist(
                          "tranx_sales_quotation_list",
                          "list"
                        ) && ( */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_quotation_list"
                            );
                          }}
                        >
                          Quotation
                        </NavDropdown.Item>
                        {/* {isActionExist("tranx_sales_order_list", "list") && ( */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_order_list"
                            );
                          }}
                        >
                          Order
                        </NavDropdown.Item>
                        {/* {isActionExist("tranx_sales_challan_list", "list") && ( */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_challan_list"
                            );
                          }}
                        >
                          Challan
                        </NavDropdown.Item>
                        {/* {isActionExist("tranx_sales_invoice_list", "list") && ( */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_invoice_list"
                            );
                          }}
                        >
                          Invoice
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_countersale_list"
                            );
                          }}
                        >
                          Counter Sale
                        </NavDropdown.Item>
                        {/* {isActionExist("tranx_credit_note_list", "list") && ( */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_credit_note_list"
                            );
                          }}
                        >
                          Sales Return
                        </NavDropdown.Item>

                        {/* <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "tranx_sales_countersale_list"
                            );
                          }}
                        >
                          Counter Sales
                        </NavDropdown.Item> */}
                      </NavDropdown>
                    </NavDropdown>

                    <NavDropdown
                      className="drop-icon-style"
                      title={
                        <span className="logoLabelStyle">
                          <img alt="menu_account_entry" src={accentry} />
                          Account Entry
                        </span>
                      }
                      show={showAccMain}
                      onMouseEnter={(e) => {
                        this.showDropdown("showAccMain", e);
                      }}
                      onMouseLeave={(e) => {
                        this.hideDropdown("showAccMain", e);
                      }}
                    >
                      {/* <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={master} /> Vouchers
                          </span>
                        }
                        show={showAccSub1}
                        onMouseEnter={(e) => {
                          this.showDropdown("showAccSub1", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showAccSub1", e);
                        }}
                      > */}
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "voucher_receipt_list"
                          );
                        }}
                      >
                        Receipt
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "voucher_paymentlist"
                          );
                        }}
                      >
                        Payment
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "tranx_contra_List");
                        }}
                      >
                        Contra
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "voucher_journal_list"
                          );
                        }}
                      >
                        Journal
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "voucher_debit_note_List"
                          );
                        }}
                      >
                        Debit Note
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "voucher_credit_List"
                          );
                        }}
                      >
                        Credit Note
                      </NavDropdown.Item>
                    </NavDropdown>
                    {/* <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#action/3.7"
                        title={
                          <span>
                            <img alt="" src={master} /> Banking Operation
                          </span>
                        }
                        show={showAccSub2}
                        onMouseEnter={(e) => {
                          this.showDropdown("showAccSub2", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showAccSub2", e);
                        }}
                      >
                        <NavDropdown.Item href="#action/8.1">
                          Cheque Printing
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          PDC Summary
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Bank Reconcilation
                        </NavDropdown.Item>
                      </NavDropdown> */}
                    {/* </NavDropdown> */}

                    <NavDropdown
                      className="drop-icon-style"
                      title={
                        <span className="logoLabelStyle">
                          <img alt="menu_account_entry" src={report} />
                          Reports
                        </span>
                      }
                      show={showRepMain}
                      onMouseEnter={(e) => {
                        this.showDropdown("showRepMain", e);
                      }}
                      onMouseLeave={(e) => {
                        this.hideDropdown("showRepMain", e);
                      }}
                    >
                      <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#action/3.7"
                        title={
                          <span>
                            Account
                            <img
                              alt=""
                              src={nav_select_icon}
                              // className="ms-auto"
                              style={{ float: "right", marginTop: "7px" }}
                            />
                          </span>
                        }
                        show={showRepSub1}
                        onMouseEnter={(e) => {
                          this.showDropdown("showRepSub1", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showRepSub1", e);
                        }}
                      >
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "balancesheet");
                          }}
                        >
                          Balance Sheet
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "profitbalance");
                          }}
                        >
                          Profit & Loss
                        </NavDropdown.Item>
                        {/* <NavDropdown.Item href="#action/8.1">
                          Trail Balance
                        </NavDropdown.Item> */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "trialbalance");
                          }}
                        >
                          Trial Balance
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/8.1">
                          Cash / Bank Book
                        </NavDropdown.Item>
                      </NavDropdown>
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "daybook");
                        }}
                      >
                        DayBook
                      </NavDropdown.Item>
                      <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#action/3.7"
                        title={
                          <span>
                            Inventory
                            <img
                              alt=""
                              src={nav_select_icon}
                              // className="ms-auto"
                              style={{ float: "right", marginTop: "7px" }}
                            />
                          </span>
                        }
                        show={showRepSub2}
                        onMouseEnter={(e) => {
                          this.showDropdown("showRepSub2", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showRepSub2", e);
                        }}
                      >
                        {/* <NavDropdown.Item href="#action/8.1">
                          Clossing stock
                        </NavDropdown.Item> */}
                        {/* <NavDropdown.Item href="#action/8.1">
                          Stock Summary
                        </NavDropdown.Item> */}
                        <NavDropdown.Item
                          href="#action/8.1"
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "stockSummery");
                          }}
                        >
                          Stock Summary
                        </NavDropdown.Item>
                        {/* <NavDropdown.Item href="#action/8.1">
                          Movement Analysis
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Reorder Level
                        </NavDropdown.Item> */}
                      </NavDropdown>
                      <NavDropdown
                        className="cust-menu sub-nav-link"
                        href="#."
                        title={
                          <span>
                            Voucher Registers
                            <img
                              alt=""
                              src={nav_select_icon}
                              // className="ms-auto"
                              style={{ float: "right", marginTop: "7px" }}
                            />
                          </span>
                        }
                        show={showRepSub3}
                        onMouseEnter={(e) => {
                          this.showDropdown("showRepSub3", e);
                        }}
                        onMouseLeave={(e) => {
                          this.hideDropdown("showRepSub3", e);
                        }}
                      >
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "sales");
                          }}
                        >
                          Sales
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch("page_change", "purchase");
                          }}
                        >
                          Purchase
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">Payment</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Receipt</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Contra</NavDropdown.Item>
                        <NavDropdown.Item href="#.">Journal</NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Debit Note
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#.">
                          Credit Note
                        </NavDropdown.Item>
                      </NavDropdown>
                    </NavDropdown>

                    <NavDropdown
                      className="drop-icon-style"
                      title={
                        <span className="logoLabelStyle">
                          <img alt="menu_account_entry" src={utilities} />
                          Utilities
                        </span>
                      }
                    >
                      <NavDropdown.Item href="#.">Import</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Export</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Backup</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Restore</NavDropdown.Item>
                      <NavDropdown.Item href="#.">Setting</NavDropdown.Item>
                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "user_mgnt_list");
                        }}
                      >
                        User Management
                      </NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "utilites_barcode_create"
                          );
                        }}
                      >
                        Barcode / QR Code Management
                      </NavDropdown.Item>
                    </NavDropdown>
                    {/* <NavDropdownMenu
                      title={
                        <span>
                          
                        User Management
                        </span>
                      }
                    >
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "user_mgnt_create");
                        }}
                      >
                        User Access Management
                      </NavDropdown.Item>
                    </NavDropdownMenu> */}
                  </Nav>
                )}
              <Datetime />
              <Profile_menu />
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}
