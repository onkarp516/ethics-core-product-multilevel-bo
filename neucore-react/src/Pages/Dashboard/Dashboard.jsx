import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Card,
} from "react-bootstrap";

import {
  authenticationService,
  getUserPermission,
  getOutletAppConfig,

} from "@/services/api_functions";
import { getDashboardData, } from "@/services/api_functions/dashboard.service";
import { isParentExist, MyNotifications,AuthenticationCheck } from "@/helpers";
import ProgressBar from "react-bootstrap/ProgressBar";
import refresh from "@/assets/images/refresh.png";
import cal1 from "@/assets/images/cardicons/Photo1.png";
import cal2 from "@/assets/images/cardicons/Photo2.png";
import cal3 from "@/assets/images/cardicons/Photo3.png";
import Groupicon from "@/assets/images/cardicons/Group.png";
import Groupicon2 from "@/assets/images/cardicons/Group2.png";
import Groupicon3 from "@/assets/images/cardicons/Group3.png";
import Rupees from "@/assets/images/cardicons/Rupees.png";
import chartbar from "@/assets/images/cardicons/chartbar.png";
import chartbar2 from "@/assets/images/cardicons/chartbar2.png";
import Fcard from "@/assets/images/cardicons/firstcard.png";
import Scard from "@/assets/images/cardicons/secondcard.png";
import Tcard from "@/assets/images/cardicons/thirdcard.png";
import option from "@/assets/images/cardicons/options.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgData: [],
      revenueData: [],
      assetsAmt: [],
      collectAmt: [],
      expenses: [],
      liabiltyAmt: [],
      receivableAmt: [],
      salesList: [],
      purchaseList: []

    }

  }

  callUserPermission = (userId) => {
    let userPer = this.props.userPermissions;
    if (!userPer || userPer.length == 0) {
      let requestData = new FormData();
      requestData.append("user_id", userId);
      getUserPermission(requestData)
        .then((response) => {
          // console.log("getUserPermission reponse : ", response);
          if (response.status === 200) {
            let userPerm = response.data.userActions;
            this.props.setUserPermissions(userPerm);
          } else {
            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: response.message,
              is_button_show: true,
            });
          }
        })
        .catch((error) => {
          console.log("error : ", error);
        });
    } else {
      console.log("After set to redux userPer", userPer);
    }
  };
  callUserControl = () => {
    // console.log("user control", this.props.userControl);
    if (authenticationService.currentUserValue.isSuperAdmin != true) {
      let userControl = this.props.userControl;
      if (!userControl || userControl.length == 0) {
        // let requestData = new FormData();
        // requestData.append("user_id", userId);
        getOutletAppConfig()
          .then((response) => {
            if (response.data.responseStatus === 200) {
              console.log("settings", response);
              let userctrl = response.data.responseObject;
              this.props.setUserControl(userctrl);
            } else {
              MyNotifications.fire({
                show: true,
                icon: "error",
                title: "Error",
                msg: response.message,
                is_button_show: true,
              });
            }
          })
          .catch((error) => {
            console.log("error : ", error);
          });
      }
    }
  };
  dashboardData = () => {
    let requestData = new FormData();

    getDashboardData()
      .then((response) => {
        console.log("response::::", response.data);
        let res = response.data;
        console.log("res_________", res.result.CollectAmt[0].today_receipt_amt)
        if (res.responseStatus == 200) {
          console.log("success in dashboard data")
          this.setState({
            assetsAmt: res.result.AssetsAmt[0],
            collectAmt: res.result.CollectAmt[0],
            expenses: res.result.Expenses[0],
            liabiltyAmt: res.result.LiabilitiesAmt[0],
            receivableAmt: res.result.ReceivableAmt[0],
            revenueData: res.result.RevenueList[0],
            salesList: res.result.Sales_List[0],
            purchaseList: res.result.purchase_list[0]

          })
          console.log("revenueData", this.state.revenueData.today_revenue_amt)
        }
        else {
          console.log("error in dashboard data")
        }
      })
      .catch((error) => {
        console.log("error catched ")
      })

  }


  componentDidMount() {
    // console.log(
    //   "authenticationService.currentUserValue.isMultiBranch",
    //   authenticationService.currentUserValue.isMultiBranch
    // );
    if (AuthenticationCheck()) {

    this.callUserPermission(authenticationService.currentUserValue.userId);
    this.callUserControl();
    this.dashboardData();
  }
  }
  render() {
    let { revenueData, assetsAmt, collectAmt, expenses, liabiltyAmt, receivableAmt, salesList, purchaseList } = this.state;

    // console.log(JSON.parse(authenticationService.currentUserValue.permission));
    return authenticationService.currentUserValue && (authenticationService.currentUserValue.userRole == "CADMIN" ||
          authenticationService.currentUserValue.userRole == "BADMIN") ? (
      <div className="Dashboard-style">

        <Row className="mx-0" style={{ marginTop: "10px" }}>
          <Col sm={4} md={4} lg={4} xl={4} className="pe-0">
            <Card
            // style={{ height: "225px", width: "530px" }}
            >
              <Card.Body className="pad">
                <Row>

                  <Col md={8}>
                    <Card.Title>Revenue</Card.Title>
                  </Col>
                  <Col md={3} className="Mleft-style">
                    <img
                      className="Scard-style mt-2 pe-0 ms-4"
                      src={Scard}
                      alt=""
                    />
                  </Col>
                  <Col md={1}>
                    <button className="options-style pe-4">
                      <img className="optionsImg" src={option} alt="" />
                    </button>
                  </Col>
                </Row>
                <Card.Subtitle className="text-muted">
                  TOTAL REVENUE
                </Card.Subtitle>
                <Row>
                  <Col className="FirstBar">
                    {/* <ProgressBar now={30} /> */}
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal1} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text" >Today</p>
                        {/* <h5>₹3,575.00</h5> */}
                        <h5>₹ {this.state.revenueData ? this.state.revenueData.today_revenue_amt : 0} </h5>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal2} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text">This Week</p>
                        {/* <h5>₹15,935.00</h5> */}
                        <h5> ₹ {this.state.revenueData ? this.state.revenueData.weekly_revenue_amt : 0}</h5>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal3} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text">This Month</p>
                        {/* <h5>₹89,136.00</h5> */}
                        <h5>₹ {this.state.revenueData ? this.state.revenueData.monthly_revenue_amt : 0}</h5>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={4} md={4} lg={4} xl={4} className="pe-0">
            <Card

            // style={{ height: "225px", width: "530px" }}
            >
              <Card.Body className="pad">
                <Row>
                  <Col md={8}>
                    <Card.Title>Collection</Card.Title>
                  </Col>
                  <Col md={3}>
                    <img
                      className="Scard-style mt-2 pe-0 ms-4"
                      src={Fcard}
                      alt=""
                    />
                  </Col>
                  <Col md={1}>
                    <button className="options-style pe-4">
                      <img className="optionsImg" src={option} alt="" />
                    </button>
                  </Col>
                </Row>
                <Card.Subtitle className="text-muted">
                  TOTAL COLLECTION
                </Card.Subtitle>
                <Row>
                  <Col className="SecondBar">
                    {/* <ProgressBar now={90} /> */}
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal1} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text">Today</p>
                        <h5> ₹ {this.state.collectAmt ? this.state.collectAmt.today_receipt_amt : 0}</h5>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal2} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text">This Week</p>
                        <h5>₹ {this.state.collectAmt ? this.state.collectAmt.weekly_receipt_amt : 0}</h5>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal3} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text">This Month</p>
                        <h5>₹ {this.state.collectAmt ? this.state.collectAmt.month_receipt_amt : 0}</h5>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={4} md={4} lg={4} xl={4}>
            <Card
            >
              <Card.Body className="pad">
                <Row>
                  <Col md={8}>
                    <Card.Title>Receivable</Card.Title>
                  </Col>
                  <Col md={3}>
                    <img
                      className="Scard-style mt-2 pe-0 ms-4"
                      src={Tcard}
                      alt=""
                    />
                  </Col>
                  <Col md={1}>
                    <button className="options-style pe-4">
                      <img className="optionsImg" src={option} alt="" />
                    </button>
                  </Col>
                </Row>
                <Card.Subtitle className="text-muted" >
                  TOTAL RECEIVABLE
                </Card.Subtitle>
                <Row>
                  <Col className="ThirdBar">
                    {/* <ProgressBar now={70} /> */}
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal1} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text">Today</p>
                        <h5> ₹ {this.state.receivableAmt ? this.state.receivableAmt.today_receivable_amt : 0} </h5>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal2} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text">This Week</p>
                        <h5>₹ {this.state.receivableAmt ? this.state.receivableAmt.weekly_receivable_amt : 0}</h5>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Row style={{ marginTop: "10px" }}>
                      <Col md={4} className="my-auto p-0 ps-2">
                        <img src={cal3} alt="" className="card-img-style" />
                      </Col>
                      <Col md={8} className="p-0">
                        <p className="m-0 dates-text">This Month</p>
                        {/* {JSON.stringify(receivableAmt.monthly_receivable_amt)} */}
                        <h5> ₹ {this.state.receivableAmt.monthly_receivable_amt}</h5>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mx-0" style={{ marginTop: "15px" }}>
          <Col sm={4} md={4} lg={4} xl={4} className="pe-0">
            <Card className="cardHeightStyle">
              <Card.Body>
                <Row>
                  <Col md={11}>
                    <Card.Title>Product/Stock</Card.Title>
                  </Col>
                  <Col md={1}>
                    <button className="options-style pe-4">
                      <img className="optionsImg" src={option} alt="" />
                    </button>
                  </Col>
                </Row>
                <Row>
                  <Col className="px-1">
                    <Table>
                      <tbody>
                        <tr
                          // style={{ lineHeight: "30px" }}
                          className="lineStyle"
                        // style={{ borderBottom: "1px solid transparent" }}
                        >
                          <td>
                            <span className="td1"> Product Name 1</span>
                          </td>
                          <td>
                            <span className="td2">Grocery</span>
                          </td>
                          <td className="text-end">
                            <span className="td3">
                              <img
                                src={Groupicon}
                                alt=""
                                className="grpico me-2"
                              />
                              <span className="spanText">522 / 800</span>
                            </span>
                          </td>
                        </tr>
                        <tr
                          // style={{ lineHeight: "30px" }}
                          className="lineStyle"

                        // style={{ borderBottom: "1px solid transparent" }}
                        >
                          <td>
                            <span className="td1"> Product Name 2</span>
                          </td>
                          <td>
                            <span className="td2">Electronics</span>
                          </td>
                          <td className="text-end">
                            <span className="td3">
                              <img
                                src={Groupicon3}
                                alt=""
                                className="grpico me-2"
                              />
                              <span className="spanText">32 / 200</span>
                            </span>
                          </td>
                        </tr>
                        <tr
                          // style={{ lineHeight: "30px" }}
                          className="lineStyle"

                        // style={{ borderBottom: "1px solid transparent" }}
                        >
                          <td>
                            <span className="td1"> Product Name 3</span>
                          </td>
                          <td>
                            <span className="td2">Gadgets</span>
                          </td>
                          <td className="text-end">
                            <span className="td3">
                              <img
                                src={Groupicon}
                                alt=""
                                className="grpico me-2"
                              />
                              <span className="spanText">12 / 20</span>
                            </span>
                          </td>
                        </tr>
                        <tr
                          // style={{ lineHeight: "30px" }}
                          className="lineStyle"

                        // style={{ borderBottom: "1px solid transparent" }}
                        >
                          <td>
                            <span className="td1"> Product Name 4</span>
                          </td>
                          <td>
                            <span className="td2">Watch</span>
                          </td>
                          <td className="text-end">
                            <span className="td3">
                              <img
                                src={Groupicon}
                                alt=""
                                className="grpico me-2"
                              />
                              <span className="spanText">42 | 85</span>
                            </span>
                          </td>
                        </tr>
                        <tr
                          // style={{ lineHeight: "30px" }}
                          className="lineStyle"

                        // style={{ borderBottom: "1px solid transparent" }}
                        >
                          <td>
                            <span className="td1"> Product Name 5</span>
                          </td>
                          <td>
                            <span className="td2">Grocery</span>
                          </td>
                          <td className="text-end">
                            <span className="td3">
                              <img
                                src={Groupicon2}
                                alt=""
                                className="grpico me-2"
                              />
                              <span className="spanText">2 | 25</span>
                            </span>
                          </td>
                        </tr>
                        <tr
                          // style={{ lineHeight: "30px" }}
                          className="lineStyle"

                        // style={{ borderBottom: "1px solid transparent" }}
                        >
                          <td>
                            <span className="td1"> Product Name 6</span>
                          </td>
                          <td>
                            <span className="td2">Electronics</span>
                          </td>
                          <td className="text-end">
                            <span className="td3">
                              <img
                                src={Groupicon}
                                alt=""
                                className="grpico me-2"
                              />
                              <span className="spanText">412 | 500</span>
                            </span>
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: "1px solid transparent",
                          }}
                          className="lineStyle"
                        >
                          <td colSpan={2}>
                            <p className="m-0 dates-text">Total Amount</p>
                            <h5>₹9,544.00</h5>
                          </td>
                          <td className="text-end">
                            <p className="m-0 dates-text">Stock Left</p>
                            <h5>5622 / 22644</h5>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={8} md={8} lg={8} xl={8}>
            <Card
              className="cardHeightStyle px-2"
              style={{ paddingTop: "10px" }}
            >
              <div style={{ borderBottom: "2px solid #ECEEF6" }}>
                <Row>
                  <Col md={6} style={{ borderRight: "2px solid #ECEEF6" }}>
                    <Card.Body className="pt-1">
                      <Card.Title>Income</Card.Title>

                      <Row className="mt-3">
                        <Col md={10}>
                          <h3 className="m-0">₹4,24,854.00</h3>
                          <p className="cmbncardtext">THIS MONTH</p>
                        </Col>
                        <Col md={2} className="text-end pe-0">
                          <button>
                            <img src={Rupees} alt="" />
                          </button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="d-flex">
                            <p className="coloredText me-2">
                              <img
                                className="cartbarstyle"
                                src={chartbar}
                                alt=""
                              />
                              +21.0%
                            </p>
                            <span className="bottomText">
                              ₹2,28,650.00 last month
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Col>
                  <Col md={6}>
                    <Card.Body className="ps-0 pt-1">
                      <Row>
                        <Col md={11}>
                          <Card.Title>Expenses</Card.Title>
                        </Col>
                        <Col md={1}>
                          <button className="options-style pe-4">
                            <img className="optionsImg" src={option} alt="" />
                          </button>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={10} style={{ marginTop: "-10px" }}>
                          <h3 className="m-0">₹ {this.state.expenses ? this.state.expenses.monthly_expensive_amt : 0}</h3>
                          <p className="cmbncardtext">THIS MONTH</p>
                        </Col>
                        <Col md={2} className="text-end pe-0">
                          <button>
                            <img src={Rupees} alt="" />
                          </button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="d-flex">
                            <p className="coloredText2 me-2">
                              <img
                                className="cartbarstyle2"
                                src={chartbar2}
                                alt=""
                              />
                              -17.0%
                            </p>
                            <span className="bottomText">
                              ₹1,90,298.00 last month
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                    {/* </Card> */}
                  </Col>
                </Row>
              </div>
              <div>
                <Row>
                  <Col md={6} style={{ borderRight: "2px solid #ECEEF6" }}>
                    <Card.Body>
                      <Card.Title>Asset</Card.Title>
                      <Row className="mt-3">
                        <Col md={10}>
                          <h3 className="m-0">₹ {this.state.assetsAmt ? this.state.assetsAmt.monthly_assets_amt : 0}</h3>
                          <p className="cmbncardtext">TOTAL ASSET</p>
                        </Col>
                        <Col md={2} className="text-end pe-0">
                          <button>
                            <img src={Rupees} alt="" />
                          </button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="d-flex">
                            <p className="coloredText me-2">
                              <img
                                className="cartbarstyle"
                                src={chartbar}
                                alt=""
                              />
                              +15.0%
                            </p>
                            <span className="bottomText">
                              ₹2,28,650.00 last month
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                    {/* </Card> */}
                  </Col>
                  <Col md={6}>
                    <Card.Body className="ps-0">
                      <Card.Title>Liability</Card.Title>
                      <Row className="mt-3">
                        <Col md={10}>
                          <h3 className="m-0">₹ {this.state.liabiltyAmt ? this.state.liabiltyAmt.monthly_liabilities_amt : 0}</h3>
                          <p className="cmbncardtext">TOTAL LIABILITY</p>
                        </Col>
                        <Col md={2} className="text-end pe-0">
                          <button>
                            <img src={Rupees} alt="" />
                          </button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="d-flex">
                            <p className="coloredText me-2">
                              <img
                                className="cartbarstyle"
                                src={chartbar}
                                alt=""
                              />
                              +12.0%
                            </p>
                            <span className="bottomText">
                              ₹87,055.00 last month
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
        {/* {JSON.stringify(authenticationService.currentUserValue.permission)} */}
        {/* {JSON.stringify(isParentExist("ledger-list"))} */}
      </div>
    ) : <div className="text-center" style={{ fontSize: '50px',paddingTop:"200px" }}>
      Welcome {authenticationService.currentUserValue &&
        authenticationService.currentUserValue.userCode} !</div>;

  }
}

// setUserPermissions

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

export default connect(mapStateToProps, mapActionsToProps)(Dashboard);
