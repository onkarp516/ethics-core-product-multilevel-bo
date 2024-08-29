import React from "react";
import { Tabs, Tab, Form } from "react-bootstrap";
import Group from "./Group";
import Brand from "./Brand.jsx";
import Category from "./Category.jsx";
import Subcategory from "./Subcategory.jsx";
import Package from "./Package";
import Flavour from "./Flavour";
import Unit from "./Unit";
export default class Catlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefresh: false,
      eventKey: "profile",
    };
  }

  handleRefresh = (status) => {
    this.setState({ isRefresh: status });
  };
  render() {
    const { isRefresh, eventKey } = this.state;
    return (
      <div>
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="sub-tab-style "
          // style={{ background: "#fff" }}
          activeKey={eventKey}
          onSelect={(v) => {
            // alert(v);
            this.setState({ eventKey: v });
          }}
        >
          <Tab
            eventKey="profile"
            title={
              <Form.Check
                type="radio"
                id="default"
                name="default"
                label="Brand"
                checked={eventKey == "profile" ? true : false}
                style={{ minHeight: "0px" }}
              />
            }
          >
            <Brand
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          <Tab
            eventKey="home"
            title={
              <Form.Check
                type="radio"
                id="default1"
                name="default"
                label="Group"
                checked={eventKey == "home" ? true : false}
                style={{ minHeight: "0px" }}
              />
            }
          >
            <Group
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          <Tab
            eventKey="category"
            title={
              <Form.Check
                type="radio"
                id="default2"
                name="default"
                label="Category"
                checked={eventKey == "category" ? true : false}
                style={{ minHeight: "0px" }}
              />
            }
          >
            <Category
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          <Tab
            eventKey="subcategory"
            title={
              <Form.Check
                type="radio"
                id="default3"
                name="default"
                label="Flavour"
                checked={eventKey == "subcategory" ? true : false}
                style={{ minHeight: "0px" }}
              />
            }
          >
            <Subcategory
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          {/* <Tab
            eventKey="flavour"
            title={
              <Form.Check
                type="radio"
                id="default4"
                name="default"
                label="Flavour"
                checked={eventKey == "flavour" ? true : false}
                style={{ minHeight: "0px" }}
              />
            }
          >
            <Flavour
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab> */}
          <Tab
            eventKey="package"
            title={
              <Form.Check
                type="radio"
                id="default5"
                name="default"
                label="Package"
                checked={eventKey == "package" ? true : false}
                style={{ minHeight: "0px" }}
              />
            }
          >
            <Package
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
          <Tab
            eventKey="unit"
            title={
              <Form.Check
                type="radio"
                id="default6"
                name="default"
                label="Unit"
                checked={eventKey == "unit" ? true : false}
                style={{ minHeight: "0px" }}
              />
            }
          >
            <Unit
              isRefresh={isRefresh}
              handleRefresh={this.handleRefresh.bind(this)}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
