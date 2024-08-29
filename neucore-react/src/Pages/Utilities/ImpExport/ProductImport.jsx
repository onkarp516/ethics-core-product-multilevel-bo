import React, { Component } from "react";
import { Row, Col, Form, Button, Table, ProgressBar } from "react-bootstrap";
import { importProduct } from "../../../services/api_functions/product.service";
import { MyNotifications } from "@/helpers";

export default class ProductImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productfile: "",
      now: 0,
    };
    this.timerIdRef = React.createRef;
  }

  importProduct1 = () => {
    let { productfile } = this.state;

    if (this.state.productfile === "") {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        // msg: res.message,
        msg: "Please select a product file",
        is_timeout: true,
        delay: 2000,
      });
    } else {
      let formData = new FormData();
      this.setState({ now: 0 }, () => {
        this.onStart();
      });
      formData.append("productfile", productfile);

      importProduct(formData)
        .then((response) => {
          let res = response.data;
          if (response.data.responseStatus === 200) {
            MyNotifications.fire({
              show: true,
              icon: "success",
              title: "Success",
              msg: res.message,
              is_timeout: true,
              delay: 2000,
            });
            this.setState({ now: 100 }, () => {
              this.onStart();
            });
          } else {
            this.setState({ now: 100 });

            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: res.message,
              is_timeout: true,
              delay: 2000,
            });
          }
        })
        .catch((error) => {
          this.setState({ now: 100 });
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            is_timeout: true,
            delay: 2000,
          });
        });
    }
  };

  onStart = () => {
    let interval = "";
    let tm = 0;

    interval = setInterval(() => {
      if (this.state.now >= 100) {
        clearInterval(interval);
        this.setState({ now: 100 });
      } else {
        tm = tm + 1;
        if (tm <= 20) {
          this.setState({ now: this.state.now + 1 });
        } else if (tm <= 50) {
          if (tm % 10 === 0) this.setState({ now: this.state.now + 1 });
        } else if (tm <= 500) {
          if (tm % 20 === 0) this.setState({ now: this.state.now + 1 });
        } else if (tm > 500) {
          if (this.state.now > 95) {
            this.setState({ now: this.state.now });
          } else {
            if (tm % 50 === 0) this.setState({ now: this.state.now + 1 });
          }
        }
      }
    }, 100);
  };

  render() {
    const { productfile, now } = this.state;
    return (
      <>
        <div className="ledger-group-style">
          <div className="cust_table">
            <Row className="justify-content-center mt-3">
              <Col lg={11}>
                <ProgressBar now={now} label={`${now}%`} />
                <Row>
                  <Col lg={11}>
                    <Form.Group controlId="formFile">
                      <Form.Control
                        type="file"
                        id="productfile"
                        name="productfile"
                        onChange={(e) => {
                          this.setState({ productfile: e.target.files[0] });
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={1} className="text-end">
                    <Button
                      className="submit-btn"
                      onClick={(e) => this.importProduct1()}
                      style={{ marginTop: "2px" }}
                    >
                      Verify
                    </Button>{" "}
                  </Col>
                </Row>

                {/* <div className="tbl-list-style1 tbl-body-style mt-4">
                  <Table size="sm" className="tbl-font">
                    <thead style={{ background: '#d5effb' }}>
                      <tr>
                        <th>Sr.No.</th>
                        <th>Product Code</th>
                        <th>Product Name</th>
                        <th>Packing</th>
                        <th>Conversion</th>
                        <th>Unit</th>
                        <th>Brand</th>
                        <th>Group</th>
                        <th>Category</th>
                        <th>HSN</th>
                        <th>SGST</th>
                        <th>CGST</th>
                        <th>IGST</th>
                        <th>Prate</th>
                        <th>Sale Rate</th>
                        <th>MRP</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: "2px solid transparent" }}
                      className="prouctTableTr tabletrcursor">
                      <tr>
                        <td>1</td>
                        <td>123</td>
                        <td>new product</td>
                        <td>psc</td>
                        <td>yes</td>
                        <td>1</td>
                        <td>brand</td>
                        <td>group</td>
                        <td>category</td>
                        <td>hsn</td>
                        <td>12</td>
                        <td>13</td>
                        <td>14</td>
                        <td>prate</td>
                        <td>140</td>
                        <td>1000</td>
                      </tr>

                    </tbody>
                    <thead className="tbl-footer mb-2">
                      <tr>
                        <th
                          colSpan={16}
                          className=""
                          style={{ borderTop: " 2px solid transparent" }}
                        >
                          12
                        </th>
                      </tr>
                    </thead>
                  </Table>
                </div> */}
              </Col>
            </Row>
          </div>
        </div>
      </>
    );
  }
}
