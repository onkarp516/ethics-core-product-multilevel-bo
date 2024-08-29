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
  transaction_ledger_list,
  transaction_ledger_details,
  delete_ledger,
} from "@/services/api_functions";
import {
  getValue,
  isActionExist,
  eventBus,
  MyNotifications,
  getSelectValue,
  ledger_select,
  INRformat,
} from "@/helpers";

export default class MdlLedger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierNameLst: [],
      supplierCodeLst: [],
      ledgerList: [],
      orgLedgerList: [],
      // selectedAll: "Creditor",
    };
  }

  transaction_ledger_listFun = (search = "") => {
    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      .then((response) => {
        let res = response.data;
        // console.log("res---->", res.list);
        if (res.responseStatus == 200) {
          let opt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }
            if (v.state) {
              stateCode = v.stateCode;
            }
            return {
              label: v.ledger_name,
              value: parseInt(v.id),
              code: v.ledger_code,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,

              current_balance: v.current_balance,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
            };
          });
          let codeopt = res.list.map((v, i) => {
            let stateCode = "";
            if (v.gstDetails) {
              if (v.gstDetails.length === 1) {
                stateCode = v.gstDetails[0]["state"];
              }
            }

            if (v.state) {
              stateCode = v.state;
            }
            return {
              label: v.ledger_code,
              value: parseInt(v.id),
              name: v.ledger_name,
              state: stateCode,
              salesRate: v.salesRate,
              gstDetails: v.gstDetails,

              current_balance: v.current_balance,
              isFirstDiscountPerCalculate: v.isFirstDiscountPerCalculate,
              takeDiscountAmountInLumpsum: v.takeDiscountAmountInLumpsum,
              ...v,
            };
          });
          let { invoice_data } = this.props;
          // console.log("invoice_data--->", invoice_data);
          // if (invoice_data.filterListCreate == "SC") {
          //   this.setState({
          //     ledgerList: res.list.filter(
          //       (v) => v.type == invoice_data.filterListSales
          //     ),
          //   });
          // } else {
          //   this.setState({
          //     ledgerList: res.list,
          //   });
          // }
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,
            ledgerList: res.list,
            // ledgerList: res.list.filter(
            //   (v) => v.type == invoice_data.filterListSales
            // ),
            orgLedgerList: res.list,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleLstChange = (e) => {
    let { orgLedgerList } = this.state;
    if (orgLedgerList.length > 0) {
      const selectedAll = e.target.value;
      let filterLst = orgLedgerList;
      if (selectedAll === "Creditor") {
        filterLst = filterLst.filter((v) => v.type == "SC");
        // console.warn("filterLst->>>>>>>>", filterLst, selectedAll);
        this.setState({ selectedAll: selectedAll, ledgerList: filterLst });
        // alert(JSON.stringify(filterLst.length));
      } else if (selectedAll === "Debitor") {
        filterLst = filterLst.filter((v) => v.type == "SD");
        // console.warn("filterLst->>>>>>>>", filterLst, selectedAll);
        this.setState({ selectedAll: selectedAll, ledgerList: filterLst });
        // alert(JSON.stringify(filterLst.length));
      } else {
        // console.warn("filterLst->>>>>>>>", orgLedgerList, selectedAll);
        this.setState({ selectedAll: selectedAll, ledgerList: orgLedgerList });
        // alert(JSON.stringify(ledgerList.length));
      }
    }
  };

  transaction_ledger_detailsFun = (ledger_id = 0) => {
    let requestData = new FormData();
    requestData.append("ledger_id", ledger_id);
    transaction_ledger_details(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let { ledgerModalStateChange } = this.props;
          ledgerModalStateChange("ledgerData", res.result);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // handleSearch = (vi) => {
  //   let { res } = this.state;
  //   console.log({ res });
  //   let orgData_F = res.filter(
  //     (v) =>
  //     (v.fullName != null && v.fullName.toLowerCase().includes(vi.toLowerCase())) ||
  //     (  v.companyName != null && v.companyName.toLowerCase().includes(vi.toLowerCase())  ) ||
  //     ( v.mobileNumber != ""  &&  v.mobileNumber.toString().includes(vi.toString().toLowerCase()) ) ||
  //     (  v.email != null && v.email.toLowerCase().includes(vi.toLowerCase())) ||
  //     (  v.gender != null &&  v.gender.toLowerCase().includes(vi.toLowerCase())) ||
  //     (  v.username  != null && v.username.toLowerCase().includes(vi.toLowerCase()))

  //   );
  //   if (vi.length == 0) {
  //     this.setState({
  //       data: res,
  //     });
  //   } else {
  //     this.setState({
  //       data: orgData_F.length > 0 ? orgData_F : [],
  //     });
  //   }
  // };

  componentDidMount() {
    this.transaction_ledger_listFun();
  }

  setSelectedSupplierFun = (supplier_id = 0) => {
    let { ledgerList } = this.state;
    let {
      invoice_data,
      ledgerModalStateChange,
      salesmanLst,
      transactionType,
    } = this.props;
    if (ledgerList.length > 0) {
      let selectedLedger = ledgerList.find(
        (v) => parseInt(v.id) == parseInt(supplier_id)
      );
      if (selectedLedger != "") {
        //   console.log("invoice_data", invoice_data);
        let opt =
          selectedLedger && selectedLedger.gstDetails
            ? selectedLedger.gstDetails.map((vi) => {
                return { label: vi.gstNo, value: vi.id, ...vi };
              })
            : "";
        console.log("selectedLedger", selectedLedger);
        ledgerModalStateChange("lstGst", opt);
        let init_d = { ...invoice_data };
        init_d["supplierNameId"] =
          selectedLedger != "" ? selectedLedger.ledger_name : "";
        init_d["supplierCodeId"] =
          selectedLedger != "" ? selectedLedger.code : "";
        init_d["selectedSupplier"] = selectedLedger != "" ? selectedLedger : "";
        init_d["pendingOrder"] =
          selectedLedger.pending_orders != ""
            ? selectedLedger.pending_orders
            : "";
        init_d["pendingChallan"] =
          selectedLedger.pending_challans != ""
            ? selectedLedger.pending_challans
            : "";
        init_d["pendingQuotation"] =
          selectedLedger.pending_quotation != ""
            ? selectedLedger.pending_quotation
            : "";
        init_d["gstId"] =
          selectedLedger != ""
            ? getValue(opt, invoice_data.gstNo)
              ? getValue(opt, invoice_data.gstNo)
              : ""
            : "";

        if (transactionType === "sale_invoice") {
          init_d["salesmanId"] =
            selectedLedger != ""
              ? getSelectValue(salesmanLst, parseInt(selectedLedger.salesmanId))
              : "";
        }
        console.log("init_d", init_d);
        ledgerModalStateChange("invoice_data", init_d);
        ledgerModalStateChange("pendingOrder", init_d["pendingOrder"]);
        ledgerModalStateChange("pendingChallan", init_d["pendingChallan"]);
        ledgerModalStateChange("pendingQuotation", init_d["pendingQuotation"]);
        ledgerModalStateChange("isLedgerSelectSet", false);
        ledgerModalStateChange("ledgerModal", false);
        ledgerModalStateChange("selectedLedger", selectedLedger);
        ledgerModalStateChange("ledgerData", "");
        ledgerModalStateChange("gstId", init_d["gstId"]);
        this.transaction_ledger_listFun();
      }
    }
  };

  setLedgerIdFun = (ledgerId, setLedgerId) => {
    let { ledgerList } = this.state;
    let {
      invoice_data,
      ledgerModalStateChange,
      salesmanLst,
      transactionType,
    } = this.props;
    if (ledgerList.length > 0) {
      let selectedLedger = ledgerList.find(
        (v) => parseInt(v.id) == parseInt(ledgerId)
      );
      // console.log("selectedLedger", selectedLedger);
      if (selectedLedger && selectedLedger != "") {
        let opt =
          selectedLedger && selectedLedger.gstDetails
            ? selectedLedger.gstDetails.map((vi) => {
                return { label: vi.gstNo, value: vi.id, ...vi };
              })
            : [];
        // console.log("opt", opt);
        ledgerModalStateChange("lstGst", opt);
        let init_d = { ...invoice_data };
        init_d["supplierNameId"] =
          selectedLedger != "" ? selectedLedger.ledger_name : "";
        init_d["supplierCodeId"] =
          selectedLedger != "" ? selectedLedger.code : "";
        init_d["selectedSupplier"] = selectedLedger != "" ? selectedLedger : "";
        init_d["pendingOrder"] =
          selectedLedger.pending_orders != ""
            ? selectedLedger.pending_orders
            : "";
        init_d["pendingChallan"] =
          selectedLedger.pending_challans != ""
            ? selectedLedger.pending_challans
            : "";
        init_d["pendingQuotation"] =
          selectedLedger.pending_quotation != ""
            ? selectedLedger.pending_quotation
            : "";
        init_d["gstId"] =
          selectedLedger != "" ? (opt.length > 0 ? opt[0] : "") : "";
        if (transactionType === "sale_invoice") {
          init_d["salesmanId"] =
            selectedLedger != ""
              ? getSelectValue(salesmanLst, parseInt(selectedLedger.salesmanId))
              : "";
        }
        // console.log("init_d", init_d);
        ledgerModalStateChange("invoice_data", init_d);
        ledgerModalStateChange("isLedgerSelectSet", false);
        ledgerModalStateChange("setLedgerId", false);
        ledgerModalStateChange("selectedLedger", selectedLedger);
        ledgerModalStateChange("ledgerData", "");
        ledgerModalStateChange("gstId", init_d["gstId"]);
        ledgerModalStateChange("pendingOrder", init_d["pendingOrder"]);
        ledgerModalStateChange("pendingChallan", init_d["pendingChallan"]);
        ledgerModalStateChange("pendingQuotation", init_d["pendingQuotation"]);
        this.transaction_ledger_listFun();
      }
    }
  };

  componentWillReceiveProps(prev, next) {
    // console.log("prev => ", prev, "next => ", next);
    // console.log("this.props", this.props);
    let { selectedLedger, ledgerModal, ledgerData } = prev;
    // console.log("selectedLedger", selectedLedger);
    let { invoice_data, isLedgerSelectSet, ledgerId, setLedgerId } = this.props;
    if (isLedgerSelectSet) {
      this.setSelectedSupplierFun(invoice_data?.EditsupplierId);
    }
    if (
      ledgerModal == true &&
      selectedLedger &&
      selectedLedger != "" &&
      ledgerData == ""
    ) {
      this.transaction_ledger_detailsFun(selectedLedger.id);
    }
    if (ledgerId != "" && setLedgerId == true) {
      this.setLedgerIdFun(ledgerId, setLedgerId);
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

        ledgerModalStateChange({
          selectedLedger: val,
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

        ledgerModalStateChange({
          selectedLedger: val,
          add_button_flag: true,
        });
        this.transaction_ledger_detailsFun(val.id);
        // transaction_ledger_detailsFun(val.id);
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));

        let opt = selectedLedger.gstDetails.map((vi) => {
          return { label: vi.gstNo, value: vi.id, ...vi };
        });
        ledgerModalStateChange("lstGst", opt);
        let init_d = { ...invoice_data };
        init_d["supplierNameId"] =
          selectedLedger != "" ? selectedLedger.ledger_name : "";
        init_d["supplierCodeId"] =
          selectedLedger != "" ? selectedLedger.code : "";
        init_d["selectedSupplier"] = selectedLedger != "" ? selectedLedger : "";
        init_d["pendingOrder"] =
          selectedLedger.pending_orders != ""
            ? selectedLedger.pending_orders
            : "";
        init_d["pendingChallan"] =
          selectedLedger.pending_challans != ""
            ? selectedLedger.pending_challans
            : "";
        init_d["pendingQuotation"] =
          selectedLedger.pending_quotation != ""
            ? selectedLedger.pending_quotation
            : "";
        init_d["gstId"] =
          selectedLedger != ""
            ? getValue(opt, ledgerData.gst_number)
              ? getValue(opt, ledgerData.gst_number)
              : ""
            : "";
        if (transactionType === "sale") {
          init_d["salesman"] =
            selectedLedger != "" ? selectedLedger.sales_man : "";
        }
        ledgerModalStateChange("invoice_data", init_d);
        ledgerModalStateChange("ledgerModal", false);
        ledgerModalStateChange("selectedLedger", "");
        ledgerModalStateChange("ledgerData", "");
        ledgerModalStateChange("gstId", init_d["gstId"]);
        ledgerModalStateChange("pendingOrder", init_d["pendingOrder"]);
        ledgerModalStateChange("pendingChallan", init_d["pendingChallan"]);
        ledgerModalStateChange("pendingQuotation", init_d["pendingQuotation"]);
        if (
          transactionType == "debit_note" ||
          transactionType == "credit_note"
        ) {
          this.props.openInvoiceBillLst(selectedLedger.id);
        }
        this.transaction_ledger_listFun();
      }
      // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
    }
  }

  render() {
    let { ledgerList } = this.state;

    let {
      ledgerModal,
      ledgerData,
      selectedLedger,
      ledgerModalStateChange,
      invoice_data,
      transactionType,
      from_source,
      rows,
      transaction_ledger_detailsFun,
      salesmanLst,
      selectedAll,
    } = this.props;

    return (
      <div className="purchaseinvoice">
        <Modal
          show={ledgerModal}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="tnx-pur-inv-mdl-product"
          centered
          onHide={() => {
            ledgerModalStateChange("ledgerModal", false);
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
                ledgerModalStateChange("ledgerModal", false);
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
                      this.transaction_ledger_listFun(e.target.value);
                    }}
                  />
                  <InputGroup.Text className="int-grp" id="basic-addon1">
                    <img className="srch_box" src={search} alt="" />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col lg={2}>
                <Row>
                  <Col lg={3} className="my-auto">
                    <Form.Label>Filter</Form.Label>
                  </Col>
                  <Col lg={9}>
                    <Form.Group className="">
                      <Form.Select
                        className="selectTo"
                        styles={ledger_select}
                        onChange={this.handleLstChange}
                        value={selectedAll}
                        style={{ boxShadow: "none" }}
                      >
                        <option value="All" selected>
                          All
                        </option>
                        <option
                          value="Creditor"
                          // selected={
                          //   invoice_data.filterListSales == "SC" ? true : false
                          // }
                        >
                          Creditor
                        </option>
                        <option
                          value="Debitor"
                          // selected={
                          //   invoice_data.filterListSales == "SD" ? true : false
                          // }
                        >
                          Debitor
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col
                lg={{
                  span: 4,
                  // offset: 4
                }}
              >
                <Button
                  className="successbtn-style float-end"
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
                        // ledgerType: "sundry_creditors",
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
                          // ledgerType: "sundry_creditors",
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
                    <th style={{ width: "8%" }}>Code</th>
                    <th style={{ width: "35%" }}>Ledger Name</th>
                    <th style={{ width: "10%" }}>Ledger Group</th>
                    <th style={{ width: "12%" }}>Contact No.</th>
                    <th style={{ width: "15%" }}>Current Balance</th>
                    <th style={{ width: "10%" }}>Ledger Type</th>
                    <th style={{ width: "10%" }}>Actions</th>
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
                          JSON.stringify(v) == JSON.stringify(selectedLedger)
                            ? "selected-tr"
                            : ""
                        }`}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          if (selectedLedger != "") {
                            console.log(
                              "invoice_data----sss",
                              invoice_data,
                              salesmanLst
                            );
                            console.log(
                              "selectedLedger",
                              selectedLedger,
                              transactionType
                            );
                            let opt = selectedLedger.gstDetails.map((vi) => {
                              return { label: vi.gstNo, value: vi.id, ...vi };
                            });
                            ledgerModalStateChange("lstGst", opt);
                            let init_d = { ...invoice_data };
                            init_d["supplierNameId"] =
                              selectedLedger != ""
                                ? selectedLedger.ledger_name
                                : "";
                            init_d["supplierCodeId"] =
                              selectedLedger != "" ? selectedLedger.code : "";
                            init_d["selectedSupplier"] =
                              selectedLedger != "" ? selectedLedger : "";
                            init_d["pendingOrder"] =
                              selectedLedger.pending_orders != ""
                                ? selectedLedger.pending_orders
                                : "";
                            init_d["pendingChallan"] =
                              selectedLedger.pending_challans != ""
                                ? selectedLedger.pending_challans
                                : "";
                            init_d["pendingQuotation"] =
                              selectedLedger.pending_quotation != ""
                                ? selectedLedger.pending_quotation
                                : "";
                            init_d["gstId"] =
                              selectedLedger != ""
                                ? getValue(opt, ledgerData.gst_number)
                                  ? getValue(opt, ledgerData.gst_number)
                                  : ""
                                : "";
                            if (transactionType === "sale_invoice") {
                              init_d["salesmanId"] =
                                selectedLedger != ""
                                  ? getSelectValue(
                                      salesmanLst,
                                      parseInt(selectedLedger.salesmanId)
                                    )
                                  : "";
                            }
                            // console.log("init_d", init_d);
                            ledgerModalStateChange("invoice_data", init_d);
                            ledgerModalStateChange("ledgerModal", false);
                            ledgerModalStateChange("selectedLedger", "");
                            ledgerModalStateChange("ledgerData", "");
                            ledgerModalStateChange("gstId", init_d["gstId"]);
                            ledgerModalStateChange(
                              "pendingOrder",
                              init_d["pendingOrder"]
                            );
                            ledgerModalStateChange(
                              "pendingChallan",
                              init_d["pendingChallan"]
                            );
                            ledgerModalStateChange(
                              "pendingQuotation",
                              init_d["pendingQuotation"]
                            );
                            if (
                              transactionType == "debit_note" ||
                              transactionType == "credit_note"
                            ) {
                              this.props.openInvoiceBillLst(selectedLedger.id);
                            }
                            this.transaction_ledger_listFun();
                          }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          ledgerModalStateChange("selectedLedger", v);

                          this.transaction_ledger_detailsFun(v.id);
                        }}
                      >
                        <td className="ps-3">{v.code}</td>
                        <td className="ps-3">{v.ledger_name}</td>
                        <td className="ps-3">
                          {v.type === "SD"
                            ? "Debitor"
                            : v.type === "SC"
                            ? "Creditor"
                            : v.type}
                        </td>
                        <td className="ps-3">{v.contact_number}</td>
                        <td className="ps-3 text-end">
                          {/* {v.current_balance} */}
                          {INRformat.format(v.current_balance)}
                        </td>
                        <td className="ps-3">{v.balance_type}</td>
                        <td>
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
            <div className="ledger_details_style pb-2">
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
                            {ledgerData != "" ? ledgerData.gst_number : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Licence No.:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {ledgerData != "" ? ledgerData.license_number : ""}
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ width: "40%" }}>FSSAI:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {ledgerData != "" ? ledgerData.fssai_number : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Ledger Group:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {/* {ledgerData != "" ? ledgerData.fssai_number : ""} */}
                            {ledgerData != "" ? ledgerData.ledger_group : ""}
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
                            {ledgerData != "" ? ledgerData.contact_name : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Area:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {ledgerData != "" ? ledgerData.area : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Route:</td>
                        <td>
                          <p className="colored_sub_text mb-0">
                            {ledgerData != "" ? ledgerData.route : ""}
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
                            {ledgerData != "" ? ledgerData.credit_days : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Transport:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerData != "" ? ledgerData.route : ""}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "40%" }}>Bank:</td>
                        <td>
                          {" "}
                          <p className="colored_sub_text mb-0">
                            {" "}
                            {ledgerData != "" ? ledgerData.bank_name : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
