import React from "react";
import {
  Button,
  Col,
  Row,
  Navbar,
  NavDropdown,
  Item,
  Nav,
  Form,
  Container,
  InputGroup,
  Table,
  Alert,
  Modal,
  CloseButton,
  Collapse,
} from "react-bootstrap";
import Select from "react-select";
import {
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  getHeader,
  customStyles,
  MyNotifications,
  eventBus,
  isActionExist,
} from "@/helpers";
import { Formik } from "formik";
// import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

// import refresh from "@render/assets/images/refresh.png";

import {
  createGroup,
  getGroups,
  createBrand,
  getBrands,
  getAllBrands,
  updateBrand,
} from "@/services/api_functions";
import print_icon from "@/assets/images/print_icon.svg";
import print_icon_grey from "@/assets/images/print_icon_grey.png";
// import GroupSelectList from "@/helpers/GroupSelectList";

export default class PurchaseInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.brandFormRef = React.createRef();
    this.state = {
      show: false,
      printModalShow: false,
      showDiv: true,
      opendiv: false,
      groupLst: [],
      getsubgrouptable: [],
      data: [],
      initVal: {
        id: "",
        groupId: "",
        brandName: "",
      },
    };
  }

  handelPrintModalShow = (status) => {
    this.setState({ printModalShow: status });
  };
  handleClose = () => {
    this.setState({ show: false }, () => {
      this.pageReload();
    });
  };
  setInitValue = () => {
    let initVal = {
      id: "",
      groupId: "",
      brandName: "",
    };
    this.setState({ initVal: initVal, opendiv: false });
  };
  lstGroups = (setVal = null) => {
    getGroups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.groupName };
            });
            this.setState({ groupLst: Opt });

            if (setVal != null && Opt.length > 0) {
              let { groupLst, initVal } = this.state;

              let current = this.brandFormRef.current;
              current.setFieldValue(
                "groupId",
                getSelectValue(groupLst, parseInt(setVal))
              );

              initVal["groupId"] = getSelectValue(groupLst, parseInt(setVal));
              this.setState({ initVal: initVal });
            }
          }
        }
      })

      .catch((error) => {});
  };

  letsubgrouplst = () => {
    getAllBrands()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({ getsubgrouptable: res.responseObject });
        }
      })
      .catch((error) => {
        this.setState({ getsubgrouptable: [] });
      });
  };

  handleModal = (status) => {
    if (status == true) {
      this.setInitValue();
    }
    this.setState({ show: status }, () => {
      // this.pageReload();
    });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstGroups();
      this.setInitValue();
      this.letsubgrouplst();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isRefresh == true) {
      this.pageReload();
      prevProps.handleRefresh(false);
    }
  }

  pageReload = () => {
    this.componentDidMount();
  };

  render() {
    const {
      show,
      groupLst,
      data,
      initVal,
      printModalShow,
      opendiv,
      showDiv,
      getsubgrouptable,
    } = this.state;

    const columns = [
      {
        id: "group_name", // database column name
        field: "groupName", // response parameter name
        label: "Group Name",
        resizable: true,
      },
      {
        id: "subgroup_name", // database column name
        field: "subgroupName", // response parameter name
        label: "Subgroup Name",
        resizable: true,
      },
    ];

    return (
      <div className="wrapper_div" style={{ height: "83vh" }}>
        <Row style={{ padding: "8px" }}>
          <Col md="3">
            <div className="">
              <Form>
                <Form.Group className="mt-1" controlId="formBasicSearch">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className="search-box"
                  />
                  {/* <Button type="submit">x</Button> */}
                </Form.Group>
              </Form>
            </div>
          </Col>

          <Col md="9" className="btn_align mainbtn_create">
            <div id="example-collapse-text">
              <div className="mb-2">
                <Button
                  className="float-right create-btn mr-2"
                  type="button"
                  style={{ float: "right" }}
                >
                  Print
                  <img src={print_icon} className="ms-2" />
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <div className="cust_table">
          <div className="table_wrapper">
            <Table hover size="sm" className="tbl-font">
              <thead>
                <tr>
                  <th>
                    <Form.Group controlId="formBasicCheckbox" className=" ">
                      <Form.Check type="checkbox" label="#." />
                    </Form.Group>{" "}
                  </th>
                  <th>Bill</th>
                  <th>Bill Date</th>
                  <th>Bill Name</th>
                  <th>Bill Amount</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="tabletrcursor">
                {/* <div className="scrollban_new"> */}
                {getsubgrouptable.length > 0 ? (
                  getsubgrouptable.map((v, i) => {
                    return (
                      <tr
                        onClick={(e) => {
                          e.preventDefault();
                          eventBus.dispatch(
                            "page_change",
                            "utilites_print_preview"
                          );
                          // this.setState({ printModalShow: true });
                        }}
                      >
                        <td>
                          {" "}
                          <Form.Group
                            controlId="formBasicCheckbox"
                            className=" "
                          >
                            <Form.Check type="checkbox" label={i + 1} />
                          </Form.Group>
                          {/* {i + 1} */}
                        </td>
                        <td>{v.groupName}</td>
                        <td>{v.groupName}</td>
                        <td>{v.subgroupName}</td>
                        <td>{v.subgroupName}</td>
                        <td>{v.subgroupName}</td>
                        <td>
                          <img src={print_icon_grey} className="ms-2" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colspan="3" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
                {/* </div> */}
              </tbody>
            </Table>
            {/* )} */}
          </div>
        </div>

        {/* Print Modal */}
        <Modal
          show={printModalShow}
          size="lg"
          className="transaction_mdl invoice-mdl-style"
          onHide={() => this.handelPrintModalShow(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title>Invoice List</Modal.Title>
            <CloseButton
              // variant="white"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.handelPrintModalShow(false)}
            />
          </Modal.Header>

          <Modal.Body className="p-0">
            <div
              className="table_wrapper"
              style={{ height: "50vh", margin: "0", borderRadius: "0px" }}
            >
              <Table hover size="sm" className="tbl-font">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Print Qty</th>
                  </tr>
                </thead>
                <tbody className="tabletrcursor">
                  {/* <div className="scrollban_new"> */}
                  {getsubgrouptable.length > 0 ? (
                    getsubgrouptable.map((v, i) => {
                      return (
                        <tr>
                          <td width="70%">{v.groupName}</td>
                          <td width="15%">
                            <Form.Control className="input-style1" />
                          </td>
                          <td width="15%">
                            <Form.Control className="input-style1" />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colspan="3" className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                  {/* </div> */}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="float-right create-btn mr-2"
              type="button"
              style={{ float: "right" }}
            >
              Print
              <img src={print_icon} className="ms-2" />
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Print Modal */}
      </div>
    );
  }
}
