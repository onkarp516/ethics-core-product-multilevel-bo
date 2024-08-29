import React, { Component } from "react";

import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Modal,
  CloseButton,
  InputGroup,
} from "react-bootstrap";

import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import {
  // transaction_ledger_list,
  getAdditionalLedgersIndirectExp,
  transaction_ledger_details,
  delete_ledger,
} from "@/services/api_functions";
import { getValue, isActionExist, eventBus, MyNotifications } from "@/helpers";

export default class MdlLedgerIndirectExp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierNameLst: [],
      supplierCodeLst: [],
      ledgerList: [],
      orgLedgerList: [],
    };
  }

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    // transaction_ledger_list(requestData)
    getAdditionalLedgersIndirectExp(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("res---->", res.list);
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            // if (v.gstDetails) {
            //   if (v.gstDetails.length === 1) {
            //     stateCode = v.gstDetails[0]["state"];
            //   }
            // }

            if (v.state) {
              stateCode = v.stateCode;
            }
            return {
              label: v.ledger_name,
              value: parseInt(v.id),
              code: v.ledger_code,
              state: stateCode,
              // salesRate: v.salesRate,
              // gstDetails: v.gstDetails,
              current_balance: v.current_balance,
              balance_type: v.balance_type,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            // if (v.gstDetails) {
            //   if (v.gstDetails.length === 1) {
            //     stateCode = v.gstDetails[0]["state"];
            //   }
            // }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              // label: v.ledger_code,
              value: parseInt(v.id),
              label: v.ledger_name,
              state: stateCode,
              // salesRate: v.salesRate,
              // gstDetails: v.gstDetails,
              current_balance: v.current_balance,
              balance_type: v.balance_type,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
            };
          });
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,

            ledgerList: res.list,
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  handleSearch = (vi) => {
    let { orgLedgerList } = this.state;
    console.log({ orgLedgerList });
    let orgData_F = orgLedgerList.filter(
      (v) =>
        (v.balance_type != null &&
          v.balance_type.toLowerCase().includes(vi.toLowerCase())) ||
        (v.ledger_name != null &&
          v.ledger_name.toLowerCase().includes(vi.toLowerCase())) ||
        (v.current_balance != "" && v.current_balance.toString().includes(vi))
      //  ||
      // (  v.email != null && v.email.toLowerCase().includes(vi.toLowerCase())) ||
      // (  v.gender != null &&  v.gender.toLowerCase().includes(vi.toLowerCase())) ||
      // (  v.username  != null && v.username.toLowerCase().includes(vi.toLowerCase()))
    );
    if (vi.length == 0) {
      this.setState({
        ledgerList: orgLedgerList,
      });
    } else {
      this.setState({
        ledgerList: orgData_F.length > 0 ? orgData_F : [],
      });
    }
  };

  // ledger_group type
  transaction_ledger_detailsFun = (ledger_id = 0) => {
    let requestData = new FormData();
    requestData.append("ledger_id", ledger_id);
    transaction_ledger_details(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("Indirect_type", res);
        if (res.responseStatus == 200) {
          // let { ledgerModalStateChange } = this.props;
          let { ledgerIndExpModalStateChange } = this.props;
          ledgerIndExpModalStateChange("ledgerDataIndExp", res.result);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  componentDidMount() {
    this.transaction_ledger_listFun();
  }

  setSelectedSupplierFun = (supplier_id = 0) => {
    let { ledgerList } = this.state;
    let { invoice_data, ledgerIndExpModalStateChange } = this.props;
    let selectedLedgerIndExp = ledgerList.find(
      (v) => parseInt(v.id) == parseInt(supplier_id)
    );
    if (selectedLedgerIndExp != "") {
      // console.log("invoice_data", invoice_data, selectedLedgerIndExp);
      // let opt = selectedLedgerIndExp.gstDetails.map((vi) => {
      //   return { label: vi.gstNo, value: vi.id, ...vi };
      // });
      // ledgerIndExpModalStateChange("lstGst", opt);
      let init_d = { ...invoice_data };

      // init_d["additionalChgLedgerName1"] =
      //   selectedLedgerIndExp != "" ? selectedLedgerIndExp.ledger_name : "";
      // init_d["additionalChgLedgerName2"] =
      //   selectedLedgerIndExp != "" ? selectedLedgerIndExp.ledger_name : "";
      // init_d["additionalChgLedgerName3"] =
      //   selectedLedgerIndExp != "" ? selectedLedgerIndExp.ledger_name : "";
      // init_d["supplierCodeId"] =
      //   selectedLedgerIndExp != "" ? selectedLedgerIndExp.code : "";
      init_d["selectedSupplier"] =
        selectedLedgerIndExp != "" ? selectedLedgerIndExp : "";
      // init_d["gstId"] =
      //   selectedLedgerIndExp != ""
      //     ? getValue(opt, invoice_data.gstNo)
      //       ? getValue(opt, invoice_data.gstNo)
      //       : ""
      //     : "";
      // console.log("init_d", init_d);
      ledgerIndExpModalStateChange("invoice_data", init_d);
      ledgerIndExpModalStateChange("isLedgerSelectSet", false);
      ledgerIndExpModalStateChange("ledgerModalIndExp", false);
      ledgerIndExpModalStateChange(
        "additionalChgLedgerName1",
        selectedLedgerIndExp.ledger_name
      );
      ledgerIndExpModalStateChange("ledgerDataIndExp", "");
      // ledgerIndExpModalStateChange("gstId", init_d["gstId"]);
      this.transaction_ledger_listFun();
    }
  };

  componentWillReceiveProps(prev, next) {
    // console.log("prev => ", prev, "next => ", next);
    // console.log("this.props", this.props);
    let { selectedLedgerIndExp, ledgerModalIndExp, ledgerDataIndExp } = prev;
    let { invoice_data, isLedgerSelectSet } = this.props;
    if (isLedgerSelectSet) {
      this.setSelectedSupplierFun(invoice_data?.EditsupplierId);
    }
    if (
      ledgerModalIndExp == true &&
      selectedLedgerIndExp != "" &&
      ledgerDataIndExp == ""
    ) {
      this.transaction_ledger_detailsFun(selectedLedgerIndExp.id);
    }
  }

  deleteledgerFun = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_ledger(formData)
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
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };
  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let {
      ledgerIndExpModalStateChange,
      transactionType,
      invoice_data,
      ledgerDataIndExp,
      salesmanLst,
    } = this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));

        // console.warn("da->>>>>>>>>>>>>>>>>>down", val);

        ledgerIndExpModalStateChange({
          selectedLedgerIndExp: val,
          add_button_flag: true,
        });
        this.transaction_ledger_detailsFun(val.id);
        // transaction_ledger_detailsFun(val.id);
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', da)

        ledgerIndExpModalStateChange({
          selectedLedgerIndExp: val,
          add_button_flag: true,
        });
        this.transaction_ledger_detailsFun(val.id);
        // transaction_ledger_detailsFun(val.id);
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedgerIndExp = JSON.parse(
          cuurentProduct.getAttribute("value")
        );

        if (this.props.ledgerModalIndExp1 == true) {
          if (selectedLedgerIndExp != "") {
            // console.log("invoice_data----sss", invoice_data, salesmanLst);
            // console.log(
            //   "selectedLedgerIndExp",
            //   selectedLedgerIndExp,
            //   transactionType
            // );

            let init_d = { ...invoice_data };
            init_d["additionalChgLedgerName1"] =
              selectedLedgerIndExp != ""
                ? selectedLedgerIndExp.ledger_name
                : "";
            init_d["additionalChgLedger1"] =
              selectedLedgerIndExp != "" ? selectedLedgerIndExp.id : "";

            if (transactionType === "sale") {
              init_d["salesmanId"] =
                selectedLedgerIndExp != ""
                  ? getValue(
                      salesmanLst,
                      parseInt(selectedLedgerIndExp.salesmanId)
                    )
                  : "";
            }
            ledgerIndExpModalStateChange("invoice_data", init_d);
            ledgerIndExpModalStateChange("ledgerModalIndExp", false);
            ledgerIndExpModalStateChange("selectedLedgerIndExp", "");
            ledgerIndExpModalStateChange("ledgerDataIndExp", "");

            if (
              transactionType == "debit_note" ||
              transactionType == "credit_note"
            ) {
              this.props.openInvoiceBillLst(selectedLedgerIndExp.id);
            }
            this.transaction_ledger_listFun();
          }
        } else if (this.props.ledgerModalIndExp2 == true) {
          if (selectedLedgerIndExp != "") {
            // console.log("invoice_data----sss", invoice_data, salesmanLst);
            // console.log(
            //   "selectedLedgerIndExp",
            //   selectedLedgerIndExp,
            //   transactionType
            // );

            let init_d = { ...invoice_data };

            init_d["additionalChgLedgerName2"] =
              selectedLedgerIndExp != ""
                ? selectedLedgerIndExp.ledger_name
                : "";
            init_d["additionalChgLedger2"] =
              selectedLedgerIndExp != "" ? selectedLedgerIndExp.id : "";

            ledgerIndExpModalStateChange("invoice_data", init_d);
            ledgerIndExpModalStateChange("ledgerModalIndExp", false);
            ledgerIndExpModalStateChange("selectedLedgerIndExp", "");
            ledgerIndExpModalStateChange("ledgerDataIndExp", "");

            if (
              transactionType == "debit_note" ||
              transactionType == "credit_note"
            ) {
              this.props.openInvoiceBillLst(selectedLedgerIndExp.id);
            }
            this.transaction_ledger_listFun();
          }
        } else if (this.props.ledgerModalIndExp3 == true) {
          if (selectedLedgerIndExp != "") {
            // console.log("invoice_data----sss", invoice_data, salesmanLst);
            // console.log(
            //   "selectedLedgerIndExp",
            //   selectedLedgerIndExp,
            //   transactionType
            // );

            let init_d = { ...invoice_data };
            init_d["additionalChgLedger3"] =
              selectedLedgerIndExp != "" ? selectedLedgerIndExp.id : "";
            init_d["additionalChgLedgerName3"] =
              selectedLedgerIndExp != ""
                ? selectedLedgerIndExp.ledger_name
                : "";

            if (transactionType === "sale") {
              init_d["salesmanId"] =
                selectedLedgerIndExp != ""
                  ? getValue(
                      salesmanLst,
                      parseInt(selectedLedgerIndExp.salesmanId)
                    )
                  : "";
            }
            ledgerIndExpModalStateChange("invoice_data", init_d);
            ledgerIndExpModalStateChange("ledgerModalIndExp", false);
            ledgerIndExpModalStateChange("selectedLedgerIndExp", "");
            ledgerIndExpModalStateChange("ledgerDataIndExp3", "");

            if (
              transactionType == "debit_note" ||
              transactionType == "credit_note"
            ) {
              this.props.openInvoiceBillLst(selectedLedgerIndExp.id);
            }
            this.transaction_ledger_listFun();
          }
        }
        this.transaction_ledger_listFun();
      }
      // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
    }
  }

  render() {
    let { ledgerList } = this.state;

    let {
      ledgerModalIndExp,
      ledgerModalIndExp1,
      ledgerModalIndExp2,
      ledgerModalIndExp3,
      ledgerDataIndExp,
      selectedLedgerIndExp,
      ledgerIndExpModalStateChange,
      invoice_data,
      transactionType,
      from_source,
      rows,
      transaction_ledger_detailsFun,
      salesmanLst,
    } = this.props;

    return (
      <div className="purchaseinvoice">
        <Modal
          show={ledgerModalIndExp}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="tnx-pur-inv-mdl-product"
          centered
          onHide={() => {
            ledgerIndExpModalStateChange("ledgerModalIndExp", false);
            this.transaction_ledger_listFun();
          }}
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Select Ledger
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                ledgerIndExpModalStateChange("ledgerModalIndExp", false);
                this.transaction_ledger_listFun();
              }}
            />
          </Modal.Header>

          <Modal.Body className="tnx-pur-inv-mdl-body p-0">
            <Row className="p-3">
              <Col lg={6}>
                <InputGroup className="mb-2  mdl-text">
                  <Form.Control
                    autoFocus="true"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    className="mdl-text-box"
                    onChange={(e) => {
                      e.preventDefault();
                      // this.transaction_ledger_listFun(e.target.value);
                      this.handleSearch(e.target.value);
                    }}
                  />
                  <InputGroup.Text className="int-grp" id="basic-addon1">
                    <img className="srch_box" src={search} alt="" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col lg={{ span: 2, offset: 4 }}>
                <Button
                  className="successbtn-style"
                  onClick={(e) => {
                    e.preventDefault();

                    if (
                      isActionExist(
                        "ledger",
                        "create",
                        this.props.userPermissions
                      )
                    ) {
                      let data = {
                        rows: rows,
                        // additionalCharges: additionalCharges,
                        invoice_data: invoice_data,
                        from_page: from_source,
                        ledgerType: "sundry_creditors",
                        ledgerId: 1,
                      };
                      eventBus.dispatch("page_change", {
                        from: from_source,
                        to: "ledgercreate",
                        prop_data: data,
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
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      if (
                        isActionExist(
                          "ledger",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        let data = {
                          rows: rows,
                          // additionalCharges: additionalCharges,
                          invoice_data: invoice_data,
                          from_page: from_source,
                          ledgerType: "sundry_creditors",
                          ledgerId: 1,
                        };
                        eventBus.dispatch("page_change", {
                          from: from_source,
                          to: "ledgercreate",
                          prop_data: data,
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
                  + Add
                </Button>
              </Col>
            </Row>
            <div className="tnx-pur-inv-ModalStyle">
              <Table className="text-start">
                <thead>
                  <tr>
                    {/* <th>Code</th> */}
                    <th>Ledger Name</th>
                    <th>Ledger Group</th>
                    {/* <th>Contact No.</th> */}
                    <th>Current Balance</th>
                    <th>Ledger Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody
                  className="prouctTableTr"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.keyCode != 9) {
                      this.handleTableRow(e);
                    }
                  }}
                >
                  {ledgerList.map((v, i) => {
                    // console.log("Group----->", ledgerList);
                    return (
                      <tr
                        value={JSON.stringify(v)}
                        id={`productTr_` + i}
                        prId={v.id}
                        tabIndex={i}
                        className={`${
                          JSON.stringify(v) ==
                          JSON.stringify(selectedLedgerIndExp)
                            ? "selected-tr"
                            : ""
                        }`}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          if (this.props.ledgerModalIndExp1 == true) {
                            if (selectedLedgerIndExp != "") {
                              // console.log(
                              //   "invoice_data----sss",
                              //   invoice_data,
                              //   salesmanLst
                              // );
                              // console.log(
                              //   "selectedLedgerIndExp",
                              //   selectedLedgerIndExp,
                              //   transactionType
                              // );
                              // let opt = selectedLedgerIndExp.gstDetails.map(
                              //   (vi) => {
                              //     return {
                              //       label: vi.gstNo,
                              //       value: vi.id,
                              //       ...vi,
                              //     };
                              //   }
                              // );
                              // ledgerIndExpModalStateChange("lstGst", opt);
                              let init_d = { ...invoice_data };
                              init_d["additionalChgLedgerName1"] =
                                selectedLedgerIndExp != ""
                                  ? selectedLedgerIndExp.ledger_name
                                  : "";
                              init_d["additionalChgLedger1"] =
                                selectedLedgerIndExp != ""
                                  ? selectedLedgerIndExp.id
                                  : "";

                              // init_d["additionalChgLedgerName2"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp.ledger_name
                              //     : "";
                              // init_d["additionalChgLedgerName3"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp.ledger_name
                              //     : "";
                              // init_d["supplierCodeId"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp.code
                              //     : "";
                              // init_d["selectedSupplier"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp
                              //     : "";
                              // init_d["gstId"] =
                              //   selectedLedgerIndExp != ""
                              //     ? getValue(opt, ledgerDataIndExp.gst_number)
                              //       ? getValue(opt, ledgerDataIndExp.gst_number)
                              //       : ""
                              //     : "";
                              if (transactionType === "sale") {
                                init_d["salesmanId"] =
                                  selectedLedgerIndExp != ""
                                    ? getValue(
                                        salesmanLst,
                                        parseInt(
                                          selectedLedgerIndExp.salesmanId
                                        )
                                      )
                                    : "";
                              }
                              ledgerIndExpModalStateChange(
                                "invoice_data",
                                init_d
                              );
                              ledgerIndExpModalStateChange(
                                "ledgerModalIndExp",
                                false
                              );
                              ledgerIndExpModalStateChange(
                                "selectedLedgerIndExp",
                                ""
                              );
                              ledgerIndExpModalStateChange(
                                "ledgerDataIndExp",
                                ""
                              );
                              // ledgerIndExpModalStateChange(
                              //   "gstId",
                              //   init_d["gstId"]
                              // );
                              if (
                                transactionType == "debit_note" ||
                                transactionType == "credit_note"
                              ) {
                                this.props.openInvoiceBillLst(
                                  selectedLedgerIndExp.id
                                );
                              }
                              this.transaction_ledger_listFun();
                            }
                          } else if (this.props.ledgerModalIndExp2 == true) {
                            if (selectedLedgerIndExp != "") {
                              // console.log(
                              //   "invoice_data----sss",
                              //   invoice_data,
                              //   salesmanLst
                              // );
                              // console.log(
                              //   "selectedLedgerIndExp",
                              //   selectedLedgerIndExp,
                              //   transactionType
                              // );
                              // let opt = selectedLedgerIndExp.gstDetails.map(
                              //   (vi) => {
                              //     return {
                              //       label: vi.gstNo,
                              //       value: vi.id,
                              //       ...vi,
                              //     };
                              //   }
                              // );
                              // ledgerIndExpModalStateChange("lstGst", opt);
                              let init_d = { ...invoice_data };
                              // init_d["additionalChgLedgerName1"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp.ledger_name
                              //     : "";
                              init_d["additionalChgLedgerName2"] =
                                selectedLedgerIndExp != ""
                                  ? selectedLedgerIndExp.ledger_name
                                  : "";
                              init_d["additionalChgLedger2"] =
                                selectedLedgerIndExp != ""
                                  ? selectedLedgerIndExp.id
                                  : "";
                              // init_d["supplierCodeId"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp.code
                              //     : "";
                              // init_d["selectedSupplier"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp
                              //     : "";
                              // init_d["gstId"] =
                              //   selectedLedgerIndExp != ""
                              //     ? getValue(opt, ledgerDataIndExp.gst_number)
                              //       ? getValue(opt, ledgerDataIndExp.gst_number)
                              //       : ""
                              //     : "";
                              // if (transactionType === "sale") {
                              //   init_d["salesmanId"] =
                              //     selectedLedgerIndExp != ""
                              //       ? getValue(
                              //           salesmanLst,
                              //           parseInt(
                              //             selectedLedgerIndExp.salesmanId
                              //           )
                              //         )
                              //       : "";
                              // }
                              ledgerIndExpModalStateChange(
                                "invoice_data",
                                init_d
                              );
                              ledgerIndExpModalStateChange(
                                "ledgerModalIndExp",
                                false
                              );
                              ledgerIndExpModalStateChange(
                                "selectedLedgerIndExp",
                                ""
                              );
                              ledgerIndExpModalStateChange(
                                "ledgerDataIndExp",
                                ""
                              );
                              // ledgerIndExpModalStateChange(
                              //   "gstId",
                              //   init_d["gstId"]
                              // );
                              if (
                                transactionType == "debit_note" ||
                                transactionType == "credit_note"
                              ) {
                                this.props.openInvoiceBillLst(
                                  selectedLedgerIndExp.id
                                );
                              }
                              this.transaction_ledger_listFun();
                            }
                          } else if (this.props.ledgerModalIndExp3 == true) {
                            if (selectedLedgerIndExp != "") {
                              // console.log(
                              //   "invoice_data----sss",
                              //   invoice_data,
                              //   salesmanLst
                              // );
                              // console.log(
                              //   "selectedLedgerIndExp",
                              //   selectedLedgerIndExp,
                              //   transactionType
                              // );
                              // let opt = selectedLedgerIndExp.gstDetails.map(
                              //   (vi) => {
                              //     return {
                              //       label: vi.gstNo,
                              //       value: vi.id,
                              //       ...vi,
                              //     };
                              //   }
                              // );
                              // ledgerIndExpModalStateChange("lstGst", opt);
                              let init_d = { ...invoice_data };
                              init_d["additionalChgLedger3"] =
                                selectedLedgerIndExp != ""
                                  ? selectedLedgerIndExp.id
                                  : "";
                              init_d["additionalChgLedgerName3"] =
                                selectedLedgerIndExp != ""
                                  ? selectedLedgerIndExp.ledger_name
                                  : "";
                              // init_d["supplierCodeId"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp.code
                              //     : "";
                              // init_d["selectedSupplier"] =
                              //   selectedLedgerIndExp != ""
                              //     ? selectedLedgerIndExp
                              //     : "";
                              // init_d["gstId"] =
                              //   selectedLedgerIndExp != ""
                              //     ? getValue(opt, ledgerDataIndExp.gst_number)
                              //       ? getValue(opt, ledgerDataIndExp.gst_number)
                              //       : ""
                              //     : "";
                              if (transactionType === "sale") {
                                init_d["salesmanId"] =
                                  selectedLedgerIndExp != ""
                                    ? getValue(
                                        salesmanLst,
                                        parseInt(
                                          selectedLedgerIndExp.salesmanId
                                        )
                                      )
                                    : "";
                              }
                              ledgerIndExpModalStateChange(
                                "invoice_data",
                                init_d
                              );
                              ledgerIndExpModalStateChange(
                                "ledgerModalIndExp",
                                false
                              );
                              ledgerIndExpModalStateChange(
                                "selectedLedgerIndExp",
                                ""
                              );
                              ledgerIndExpModalStateChange(
                                "ledgerDataIndExp3",
                                ""
                              );
                              // ledgerIndExpModalStateChange(
                              //   "gstId",
                              //   init_d["gstId"]
                              // );
                              if (
                                transactionType == "debit_note" ||
                                transactionType == "credit_note"
                              ) {
                                this.props.openInvoiceBillLst(
                                  selectedLedgerIndExp.id
                                );
                              }
                              this.transaction_ledger_listFun();
                            }
                          }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          ledgerIndExpModalStateChange(
                            "selectedLedgerIndExp",
                            v
                          );

                          this.transaction_ledger_detailsFun(v.id);
                        }}
                      >
                        {/* <td className="ps-3">{v.code}</td> */}
                        <td className="text-center">{v.ledger_name}</td>
                        {/* <td className="">
                          {v.type === "SD"
                            ? "Debitor"
                            : v.type === "SC"
                            ? "Creditor"
                            : v.type}
                        </td> */}
                        <td className="text-center">
                          {ledgerDataIndExp != ""
                            ? ledgerDataIndExp.ledger_group
                            : ""}
                        </td>
                        <td className="text-center">{v.current_balance}</td>
                        <td className="text-center">{v.balance_type}</td>
                        <td className="text-center">
                          <img
                            src={TableEdit}
                            alt=""
                            className="mdl-icons"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                isActionExist(
                                  "ledger",
                                  "edit",
                                  this.props.userPermissions
                                )
                              ) {
                                let source = {
                                  rows: rows,
                                  // additionalCharges: additionalCharges,
                                  invoice_data: invoice_data,
                                  from_page: from_source,
                                };

                                let data = {
                                  source: source,
                                  id: v.id,
                                };
                                //console.log({ data });
                                eventBus.dispatch("page_change", {
                                  from: from_source,
                                  to: "ledgeredit",
                                  prop_data: data,
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
                          />
                          <img
                            src={TableDelete}
                            alt=""
                            className="mdl-icons"
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                isActionExist(
                                  "ledger",
                                  "delete",
                                  this.props.userPermissions
                                )
                              ) {
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
                                      this.deleteledgerFun(v.id);
                                    },
                                    handleFailFn: () => {},
                                  },
                                  () => {
                                    console.warn("return_data");
                                  }
                                );
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
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            {/* <div className="ledger_details_style pb-2">
              <Row className="mx-1 ">
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0 ">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td style={{ width: "40%" }}>GST No.:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.gst_number
                              : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Licence No.:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.license_number
                              : ""}
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ width: "40%" }}>FSSAI:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.fssai_number
                              : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Ledger Group:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.ledger_group
                              : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td style={{ width: "40%" }}>Contact Person:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.contact_name
                              : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Area:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.area
                              : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Route:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.route
                              : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="tbl-color">
                  <Table className="colored_label mb-0 ">
                    <tbody style={{ borderBottom: "0px transparent" }}>
                      <tr>
                        <td style={{ width: "40%" }}>Credit Days:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.credit_days
                              : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Transport:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.route
                              : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Bank:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerDataIndExp != ""
                              ? ledgerDataIndExp.bank_name
                              : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div> */}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
