import React from "react";

import { Button, Col, Row, Form, Table, InputGroup } from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";
import search from "@/assets/images/search_icon@3x.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import { delete_gst_input, getGStInputList } from "@/services/api_functions";

import {
  AuthenticationCheck,
  eventBus,
  isActionExist,
  MyNotifications,
  LoadingComponent,
} from "@/helpers";
import delete_icon from "@/assets/images/delete_icon3.png";

class GSTInputList extends React.Component {
  constructor(props) {
    super(props);
    this.gstInputRef = React.createRef();
    this.state = {
      opendiv: false,
      showDiv: true,
      gstInputList: [],
      showloader: true,
      orgData: [], 
    };

    this.myRef = React.createRef();
  }

  lstPurchaseInvoice = () => {
    this.setState({ showloader: true });
    getGStInputList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            {
              gstInputList: res.data,
              showloader: false,
            },
            () => {
              this.gstInputRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch(() => {
        this.setState({ gstInputList: [] });
      });
  };

  deletegstinput = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_gst_input(formData)
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
        }
      })
      .catch(() => {
        this.setState({ gstInputList: [] });
      });
  };

    handleSearch = (vi) => {
      let { orgData } = this.state;
      console.log({ orgData });
      let orgData_F = orgData.filter(
        (v) =>
         ( v.invoice_no != null && v.invoice_no.toLowerCase().includes(vi.toLowerCase())) ||
         ( moment(v.transaction_date).format("DD-MM-YYYY").includes(vi)) ||
          (moment(v.invoice_date).format("DD-MM-YYYY").includes(vi)) ||
         ( v.purchase_account_name != null && v.purchase_account_name.toLowerCase().includes(vi.toLowerCase())) ||
         ( v.sundry_creditor_name != null && v.sundry_creditor_name.toLowerCase().includes(vi.toLowerCase()))
        // ||
        // v.total_amount.toLowerCase().includes(vi.toLowerCase())
      );
      this.setState({
          gstInputList: orgData_F.length > 0 ? orgData_F : orgData,
      });
    };

  pageReload = () => {
    this.componentDidMount();
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseInvoice();
    }
  }
  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let {
      ledgerModalStateChange,
      transactionType,
      invoice_data,
      ledgerData,
    } = this.props;
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
        if (
          isActionExist(
            "gst-input",
            "edit",
            this.props.userPermissions
          )
        ) {
          eventBus.dispatch("page_change", {
            from: "gst_input_list",
            to: "gst_input_edit",
            prop_data: selectedLedger,
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

        // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
      }
    }
  }
  render() {
    const { gstInputList, showloader, opendiv } = this.state;

    return (
      <>
        <div className="ledger_form_style">
          <div className="ledger-group-style">
            {!opendiv && (
              <Row className="p-2">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  innerRef={this.gstInputRef}
                  initialValues={{ search: "" }}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                    // groupName: Yup.string().trim().required("Group name is required"),
                  })}
                  onSubmit={(values) => { }}
                >
                  {({ values }) => (
                    // {!opendiv && (
                    <Form autoComplete="off">
                      <Row >
                        <Col md="3">
                          <div className="">
                            <InputGroup className="mb-3">
                              <Form.Control
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                                style={{ borderRight: "none" }}
                                autoFocus="true"
                                onChange={(e) => {
                                  this.handleSearch(e.target.value);
                                }}
                              />
                              <InputGroup.Text
                                className="input_gruop"
                                id="basic-addon1"
                              >
                                <img className="srch_box" src={search} alt="" />
                              </InputGroup.Text>
                            </InputGroup>
                          </div>
                        </Col>
                        <Col md="5"></Col>{" "}
                        <Col md="4" className="mt-0 text-end">
                          {!opendiv && (
                            <Button
                              className="create-btn btn btn-success"
                              onClick={(e) => {
                                e.preventDefault();

                                if (
                                  isActionExist(
                                    "gst-input",
                                    "create",
                                    this.props.userPermissions
                                  )
                                ) {
                                  eventBus.dispatch("page_change", {
                                    from: "gst_input_list",
                                    to: "gst_input",
                                    prop_data: values,
                                    isNewTab: false,
                                  });
                                  // this.setLastPurchaseSerialNo();
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
                              aria-controls="example-collapse-text"
                              aria-expanded={opendiv}
                            >
                              {" "}
                              Create
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Row>
            )}
            <div className="tbl-list-style1 tbl-body-style">
              {isActionExist("gst-input", "list", this.props.userPermissions) && (
                <Table size="sm" className="tbl-font">
                  <thead>
                    {/* <div className="scrollbar_hd"> */}
                    <tr>
                      {this.state.showDiv}
                      <th>GST Input No.</th>
                      <th>Transaction Date</th>
                      <th>Supplier Name</th>
                      <th>Posting Name</th>
                      <th>Narration</th>
                      <th>Total Amount</th>
                      <th>Action</th>
                    </tr>
                    {/* </div> */}
                  </thead>
                  <tbody style={{ borderTop: "2px solid transparent" }}
                    className="prouctTableTr tabletrcursor"
                    onKeyDown={(e) => {
                      e.preventDefault();
                      if (e.keyCode != 9) {
                        this.handleTableRow(e);
                      }
                    }}>
                    {/* <div className="scrollban_new"> */}
                    {gstInputList.length > 0 ? (
                      gstInputList.map((v, i) => {
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
                                  "gst-input",
                                  "edit",
                                  this.props.userPermissions
                                )
                              ) {
                                eventBus.dispatch("page_change", {
                                  from: "gst_input_list",
                                  to: "gst_input_edit",
                                  prop_data: v,
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
                          >
                            <td>{v.gst_input_no}</td>
                            <td>
                              {moment(v.transaction_dt).format("DD-MM-YYYY")}
                            </td>
                            <td>{v.supplier_ledger_name}</td>
                            <td>{v.posting_ledger_name}</td>
                            <td>{v.narrations}</td>
                            <td>{v.total_amt}</td>
                            <td>
                              <img
                                src={delete_icon}
                                className="mdl-icons"
                                title="Delete"
                                onClick={() => {
                                  this.delete_gst_input(v.id);
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
                                        this.deletepurchase(v.id);
                                      },
                                      handleFailFn: () => { },
                                    },
                                    () => {
                                      console.warn("return_data");
                                    }
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No Data Found
                        </td>
                        {/* {showloader == true && LoadingComponent(showloader)} */}
                      </tr>
                    )}
                  </tbody>
                  <thead className="tbl-footer mb-2">
                    <tr>
                      <th
                        colSpan={7}
                        className=""
                        style={{ borderTop: " 2px solid transparent" }}
                      >
                        {Array.from(Array(1), (v) => {
                          return (
                            <tr>
                              {/* <th>&nbsp;</th> */}
                              <th>
                                Total GST Input List :
                              </th>
                              <th>{gstInputList.length}</th>
                            </tr>
                          );
                        })}
                      </th>
                    </tr>
                  </thead>
                </Table>
              )}
            </div>
          </div>
        </div>
      </>
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

export default connect(mapStateToProps, mapActionsToProps)(GSTInputList);
