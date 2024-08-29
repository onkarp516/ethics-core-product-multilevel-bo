import React from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  InputGroup,
  CloseButton,
  Collapse,
} from "react-bootstrap";
import { Formik } from "formik";

import * as Yup from "yup";
import delete_icon from "@/assets/images/delete_icon 3.png";
import search from "@/assets/images/search_icon@3x.png";
import refresh from "@/assets/images/refresh.png";
import moment from "moment";
import Select from "react-select";

import {
  getPurchaseAccounts,
  getSundryCreditors,
  authenticationService,
  getPurchaseInvoiceList,
  getLastPurchaseInvoiceNo,
  getTranxDebitNoteLast,
  getTranxDebitNoteListInvoiceBillSC,
  getTranxPurchaseProductListBillNo,
  getPurchaseReturnLst,
  delete_purchase_return,
} from "@/services/api_functions";

import {
  getSelectValue,
  MyDatePicker,
  AuthenticationCheck,
  customStyles,
  eventBus,
  isActionExist,
  MyNotifications,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class TranxDebitNoteList extends React.Component {
  constructor(props) {
    super(props);
    this.debitnoteRef = React.createRef();
    this.state = {
      show: false,
      purchaseAccLst: [],
      supplierNameLst: [],
      supplierCodeLst: [],
      purchaseInvoiceLst: [],
      orgData: [],
      initVal: {
        debit_note_sr: 1,
        pr_invoice_dt: "",
        transaction_dt: moment().format("YYYY-MM-DD"),
        purchaseId: "",
        invoice_no: "",
        invoice_dt: "",
        from_date: "",
        to_date: "",
        supplierCodeId: "",
        supplierNameId: "",
        purchase_return_invoice: "",
        outstanding: "",
      },
      opendiv: false,
      modal: false,
      errormodal: false,
      name: "",
      modalInputName: "",
      invoiceLstSC: [],
      selected_values: "",
      lst_products: [],
      debitnoteModalShow: false,
      supplier_name: "",
    };

    this.myRef = React.createRef();
  }
  handeldebitnoteModalShow = (status) => {
    this.setState({ debitnoteModalShow: status });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    this.setState({ name: this.state.modalInputName });
    this.modalClose();
  }

  modalOpen() {
    this.setState({ modal: true });
  }
  errorModal() {
    this.setState({ errormodal: true });
  }
  recordsavemodal() {
    this.setState({ recordsavemodal: true });
  }
  modalClose() {
    this.setState({
      modalInputName: "",
      modal: false,
      errormodal: false,
      recordsavemodal: false,
    });
  }

  lstPurchaseAccounts = () => {
    getPurchaseAccounts()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            return { label: v.name, value: v.id };
          });
          this.setState({ purchaseAccLst: opt });
        }
      })
      .catch((error) => { });
  };
  getPurchase_ReturnLst = () => {
    getPurchaseReturnLst()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState(
            { purchaseInvoiceLst: res.data, orgData: res.data },
            () => {
              this.debitnoteRef.current.setFieldValue("search", "");
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  handleSearch = (vi) => {
    let { orgData } = this.state;
    console.log({ orgData });
    let orgData_F = orgData.filter(
      (v) =>
        v.pur_return_no.includes(vi) ||
        moment(v.transaction_date).format("DD-MM-YYYY").includes(vi) ||
        // v.invoice_no.toLowerCase().includes(vi.toLowerCase()) ||
        v.sundry_creditor_name.toLowerCase().includes(vi.toLowerCase())
      // ||
      // v.total_amount.toLowerCase().includes(vi.toLowerCase())
    );
    this.setState({
      purchaseInvoiceLst: orgData_F.length > 0 ? orgData_F : orgData,
    });
  };

  setLastPurchaseSerialNo = () => {
    getTranxDebitNoteLast()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          const { initVal } = this.state;

          initVal["debit_note_sr"] = res.count;
          initVal["purchase_return_invoice"] = res.purReturnNo;
          this.setState({ initVal: initVal });
        }
      })
      .catch((error) => { });
  };
  lstSundryCreditors = () => {
    getSundryCreditors()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.name,
              value: v.id,
              code: v.ledger_code,
              state: stateCode,
              ledger_balance: v.ledger_balance,
              ledger_balance_type: v.ledger_balance_type,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length == 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: v.id,
              name: v.name,
              state: stateCode,
              ledger_balance: v.ledger_balance,
              ledger_balance_type: v.ledger_balance_type,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
          });
        }
      })
      .catch((error) => { });
  };

  deletepurchase = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_purchase_return(formData)
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
      .catch((error) => {
        this.setState({ purchaseInvoiceLst: [] });
      });
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.lstPurchaseAccounts();
      this.lstSundryCreditors();
      // this.lstPurchaseInvoice();
      this.setLastPurchaseSerialNo();
      this.getPurchase_ReturnLst();
    }
  }
  handleCreateBtn = () => {
    this.setState({ show: true });
  };

  handleSubmitSCList = (value) => {
    this.setState({ initVal: value });

    let reqData = new FormData();
    reqData.append("sundry_creditor_id", value.supplierCodeId.value);

    getTranxDebitNoteListInvoiceBillSC(reqData)
      .then((response) => {
        // console.log('before response', response);
        let res = response.data;
        if (res.responseStatus == 200) {
          // console.log('response', response);
          let lst = res.data;
          this.setState({
            invoiceLstSC: lst,
            selected_values: value,
            show: true,
          });
        }
      })
      .catch((error) => { });
  };

  handleRowClick = (v) => {
    let prop_data = {
      returnIntiVal: this.state.initVal,
      returnData: v,
    };

    eventBus.dispatch("page_change", {
      from: "tranx_debit_note_list",
      to: "tranx_debit_note_product_list",
      isNewTab: false,
      prop_data: prop_data,
    });
  };

  render() {
    const {
      show,
      purchaseAccLst,
      supplierNameLst,
      supplierCodeLst,
      purchaseInvoiceLst,
      initVal,
      invoiceLstSC,
      selected_values,
      debitnoteModalShow,
      supplier_name,
      lst_products,
      opendiv,
    } = this.state;

    return (
      <>
        <div className="ledger_form_style">
          <div className="cust_table">
            {!opendiv && (
              <Row className="">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  innerRef={this.debitnoteRef}
                  initialValues={{ search: "" }}
                  enableReinitialize={true}
                  validationSchema={Yup.object().shape({
                    // groupName: Yup.string().trim().required("Group name is required"),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => { }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    resetForm,
                  }) => (
                    // {!opendiv && (
                    <Form autoComplete="off">
                      <Row>
                        <Col md="3">
                          <div className="">
                            {/* <Form>
                              <Form.Group
                                className="search_btn_style mt-1"
                                controlId="formBasicSearch"
                              >
                                <Form.Control
                                  type="text"
                                  placeholder="Search"
                                  className="main_search"
                                  id="search"
                                  name="search"
                                  onChange={(e) => {
                                    let v = e.target.value;
                                    console.log({ v });
                                    setFieldValue("search", v);
                                    this.handleSearch(v);
                                  }}
                                  value={values.search}
                                />
                                {/* <Button type="submit">x</Button> 
                              </Form.Group>
                            </Form> */}
                            <InputGroup className="mb-2">
                              <Form.Control
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                                style={{ borderRight: "none" }}
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
                        <Col md="5">
                          {/* <InputGroup className="mb-3 ">
                  <MyDatePicker
                    
                    id="bill_dt"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="FROM DATE"
                    onChange={(date) => {
                      setFieldValue('bill_dt', date);
                    }}
                    selected={values.bill_dt}
                    maxDate={new Date()}
                    className="date-style text_center mt-1"
                  />
                  <InputGroup.Text
                    id="basic-addon2"
                    className=" mt-1"
                    style={{ background: "transparent", border: "none" }}
                  >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                  </InputGroup.Text>
                  <MyDatePicker
                   
                    id="bill_dt"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="TO DATE"
                    onChange={(date) => {
                      setFieldValue('bill_dt', date);
                    }}
                    selected={values.bill_dt}
                    maxDate={new Date()}
                    className="date-style text_center mt-1"
                  />
                </InputGroup> */}
                        </Col>
                        <Col md="4" className="mt-2 text-end">
                          {/* <Button
                            className="ml-2 btn-refresh"
                            type="button"
                            onClick={() => {
                              this.pageReload();
                            }}
                          >
                            <img src={refresh} alt="icon" />
                          </Button> */}
                          {/* {this.state.hide == 'true'} */}
                          {!opendiv && (
                            <Button
                              className="create-btn mr-2"
                              id="TDNL_create_btn"

                              onClick={(e) => {
                                e.preventDefault();
                                // ;
                                if (
                                  isActionExist(
                                    "purchase-return",
                                    "create",
                                    this.props.userPermissions
                                  )
                                ) {
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_debit_note_list",
                                    to: "tranx_debit_note_product_list",
                                    prop_data: values,
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
                              aria-controls="example-collapse-text"
                              aria-expanded={opendiv}
                              // onClick={this.open}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  if (
                                    isActionExist(
                                      "purchase-return",
                                      "create",
                                      this.props.userPermissions
                                    )
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "tranx_debit_note_list",
                                      to: "tranx_debit_note_product_list",
                                      prop_data: values,
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
                                }
                              }}
                            >
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
            {/* {purchaseInvoiceLst.length > 0 && ( */}
            <div className="tbl-body-style">
              {isActionExist(
                "purchase-return",
                "list",
                this.props.userPermissions
              ) && (
                  <Table
                    hover
                    size="sm"
                    className={`${opendiv != "" ? "tbl-font" : "tbl-font"}`}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "15%" }}>Pur_Return No.</th>
                        <th style={{ width: "15%" }}>Transaction Date</th>
                        <th style={{ width: "15%" }}>Return Date</th>
                        <th style={{ width: "15%" }}>Supplier Name</th>
                        <th style={{ width: "20%" }}>Narration</th>
                        <th style={{ width: "10%" }}>Total Amount</th>
                        <th style={{ width: "10%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ borderTop: "2px solid transparent" }}>
                      {purchaseInvoiceLst.length > 0 ? (
                        purchaseInvoiceLst.map((v, i) => {
                          return (
                            <tr
                              onDoubleClick={(e) => {
                                // ;
                                e.preventDefault();
                                if (
                                  isActionExist(
                                    "purchase-return",
                                    "edit",
                                    this.props.userPermissions
                                  )
                                ) {
                                  eventBus.dispatch("page_change", {
                                    from: "tranx_debit_note_list",
                                    to: "tranx_debit_note_edit_B2B",
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
                              <td style={{ width: "15%" }}>{v.pur_return_no}</td>
                              <td style={{ width: "15%" }}>
                                {moment(v.transaction_date).format("DD-MM-YYYY")}
                              </td>
                              <td style={{ width: "15%" }}>
                                {v.purchase_return_date}
                              </td>
                              <td style={{ width: "15%" }}>
                                {v.sundry_creditor_name}
                              </td>
                              <td style={{ width: "20%" }}>{v.narration}</td>
                              <td style={{ width: "10%" }}>{v.total_amount}</td>
                              <td style={{ width: "10%" }}>
                                <img
                                  src={delete_icon}
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    //margin: "0px 15px 0px 20px",
                                    textAlign: "center",
                                  }}
                                  title="Delete"
                                  onClick={(e) => {
                                    // this.deletepurchase(v.id);
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
                          <td colSpan={8} className="text-center">
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <thead className="tbl-footer">
                      <tr>
                        <th colSpan={10}></th>
                      </tr>
                    </thead>
                  </Table>
                )}
            </div>
            {/* )} */}
          </div>

          <Modal
            show={show}
            size="lg"
            className="transaction_mdl invoice-mdl-style"
            onHide={() => this.setState({ show: false })}
            // dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            //centered
            animation={false}
          >
            <Modal.Header
            //closeButton
            // className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title
              // id="example-custom-modal-styling-title"
              // className=""
              >
                Invoice List
              </Modal.Title>
              <CloseButton
                // variant="white"
                className="pull-right"
                onClick={this.handleClose}
              // onClick={() => this.handlesupplierdetailsModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className="p-0">
              <div className="table_wrapper">
                {invoiceLstSC.length > 0 && (
                  // <div className="all_bills">
                  //   <div className="bills_dt">
                  //     <div className="institutetbl pb-2 pt-0 pl-2 pr-2">
                  //       <div className="table_wrapper1">
                  <Table hover size="sm" className="tbl-font">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }} className="">
                          {" "}
                          #.
                        </th>
                        <th style={{ textAlign: "left" }} className="">
                          Bill
                        </th>
                        <th style={{ textAlign: "left" }} className="">
                          Bill Amt
                        </th>
                        <th style={{ textAlign: "left" }} className="">
                          Bill Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceLstSC.map((v, i) => {
                        return (
                          <tr
                            onClick={(e) => {
                              e.preventDefault();

                              this.handleRowClick(v);
                            }}
                          >
                            <td>{i + 1}</td>
                            <td>{v.invoice_no}</td>
                            <td>{v.total_amount}</td>
                            <td>
                              {moment(v.invoice_date).format("DD/MM/YYYY")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  //  </div>
                  //       </div>
                  //     </div>
                  //   </div>
                )}
              </div>
            </Modal.Body>
          </Modal>

          {/* Debit Note Create Modal */}
          <Modal
            fullscreen
            show={debitnoteModalShow}
            size="xl"
            className="groupnewmodal mt-5 mainmodal"
            onHide={() => this.handeldebitnoteModalShow(false)}
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
          //centered
          >
            <Modal.Header
              //closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                {supplier_name && supplier_name}
              </Modal.Title>
              <CloseButton
                variant="white"
                className="pull-right"
                //onClick={this.handleClose}
                onClick={() => this.handeldebitnoteModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className=" p-2 p-invoice-modal">
              <div
                className="institutetbl pb-2 pt-0 pl-2 pr-2"
              //style={{ height: '410px' }}
              >
                <Table
                  size="lg"
                  className="key mb-0 purchacetbl"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>
                        <Form.Group
                          controlId="formBasicCheckbox"
                          className="ml-1 pmt-allbtn"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Sr. #."
                            className="pt-1"
                          />
                        </Form.Group>
                      </th>
                      <th>Particulars</th>
                      <th>Qty</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="unithead">
                      <td></td>
                      <td></td>
                      <td>
                        <tr>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="H"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="M"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="L"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                        </tr>
                      </td>
                      {/* <td></td> */}
                      <td>
                        <tr>
                          <td>
                            <Form.Control
                              type="text"
                              placeholder="H"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="M"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                          <td>
                            {" "}
                            <Form.Control
                              type="text"
                              placeholder="L"
                              readonly
                              style={{ background: "#fff" }}
                            />
                          </td>
                        </tr>
                      </td>
                    </tr>
                    {lst_products.length > 0 &&
                      lst_products.map((v, i) => {
                        return (
                          <tr>
                            <td>
                              <Form.Group
                                controlId="formBasicCheckbox"
                                className="ml-1 pmt-allbtn"
                              >
                                <Form.Check
                                  type="checkbox"
                                  label="Sr. #."
                                  className="pt-1"
                                />
                              </Form.Group>
                            </td>
                            <td>{v.product_name}</td>
                            <td>{v.qtyH}</td>
                            <td>{v.qtyM}</td>
                            <td>{v.qtyL}</td>
                            <td>{v.rateH}</td>
                            <td>{v.rateM}</td>
                            <td>{v.rateL}</td>
                          </tr>
                        );
                      })}
                    {/*{rows.map((v, i) => {
                      return (
                        <TRowComponent
                          i={i}
                          setFieldValue={setFieldValue}
                          setElementValue={this.setElementValue.bind(this)}
                          handleChangeArrayElement={this.handleChangeArrayElement.bind(
                            this
                          )}
                          productLst={productLst}
                          handlePlaceHolder={this.handlePlaceHolder.bind(
                            this
                          )}
                          handleUnitLstOptLength={this.handleUnitLstOptLength.bind(
                            this
                          )}
                          isDisabled={false}
                          handleClearProduct={this.handleClearProduct.bind(
                            this
                          )}
                        />
                      );
                    })}*/}
                  </tbody>
                </Table>
              </div>
            </Modal.Body>
          </Modal>
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

export default connect(mapStateToProps, mapActionsToProps)(TranxDebitNoteList);
