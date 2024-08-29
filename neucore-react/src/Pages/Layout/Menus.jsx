import React, { Component } from "react";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";

import { DropdownSubmenu, NavDropdownMenu } from "@/CustMenu";
import out1 from "@/assets/images/icon/out1.svg";
import Datetime from "./Datetime";
import Profile_menu from "./Profile_menu";
import dashboard from "@/assets/images/1x/menu_dashboard.png";
import menu_master from "@/assets/images/1x/menu_master.png";
import mainLogo from "@/assets/images/logo.svg";
import master from "@/assets/images/NewIcons/master.png";
import sales from "@/assets/images/NewIcons/sales.png";
import purchase from "@/assets/images/NewIcons/purchase.png";
import transaction from "@/assets/images/icon/transaction2.png";
import accountentry from "@/assets/images/NewIcons/accountentry.png";
import accountbook from "@/assets/images/NewIcons/accountbook.png";
import stockbook from "@/assets/images/NewIcons/stockbook.png";
import tax from "@/assets/images/NewIcons/tax.png";
import quickreport from "@/assets/images/NewIcons/quickreport.png";
import report from "@/assets/images/NewIcons/reports.png";
import utilities_old from "@/assets/images/NewIcons/utilities_old.png";
import controls from "@/assets/images/NewIcons/controls.png";
import { app, window } from "@neutralinojs/lib";

import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
// import report from "@/assets/images/icon/report2.png";
// import utilities from "@/assets/images/icon/utilities2.png";
import menu_transaction from "@/assets/images/1x/menu_transaction.png";
import menu_account_entry from "@/assets/images/1x/menu_account_entry.png";
import menu_reports from "@/assets/images/1x/menu_reports.png";
import menu_utilities from "@/assets/images/1x/menu_utilities.png";
import top_icon from "@/assets/images/top_icon.svg";
import nav_select_icon from "@/assets/images/nav_select_icon.svg";
import close_icon from "@/assets/images/close.svg";
import { eventBus } from "@/helpers";
import { authenticationService } from "@/services/api_functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faMaximize } from "@fortawesome/free-solid-svg-icons";
import Max from "@/assets/images/maximize.png";
import { isParentExist, isActionExist, AuthenticationCheck } from "@/helpers";
class Menus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMultiBranch: true,
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

  OpenSalesInvoiceCreate = (e) => {
    eventBus.dispatch("page_change", "tranx_sales_invoice_create");
  };
  OpenPurchaseInvoiceCreate = (e) => {
    eventBus.dispatch("page_change", "tranx_purchase_invoice_create");
  };

  handleKeyPress = (event) => {
    console.log("event", event);
    if (event.altKey && event.key == "F4") {
      event.preventDefault();
      this.OpenSalesInvoiceCreate();
    } else if (event.altKey && event.key == "F3") {
      event.preventDefault();
      this.OpenPurchaseInvoiceCreate();
    }
  };

  componentDidMount() {
    // document.addEventListener("keydown", this.handleKeyPress)
    if (AuthenticationCheck()) {
      if (
        authenticationService.currentUserValue.isMultiBranch != null &&
        authenticationService.currentUserValue.isMultiBranch != undefined
      ) {
        this.setState({
          isMultiBranch: authenticationService.currentUserValue.isMultiBranch,
        });
      }
    }
  }

  componentWillUnmount() {
    // document.removeEventListener("keydown", this.handleKeyPress);
  }

  showDropdown = (id, e) => {
    this.setState({ [id]: true });
  };
  hideDropdown = (id, e) => {
    this.setState({ [id]: "" });
  };

  minimizeButton = () => {
    console.log("in Minimize button function");
    console.log("window-->", window);
    // window.minimize(); 2.tried
    // window.window.minimize();3 tried
    window.Neutralino.window.minimize();

    // window.Neutralino.minimize(); 1.tried
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
            {authenticationService.currentUserValue.CompanyName} | Ethics 2.0
          </span>
          <div style={{ display: "inline", float: "right", display: "flex" }}>
            {/* <div>
              <FontAwesomeIcon
                icon={faMinus}
                className="minus_icon_style"
                onClick={async (e) => {
                  console.log("Min Clicked!");
                  e.preventDefault();
                  // this.minimizeButton();
                  await window.minimize();
                }}
              />
            </div> */}
            <img
              alt=""
              src={out1}
              style={{ height: "20px" }}
              className="minus_icon_style"
              onClick={(e) => {
                e.preventDefault();
                // console.log("logout clicked");
                eventBus.dispatch("page_change", "logout");
                // eventBus.dispatch("handle_main_state", {
                //   statekey: "isShowMenu",
                //   statevalue: false,
                // });
              }}
            />
            {/* <img className="maximize_icon" src={Max} alt="" /> */}
            {/* <img
              className="close-icon"
              onClick={(e) => {
                console.log("Close Clicked!");
                e.preventDefault();
                // window.Neutralino.app.exit();
                app.exit();
              }}
              src={close_icon}
              alt=""
            /> */}
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
                        // eventBus.dispatch("page_change", "dashboard");
                        eventBus.dispatch("page_change", {
                          to: "dashboard",
                          isNewTab: true,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        height: "41px",
                        width: "41px",
                      }}
                    />
                    <p className="logodash"></p>
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
                          <img alt="" src={master} className="menuimg" /> Master
                        </span>
                      }
                    >
                      {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "companyList");
                        }}
                      >
                        Company
                      </NavDropdown.Item>

                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "company");
                        }}
                      >
                        Company
                      </NavDropdown.Item> */}
                      <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "rolelist");
                        }}
                      >
                        Role
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

                      {/* <NavDropdown.Item
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
                      </NavDropdown.Item> */}
                    </NavDropdown>
                    {/* <NavDropdown
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={master} className="menuimg" /> User
                          Management
                        </span>
                      }
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
                    </NavDropdown> */}
                  </Nav>
                )}
              {authenticationService.currentUserValue &&
                authenticationService.currentUserValue.userRole ===
                  "CADMIN1" && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    {/* <Nav.Link
                      href="#."
                      onClick={(e) => {
                        e.preventDefault();
                        eventBus.dispatch("page_change", "dashbogiard");
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
                        // eventBus.dispatch("page_change", "dashboard");
                        eventBus.dispatch("page_change", {
                          to: "dashboard",
                          isNewTab: true,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        height: "41px",
                        width: "41px",
                      }}
                    />
                    <p
                      style={{
                        margin: "-8px 7px 0px 7px",
                        borderRight: "0.1px solid #2B415C",
                      }}
                    ></p>
                    <NavDropdown
                      // show={true}
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={master} className="menuimg" /> Master
                        </span>
                      }
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
                          eventBus.dispatch("page_change", "user_access_mngt");
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
                      {/* <NavDropdown.Item
                        href="#."
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "branchuser");
                        }}
                      >
                        Branch User
                      </NavDropdown.Item> */}
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
                        // eventBus.dispatch("page_change", "dashboard");
                        eventBus.dispatch("page_change", {
                          to: "dashboard",
                          isNewTab: true,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        height: "41px",
                        width: "41px",
                      }}
                    />
                    <p
                      style={{
                        margin: "-8px 10px 0px 10px",
                        borderRight: "0.1px solid #2B415C",
                      }}
                    ></p>
                    <NavDropdown
                      // show={true}
                      title={
                        <span className="logoLabelStyle">
                          <img alt="" src={master} className="menuimg" /> Master
                        </span>
                      }
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
                    </NavDropdown>
                  </Nav>
                )}
              {/* authenticationService.currentUserValue.userRole === "USER" && ( */}
              {authenticationService.currentUserValue &&
                (authenticationService.currentUserValue.userRole === "CADMIN" ||
                  authenticationService.currentUserValue.userRole ===
                    "USER") && (
                  <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                    <img
                      alt=""
                      src={mainLogo}
                      onClick={(e) => {
                        e.preventDefault();
                        // eventBus.dispatch("page_change", "dashboard");
                        eventBus.dispatch("page_change", {
                          to: "dashboard",
                          isNewTab: true,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                        height: "41px",
                        width: "41px",
                      }}
                    />
                    <p
                      style={{
                        margin: "-8px 10px 0px 10px",
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

                    {isParentExist("master", this.props.userPermissions) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle labelStyle">
                            <img alt="" src={master} className="menuimg" />{" "}
                            Master
                          </span>
                        }
                      >
                        {authenticationService.currentUserValue &&
                        authenticationService.currentUserValue.isMultiBranch &&
                        authenticationService.currentUserValue.isMultiBranch !==
                          false ? (
                          <>
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                // eventBus.dispatch("page_change", "branch");
                                eventBus.dispatch(
                                  "page_change",
                                  "newBranchList"
                                );
                              }}
                            >
                              Branch
                            </NavDropdown.Item>
                            {/* <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "branchList");
                              }}
                            >
                              New Branch
                            </NavDropdown.Item> */}
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "branchAdmin");
                              }}
                            >
                              Branch Admin
                            </NavDropdown.Item>
                            {/* <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "newBranchList"
                                );
                              }}
                            >
                              New Branch
                            </NavDropdown.Item>
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "newBranchAdminList"
                                );
                              }}
                            >
                              New Branch Admin
                            </NavDropdown.Item> */}
                          </>
                        ) : (
                          ""
                        )}
                        {authenticationService.currentUserValue &&
                          authenticationService.currentUserValue.userRole &&
                          authenticationService.currentUserValue.userRole ===
                            "CADMIN" && (
                            <>
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "user_access_mngt"
                                  );
                                }}
                              >
                                Company User
                              </NavDropdown.Item>
                            </>
                          )}

                        {isActionExist(
                          "associate-group",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch(
                                "page_change",
                                "associategroup"
                              );
                            }}
                          >
                            Ledger Group
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "ledger",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "ledgerlist");
                            }}
                          >
                            Ledger
                          </NavDropdown.Item>
                        )}
                        {/*{authenticationService.currentUserValue &&
                          authenticationService.currentUserValue.userRole &&
                          authenticationService.currentUserValue.userRole ===
                            "CADMIN" && (
                            <>
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "usercontrol"
                                  );
                                }}
                              >
                                User Control
                              </NavDropdown.Item>
                            </>
                          )}
                         {isParentExist(
                          "account",
                          this.props.userPermissions
                        ) && (
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
                            >
                              {isActionExist(
                                "associate-group",
                                "list",
                                this.props.userPermissions
                              ) && (
                                  <NavDropdown.Item
                                    href="#."
                                    onClick={(e) => {
                                      e.preventDefault();
                                      eventBus.dispatch(
                                        "page_change",
                                        "associategroup"
                                      );
                                    }}
                                  >
                                    Ledger Group
                                  </NavDropdown.Item>
                                )}
                              {
                                (isActionExist("ledger", "list"),
                                  this.props.userPermissions && (
                                    <NavDropdown.Item
                                      href="#."
                                      onClick={(e) => {
                                        e.preventDefault();
                                        eventBus.dispatch(
                                          "page_change",
                                          "ledgerlist"
                                        );
                                      }}
                                    >
                                      Ledger
                                    </NavDropdown.Item>
                                  ))
                              }
                            </NavDropdown>
                          )} */}

                        {isActionExist(
                          "catlog",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "catlog");
                            }}
                          >
                            Catlog
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "hsn",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "hsn");
                            }}
                          >
                            HSN
                          </NavDropdown.Item>
                        )}

                        {isActionExist(
                          "tax-management",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "tax");
                            }}
                          >
                            Tax Management
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "product",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "productlist");
                            }}
                          >
                            Product
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "area-master",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", "area-master");
                            }}
                          >
                            Area Master
                          </NavDropdown.Item>
                        )}
                        {/* {isActionExist(
                          "bank-master",
                          "list",
                          this.props.userPermissions
                        ) && (
                            <NavDropdown.Item
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "bank-master");
                              }}
                            >
                              Bank Master
                            </NavDropdown.Item>
                          )} */}
                        {isActionExist(
                          "salesman-master",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch(
                                "page_change",
                                "salasman-master"
                              );
                            }}
                          >
                            Salesman Master
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}

                    {isParentExist("purchase", this.props.userPermissions) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle labelStyle">
                            <img alt="" src={purchase} className="menuimg" />{" "}
                            Purchase
                          </span>
                        }
                      >
                        {isActionExist(
                          "purchase-invoice",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_purchase_invoice_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Invoice
                          </NavDropdown.Item>
                        )}

                        {isActionExist(
                          "purchase-order",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_purchase_order_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Order
                          </NavDropdown.Item>
                        )}

                        {isActionExist(
                          "purchase-challan",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_purchase_challan_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Challan
                          </NavDropdown.Item>
                        )}

                        {isActionExist(
                          "purchase-return",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_debit_note_list_B2B",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Purchase Return
                          </NavDropdown.Item>
                        )}

                        {/* {isActionExist(
                          "stock-in",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                              Stock In / Transfer In
                            </NavDropdown.Item>
                          )}
                        {isActionExist(
                          "purchase-sample",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                              Purchase Sample
                            </NavDropdown.Item>
                          )} */}
                      </NavDropdown>
                    )}
                    {isParentExist("sales", this.props.userPermissions) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle labelStyle">
                            <img alt="" src={sales} className="menuimg" /> Sales
                          </span>
                        }
                      >
                        {isActionExist(
                          "sales-invoice",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "tranx_sales_invoice_list"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_sales_invoice_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Invoice
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "sales-quotation",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_sales_quotation_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });

                              // eventBus.dispatch(
                              //   "page_change",
                              //   "tranx_sales_quotation_list"
                              // );
                            }}
                          >
                            Quotation
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "sales-order",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_sales_order_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });

                              // eventBus.dispatch(
                              //   "page_change",
                              //   "tranx_sales_order_list"
                              // );
                            }}
                          >
                            Order
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "sales-challan",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_sales_challan_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Challan
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "counter-sales",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_sales_countersale_create",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Counter Sale
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "sales-return",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_credit_note_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Sales Return
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "sales-invoice",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "tranx_sales_invoice_list"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "tranx_sales_invoice_composition_list",
                                // prop_data: {
                                //   hsnNumber: edit_data.hsnNumber,
                                //   id: edit_data.id,
                                // },
                                isNewTab: true,
                              });
                            }}
                          >
                            Consumer Sale
                          </NavDropdown.Item>
                        )}
                        {/* {isActionExist(
                          "shortage",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                            Shortage / Surplus
                          </NavDropdown.Item>
                        )} */}
                        {/* {isActionExist(
                          "stock-out",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                            Stock Out / Transfer Out
                          </NavDropdown.Item>
                        )} */}
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
                    )}
                    {/* {isParentExist(
                      "transaction",
                      this.props.userPermissions
                    ) && (
                        <NavDropdown
                          className="drop-icon-style"
                          title={
                            <span className="logoLabelStyle">
                              <img alt="" src={transaction} /> Transaction
                            </span>
                          }
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
                          >
                            {isActionExist(
                              "purchase-order",
                              "list",
                              this.props.userPermissions
                            ) && (
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
                              )}
                            {isActionExist(
                              "purchase-challan",
                              "list",
                              this.props.userPermissions
                            ) && (
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
                              )}

                          {isActionExist(
                            "purchase-invoice",
                            "list",
                            this.props.userPermissions
                          ) && (
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
                          )}

                            {isActionExist(
                              "purchase-return",
                              "list",
                              this.props.userPermissions
                            ) && (
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
                              )}

                            {isActionExist(
                              "purchase-return",
                              "list",
                              this.props.userPermissions
                            ) && (
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
                              )}
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
                        >
                          {isActionExist(
                            "sales-quotation",
                            "list",
                            this.props.userPermissions
                          ) && (
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
                          )}
                          {isActionExist(
                            "sales-order",
                            "list",
                            this.props.userPermissions
                          ) && (
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
                          )}
                          {isActionExist(
                            "sales-challan",
                            "list",
                            this.props.userPermissions
                          ) && (
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
                          )}
                          {isActionExist(
                            "sales-invoice",
                            "list",
                            this.props.userPermissions
                          ) && (
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
                          )}
                          {isActionExist(
                            "counter-sales",
                            "list",
                            this.props.userPermissions
                          ) && (
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
                          )}
                          {isActionExist(
                            "sales-return",
                            "list",
                            this.props.userPermissions
                          ) && (
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
                          )}
                        </NavDropdown>
                      </NavDropdown>
                    )} */}
                    {isParentExist(
                      "account-entry",
                      this.props.userPermissions
                    ) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle labelStyle">
                            <img
                              alt="menu_account_entry"
                              src={accountentry}
                              className="menuimg"
                            />
                            Account Entry
                          </span>
                        }
                      >
                        {isActionExist(
                          "receipt",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                        )}
                        {isActionExist(
                          "payment",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                        )}
                        {isActionExist(
                          "contra",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              eventBus.dispatch(
                                "page_change",
                                "tranx_contra_List"
                              );
                            }}
                          >
                            Contra
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "journal",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                        )}
                        {isActionExist(
                          "debit-note",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                        )}
                        {isActionExist(
                          "credit-note",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                        )}
                        {/* {isActionExist(
                            "gst-input",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#action/8.1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "gst_input_list"
                                  );
                                }}
                              >
                                GST Input
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "gst-output",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#action/8.1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "gst_output_list"
                                  );
                                }}
                              >
                                GST Output
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "purchase-voucher",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#action/8.1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "purchaseVoucherList"
                                  );
                                }}
                              >
                                Purchase
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "sales-voucher",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#action/8.1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "salesVoucherList"
                                  );
                                }}
                              >
                                Sales
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "depreciation",
                            "list",
                            this.props.userPermissions
                          ) && (
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
                                Depreciation
                              </NavDropdown.Item>
                            )} */}
                      </NavDropdown>
                    )}
                    {isParentExist(
                      "account-books",
                      this.props.userPermissions
                    ) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle">
                            <img
                              alt="menu_account_entry"
                              src={accountbook}
                              className="menuimg"
                            />
                            Account Books
                          </span>
                        }
                      >
                        {isActionExist(
                          "ledger-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "ledgerReport1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "ledgerReport1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Ledger
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "debtor-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "debtors2");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "debtors2",
                                isNewTab: true,
                              });
                            }}
                          >
                            Debtors
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "creditor-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "creditors1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "creditors1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Creditors
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "expenses-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "expenses");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "expenses",
                                isNewTab: true,
                              });
                            }}
                          >
                            Expenses
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "day-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "dayBookReport");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "dayBookReport",
                                isNewTab: true,
                              });
                            }}
                          >
                            Day Book
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "receipt-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "receiptReport1"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "receiptReport1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Receipt
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "payment-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "payment1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "payment1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Payment
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "journal-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "journal1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "journal1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Journal
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "contra-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "contra1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "contra1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Contra
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "debit-note-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "debitNote1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "debitNote1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Debit Note
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "credit-note-books",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "creditNote1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "creditNote1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Credit Note
                          </NavDropdown.Item>
                        )}
                        {/* {isActionExist(
                            "sales-books",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Sales Book
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "purchase-books",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Purchase Book
                              </NavDropdown.Item>
                            )} */}
                        {isActionExist(
                          "sales-register",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "salesRegister1"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "salesRegister1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Sales Register
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "cash/bank-book",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "purchaseRegister1"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "purchaseRegister1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Purchase Register
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "purchase-register",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "cashOrBankBook1"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "cashOrBankBook1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Cash/Bank Book
                          </NavDropdown.Item>
                        )}
                      </NavDropdown>
                    )}
                    {isParentExist(
                      "stock-books",
                      this.props.userPermissions
                    ) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle">
                            <img
                              alt="menu_account_entry"
                              src={stockbook}
                              className="menuimg"
                            />
                            Stock Books
                          </span>
                        }
                      >
                        {isActionExist(
                          "whole-stocks",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "wholeStock1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "wholeStock1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Whole Stock
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "available-stocks",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "available1");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "available1",
                                isNewTab: true,
                              });
                            }}
                          >
                            Available Stock
                          </NavDropdown.Item>
                        )}
                        {/* {isActionExist(
                            "batch-stocks",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch("page_change", "batchStock1");
                                }}
                              >
                                Batch Stock
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "stock-valuation",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch("page_change", "valuation3");
                                }}
                              >
                                Stock Valuation
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "min-level-stcoks",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch("page_change", "minimumLevel1");
                                }}
                              >
                                Products - Minimum Level
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "max-level-stocks",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch("page_change", "maximumLevel1");
                                }}
                              >
                                Products - Maximum Level
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "near-expiry",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "productNearExpiry3"
                                  );
                                }}
                              >
                                Product Near Expiry
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "expired-product",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "expiryProduct1"
                                  );
                                }}
                              >
                                Expired Products
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "shelf-products",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Shelf Stocks
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "filter-stocks",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Filter Stocks
                              </NavDropdown.Item>
                            )} */}
                      </NavDropdown>
                    )}
                    {/* {isParentExist(
                      "gst-report",
                      this.props.userPermissions
                    ) && (
                        <NavDropdown
                          className="drop-icon-style"
                          title={
                            <span className="logoLabelStyle">
                              <img
                                alt="menu_account_entry"
                                src={tax}
                                className="menuimg"
                              />
                              GST
                            </span>
                          }
                        >
                          {isActionExist(
                            "gstr1-report",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">GSTR1</NavDropdown.Item>
                            )}
                          {isActionExist(
                            "gstr2-report",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">GSTR2</NavDropdown.Item>
                            )}
                          {isActionExist(
                            "gstr3b-report",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">GSTR3B</NavDropdown.Item>
                            )}
                          {isActionExist(
                            "computation",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Computation
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "ledgerwise-gstr1",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Ledgerwise GSTR1
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "ledgerwise-gstr2",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Ledgerwise GSTR2
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "gst-other-input",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                GST Other Input
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "gst-other-output",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                GST Other Output
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "gst-sales-register",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                GST Sales Register
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "gste-purchase-register",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                GST Purchase Register
                              </NavDropdown.Item>
                            )}
                        </NavDropdown>
                      )}
                    {isParentExist(
                      "quick-report",
                      this.props.userPermissions
                    ) && (
                        <NavDropdown
                          className="drop-icon-style"
                          title={
                            <span className="logoLabelStyle">
                              <img
                                alt="menu_account_entry"
                                src={quickreport}
                                className="menuimg"
                              />
                              Quick Report
                            </span>
                          }
                        >
                          {isActionExist(
                            "day-sales-summary",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Day Sales Summary
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "fast-moving-products",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Fast moving Item
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "slow-moving-prodcuts",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Slow moving Items
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "payment-modes",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Mode of Payment
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "operator-wise-report",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Operator Wise
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "salesman-report",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Salesman
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "todays-profit-report",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item href="#.">
                                Todays Profit
                              </NavDropdown.Item>
                            )}
                        </NavDropdown>
                      )} */}
                    {isParentExist("reports", this.props.userPermissions) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle">
                            <img
                              alt="menu_account_entry"
                              src={report}
                              className="menuimg"
                            />
                            Reports
                          </span>
                        }
                      >
                        {/* {isActionExist(
                          "sales-customize-report",
                          "list",
                          this.props.userPermissions
                        ) && (
                            <NavDropdown.Item
                              href="#action/8.1"
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "daybook");
                              }}
                            >
                              Sales customize Report
                            </NavDropdown.Item>
                          )}
                        {isActionExist(
                          "purchase-customize-report",
                          "list",
                          this.props.userPermissions
                        ) && (
                            <NavDropdown.Item
                              href="#action/8.1"
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "daybook");
                              }}
                            >
                              Purchase customize Report
                            </NavDropdown.Item>
                          )} */}
                        {isActionExist(
                          "profit-and-loss",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "profitandloss1"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "profitandloss1",
                                isNewTab: true,
                              });
                            }}
                          >
                            P/L
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "balance-sheet",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "balancesheet");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "balancesheet",
                                isNewTab: true,
                              });
                            }}
                          >
                            Balance-Sheet
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "trial-balance",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "trialbalance3");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "trialbalance3",
                                isNewTab: true,
                              });
                            }}
                          >
                            Trial Balance
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "trial-balance",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "barcodedesign");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "barcodedesign",
                                isNewTab: true,
                              });
                            }}
                          >
                            Barcode Design
                          </NavDropdown.Item>
                        )}
                        {/* <NavDropdown
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
                        >
                          {isActionExist(
                            "stock-summary",
                            "list",
                            this.props.userPermissions
                          ) && (
                            <NavDropdown.Item
                              href="#action/8.1"
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "stockSummery"
                                );
                              }}
                            >
                              Stock Summary
                            </NavDropdown.Item>
                          )}
                        </NavDropdown> */}
                        {/* <NavDropdown
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
                        >
                          {isActionExist(
                            "balance-sheet",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#action/8.1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "balancesheet"
                                  );
                                }}
                              >
                                Balance Sheet
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "profit-and-loss",
                            "list",
                            this.props.userPermissions
                          ) && (
                            <NavDropdown.Item
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch(
                                  "page_change",
                                  "profitbalance"
                                );
                              }}
                            >
                              Profit & Loss
                            </NavDropdown.Item>
                          )}
                          {isActionExist(
                            "trial-balance",
                            "list",
                            this.props.userPermissions
                          ) && (
                              <NavDropdown.Item
                                href="#action/8.1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch(
                                    "page_change",
                                    "trialbalance"
                                  );
                                }}
                              >
                                Trial Balance
                              </NavDropdown.Item>
                            )}
                          {isActionExist(
                            "cashbank-",
                            "list",
                            this.props.userPermissions
                          ) && (
                            <NavDropdown.Item href="#action/8.1">
                              Cash / Bank Book
                            </NavDropdown.Item>
                          )}
                        </NavDropdown> */}
                        {/* {isParentExist(
                          "vouchers",
                          this.props.userPermissions
                        ) && (
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
                          >
                            {isActionExist(
                              "sales",
                              "list",
                              this.props.userPermissions
                            ) && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch("page_change", "sales");
                                }}
                              >
                                Sales
                              </NavDropdown.Item>
                            )}
                            {isActionExist(
                              "purchase",
                              "list",
                              this.props.userPermissions
                            ) && (
                              <NavDropdown.Item
                                href="#."
                                onClick={(e) => {
                                  e.preventDefault();
                                  eventBus.dispatch("page_change", "purchase");
                                }}
                              >
                                Purchase
                              </NavDropdown.Item>
                            )}
                            {isActionExist(
                              "payment",
                              "list",
                              this.props.userPermissions
                            ) && (
                              <NavDropdown.Item href="#.">
                                Payment
                              </NavDropdown.Item>
                            )}
                            {isActionExist(
                              "receipt",
                              "list",
                              this.props.userPermissions
                            ) && (
                              <NavDropdown.Item href="#.">
                                Receipt
                              </NavDropdown.Item>
                            )}
                            {isActionExist(
                              "contra",
                              "list",
                              this.props.userPermissions
                            ) && (
                              <NavDropdown.Item href="#.">
                                Contra
                              </NavDropdown.Item>
                            )}
                            {isActionExist(
                              "journal",
                              "list",
                              this.props.userPermissions
                            ) && (
                              <NavDropdown.Item href="#.">
                                Journal
                              </NavDropdown.Item>
                            )}
                            {isActionExist(
                              "debit-note",
                              "list",
                              this.props.userPermissions
                            ) && (
                              <NavDropdown.Item href="#.">
                                Debit Note
                              </NavDropdown.Item>
                            )}
                            {isActionExist(
                              "credit-note",
                              "list",
                              this.props.userPermissions
                            ) && (
                              <NavDropdown.Item href="#.">
                                Credit Note
                              </NavDropdown.Item>
                            )}
                          </NavDropdown>
                        )} */}
                      </NavDropdown>
                    )}
                    {isParentExist("utility", this.props.userPermissions) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle">
                            <img
                              alt="menu_account_entry"
                              src={utilities_old}
                              className="menuimg"
                            />
                            Utilities
                          </span>
                        }
                      >
                        {/* {isActionExist(
                          "backup",
                          "list",
                          this.props.userPermissions
                        ) && (
                            <NavDropdown.Item href="#.">Backup</NavDropdown.Item>
                          )} */}
                        {/* {isActionExist(
                          "restore",
                          "list",
                          this.props.userPermissions
                        ) && (
                            <NavDropdown.Item href="#.">Restore</NavDropdown.Item>
                          )} */}
                        {isActionExist(
                          "product-import",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "productImport");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "productImport",
                                isNewTab: true,
                              });
                            }}
                          >
                            Import Product
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "product-import",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "stockImport");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "stockImport",
                                isNewTab: true,
                              });
                            }}
                          >
                            Import Stock
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "product-import",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "ledgerImport");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "ledgerImport",
                                isNewTab: true,
                              });
                            }}
                          >
                            Import Ledger
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "product-import",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "utilites_print_preview"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "utilites_print_preview",
                                isNewTab: true,
                              });
                            }}
                          >
                            Barcode
                          </NavDropdown.Item>
                        )}
                        {isActionExist(
                          "product-import",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#."
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "dispatchManagement"
                              // );
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "dispatchManagement",
                                isNewTab: true,
                              });
                            }}
                          >
                            Dispatch Management
                          </NavDropdown.Item>
                        )}

                        {/* {isActionExist(
                          "product-export",
                          "list",
                          this.props.userPermissions
                        ) && (
                            <NavDropdown.Item href="#.">Export</NavDropdown.Item>
                          )} */}
                        {/* {isActionExist(
                          "tally-export",
                          "list",
                          this.props.userPermissions
                        ) && (
                            <NavDropdown.Item href="#.">
                              Tally Export
                            </NavDropdown.Item>
                          )} */}
                        {/* {isActionExist(
                          "sms-api-integration",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                              SMS API Integration
                            </NavDropdown.Item>
                          )} */}
                        {/* {isActionExist(
                          "whatsapp-api-integration",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                              Whatsapp API Integration
                            </NavDropdown.Item>
                          )} */}
                        {/* {isActionExist(
                          "data-freeze",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                              Data Freeze
                            </NavDropdown.Item>
                          )} */}
                        {/* <NavDropdown.Item
                          href="#."
                          onClick={(e) => {
                            e.preventDefault();
                            eventBus.dispatch(
                              "page_change",
                              "user_mgnt_list",
                              this.props.userPermissions
                            );
                          }}
                        >
                          User Management
                        </NavDropdown.Item> */}
                        {/* {isActionExist(
                          "barcode",
                          "list",
                          this.props.userPermissions
                        ) && (
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
                          )} */}
                      </NavDropdown>
                    )}
                    {isParentExist("control", this.props.userPermissions) && (
                      <NavDropdown
                        className="drop-icon-style"
                        title={
                          <span className="logoLabelStyle">
                            <img
                              alt="menu_account_entry"
                              src={controls}
                              className="menuimg"
                            />
                            Controls
                          </span>
                        }
                      >
                        {isActionExist(
                          "user-control",
                          "list",
                          this.props.userPermissions
                        ) && (
                          <NavDropdown.Item
                            href="#action/8.1"
                            onClick={(e) => {
                              e.preventDefault();
                              // eventBus.dispatch("page_change", "usercontrol");
                              eventBus.dispatch("page_change", {
                                from: "dashboard",
                                to: "usercontrol",
                                isNewTab: true,
                              });
                            }}
                          >
                            User Control
                          </NavDropdown.Item>
                        )}
                        {/* {isActionExist(
                          "software-control",
                          "list",
                          this.props.userPermissions
                        ) && (
                            <NavDropdown.Item
                              href="#action/8.1"
                              onClick={(e) => {
                                e.preventDefault();
                                eventBus.dispatch("page_change", "daybook");
                              }}
                            >
                              Software Control
                            </NavDropdown.Item>
                          )} */}
                      </NavDropdown>
                    )}

                    {/* Bill Format */}
                    <NavDropdown
                      className="drop-icon-style"
                      title={
                        <span className="logoLabelStyle">
                          <img
                            alt="menu_account_entry"
                            src={controls}
                            className="menuimg"
                          />
                          Bill Format
                        </span>
                      }
                    >
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          // eventBus.dispatch("page_change", "format1");
                          eventBus.dispatch("page_change", {
                            from: "dashboard",
                            to: "format1",
                            isNewTab: true,
                          });
                        }}
                      >
                        Format 1
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          // eventBus.dispatch("page_change", "format2");
                          eventBus.dispatch("page_change", {
                            from: "dashboard",
                            to: "format2",
                            isNewTab: true,
                          });
                        }}
                      >
                        Format 2
                      </NavDropdown.Item>
                    </NavDropdown>

                    {/* testing hsn start */}
                    {/* <NavDropdown
                      className="drop-icon-style"
                      title={
                        <span className="logoLabelStyle">
                          <img
                            alt="menu_account_entry"
                            src={controls}
                            className="menuimg"
                          />
                          HSN Testing
                        </span>
                      }
                    >
                      <NavDropdown.Item
                        href="#action/8.1"
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch("page_change", "hsntest");
                        }}
                      >
                        HSN Test
                      </NavDropdown.Item>
                    </NavDropdown> */}
                    {/* testing hsn end */}
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

const mapStateToProps = ({ userPermissions, userControl }) => {
  return { userPermissions, userControl };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
      setUserControl,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(Menus);
