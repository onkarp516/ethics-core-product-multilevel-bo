import React, { Component } from 'react'
import { Row, Col, Form, Button, Table, ProgressBar } from 'react-bootstrap'
import { stockImport } from '../../../services/api_functions/product.service';
import { MyNotifications } from "@/helpers";

export default class StockImport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productstockfile: "",
      now: 0,
    }
    this.timeIdRef = React.createRef;
  }

  productStockImport = () => {

    let { productstockfile } = this.state;
    if (this.state.productstockfile === "") {

      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Please select a Stock file",
        is_timeout: true,
        delay: 2000
      })

    } else {
      let formData = new FormData();
      this.setState({ now: 0 }, () => {
        this.onStart();
      }
      )
      formData.append("productstockfile", productstockfile);
      stockImport(formData)
        .then((response) => {
          let res = response.data;
          if (response.data.responseStatus === 200) {

            MyNotifications.fire({
              show: true,
              icon: "success",
              title: "Success",
              msg: res.message,
              is_timeout: true,
              delay: 2000
            })
            this.setState({ now: 100 }, () => {
              this.onStart();
            })
          } else {

            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: res.message,
              is_timeout: true,
              delay: 2000,
            })
            // this.setState({ now: 0 }, () => {
            //   this.onStart();
            // })
          }
        })
        .catch((error) => {

          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            is_timeout: true,
            delay: 1500,
          })

        })
    }

  }
  onStart = () => {
    let interval = '';
    interval = setInterval(() => {
      if (this.state.now <= 100) {
        this.setState({ now: this.state.now + 1 });
      }
      else {
        clearInterval(interval);
        this.setState({ now: 100 })
      }
    }, 100)
  }

  render() {
    const { productstockfile, now } = this.state;
    return (
      <>
        <div className="ledger-group-style">
          <div className="cust_table">
            <Row className='justify-content-center mt-3'>
              <Col lg={11}>
                <ProgressBar now={now} label={`${now}%`} />

                <Row>
                  <Col lg={11}>
                    <Form.Group controlId="formFile" >
                      <Form.Control type="file"
                        id="productstockfile"
                        name="productstockfile" onChange={(e) => {
                          this.setState({ productstockfile: e.target.files[0] });
                        }} />
                    </Form.Group>
                  </Col>
                  <Col lg={1} className='text-end'>
                    <Button className='submit-btn' onClick={(e) => this.productStockImport()}
                      style={{ marginTop: '2px' }}>Verify</Button>{' '}
                  </Col>
                </Row>

              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  }
}
