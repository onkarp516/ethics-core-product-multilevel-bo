import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import PurchaseInvoice from "./PurchaseInvoice.jsx";
import TransactionPrint from "./TransactionPrint.jsx";
export default class PrintBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefresh: false,
    };
  }

  handleRefresh = (status) => {
    this.setState({ isRefresh: status });
  };
  render() {
    const { isRefresh } = this.state;
    return (
      <div>
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="sub-tab-style "
          // style={{ background: "#fff" }}
        >
          <Tab eventKey="home" title="Product">
            <PurchaseInvoice
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          <Tab eventKey="profile" title="Transaction">
            <TransactionPrint
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          {/* <Tab eventKey="category" title="Manual">
            <PurchaseInvoice
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          <Tab eventKey="subcategory" title="Mapping">
            <PurchaseInvoice
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab> */}
        </Tabs>
      </div>
    );
  }
}
