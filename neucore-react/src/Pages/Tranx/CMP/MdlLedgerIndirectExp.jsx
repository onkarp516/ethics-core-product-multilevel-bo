import React, { Component } from "react";
import ReactDOM from "react-dom"; //@mrunal On Escape key press and On outside Modal click Modal will Close
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
import Frame from "@/assets/images/Frame.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import search from "@/assets/images/search_icon@3x.png";
import add_icon from "@/assets/images/add_icon.svg";
import {
  transaction_ledger_list,
  getAdditionalLedgersIndirectExp,
  transaction_ledger_details,
  delete_ledger,
} from "@/services/api_functions";

import {
  getValue,
  isActionExist,
  eventBus,
  MyNotifications,
  getSelectValue,
  isUserControlExist,
  INRformat,
  OnlyEnterNumbers,
  AuthenticationCheck,
} from "@/helpers";

const data = [
  { no: "1", name: "Shreenivaas Narayan Nandal" },
  { no: "2", name: "Shrikant Gopal Ande" },
  { no: "3", name: "Ashwin Rajaram Shendre" },
  { no: "4", name: "Rohan Nandakumar Gurav" },
  { no: "5", name: "Dinesh Janardan Shripuram" },
  { no: "6", name: "LalitKumar Yeladi" },
  { no: "7", name: "Harish Gali" },
  { no: "8", name: "Rahul Sadanand Pola" },
  { no: "9", name: "Vaibhav Kamble" },
  { no: "10", name: "Akshay Salunke" },
];

export default class MdlLedgerIndirectExp extends Component {
  constructor(props) {
    super(props);
    this.customModalRef = React.createRef(); //mrunal @Ref is created & used at MDLLedger Component Below
    this.state = {
      code: false,
      cust_data: data,
      supplierNameLst: [],
      supplierCodeLst: [],
      ledgerList: [],
      orgLedgerList: [],
      idxAdditionCharges: -1,
      selectedLedger: "",
    };
  }

  transaction_ledger_listFun = (search = "") => {

    if (this.props.ledgerList == "show") {
      this.filterData()
    }

    let requestData = new FormData();
    requestData.append("search", search);
    transaction_ledger_list(requestData)
      // getAdditionalLedgersIndirectExp(requestData)
      .then((response) => {
        let res = response.data;
        console.log("res---->", res.list);
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

          codeopt = codeopt.filter((v) => v.unique_code != "SUCR" || v.unique_code != "SUDR");
          opt = opt.filter((v) => v.unique_code != "SUCR" || v.unique_code != "SUDR");
          this.setState({
            supplierNameLst: opt,
            supplierCodeLst: codeopt,

            ledgerList: opt,
            orgLedgerList: opt,
          },
            () => {
              // let { productModalStateChange } = this.props;
              // productModalStateChange({ productLst: res.list });
              setTimeout(() => {

                if (this.props.selectedProduct) {
                  if (document.getElementById("productTr_0") != null) {
                    document.getElementById("productTr_0")?.focus()
                  }
                } else {
                  if (document.getElementById("productTr_0") != null) {
                    document.getElementById("productTr_0")?.focus()
                  }
                }
              }, 1000);
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
    if (AuthenticationCheck()) {
      this.transaction_ledger_listFun();
      document.addEventListener("keydown", this.handleEscapeKey);
      document.addEventListener("mousedown", this.handleClickOutside); //@mrunal @On outside click modal will close
    }
  }


  //@mrunal @On outside Modal click Modal will Close
  handleClickOutside = (event) => {


    const modalNode = ReactDOM.findDOMNode(this.customModalRef.current);
    if (modalNode && !modalNode.contains(event.target)) {
      this.setState({ code: false });
    }

  };
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

  setIndirectEx = (key_set, invoice_data) => {
    let { ledgerList } = this.state;
    let { ledgerIndExpModalStateChange } = this.props;

    console.log("ledgerList", ledgerList);
    console.log("Key", { key_set, invoice_data, ledgerList });

    if (key_set == "ledgerModalIndExp1") {
      // let selectedLedgerIndExp = getSelectValue(ledgerList, invoice_data.additionalChgLedger1);
      let selectedLedgerIndExp = ledgerList.find(
        (v) => parseInt(v.id) == parseInt(invoice_data.additionalChgLedger1)
      );
      console.log("selectedLedgerIndExp", selectedLedgerIndExp?.ledger_name);
      if (selectedLedgerIndExp != "") {
        console.log("selectedLedgerIndExp----sss", selectedLedgerIndExp);
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
        init_d["additionalChgLedgerName1"] = selectedLedgerIndExp?.ledger_name;
        init_d["additionalChgLedger1"] = selectedLedgerIndExp?.id;

        // if (transactionType === "sale") {
        //   init_d["salesmanId"] =
        //     selectedLedgerIndExp != ""
        //       ? getValue(
        //         salesmanLst,
        //         parseInt(
        //           selectedLedgerIndExp.salesmanId
        //         )
        //       )
        //       : "";
        // }
        ledgerIndExpModalStateChange("invoice_data", init_d);
        if (init_d["additionalChgLedgerName1"] != "") {
          ledgerIndExpModalStateChange("isIndirectLedgerSelectSet", false);
        }

        // ledgerIndExpModalStateChange(
        //   "gstId",
        //   init_d["gstId"]
        // );
        // if (
        //   transactionType == "debit_note" ||
        //   transactionType == "credit_note"
        // ) {
        //   this.props.openInvoiceBillLst(
        //     selectedLedgerIndExp.id
        //   );
        // }
        // this.transaction_ledger_listFun();
      }
    } else if (key_set == "ledgerModalIndExp2") {
      // let selectedLedgerIndExp = getSelectValue(ledgerList, invoice_data.additionalChgLedger1);
      let selectedLedgerIndExp = ledgerList.find(
        (v) => parseInt(v.id) == parseInt(invoice_data.additionalChgLedger2)
      );
      console.log("selectedLedgerIndExp", selectedLedgerIndExp?.ledger_name);
      if (selectedLedgerIndExp != "") {
        console.log("selectedLedgerIndExp----sss", selectedLedgerIndExp);
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
        init_d["additionalChgLedgerName2"] = selectedLedgerIndExp?.ledger_name;
        init_d["additionalChgLedger2"] = selectedLedgerIndExp?.id;

        // if (transactionType === "sale") {
        //   init_d["salesmanId"] =
        //     selectedLedgerIndExp != ""
        //       ? getValue(
        //         salesmanLst,
        //         parseInt(
        //           selectedLedgerIndExp.salesmanId
        //         )
        //       )
        //       : "";
        // }
        ledgerIndExpModalStateChange("invoice_data", init_d);
        if (init_d["additionalChgLedgerName2"] != "") {
          ledgerIndExpModalStateChange("isIndirectLedgerSelectSet", false);
        }

        // ledgerIndExpModalStateChange(
        //   "gstId",
        //   init_d["gstId"]
        // );
        // if (
        //   transactionType == "debit_note" ||
        //   transactionType == "credit_note"
        // ) {
        //   this.props.openInvoiceBillLst(
        //     selectedLedgerIndExp.id
        //   );
        // }
        // this.transaction_ledger_listFun();
      }
    } else if (key_set == "ledgerModalIndExp3") {
      // let selectedLedgerIndExp = getSelectValue(ledgerList, invoice_data.additionalChgLedger1);
      let selectedLedgerIndExp = ledgerList.find(
        (v) => parseInt(v.id) == parseInt(invoice_data.additionalChgLedger3)
      );
      console.log("selectedLedgerIndExp", selectedLedgerIndExp?.ledger_name);
      if (selectedLedgerIndExp != "") {
        console.log("selectedLedgerIndExp----sss", selectedLedgerIndExp);
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
        init_d["additionalChgLedgerName3"] = selectedLedgerIndExp?.ledger_name;
        init_d["additionalChgLedger3"] = selectedLedgerIndExp?.id;

        // if (transactionType === "sale") {
        //   init_d["salesmanId"] =
        //     selectedLedgerIndExp != ""
        //       ? getValue(
        //         salesmanLst,
        //         parseInt(
        //           selectedLedgerIndExp.salesmanId
        //         )
        //       )
        //       : "";
        // }
        ledgerIndExpModalStateChange("invoice_data", init_d);
        if (init_d["additionalChgLedgerName3"] != "") {
          ledgerIndExpModalStateChange("isIndirectLedgerSelectSet", false);
        }

        // ledgerIndExpModalStateChange(
        //   "gstId",
        //   init_d["gstId"]
        // );
        // if (
        //   transactionType == "debit_note" ||
        //   transactionType == "credit_note"
        // ) {
        //   this.props.openInvoiceBillLst(
        //     selectedLedgerIndExp.id
        //   );
        // }
        // this.transaction_ledger_listFun();
      }
    } else {
    }
  };
  componentWillReceiveProps(prev, next) {
    // console.log("MdlledgerindirectEXP prev", prev);
    // console.log("MdlledgerindirectEXP next", next);
    // console.log("prev => ", prev, "next => ", next);
    // console.log("this.props", this.props);
    document.removeEventListener("keydown", this.handleEscapeKey);
    document.removeEventListener("mousedown", this.handleClickOutside); // @mrunal On outside Modal click Modal will Close
    let { selectedLedgerIndExp, ledgerModalIndExp, ledgerDataIndExp } = prev;
    let {
      invoice_data,
      isLedgerSelectSet,
      isIndirectLedgerSelectSet,
      key_set,
      isAdditionalCharges,
      additionalCharges
    } = this.props;
    if (isAdditionalCharges) {
      this.setAdditionalChargesFun(additionalCharges);
    }
    if (isLedgerSelectSet) {
      this.setSelectedSupplierFun(invoice_data?.EditsupplierId);
    }

    if (isIndirectLedgerSelectSet) {
      this.transaction_ledger_listFun();
      // this.setSelectedSupplierFun(invoice_data?.EditsupplierId);
      setTimeout(() => {
        this.setIndirectEx(key_set, invoice_data);
      }, 25);
    }
    if (
      ledgerModalIndExp == true &&
      selectedLedgerIndExp != "" &&
      ledgerDataIndExp == ""
    ) {
      this.transaction_ledger_detailsFun(selectedLedgerIndExp.id);

    }

    // if (ledgerModalIndExp == true && selectedLedgerIndExp == "") {
    //   setTimeout(() => {
    //     document.getElementById(`additional-ledgerId-0`)?.focus();
    //   }, 200);
    // }
  }

  setAdditionalChargesFun = (additionalCharges) => {
    let { ledgerList } = this.state;
    let { ledgerIndExpModalStateChange } = this.props;
    console.log("set--additionalCharges", additionalCharges, ledgerList);

    additionalCharges = additionalCharges.map((vi, ii) => {
      vi["additional_charges_details_id"] =
        vi.additional_charges_details_id;
      vi["orgLedgerId"] = vi.ledgerId;
      vi["ledgerId"] = vi.orgLedgerId && vi.orgLedgerId != "" ? getSelectValue(ledgerList, parseInt(vi.orgLedgerId)) : "";
      vi["amt"] = vi.amt;

      return vi;
    });
    let totalamt = 0;
    additionalCharges.map((v) => {
      if (v.amt != "") {
        totalamt += parseFloat(v.amt);
      }
    });
    ledgerIndExpModalStateChange("additionalCharges", additionalCharges);
    ledgerIndExpModalStateChange("additionalChargesTotal", totalamt);
    ledgerIndExpModalStateChange("isAdditionalCharges", false);



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
  // ! Key up-down focus to Table TR
  handleLedgerTableRow(event) {
    // debugger;
    console.log("handleLedgerTableRow", event)
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let {
      ledgerModalStateChange,
      transactionType,
      invoice_data,
      ledgerData,
      ledgerInputData,
      setledgerInputDataFun,
      tranxRef,
    } = this.props;
    const k = event.keyCode;
    if (k === 40) {
      //! condition for down key press
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
      //! condition for up key press
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
    } else if (k === 13) {
      let cuurentProduct = t;
      let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
      let { ledgerList, code, cust_data, idxAdditionCharges, } =
        this.state;
      const { handleAdditionalCharges } = this.props;
      if (selectedLedger != "") {
        handleAdditionalCharges(
          "ledgerId",
          idxAdditionCharges,
          selectedLedger
        );
        this.setState({
          code: false,
          idxAdditionCharges: -1,
        });
        document
          .getElementById(`additional-amt-${idxAdditionCharges}`)
          ?.focus();
        this.transaction_ledger_listFun();
      }
    } else if (k == 8) {
      //! condition for backspace key press 1409
      document.getElementById("ledgerId")?.focus();
    } else if (k == 37 || k == 39) {
      //! condition for left & right key press 1409
    }
  }
  filterData(value, index = -1) {
    let { orgLedgerList, ledgerList } = this.state;
    let filterData = orgLedgerList.filter(
      (v) => v.label.includes(value)
    );
    console.warn("filterData->>>>>>>", filterData);
    this.setState({
      code: value,
      cust_data: filterData,
      code_name: "",
      idxAdditionCharges: index,
    });
  }
  render() {
    let { ledgerList, code, cust_data, idxAdditionCharges, selectedLedger, productTrForm } =
      this.state;
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
      additionalCharges,
      handleAdditionalCharges,
      setAdditionalCharges,
      handleAdditionalChargesHide,
      handleAddAdditionalCharges,
      handleRemoveAddtionalChargesRow,
      ledgerModalStateChange, handleAddRow, productModalStateChange
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
              Additional Charges
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
            {/* <pre>
              {JSON.stringify(this.props.additionalCharges, undefined, 2)}
            </pre> */}

            <div className="tnx-pur-inv-ModalStyle">
              {additionalCharges && additionalCharges.length > 0 && (
                <>
                  <Table className="mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>#</th>
                        <th>Particular</th>
                        <th style={{ width: "15%" }}>Amt</th>
                        <th style={{ width: "10%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <pre>{JSON.stringify(additionalCharges, undefined, 2)}</pre> */}
                      {additionalCharges.map((v, i) => {
                        return (
                          <tr>
                            <td className="text-center p-0">{i + 1}</td>

                            <td className="p-0">
                              {/* <pre>{JSON.stringify(setAdditionalCharges("ledgerId", i), undefined, 2)}</pre> */}
                              <Form.Control
                                type="text"
                                id={`additional-ledgerId-${i}`}
                                name={`additional-ledgerId-${i}`}
                                onChange={(e) => {
                                  e.preventDefault();
                                  this.filterData(e.target.value.toLocaleLowerCase(), i);
                                }}
                                // autoFocus="true"
                                autoComplete="off"
                                // onChange={(value) => {
                                //   this.handleAdditionalCharges(
                                //     "ledgerId",
                                //     i,
                                //     value
                                //   );
                                // }}
                                onKeyDown={(e) => {
                                  if (e.key == "Tab") {
                                    setTimeout(() => {
                                      document.getElementById("addtionalAdd")?.focus();
                                    }, 500)
                                  }
                                  else if (e.keyCode == 40) {
                                    //! this condition for down button press 1409
                                    if (code === true) {
                                      document
                                        .getElementById("additional_0")
                                        ?.focus();
                                    }
                                  }
                                  else if (e.keyCode === 13) {
                                    e.preventDefault();
                                    this.setState({ ledgerModalIndExp: false }, () => {
                                      document
                                        .getElementById(`additional-amt-${idxAdditionCharges}`)
                                        ?.focus();
                                    })
                                    this.filterData(e.target.value.toLocaleLowerCase(), i)
                                  }

                                }}
                                value={
                                  setAdditionalCharges("ledgerId", i)
                                    ? setAdditionalCharges("ledgerId", i)["ledger_name"] : ""
                                }
                                // value={values.particulars}

                                className="tnx-pur-inv-prod-style text-start table-text-box"
                                placeholder="Particulars"
                              />
                            </td>
                            <td className="p-0" style={{ background: "#D2F6E9" }}>
                              <Form.Control
                                className=" table-text-box border-0"
                                type="text"
                                placeholder="Enter Amount"
                                id={`additional-amt-${i}`}
                                name={`additional-amt-${i}`}
                                autoComplete="nope"
                                onChange={(value) => {
                                  handleAdditionalCharges(
                                    "amt",
                                    i,
                                    value.target.value
                                  );
                                }}
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                value={setAdditionalCharges("amt", i)}
                                onKeyDown={(e) => {
                                  if (e.key == "Tab") {
                                    setTimeout(() => {
                                      document.getElementById("delete-charges")?.focus();
                                    }, 500)
                                  }
                                  else if (e.keyCode === 13) {
                                    if (i != 0)
                                      setTimeout(() => {
                                        document.getElementById("delete_btn_add_ch")?.focus();
                                      }, 500)
                                    else {
                                      document.getElementById("addBtn_char")?.focus();
                                    }
                                  }
                                }}
                              />
                            </td>
                            <td className="text-center p-0">
                              {/* {JSON.stringify(v)} */}
                              {i != 0 && 
                              <Button className="btn_img_style"
                                  id="delete_btn_add_ch"
                                onKeyDown={(e) => {
                                  if (e.key == "Tab") {
                                    setTimeout(() => {
                                      document.getElementById("addbtn-charges")?.focus();
                                    }, 500)
                                  } else if (e.keyCode === 32) {
                                    handleRemoveAddtionalChargesRow(i);
                                  } else if (e.keyCode === 13) {
                                    document.getElementById("addBtn_char").focus();
                                  }
                                }} >
                                  <img
                                    src={TableDelete}

                                    alt=""
                                  className="btnimg"
                                  id="delete-charges"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      console.log("delete");
                                      handleRemoveAddtionalChargesRow(i);
                                    }}
                                  // onKeyDown={(e) => {
                                  //   if (e.key == "Tab") {
                                  //     setTimeout(() => {
                                  //       document.getElementById("addbtn-charges")?.focus();
                                  //     }, 500)
                                  //   } else if (e.keyCode === 13) {
                                  //     handleRemoveAddtionalChargesRow(i);
                                  //   }
                                  // }}
                                  />
                                </Button>}

                              <Button className="btn_img_style"
                                id="addBtn_char"
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                  if (e.keyCode === 32) {
                                    e.preventDefault();
                                    // handleAddRow();
                                    // productModalStateChange({
                                    //   add_button_flag: true,
                                    // });
                                    handleAddAdditionalCharges();
                                  } else if (e.keyCode === 9) {
                                    // this.focusNextElement(
                                    //   productTrForm,
                                    //   e.target
                                    // );
                                    document.getElementById("submitbt").focus();
                                  }
                                }}>
                                <img
                                  src={add_icon}
                                  alt=""
                                  id="addbtn-charges"
                                  className="btnimg"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log("add");
                                    handleAddAdditionalCharges();
                                  }}

                                />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </>
              )}
            </div>
            {code ? (
              <div
                className="additional-charges-tbl"
                onMouseLeave={(e) => {
                  e.preventDefault();
                  this.setState({ code: false });
                }}

              >
                <Row className="justify-content-end">

                  <div className="px-0 additional-charges"
                  // style={{
                  //   height: "37vh",
                  //   borderRadius: "4px",
                  //   boxShadow: "none",
                  //   width: "75.3%",
                  //   marginTop: "-76px",
                  //   position: "absolute",
                  //   background: "#fff",
                  //   zIndex: "999",
                  // }}
                  >
                    <Table className="">
                      <thead>
                        <tr style={{ borderBottom: "2px solid transparent" }}>
                          <th style={{ width: "8%", verticalAlign: "middle" }}>Code</th>
                          <th style={{ width: "35%" }}>
                            <Row>
                              <Col lg={6} className="text-start my-auto">
                                Ledger Name
                              </Col>
                              <Col lg={6} className="text-end">
                                <Button
                                  id="addtionalAdd"
                                  className="successbtn-style"
                                  style={{
                                    width: "fit-content !important",
                                  }}
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
                                        additionalCharges: additionalCharges,
                                        invoice_data: invoice_data,
                                        from_page: from_source,
                                        ledgerModalIndExp: ledgerModalIndExp,
                                        ledgerList: "show",
                                        ledgerModalIndExp1: ledgerModalIndExp1,
                                        ledgerModalIndExp2: ledgerModalIndExp2,
                                        // ledgerType: "sundry_creditors",
                                        ledgerId: 1,
                                        // sourceUnder: sourceUnder,
                                        opType: "create",
                                      };
                                      eventBus.dispatch("page_change", {
                                        from: from_source,
                                        to: "ledgercreate",
                                        prop_data: { prop_data: data },

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
                                          additionalCharges: additionalCharges,
                                          invoice_data: invoice_data,
                                          from_page: from_source,
                                          // ledgerType: "sundry_creditors",
                                          ledgerId: 1,
                                        };
                                        eventBus.dispatch("page_change", {
                                          from: from_source,
                                          to: "ledgercreate",
                                          prop_data: { prop_data: data },

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
                          </th>
                          <th style={{ width: "10%", verticalAlign: "middle" }}>Ledger Group</th>
                          <th style={{ width: "12%", verticalAlign: "middle" }}>Contact No.</th>
                          <th style={{ width: "15%", verticalAlign: "middle" }}>Current Balance</th>
                          <th style={{ width: "2%", verticalAlign: "middle" }}>Type</th>
                          <th style={{ width: "10%", verticalAlign: "middle" }}>Actions</th>
                        </tr>
                      </thead>

                      <tbody
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (e.keyCode != 9) {
                            this.handleLedgerTableRow(e);
                          }
                        }}
                      >
                        {ledgerList.map((v, i) => {
                          return (
                            <tr
                              value={JSON.stringify(v)}
                              // id={`additional_` + i}
                              id={`additional_${i}`}

                              prId={v.id}
                              tabIndex={i}
                              // className={`${JSON.stringify(v) ==
                              //   JSON.stringify(selectedLedger)
                              //   ? "selected-tr"
                              //   : ""
                              //   }`}
                              onDoubleClick={(e) => {
                                e.preventDefault();
                                if (selectedLedger != "") {
                                  handleAdditionalCharges(
                                    "ledgerId",
                                    idxAdditionCharges,
                                    selectedLedger
                                  );
                                  this.setState({
                                    code: false,
                                    idxAdditionCharges: -1,
                                  });
                                  this.transaction_ledger_listFun();
                                }
                                document
                                  .getElementById(`additional-amt-${idxAdditionCharges}`)
                                  ?.focus();
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ selectedLedger: v });
                                ledgerModalStateChange("selectedLedger", v);
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
                                {INRformat.format(v.current_balance)}
                              </td>
                              <td className="ps-3">{v.balance_type}</td>
                              <td>
                                <img
                                  style={{ height: "inherit" }}
                                  src={Frame}
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
                                        additionalCharges: additionalCharges,
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
                                        prop_data: { prop_data: data },

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
                                  style={{ height: "inherit" }}
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
                                          handleFailFn: () => { },
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

                </Row>
              </div>
            ) : (
              ""
            )}

            {/* <div className="tnx-pur-inv-ModalStyle">
              <Table className="">
                <thead>
                  <tr>
                    <th style={{ width: "3%" }}>#</th>
                    <th className="text-start">Particular</th>
                    <th style={{ width: "10%", textAlign: "end" }}>
                      Add.Charges
                    </th>
                    <th style={{ width: "10%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center p-0">1</td>
                    <td className="text-center p-0">
                      <Form.Control
                        type="text"
                        id="particulars"
                        name="particulars"
                        onChange={(e) => {
                          e.preventDefault();
                          this.filterData(e.target.value);
                        }}
                        // value={values.particulars}

                        className="tnx-pur-inv-prod-style text-start table-text-box"
                        placeholder="Particulars"
                      />
                    </td>

                    <td
                      className="text-end p-0"
                      style={{ backgroundColor: "rgb(210, 246, 233)" }}
                    >
                      <Form.Control
                        className=" table-text-box border-0"
                        type="text"
                        placeholder="Enter"
                      />
                    </td>
                    <td className="text-center p-0">
                      <img
                        src={TableDelete}
                        alt=""
                        className="mdl-icons"
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //       if (
                        //         isActionExist(
                        //           "ledger",
                        //           "delete",
                        //           this.props.userPermissions
                        //         )
                        //       ) {
                        //         MyNotifications.fire(
                        //           {
                        //             show: true,
                        //             icon: "confirm",
                        //             title: "Confirm",
                        //             msg: "Do you want to Delete",
                        //             is_button_show: false,
                        //             is_timeout: false,
                        //             delay: 0,
                        //             handleSuccessFn: () => {
                        //               this.deleteledgerFun(v.id);
                        //             },
                        //             handleFailFn: () => { },
                        //           },
                        //           () => {
                        //             console.warn("return_data");
                        //           }
                        //         );
                        //       } else {
                        //         MyNotifications.fire({
                        //           show: true,
                        //           icon: "error",
                        //           title: "Error",
                        //           msg: "Permission is denied!",
                        //           is_button_show: true,
                        //         });
                        //       }
                        //     }}
                      />
                      <img
                        src={add_icon}
                        alt=""
                        className="mdl-icons"
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   if (
                        //     isActionExist(
                        //       "ledger",
                        //       "edit",
                        //       this.props.userPermissions
                        //     )
                        //   ) {
                        //     let source = {
                        //       rows: rows,
                              // additionalCharges: additionalCharges,
                        //       invoice_data: invoice_data,
                        //       from_page: from_source,
                        //     };

                        //     let data = {
                        //       source: source,
                        //       id: v.id,
                        //     };
                        //     //console.log({ data });
                        //     eventBus.dispatch("page_change", {
                        //       from: from_source,
                        //       to: "ledgeredit",
                        //                                           prop_data: { prop_data: data },

                        //       isNewTab: false,
                        //     });
                        //   } else {
                        //     MyNotifications.fire({
                        //       show: true,
                        //       icon: "error",
                        //       title: "Error",
                        //       msg: "Permission is denied!",
                        //       is_button_show: true,
                        //     });
                        //   }
                        // }}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>

              
            </div> */}
          </Modal.Body>
          <Modal.Footer style={{ borderTop: "0px solid transparent" }}>
            <Button
              className="successbtn-style"
              style={{ width: "fit-content !important" }}
              id="submitbt"
              onClick={(e) => {
                e.preventDefault();
                this.setState(
                  {
                    code: false,
                    selectedLedger: "",
                    idxAdditionCharges: -1,
                  },
                  () => {
                    handleAdditionalChargesHide();
                  }
                );
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
