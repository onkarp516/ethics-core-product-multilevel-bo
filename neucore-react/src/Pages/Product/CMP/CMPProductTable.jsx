import React, { Component } from "react";
import { connect } from "react-redux";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";
import add_icon from "@/assets/images/add_icon.svg";

import {
  AuthenticationCheck,
  MyDatePicker,
  MyTextDatePicker,
  customStylesWhite,
  eventBus,
  getSelectValue,
  MyNotifications,
  getValue,
  createPro,
  productDropdown,
  AlphabetwithSpecialChars,
  isUserControl,
  getUserControlData,
  getUserControlLevel,
  isMultiRateExist,
  OnlyEnterNumbers,
  OnlyEnterAmount,
  newRowDropdownUnit,
  DropdownIndicator,
  IndicatorSeparator,
  ControlComponent,
  ClearIndicator,
  CustomOption,
  CustomInput,
  CustomSelectInput,
  level_C_DD,
  level_B_DD,
  level_A_DD,
  Menu,
  allEqual,
  handlesetFieldValue,
  handleDataCapitalised
} from "@/helpers";

import {
  get_outlet_levelA,
  get_outlet_levelB,
  get_outlet_levelC,
  getAllUnit,
  createUnit,
  updateUnit,
  get_units,
  create_levelA,
  update_levelA,
  get_levelA_by_id,
  create_levelB,
  update_levelB,
  get_levelB_by_id,
  create_levelC,
  update_levelC,
  get_levelC_by_id,
} from "@/services/api_functions";

import Select from "react-select";
import {
  Button,
  Col,
  Row,
  Form,
  Modal,
  Table,
  CloseButton,
} from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const uomoption = [
  { label: "BAG-Bag", value: "Services" },
  { label: "BAL-Bale", value: "BAL" },
  { label: "BDL-Bundles", value: "BDL" },
  { label: "BKL-Buckles", value: "BKL" },
  { label: "BOU-Billions Of Units", value: "BOU" },
  { label: "BOX-Box", value: "BOX" },
  { label: "BTL-Bottles", value: "BTL" },
  { label: "BUN-Bunches", value: "BUN" },
  { label: "CAN-Cans", value: "CAN" },
  { label: "CBM-Cubic Meter", value: "CBM" },
  { label: "CCM-Cubic Centimeter", value: "CCM" },
  { label: "CMS-Centimeter", value: "CMS" },
  { label: "CTN-Cartons", value: "CTN" },
  { label: "DOZ-Dozen", value: "DOZ" },
  { label: "DRM-Drum", value: "DRM" },
  { label: "GGR-Great Gross", value: "GGR" },
  { label: "GMS-Grams", value: "GMS" },
  { label: "GRS-Gross", value: "GRS" },
  { label: "GYD-Gross Yard", value: "GYD" },
  { label: "KGS-Kilograms", value: "KGS" },
  { label: "KLR-Kilo Liter", value: "KLR" },
  { label: "KME-Kilo Meter", value: "KME" },
  { label: "MLT-Milliliter", value: "MLT" },
  { label: "MTR-Meters", value: "MTR" },
  { label: "MTS-Metric Tons", value: "MTS" },
  { label: "NOS-Numbers", value: "NOS" },
  { label: "PAC-Packs", value: "PAC" },
  { label: "PCS-Pieces", value: "PCS" },
  { label: "PRS-Pairs", value: "PRS" },
  { label: "QTL-Quintal", value: "QTL" },
  { label: "ROL-Rolls", value: "ROL" },
  { label: "SET-Sets", value: "SET" },
  { label: "SQF-Square Feet", value: "SQF" },
  { label: "SQM-Square Meters", value: "SQM" },
  { label: "TBS-Tablets", value: "TBS" },
  { label: "TGM-Ten Gross", value: "TGM" },
  { label: "THD-Thousands", value: "THD" },
  { label: "TON-Tonnes", value: "TON" },
  { label: "TUB-Tubes", value: "TUB" },
  { label: "UGS-US Gallons", value: "UGS" },
  { label: "UNT-Units", value: "UNT" },
  { label: "SQY-Square Yards	", value: "SQY" },
  { label: "GYD-Gross Yards", value: "GYD" },
  { label: "YDS-Yards", value: "YDS" },
  { label: "OTH-Others", value: "OTH" },
];

class CMPProductTable extends Component {
  constructor(props) {
    super(props);
    this.openingBatchRef = React.createRef();
    this.LevelAMdlRef = React.createRef();
    this.LevelBMdlRef = React.createRef();
    this.LevelCMdlRef = React.createRef();
    this.UnitMdlRef = React.createRef();
    this.purRateRef = React.createRef();
    // this.LevelA_0 = React.createRef();
    this.state = {
      ABC_flag_value: "",
      levelA: "",
      levelB: "",
      levelC: "",
      levelAOpt: [],
      levelBOpt: [],
      levelCOpt: [],
      unitOpts: [],
      curr_index: 0,
      batchInitVal: {
        id: 0,
        b_no: "",
        opening_qty: 0,
        b_free_qty: "",
        b_mrp: 0,
        b_sale_rate: 0,
        b_purchase_rate: 0,
        b_costing: 0,
        b_expiry: "",
        b_manufacturing_date: "",
        isOpeningbatch: false,
        isUpdate: false,
      },

      rowIndex: "no",
      unitIndex: -1,
      index: -1,
      levelAindex: -1,
      levelBindex: -1,
      levelCindex: -1,
      batchList: [],
      unitInitVal: {
        id: "",
        unitName: "",
        unitCode: "",
        uom: "",
      },
      levelA: "",
      levelB: "",
      levelC: "",
      unitList: [],
      unitModalShow: false,
      selectedUnits: [],

      levelAInitVal: {
        id: "",
        levelName: "",
      },
      levelAList: [],
      levelAModalShow: false,
      selectedLevelA: [],

      levelBInitVal: {
        id: "",
        levelName: "",
      },
      levelBList: [],
      levelBModalShow: false,
      selectedLevelB: [],

      levelCInitVal: {
        id: "",
        levelName: "",
      },
      levelCList: [],
      levelCModalShow: false,
      selectedLevelC: [],
      errorArrayBorder: "",
      errorArrayBorderUnit: "",
      errorArrayBorderLevelA: "",
      errorArrayBorderLevelB: "",
      errorArrayBorderLevelC: "",

      currentId: "",
      currentIdA: "",
      currentIdB: "",
      currentIdC: "",
      mrp_val: "",

      productArrayList: [],
    };

    // for (let i = 0; i <= this.state.productArrayList.length; i++) {
    //   this["LevelA_" + i] = React.createRef();
    //   this["LevelB_" + i] = React.createRef();
    //   this["LevelC_" + i] = React.createRef();
    //   this["unit_" + i] = React.createRef();
    // }
  }

  // Purchase RateValidation for non-Batch products
  validatePurchaseRate1 = (mrp = 0, p_rate = 0) => {
    // console.log("MRP =", parseFloat(mrp));
    // console.log("Purchase rate ::", parseFloat(p_rate));
    // console.log("mrp_val", this.state.mrp_val);

    if (parseFloat(mrp) <= parseFloat(p_rate) === true) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Purchase rate should less than MRP",
        is_timeout: true,
        delay: 1500,
        // is_button_show: true,
      });
      // setFieldValue(`reference`, p_rate);
      setTimeout(() => {
        this.purRateRef.current.focus();
        // document.getElementById("purRateRef").focus();
      }, 1000);
    }
  };

  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
    // console.log("getUserControlLevelFromRedux : ", level);
    this.setState({ ABC_flag_value: level });
    if (level == "A") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
    } else if (level == "AB") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelA: l_A, levelB: l_B });
    } else if (level == "ABC") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      const l_C = getUserControlData("is_level_c", this.props.userControl);
      this.setState({ levelA: l_A, levelB: l_B, levelC: l_C });
    }
  };

  getLevelALst = (id = false) => {
    get_outlet_levelA()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opts = [];

          if (res.responseObject.length > 0) {
            opts = res.responseObject.map((v) => {
              return { label: v.levelName, value: v.id };
            });

            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: "0", label: "Add New" });
            this.setState({ levelAOpt: opts }, () => {
              if (id && this.state.levelAindex != -1) {
                this.setElementValue(
                  "selectedLevelA",
                  opts[opts.length - 1],
                  this.state.levelAindex
                );
              }
            });
            // this.setState({ levelAOpt: opts });
          } else {
            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: "0", label: "Add New" });

            this.setState({ levelAOpt: opts });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        // this.setState({ levelAOpt: [] });
      });
  };

  getLevelBLst = (id = false) => {
    get_outlet_levelB()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opts = [];
          if (res.responseObject.length > 0) {
            opts = res.responseObject.map((v) => {
              return { label: v.levelName, value: v.id };
            });

            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: "0", label: "Add New" });

            // this.setState({ levelBOpt: opts });
            this.setState({ levelBOpt: opts }, () => {
              if (id && this.state.levelBindex != -1) {
                this.setElementValue(
                  "selectedLevelB",
                  opts[opts.length - 1],
                  this.state.levelBindex
                );
              }
            });
          } else {
            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: "0", label: "Add New" });

            this.setState({ levelBOpt: opts });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ levelBOpt: [] });
      });
  };

  getLevelCLst = (id = false) => {
    get_outlet_levelC()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let opts = [];
          if (res.responseObject.length > 0) {
            opts = res.responseObject.map((v) => {
              return { label: v.levelName, value: v.id };
            });

            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: "0", label: "Add New" });

            this.setState({ levelCOpt: opts }, () => {
              if (id && this.state.levelCindex != -1) {
                this.setElementValue(
                  "selectedLevelC",
                  opts[opts.length - 1],
                  this.state.levelCindex
                );
              }
            });
          } else {
            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: "0", label: "Add New" });

            this.setState({ levelCOpt: opts });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({ levelCOpt: [] });
      });
  };

  lstUnit = (id = false) => {
    getAllUnit()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          let Opt = [];
          if (data.length > 0) {
            Opt = data.map(function (values) {
              return { value: values.id, label: values.unitName };
              // return { value: values.id, label: values.unitCode };
            });

            if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
            else Opt.unshift({ value: "0", label: "Add New" });
            // console.log("id unitIndex", id, this.state.unitIndex);
            this.setState({ unitOpts: Opt }, () => {
              if (id && this.state.unitIndex != -1) {
                this.setElementValue(
                  "selectedUnit",
                  Opt[Opt.length - 1],
                  this.state.unitIndex
                );
              }
            });
          } else {
            if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
            else Opt.unshift({ value: "0", label: "Add New" });
            this.setState({ unitOpts: Opt });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  setProductRows = () => {
    let { productrows, productSetChange } = this.props;

    let { levelAOpt, levelBOpt, levelCOpt, unitOpts } = this.state;
    let error = false;

    this.setState({ productArrayList: productrows });
    let FproductRow = productrows.map((v, i) => {
      if (
        v["orgselectedLevelA"] &&
        v["orgselectedLevelA"] != "" &&
        levelAOpt.length > 0
      ) {
        v["selectedLevelA"] = v.orgselectedLevelA
          ? getSelectValue(levelAOpt, parseInt(v.orgselectedLevelA))
          : "";
      }
      if (
        !isNaN(parseInt(v["orgselectedLevelA"])) &&
        parseInt(v["orgselectedLevelA"]) > 0 &&
        v["selectedLevelA"] == ""
      ) {
        error = true;
      }
      if (
        v["orgselectedLevelB"] &&
        v["orgselectedLevelB"] != "" &&
        levelBOpt.length > 0
      ) {
        v["selectedLevelB"] = v.orgselectedLevelB
          ? getSelectValue(levelBOpt, parseInt(v.orgselectedLevelB))
          : "";
      }
      if (
        !isNaN(parseInt(v["orgselectedLevelB"])) &&
        parseInt(v["orgselectedLevelB"]) > 0 &&
        v["selectedLevelB"] == ""
      ) {
        error = true;
      }
      if (
        v["orgselectedLevelC"] &&
        v["orgselectedLevelC"] != "" &&
        levelCOpt.length > 0
      ) {
        v["selectedLevelC"] = v.orgselectedLevelC
          ? getSelectValue(levelCOpt, parseInt(v.orgselectedLevelC))
          : "";
      }
      if (
        !isNaN(parseInt(v["orgselectedLevelC"])) &&
        parseInt(v["orgselectedLevelC"]) > 0 &&
        v["selectedLevelC"] == ""
      ) {
        error = true;
      }

      if (
        v["orgselectedUnit"] &&
        v["orgselectedUnit"] != "" &&
        unitOpts.length > 0
      ) {
        v["selectedUnit"] = v.orgselectedUnit
          ? getSelectValue(unitOpts, parseInt(v.orgselectedUnit))
          : "";
      }
      if (
        !isNaN(parseInt(v["orgselectedUnit"])) &&
        parseInt(v["orgselectedUnit"]) > 0 &&
        v["selectedUnit"] == ""
      ) {
        error = true;
      }

      return v;
    });
    // console.log("error", error);
    // console.log("FproductRow", FproductRow);
    if (error == false) {
      productSetChange({
        setRowData: false,
        isEditDataSet: true,
        productrows: FproductRow,
      });
    } else {
      productSetChange({ productrows: FproductRow });
    }
  };
  componentDidMount() {
    if (AuthenticationCheck()) {
      this.getUserControlLevelFromRedux();
      this.getLevelALst();
      this.getLevelBLst();
      this.getLevelCLst();
      this.lstUnit();
    }
    let { setRowData } = this.props;
    if (setRowData) {
      this.setProductRows();
    }
  }

  componentWillReceiveProps(props, next) {
    // console.log("CMP product Table props", props, next);
    // console.log("CMP product Table ", props);
    let { setRowData } = this.props;
    if (setRowData) {
      // console.log("CMP product Table CMPRECEIVEPROPS", this.props);
      this.setProductRows();
    }

    if (props.enterKeyPress) this.focusNextElement(props.enterKeyPress);
  }

  focusNextElement(e, nextIndex = null) {
    var form = e.target.form;
    var cur_index =
      nextIndex != null
        ? nextIndex
        : Array.prototype.indexOf.call(form, e.target);
    let ind = cur_index + 1;
    for (let index = ind; index <= form.elements.length; index++) {
      if (form.elements[index]) {
        if (
          !form.elements[index].readOnly &&
          !form.elements[index].disabled &&
          form.elements[index].id != ""
        ) {
          form.elements[index].focus();
          break;
        } else {
          this.focusNextElement(e, index);
        }
      } else {
        this.focusNextElement(e, index);
      }
    }
  }

  setElementValue = (ele, val, idx) => {
    let { productrows, productSetChange } = this.props;
    productrows[idx][ele] = val;
    productSetChange({ productrows: productrows });
  };

  getElementValue = (ele, idx) => {
    let { productrows } = this.props;
    return productrows[idx][ele] ? productrows[idx][ele] : "";
  };

  AddUnitRow = (idx) => {
    let { productrows, productSetChange } = this.props;
    let { curr_index } = this.state;
    let currRow = productrows[idx];
    if (curr_index == idx) {
      let v = {
        current_index: parseInt(idx) + 1,
        index_A: parseInt(idx),
        index_B: parseInt(idx),
        index_C: parseInt(idx),
        index_Unit: parseInt(idx) + 1,
        selectedLevelA: currRow["selectedLevelA"],
        selectedLevelB: currRow["selectedLevelB"],
        selectedLevelC: currRow["selectedLevelC"],
        selectedUnit: "",
        conv: 0,
        max_qty: 0,
        min_qty: 0,
        mrp: 0,
        pur_rate: 0,
        rate_1: 0,
        rate_2: 0,
        rate_3: 0,
        cost: 0,
        opn_stock: 0,
        is_negetive: false,
        batchList: [],
      };
      productrows = [...productrows, v];
    } else {
      let pervArr = productrows.slice(0, idx + 1);
      let nextArr = productrows.slice(idx + 1);
      let pervRow = productrows[idx - 1];
      // let nextRow = productrows[idx + 1];
      if (currRow["current_index"] == 0) {
        let newObj = {
          current_index: parseInt(idx) + 1,
          index_A: parseInt(idx),
          index_B: parseInt(idx),
          index_C: parseInt(idx),
          index_Unit: parseInt(idx) + 1,
          selectedLevelA: currRow["selectedLevelA"],
          selectedLevelB: currRow["selectedLevelB"],
          selectedLevelC: currRow["selectedLevelC"],
          selectedUnit: "",
          conv: 0,
          max_qty: 0,
          min_qty: 0,
          mrp: 0,
          pur_rate: 0,
          rate_1: 0,
          rate_2: 0,
          rate_3: 0,
          cost: 0,
          opn_stock: 0,
          is_negetive: false,
          batchList: [],
        };
        let lstIdx = parseInt(idx) + 1;

        let nextArrAdj = nextArr.map((v, i) => {
          return {
            ...v,
            index_Unit: lstIdx + 1 + i,
            current_index: lstIdx + 1 + i,
          };
        });
        productrows = [...pervArr, newObj, ...nextArrAdj];
      } else {
        let newObj = {
          current_index: parseInt(idx) + 1,
          index_A: parseInt(idx),
          index_B: parseInt(idx),
          index_C: parseInt(idx),
          index_Unit: parseInt(idx) + 1,
          selectedLevelA: pervRow["selectedLevelA"],
          selectedLevelB: pervRow["selectedLevelB"],
          selectedLevelC: pervRow["selectedLevelC"],
          selectedUnit: "",
          conv: 0,
          max_qty: 0,
          min_qty: 0,
          mrp: 0,
          pur_rate: 0,
          rate_1: 0,
          rate_2: 0,
          rate_3: 0,
          cost: 0,
          opn_stock: 0,
          is_negetive: false,
          batchList: [],
        };
        let lstIdx = parseInt(idx) + 1;

        let nextArrAdj = nextArr.map((v, i) => {
          return {
            ...v,
            index_Unit: lstIdx + 1 + i,
            current_index: lstIdx + 1 + i,
          };
        });
        productrows = [...pervArr, newObj, ...nextArrAdj];
      }
      // console.log("pervArr", { pervArr, nextArr, pervRow, currRow, nextRow });
    }
    // console.log("productrows", productrows);
    // console.log("productrows.length - 1", productrows.length - 1);
    this.setState({ curr_index: productrows.length - 1 }, () => {
      productSetChange({ productrows: productrows });
    });
  };

  AddLevelCRow = (idx) => {
    let { productrows, productSetChange } = this.props;
    let { curr_index } = this.state;
    let currRow = productrows[idx];
    if (curr_index == idx) {
      let v = {
        current_index: parseInt(idx) + 1,
        index_A: parseInt(idx),
        index_B: parseInt(idx),
        index_C: parseInt(idx) + 1,
        index_Unit: parseInt(idx) + 1,
        selectedLevelA: currRow["selectedLevelA"],
        selectedLevelB: currRow["selectedLevelB"],
        selectedLevelC: "",
        selectedUnit: "",
        conv: 0,
        max_qty: 0,
        min_qty: 0,
        mrp: 0,
        pur_rate: 0,
        rate_1: 0,
        rate_2: 0,
        rate_3: 0,
        cost: 0,
        opn_stock: 0,
        is_negetive: false,
        batchList: [],
      };
      productrows = [...productrows, v];
    } else {
      let pervArr = productrows.slice(0, idx + 1);
      let nextArr = productrows.slice(idx + 1);
      let pervRow = productrows[idx - 1];
      // let nextRow = productrows[idx + 1];
      if (currRow["current_index"] == 0) {
        let newObj = {
          current_index: parseInt(idx) + 1,
          index_A: parseInt(idx),
          index_B: parseInt(idx),
          index_C: parseInt(idx) + 1,
          index_Unit: parseInt(idx) + 1,
          selectedLevelA: currRow["selectedLevelA"],
          selectedLevelB: currRow["selectedLevelB"],
          selectedLevelC: "",
          selectedUnit: "",
          conv: 0,
          max_qty: 0,
          min_qty: 0,
          mrp: 0,
          pur_rate: 0,
          rate_1: 0,
          rate_2: 0,
          rate_3: 0,
          cost: 0,
          opn_stock: 0,
          is_negetive: false,
          batchList: [],
        };
        let lstIdx = parseInt(idx) + 1;

        let nextArrAdj = nextArr.map((v, i) => {
          return {
            ...v,
            index_Unit: lstIdx + 1 + i,
            current_index: lstIdx + 1 + i,
          };
        });
        productrows = [...pervArr, newObj, ...nextArrAdj];
      } else {
        let newObj = {
          current_index: parseInt(idx) + 1,
          index_A: parseInt(idx),
          index_B: parseInt(idx),
          index_C: parseInt(idx) + 1,
          index_Unit: parseInt(idx) + 1,
          selectedLevelA: pervRow["selectedLevelA"],
          selectedLevelB: pervRow["selectedLevelB"],
          selectedLevelC: "",
          selectedUnit: "",
          conv: 0,
          max_qty: 0,
          min_qty: 0,
          mrp: 0,
          pur_rate: 0,
          rate_1: 0,
          rate_2: 0,
          rate_3: 0,
          cost: 0,
          opn_stock: 0,
          is_negetive: false,
          batchList: [],
        };
        let lstIdx = parseInt(idx) + 1;

        let nextArrAdj = nextArr.map((v, i) => {
          return {
            ...v,
            index_Unit: lstIdx + 1 + i,
            current_index: lstIdx + 1 + i,
          };
        });
        productrows = [...pervArr, newObj, ...nextArrAdj];
      }
    }
    this.setState({ curr_index: productrows.length - 1 }, () => {
      productSetChange({ productrows: productrows });
    });
  };

  AddLevelBRow = (idx) => {
    let { productrows, productSetChange } = this.props;
    let { curr_index } = this.state;
    let currRow = productrows[idx];
    if (curr_index == idx) {
      let v = {
        current_index: parseInt(idx) + 1,
        index_A: parseInt(idx),
        index_B: parseInt(idx) + 1,
        index_C: parseInt(idx) + 1,
        index_Unit: parseInt(idx) + 1,
        selectedLevelA: currRow["selectedLevelA"],
        selectedLevelB: "",
        selectedLevelC: "",
        selectedUnit: "",
        conv: 0,
        max_qty: 0,
        min_qty: 0,
        mrp: 0,
        pur_rate: 0,
        rate_1: 0,
        rate_2: 0,
        rate_3: 0,
        cost: 0,
        opn_stock: 0,
        is_negetive: false,
        batchList: [],
      };
      productrows = [...productrows, v];
    } else {
      let pervArr = productrows.slice(0, idx + 1);
      let nextArr = productrows.slice(idx + 1);
      let pervRow = productrows[idx - 1];
      if (currRow["current_index"] == 0) {
        let newObj = {
          current_index: parseInt(idx) + 1,
          index_A: parseInt(idx),
          index_B: parseInt(idx) + 1,
          index_C: parseInt(idx) + 1,
          index_Unit: parseInt(idx) + 1,
          selectedLevelA: currRow["selectedLevelA"],
          selectedLevelB: "",
          selectedLevelC: "",
          selectedUnit: "",
          conv: 0,
          max_qty: 0,
          min_qty: 0,
          mrp: 0,
          pur_rate: 0,
          rate_1: 0,
          rate_2: 0,
          rate_3: 0,
          cost: 0,
          opn_stock: 0,
          is_negetive: false,
          batchList: [],
        };
        let lstIdx = parseInt(idx) + 1;

        let nextArrAdj = nextArr.map((v, i) => {
          return {
            ...v,
            index_Unit: lstIdx + 1 + i,
            current_index: lstIdx + 1 + i,
          };
        });
        productrows = [...pervArr, newObj, ...nextArrAdj];
      } else {
        let newObj = {
          current_index: parseInt(idx) + 1,
          index_A: parseInt(idx),
          index_B: parseInt(idx) + 1,
          index_C: parseInt(idx) + 1,
          index_Unit: parseInt(idx) + 1,
          selectedLevelA: pervRow["selectedLevelA"],
          selectedLevelB: "",
          selectedLevelC: "",
          selectedUnit: "",
          conv: 0,
          max_qty: 0,
          min_qty: 0,
          mrp: 0,
          pur_rate: 0,
          rate_1: 0,
          rate_2: 0,
          rate_3: 0,
          cost: 0,
          opn_stock: 0,
          is_negetive: false,
          batchList: [],
        };
        let lstIdx = parseInt(idx) + 1;

        let nextArrAdj = nextArr.map((v, i) => {
          return {
            ...v,
            index_Unit: lstIdx + 1 + i,
            current_index: lstIdx + 1 + i,
          };
        });
        productrows = [...pervArr, newObj, ...nextArrAdj];
      }
    }
    this.setState({ curr_index: productrows.length - 1 }, () => {
      productSetChange({ productrows: productrows });
    });
  };

  AddLevelARow = (idx) => {
    let { productrows, productSetChange } = this.props;
    let { curr_index } = this.state;
    let currRow = productrows[idx];
    if (curr_index == idx) {
      let v = {
        current_index: parseInt(idx) + 1,
        index_A: parseInt(idx) + 1,
        index_B: parseInt(idx) + 1,
        index_C: parseInt(idx) + 1,
        index_Unit: parseInt(idx) + 1,
        selectedLevelA: "",
        selectedLevelB: "",
        selectedLevelC: "",
        selectedUnit: "",
        conv: 0,
        max_qty: 0,
        min_qty: 0,
        mrp: 0,
        pur_rate: 0,
        rate_1: 0,
        rate_2: 0,
        rate_3: 0,
        cost: 0,
        opn_stock: 0,
        is_negetive: false,
        batchList: [],
      };
      productrows = [...productrows, v];
    } else {
      let pervArr = productrows.slice(0, idx + 1);
      let nextArr = productrows.slice(idx + 1);
      let pervRow = productrows[idx - 1];
      // let nextRow = productrows[idx + 1];
      if (currRow["current_index"] == 0) {
        let newObj = {
          current_index: parseInt(idx) + 1,
          index_A: parseInt(idx) + 1,
          index_B: parseInt(idx) + 1,
          index_C: parseInt(idx) + 1,
          index_Unit: parseInt(idx) + 1,
          selectedLevelA: "",
          selectedLevelB: "",
          selectedLevelC: "",
          selectedUnit: "",
          conv: 0,
          max_qty: 0,
          min_qty: 0,
          mrp: 0,
          pur_rate: 0,
          rate_1: 0,
          rate_2: 0,
          rate_3: 0,
          cost: 0,
          opn_stock: 0,
          is_negetive: false,
          batchList: [],
        };
        let lstIdx = parseInt(idx) + 1;

        let nextArrAdj = nextArr.map((v, i) => {
          return {
            ...v,
            index_Unit: lstIdx + 1 + i,
            current_index: lstIdx + 1 + i,
          };
        });
        productrows = [...pervArr, newObj, ...nextArrAdj];
      } else {
        let newObj = {
          current_index: parseInt(idx) + 1,
          index_A: parseInt(idx) + 1,
          index_B: parseInt(idx) + 1,
          index_C: parseInt(idx + 1),
          index_Unit: parseInt(idx) + 1,
          selectedLevelA: "",
          selectedLevelB: "",
          selectedLevelC: "",
          selectedUnit: "",
          conv: 0,
          max_qty: 0,
          min_qty: 0,
          mrp: 0,
          pur_rate: 0,
          rate_1: 0,
          rate_2: 0,
          rate_3: 0,
          cost: 0,
          opn_stock: 0,
          is_negetive: false,
          batchList: [],
        };
        let lstIdx = parseInt(idx) + 1;

        let nextArrAdj = nextArr.map((v, i) => {
          return {
            ...v,
            index_Unit: lstIdx + 1 + i,
            current_index: lstIdx + 1 + i,
          };
        });
        productrows = [...pervArr, newObj, ...nextArrAdj];
      }
    }

    this.setState({ curr_index: productrows.length - 1 }, () => {
      productSetChange({ productrows: productrows });
    });
  };

  RemoveUnitRow = (idx) => {
    let { productrows, productSetChange } = this.props;
    let prevRow = productrows[idx - 1];
    let pervArr = productrows.slice(0, idx);
    let nextArr = productrows.slice(idx + 1);
    let currRow = productrows[idx];
    // console.log("currRow", currRow);
    let nextArrAdj = nextArr.map((v, i) => {
      let retObj = { ...v };
      if (v.index_A == idx) {
        retObj["index_A"] = prevRow ? prevRow["index_A"] : "-1";
        retObj["selectedLevelA"] = prevRow ? prevRow["selectedLevelA"] : "";
      }

      if (v.index_B == idx) {
        retObj["index_B"] = prevRow ? prevRow["index_B"] : "-1";
        retObj["selectedLevelB"] = prevRow ? prevRow["selectedLevelB"] : "";
      }

      if (v.index_C == idx) {
        retObj["index_C"] = prevRow ? prevRow["index_C"] : "-1";
        retObj["selectedLevelC"] = prevRow ? prevRow["selectedLevelC"] : "";
      }

      return {
        ...retObj,
        index_Unit: idx + i,
        current_index: idx + i,
      };
    });

    productrows = [...pervArr, ...nextArrAdj];
    this.setState({ curr_index: productrows.length - 1 }, () => {
      productSetChange({ productrows: productrows });
    });
  };

  RemoveLevelCRow = (idx) => {
    let { productrows, productSetChange } = this.props;
    let prevRow = productrows[idx - 1];
    let pervArr = productrows.slice(0, idx);
    let nextArr = productrows.slice(idx + 1);

    let nextArrAdj = nextArr.map((v, i) => {
      let retObj = { ...v };
      if (v.index_A == idx) {
        retObj["index_A"] = prevRow ? prevRow["index_A"] : "-1";
        retObj["selectedLevelA"] = prevRow
          ? prevRow["selectedLevelA"]
            ? prevRow["selectedLevelA"]
            : ""
          : "";
      }

      if (v.index_B == idx) {
        retObj["index_B"] = prevRow ? prevRow["index_B"] : "-1";
        retObj["selectedLevelB"] = prevRow
          ? prevRow["selectedLevelB"]
            ? prevRow["selectedLevelB"]
            : ""
          : "";
      }

      if (v.index_C == idx) {
        retObj["index_C"] = prevRow ? prevRow["index_C"] : "-1";
        retObj["selectedLevelC"] = prevRow
          ? prevRow["selectedLevelC"]
            ? prevRow["selectedLevelC"]
            : ""
          : "";
      } else if (v.index_C > idx + i) {
        return {
          ...retObj,
          index_Unit: idx + i,
          current_index: idx + i,
          index_C: idx + i,
          selectedLevelC: "",
        };
      } else {
        return {
          ...retObj,
          index_Unit: idx + i,
          current_index: idx + i,
        };
      }
    });

    productrows = [...pervArr, ...nextArrAdj];
    // console.log("productrows", productrows);
    this.setState({ curr_index: productrows.length - 1 }, () => {
      productSetChange({ productrows: productrows });
    });
  };

  RemoveLevelBRow = (idx) => {
    let { productrows, productSetChange } = this.props;
    let prevRow = productrows[idx - 1];
    let pervArr = productrows.slice(0, idx);
    let nextArr = productrows.slice(idx + 1);

    let nextArrAdj = nextArr.map((v, i) => {
      let retObj = { ...v };
      if (v.index_A == idx) {
        retObj["index_A"] = prevRow ? prevRow["index_A"] : "-1";
        retObj["selectedLevelA"] = prevRow
          ? prevRow["selectedLevelA"]
            ? prevRow["selectedLevelA"]
            : ""
          : "";
      }

      if (v.index_B == idx) {
        retObj["index_B"] = prevRow ? prevRow["index_B"] : "-1";
        retObj["selectedLevelB"] = prevRow
          ? prevRow["selectedLevelB"]
            ? prevRow["selectedLevelB"]
            : ""
          : "";
      } else if (v.index_B > idx + i) {
        return {
          ...retObj,
          index_Unit: idx + i,
          current_index: idx + i,
          index_C: idx + i,
          index_B: idx + 1,
          selectedLevelB: "",
          selectedLevelC: "",
        };
      } else {
        return {
          ...retObj,
          index_Unit: idx + i,
          current_index: idx + i,
        };
      }
    });

    productrows = [...pervArr, ...nextArrAdj];

    this.setState({ curr_index: productrows.length - 1 }, () => {
      productSetChange({ productrows: productrows });
    });
  };

  RemoveLevelARow = (idx) => {
    let { productrows, productSetChange } = this.props;
    let prevRow = productrows[idx - 1];
    let pervArr = productrows.slice(0, idx);
    let nextArr = productrows.slice(idx + 1);

    let nextArrAdj = nextArr.map((v, i) => {
      let retObj = { ...v };
      if (v.index_A == idx) {
        retObj["index_A"] = prevRow ? prevRow["index_A"] : "-1";
        retObj["selectedLevelA"] = prevRow
          ? prevRow["selectedLevelA"]
            ? prevRow["selectedLevelA"]
            : ""
          : "";
      } else if (v.index_A > idx + i) {
        return {
          ...retObj,
          index_Unit: idx + i,
          current_index: idx + i,
          index_C: idx + i,
          index_B: idx + 1,
          index_A: idx + 1,
          selectedLevelA: "",
          selectedLevelB: "",
          selectedLevelC: "",
        };
      } else {
        return {
          ...retObj,
          index_Unit: idx + i,
          current_index: idx + i,
        };
      }
    });

    productrows = [...pervArr, ...nextArrAdj];
    this.setState({ curr_index: productrows.length - 1 }, () => {
      productSetChange({ productrows: productrows });
    });
  };
  handleOpeningBatchOpen = (idx) => {
    let batchInitVal = {
      id: 0,
      b_no: "",
      opening_qty: "",
      b_free_qty: "",
      b_mrp: "",
      b_sale_rate: "",
      b_purchase_rate: "",
      b_costing: 0,
      b_expiry: "",
      b_manufacturing_date: "",
      isOpeningbatch: false,
      isUpdate: false,
    };

    let { productrows, productSetChange } = this.props;

    let batchList = productrows[idx]["batchList"];
    this.setState(
      {
        index: idx,
        batchInitVal: batchInitVal,
        batchList: batchList,
        errorArrayBorder: "",
      },
      () => {
        productSetChange({ opnStockModalShow: true });
        if (this.props.isOpeningBatch) {
          setTimeout(() => {
            document.getElementById("b_no").focus();
          }, 100);
        } else {
          setTimeout(() => {
            document.getElementById("opening_qty").focus();
          }, 100);
        }
      }
    );
  };

  validatePurchaseRate = (mrp = 0, p_rate = 0, setFieldValue) => {
    // console.log("MRP =", parseFloat(mrp));
    // console.log("Purchase rate ::", parseFloat(p_rate));
    if (parseFloat(mrp) <= parseFloat(p_rate) === true) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Purchase rate should less than MRP",
        is_timeout: true,
        delay: 1500,
        // is_button_show: true,
      });
      setFieldValue("b_purchase_rate", p_rate);
      setTimeout(() => {
        document.getElementById("b_purchase_rate").focus();
      }, 1000);
    } else {
      document.getElementById("b_costing").focus();
    }
  };
  validateSalesRate = (
    mrp = 0,
    purchaseRate = 0,
    salesRates = 0,
    element,
    setFieldValue
  ) => {
    if (
      parseFloat(salesRates) > parseFloat(purchaseRate) === false ||
      parseFloat(salesRates) < parseFloat(mrp) === false
    ) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Sales rate is always between Purchase and Mrp",
        is_timeout: true,
        delay: 1500,
        // is_button_show: true,
      });
      setFieldValue("b_purchase_rate", purchaseRate);
      setFieldValue("b_sale_rate", salesRates);
      setTimeout(() => {
        document.getElementById("b_sale_rate").focus();
      }, 1600);
    } else {
      setTimeout(() => {
        document.getElementById("b_manufacturing_date").focus();
      }, 100);
    }
  };

  calculateCosting = () => {
    if (this.openingBatchRef.current) {
      let { b_purchase_rate, b_free_qty, opening_qty } =
        this.openingBatchRef.current.values;
      // console.log("costing", b_purchase_rate, b_free_qty, opening_qty);
      let costing = 0;
      let freeQty = b_free_qty != "" ? parseInt(b_free_qty) : 0;
      let total_op_qty = 0;
      if (parseFloat(b_purchase_rate) > 0 && parseInt(opening_qty) > 0) {
        total_op_qty = parseInt(opening_qty) + parseInt(freeQty);
        costing =
          (parseInt(opening_qty) * parseFloat(b_purchase_rate)) /
          parseInt(total_op_qty);
        costing = costing.toFixed(2);
      }
      // console.log("costing", costing);

      this.openingBatchRef.current.setFieldValue(
        "b_costing",
        isNaN(costing) ? "" : costing
      );
    }
  };
  openingBatchUpdate = (values, setFieldValue, ind) => {
    let batchInitVal = {
      id: values.id,
      b_no: values.b_no != "" ? values.b_no : "",
      batch_id: values.batch_id != "" ? values.batch_id : "",
      opening_qty: values.opening_qty != 0 ? values.opening_qty : "",
      b_free_qty: values.b_free_qty != 0 ? values.b_free_qty : "",
      b_mrp: values.b_mrp != 0 ? values.b_mrp : "",
      b_sale_rate: values.b_sale_rate != 0 ? values.b_sale_rate : "",
      b_purchase_rate:
        values.b_purchase_rate != 0 ? values.b_purchase_rate : "",
      b_costing: values.b_purchase_rate != 0 ? values.b_purchase_rate : "",
      b_expiry: values.b_expiry != "" ? values.b_expiry : "",
      b_manufacturing_date:
        values.b_manufacturing_date != "" ? values.b_manufacturing_date : "",
      isOpeningbatch: values.isOpeningbatch,
      isUpdate: true,
    };

    this.setState({ batchInitVal: batchInitVal, rowIndex: ind }, () => {
      document.getElementById("b_no").focus();
    });
    // console.log("values---open", values);
    setFieldValue("b_no", values.b_no);
    setFieldValue("batch_id", values.batch_id);
    setFieldValue("opening_qty", values.opening_qty);
    setFieldValue("b_free_qty", values.b_free_qty);
    setFieldValue("b_mrp", values.b_mrp);
    setFieldValue("b_sale_rate", values.b_sale_rate);
    setFieldValue("b_purchase_rate", values.b_purchase_rate);
    setFieldValue("b_costing", values.b_costing);
    setFieldValue("b_expiry", values.b_expiry);
    setFieldValue("b_manufacturing_date", values.b_manufacturing_date);
  };
  clearOpeningStockData = () => {
    let batchInitVal = {
      id: 0,
      b_no: "",
      opening_qty: "",
      b_free_qty: "",
      b_mrp: "",
      b_sale_rate: "",
      b_purchase_rate: "",
      b_costing: 0,
      b_expiry: "",
      b_manufacturing_date: "",
      isOpeningbatch: false,
      isUpdate: false,
    };
    let { productrows, productSetChange } = this.props;

    this.setState({
      batchInitVal: batchInitVal,
      errorArrayBorder: "",
    });
  };

  addBatchOpeningRow = (values = "") => {
    // console.warn("values->>>>>", values);
    let { index, rowIndex } = this.state;
    let { isOpeningBatch, productrows, productSetChange } = this.props;

    if (index > -1) {
      let old_lst = productrows[index]["batchList"];
      let is_updated = false;
      let batchExist = false;
      let final_state = old_lst;
      if (isOpeningBatch == true) {
        let dataExist = false;
        let dataExist1 = false;
        if (old_lst != "" && old_lst.length > 0) {
          dataExist = old_lst.filter((v, i) => {
            if (rowIndex == "no") {
              if (v.b_no == values.b_no) {
                return true;
              }
            } else if (
              rowIndex != "no" &&
              (v.b_no == old_lst[rowIndex]["b_no"] || v.b_no == values.b_no)
            ) {
              return true;
            } else return false;
          });
          // dataExist1 = old_lst.filter((v) => {
          //   if (

          //     rowIndex != "no" && v.b_no == old_lst[rowIndex]["b_no"]
          //   ) {
          //     return true;
          //   }
          // });
        }
        if (rowIndex != "no" && dataExist.length > 1) {
          batchExist = true;
        } else if (rowIndex == "no" && dataExist.length > 0) {
          // console.warn("Record Already Exist In Table !");
          batchExist = true;
        } else {
          if (rowIndex != "no" && rowIndex >= 0) {
            final_state[rowIndex] = values;
          } else {
            final_state.push(values);
          }
        }
      } else {
        let dataExist = false;
        let dataExist1 = false;
        if (old_lst != "" && old_lst.length > 0) {
          dataExist = old_lst.filter((v, i) => {
            if (rowIndex == "no") {
              if (v.b_no == values.b_no) {
                return true;
              }
            } else if (v.b_no == values.b_no) {
              return true;
            } else return false;
          });
          dataExist1 = old_lst.filter((v) => {
            if (
              v.b_no == values.b_no ||
              (rowIndex != "no" && v.b_no == old_lst[rowIndex]["b_no"])
            ) {
              return true;
            }
          });
        }
        if (rowIndex != "no" && dataExist1.length > 1) {
          batchExist = true;
        } else if (rowIndex == "no" && dataExist.length > 0) {
          batchExist = true;
        } else {
          if (rowIndex != "no" && rowIndex >= 0) {
            final_state[rowIndex] = values;
          } else {
            final_state.push(values);
          }
        }
      }

      // console.warn("batchExist->>>>>", batchExist);
      if (batchExist) {
        MyNotifications.fire({
          show: true,
          icon: "error",
          title: "Error",
          msg: "Batch Already Exist",
          is_timeout: true,
          delay: 1500,
          // is_button_show: true,
        });
        setTimeout(() => {
          document.getElementById("b_no").focus();
        }, 2000);
      } else {
        // console.log({ final_state });
        // if (is_updated == false) {
        //   final_state = [...old_lst, values];
        // }
        // console.log({ final_state });
        productrows[index]["batchList"] = final_state;

        let total_op_qty = 0;
        // console.log("final_state", final_state);
        final_state.map((v, i) => {
          total_op_qty =
            parseInt(total_op_qty) +
            parseInt(v["opening_qty"]) +
            (v["b_free_qty"] != "" ? parseInt(v["b_free_qty"]) : 0);
        });
        // console.log("total_op_qty", total_op_qty);
        productrows[index]["opn_stock"] = total_op_qty;
        // mstPackaging[claIndex]["levelb"][clbIndex]["levelc"][clcIndex]["units"][
        //   cuIndex
        // ]["isOpeningbatch"] = isOpeningBatch;

        // console.log({ mstPackaging });
        this.setState({ batchList: final_state, rowIndex: "no" }, () => {
          productSetChange({ productrows: productrows });

          if (this.openingBatchRef.current) {
            this.openingBatchRef.current.setFieldValue("id", 0);
            this.openingBatchRef.current.setFieldValue("b_no", "");
            this.openingBatchRef.current.setFieldValue("batch_id", "");
            this.openingBatchRef.current.setFieldValue("opening_qty", "");
            this.openingBatchRef.current.setFieldValue("b_free_qty", "");
            this.openingBatchRef.current.setFieldValue("b_mrp", "");
            this.openingBatchRef.current.setFieldValue("b_sale_rate", "");
            this.openingBatchRef.current.setFieldValue("b_purchase_rate", "");
            this.openingBatchRef.current.setFieldValue("b_costing", "");
            this.openingBatchRef.current.setFieldValue("b_expiry", "");
            this.openingBatchRef.current.setFieldValue(
              "b_manufacturing_date",
              ""
            );
            this.openingBatchRef.current.setFieldValue("isUpdate", false);
          }

          setTimeout(() => {
            document.getElementById("b_no").focus();
          }, 1000);
        });
      }
    }
  };

  handelUnitModalShow = (status) => {
    this.setState({
      unitModalShow: status,
    });
  };

  handleUnitCount = (v) => {
    let { mstUnits, mstPackaging } = this.state;
    let blankcnt = parseInt(v) - mstUnits.length;
    let fUnits = [...mstUnits];
    if (blankcnt > 0) {
      new Array(blankcnt).fill("").map((v) => {
        fUnits.push(v);
      });
    } else if (blankcnt < 0) {
      fUnits = fUnits.splice(0, v);
    }

    this.setState({ mstUnits: fUnits }, () => {
      this.setInitPackagingAfterUnitChanges();
    });
  };

  hadleUnitMst = (value, action, index) => {
    let { mstUnits } = this.state;
    if (mstUnits) {
      if (action.action == "clear") {
        mstUnits[index] = "";
      } else {
        mstUnits[index] = value;
      }
    }
    this.setState({ mstUnits: mstUnits });
  };
  getUnitMst = (i) => {
    let { mstUnits } = this.state;
    return mstUnits ? mstUnits[i] : "";
  };

  handleDisablePlusButton = () => {
    let { mstPackaging } = this.state;
    let isError = false;
    mstPackaging.map((v) => {
      if (
        isUserControl("is_level_a", this.props.userControl) &&
        v.levela_id == ""
      ) {
        isError = true;
      }
      // console.log("isError Level A: ", isError);

      v["levelb"] = v.levelb.map((vi) => {
        if (
          isUserControl("is_level_b", this.props.userControl) &&
          vi.levelb_id == ""
        ) {
          isError = true;
        }
        // console.log("isError Level B: ", isError);

        vi["levelc"] = vi.levelc.map((vii) => {
          if (
            isUserControl("is_level_c", this.props.userControl) &&
            vii.levelc_id == ""
          ) {
            isError = true;
          }

          vii.units = vii.units.map((y) => {
            if (y.unit_id == "") {
              isError = true;
              // console.log("isError Unit level : ", isError);
            }

            return y;
          });
          return vii;
        });
        return vi;
      });
      return v;
    });

    return isError;
  };
  unitModalShow = (value, index = -1) => {
    // console.log("unit index", index);
    this.setState({ unitModalShow: value, unitIndex: index }, () => {
      if (value == false)
        this.setState({
          unitInitVal: {
            id: "",
            unitName: "",
            unitCode: "",
            uom: "",
          },
          errorArrayBorderUnit: "",
        });
    });
  };
  handleUnitFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_units(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            unitName: res.unitName,
            unitCode: res.unitCode ? getValue(uomoption, res.unitCode) : "",
          };
          this.setState({ unitInitVal: initVal, unitModalShow: true });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: result.message,
            is_timeout: true,
            delay: 1500,
            // is_button_show: true,
          });
        }
      })
      .catch((error) => { });
  };
  levelAModalShow = (value, index = -1) => {
    // console.log("index", index);
    this.setState({ levelAModalShow: value, levelAindex: index }, () => {
      if (value == false)
        this.setState({
          levelAInitVal: {
            id: "",
            levelName: "",
          },
        });
    });
  };
  handleLevelAFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_levelA_by_id(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            levelName: res.levelName,
          };
          this.setState({ levelAInitVal: initVal, levelAModalShow: true });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: result.message,
            is_timeout: true,
            delay: 1500,
            // is_button_show: true,
          });
        }
      })
      .catch((error) => { });
  };
  levelBModalShow = (value, index = -1) => {
    this.setState({ levelBModalShow: value, levelBindex: index }, () => {
      if (value == false)
        this.setState({
          levelBInitVal: {
            id: "",
            levelName: "",
          },
        });
    });
  };
  handleLevelBFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_levelB_by_id(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            levelName: res.levelName,
          };
          this.setState({ levelBInitVal: initVal, levelBModalShow: true });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: result.message,
            is_timeout: true,
            delay: 1500,
            // is_button_show: true,
          });
        }
      })
      .catch((error) => { });
  };

  levelCModalShow = (value, index = -1) => {
    this.setState({ levelCModalShow: value, levelCindex: index }, () => {
      if (value == false)
        this.setState({
          levelCInitVal: {
            id: "",
            levelName: "",
          },
        });
    });
  };
  handleLevelCFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_levelC_by_id(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            levelName: res.levelName,
          };
          this.setState({ levelCInitVal: initVal, levelCModalShow: true });
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: result.message,
            is_timeout: true,
            delay: 1500,
            // is_button_show: true,
          });
        }
      })
      .catch((error) => { });
  };

  setErrorBorder(index, value, stateVal) {
    // let { [stateVal]} = this.state;
    let errorArrayData = [];
    if (this.state[stateVal].length > 0) {
      errorArrayData = this.state[stateVal];
      if (this.state[stateVal].length >= index) {
        errorArrayData.splice(index, 1, value);
      } else {
        Array.from(Array(index), (v) => {
          errorArrayData.push(value);
        });
      }
    } else {
      {
        Array.from(Array(index + 1), (v) => {
          errorArrayData.push(value);
        });
      }
    }

    this.setState({ [stateVal]: errorArrayData });
  }

  handleKeyDown = (e, index) => {
    if (e.keyCode === 13) {
      document.getElementById(index).focus();
    }
  };

  // ! Key up-down focus to Table TR
  handleBatchStockTableRow(event) {
    // debugger;
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let { batchList } = this.state;
    const k = event.keyCode;
    if (k === 40) {
      //! condition for down key press
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();
      } else {
        document.getElementById("batchStock_submit_btn").focus();
      }
    } else if (k === 38) {
      //! condition for up key press
      let prev = t.previousElementSibling;
      if (prev) {
        prev.focus();
      }
    } else if (k === 13) {
      //! condition for enter key press
      let cuurentProduct = t;
      let selectedBatchRow = JSON.parse(cuurentProduct.getAttribute("value"));
      let tabIndex = JSON.parse(cuurentProduct.getAttribute("tabIndex"));

      this.openingBatchUpdate(
        selectedBatchRow,
        this.openingBatchRef.current.setFieldValue,
        tabIndex
      );
    } else if (k == 8) {
      //! condition for backspace key press 1409
    } else if (k == 37 || k == 39) {
      //! condition for left & right key press 1409
    }
  }

  render() {
    let {
      productrows,
      productSetChange,
      isBatchHideShow,
      opnStockModalShow,
      isOpeningBatch,
      ABC_flag_value,
      unitIdData,
      isInventoryFlag,
    } = this.props;

    let {
      levelA,
      levelB,
      levelC,
      levelAOpt,
      levelBOpt,
      levelCOpt,
      unitOpts,
      curr_index,
      batchInitVal,
      batchList,
      unitModalShow,
      unitInitVal,
      levelAInitVal,
      levelBInitVal,
      levelCInitVal,
      levelAModalShow,
      levelBModalShow,
      levelCModalShow,
      claIndex,
      clbIndex,
      clcIndex,
      cuIndex,
      errorArrayBorder,
      errorArrayBorderUnit,
      errorArrayBorderLevelA,
      errorArrayBorderLevelB,
      errorArrayBorderLevelC,
      currentId,
      currentIdA,
      currentIdB,
      currentIdC,
    } = this.state;

    return (
      <>
        <div className="pro-tbl-style">
          <Table>
            <thead>
              <tr>
                {levelA ? (
                  <>
                    <th
                      style={{
                        width: "20px",
                      }}
                    ></th>
                    <th
                      style={{
                        width: "20px",
                      }}
                    ></th>
                    <th
                      // style={{
                      //   width: "206px",}}
                      className="levela"
                    >
                      {levelA ? levelA.label : ""}
                    </th>
                  </>
                ) : (
                  ""
                )}
                {levelB ? (
                  <>
                    <th
                      style={{
                        width: "20px",
                      }}
                      className="left-border-style"
                    ></th>
                    <th
                      style={{
                        width: "20px",
                      }}
                    ></th>
                    <th
                      // style={{
                      //   width: "178px",}}
                      className="levelb"
                    >
                      {levelB ? levelB.label : ""}
                    </th>
                  </>
                ) : (
                  ""
                )}
                {levelC ? (
                  <>
                    <th
                      style={{
                        width: "20px",
                      }}
                      className="left-border-style"
                    ></th>
                    <th
                      style={{
                        width: "20px",
                      }}
                    ></th>
                    <th
                      className="levelc"
                    // style={{
                    //   width: "200px",
                    // }}
                    >
                      {levelC ? levelC.label : ""}
                    </th>
                  </>
                ) : (
                  ""
                )}

                <th
                  style={{
                    width: "20px",
                  }}
                  className="left-border-style"
                ></th>
                <th
                  style={{
                    width: "20px",
                  }}
                ></th>
                <th
                  className="unit"
                // style={{
                //   width: "86px",
                // }}
                >
                  Unit
                </th>
                <th
                  className="left-border-style con text-center"
                // style={{
                //   width: "53px",
                // }}
                >
                  Conv.
                </th>
                <th
                  className="left-border-style max text-center"
                // style={{
                //   width: "140px",
                // }}
                >
                  Max. Qty
                </th>

                <th
                  className="left-border-style max text-center"
                // style={{
                //   width: "140px",
                // }}
                >
                  Min. Qty
                </th>
                {!isBatchHideShow && (
                  <>
                    <th
                      className="left-border-style max text-center"
                    // style={{
                    //   width: "140px",
                    // }}
                    >
                      MRP
                    </th>
                    <th
                      className="left-border-style max text-center"
                    // style={{
                    //   width: "140px",
                    // }}
                    >
                      Pur. Rate
                    </th>
                    <th
                      className="left-border-style max text-center"
                    // style={{
                    //   width: "140px",
                    // }}
                    >
                      Rate1
                    </th>
                    <th
                      className="left-border-style max text-center"
                    // style={{
                    //   width: "140px",
                    // }}
                    >
                      Rate2
                    </th>
                    <th
                      className="left-border-style max text-center"
                    // style={{
                    //   width: "140px",
                    // }}
                    >
                      Rate3
                    </th>
                  </>
                )}
                {/* <th>Cost</th> */}
                <th
                  className="left-border-style max text-center"
                // style={{
                //   width: "140px",
                // }}
                >
                  Opn. Stock
                </th>
                <th
                  // className="left-border-style"
                  className={`${!isBatchHideShow == true
                    ? "batchoff_ve left-border-style"
                    : "batchon_ve left-border-style"
                    }`}
                >
                  -ve
                </th>
              </tr>
            </thead>
            {/* {JSON.stringify(productrows)} */}
            <tbody>
              {productrows.length > 0 &&
                productrows.map((pv, pi) => {
                  return (
                    <tr>
                      {levelA ? (
                        <>
                          <td
                            style={{
                              width: "20px",
                            }}
                          >
                            {pv.selectedLevelA == "" ? (
                              <></>
                            ) : (
                              <Button
                                id={`rowPlusBtnLevelA-${pi}`}
                                className="rowPlusBtn"
                                onClick={(v) => {
                                  v.preventDefault();
                                  // console.log("Unit add Click", pi);
                                  this.AddLevelARow(pi);
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  }
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  className="plus-color"
                                />
                              </Button>
                            )}
                            {/* <Button
                              className="rowPlusBtn"
                              onClick={(v) => {
                                v.preventDefault();
                                // console.log("Unit add Click", pi);
                                this.AddLevelARow(pi);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                className="plus-color"
                              />
                            </Button> */}
                          </td>
                          <td
                            style={{
                              width: "20px",
                            }}
                          >
                            <Button
                              // disabled={mstLevelC.units.length === 1 ? true : false}
                              id={`rowMinusBtnLevelA-${pi}`}
                              className="rowMinusBtn"
                              onClick={(e) => {
                                e.preventDefault();
                                this.RemoveLevelARow(pi);
                              }}
                              disabled={curr_index == 0 ? true : false}
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.focusNextElement(e);
                                }
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faMinus}
                                className="minus-color"
                              />
                            </Button>
                          </td>
                          <td
                            className="levela"
                            // style={{
                            //   width: "206px",}}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                // if (levelB) {
                                //   this["LevelB_" + pi].current?.focus();
                                // } else {
                                //   this["unit_" + pi].current?.focus();
                                // }
                                this.focusNextElement(e);
                              }
                            }}
                          >
                            <Select
                              // ref={this.LevelA_0}

                              // ref={this["LevelA_" + pi]}
                              menuPlacement="auto"
                              menuPosition="fixed"
                              onChange={(v) => {
                                if (v !== "") {
                                  if (v.label === "Add New") {
                                    // console.log(v.label === "Add New");
                                    this.setState(
                                      { currentIdA: `selectedLevelA-${pi}` },
                                      () => {
                                        this.levelAModalShow(true, pi);
                                      }
                                    );
                                  } else {
                                    // console.log("else part", v);
                                    // handleLevelAChange(mstLevelAIndex, v);
                                    this.setElementValue(
                                      "selectedLevelA",
                                      v,
                                      pi
                                    );
                                  }
                                }
                              }}
                              options={levelAOpt}
                              value={pv.selectedLevelA}
                              placeholder="Select"
                              name={`selectedLevelA-${pi}`}
                              id={`selectedLevelA-${pi}`}
                              styles={level_A_DD(ABC_flag_value)}
                            />
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                      {levelB ? (
                        <>
                          <td
                            className="left-border-style"
                            style={{
                              width: "20px",
                            }}
                          >
                            {pv.selectedLevelB == "" ? (
                              <></>
                            ) : (
                              <Button
                                id={`rowPlusBtnLevelB-${pi}`}
                                className="rowPlusBtn"
                                onClick={(v) => {
                                  v.preventDefault();
                                  // console.log("Unit add Click", pi);
                                  this.AddLevelBRow(pi);
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  }
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  className="plus-color"
                                />
                              </Button>
                            )}
                            {/* <Button
                              className="rowPlusBtn"
                              onClick={(v) => {
                                v.preventDefault();
                                // console.log("Unit add Click", pi);
                                this.AddLevelBRow(pi);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                className="plus-color"
                              />
                            </Button> */}
                          </td>
                          <td
                            style={{
                              width: "20px",
                            }}
                          >
                            <Button
                              // disabled={mstLevelC.units.length === 1 ? true : false}
                              id={`rowMinusBtnLevelB-${pi}`}
                              className="rowMinusBtn"
                              onClick={(e) => {
                                e.preventDefault();
                                this.RemoveLevelBRow(pi);
                              }}
                              disabled={curr_index == 0 ? true : false}
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.focusNextElement(e);
                                }
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faMinus}
                                className="minus-color"
                              />
                            </Button>
                          </td>
                          <td
                            className="levelb"
                            // style={{
                            //   width: "178px",
                            // }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                                //   if (levelC) {
                                //     this["LevelC_" + pi].current?.focus();
                                //   } else {
                                //     this["unit_" + pi].current?.focus();
                                //   }
                              }
                            }}
                          >
                            {" "}
                            <Select
                              // ref={this["LevelB_" + pi]}
                              menuPlacement="auto"
                              styles={level_B_DD(ABC_flag_value)}
                              menuPosition="fixed"
                              onChange={(v) => {
                                if (v !== "") {
                                  if (v.label === "Add New") {
                                    // console.log(v.label === "Add New");
                                    this.setState(
                                      { currentIdB: `selectedLevelB-${pi}` },
                                      () => {
                                        this.levelBModalShow(true, pi);
                                      }
                                    );
                                  } else {
                                    // console.log("else part", v);
                                    // handleLevelAChange(mstLevelAIndex, v);
                                    this.setElementValue(
                                      "selectedLevelB",
                                      v,
                                      pi
                                    );
                                  }
                                }
                              }}
                              options={levelBOpt}
                              value={pv.selectedLevelB}
                              placeholder="Select"
                              name={`selectedLevelB-${pi}`}
                              id={`selectedLevelB-${pi}`}
                            />
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                      {levelC ? (
                        <>
                          <td
                            className="left-border-style"
                            style={{
                              width: "20px",
                            }}
                          >
                            {" "}
                            {pv.selectedLevelC == "" ? (
                              <></>
                            ) : (
                              <Button
                                id={`rowPlusBtnLevelC-${pi}`}
                                className="rowPlusBtn"
                                onClick={(v) => {
                                  v.preventDefault();
                                  // console.log("Unit add Click", pi);
                                  this.AddLevelCRow(pi);
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode == 13) {
                                    this.focusNextElement(e);
                                  }
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  className="plus-color"
                                />
                              </Button>
                            )}
                            {/* <Button
                              className="rowPlusBtn"
                              onClick={(v) => {
                                v.preventDefault();
                                // console.log("Unit add Click", pi);
                                this.AddLevelCRow(pi);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                className="plus-color"
                              />
                            </Button> */}
                          </td>
                          <td
                            style={{
                              width: "20px",
                            }}
                          >
                            <Button
                              // disabled={mstLevelC.units.length === 1 ? true : false}
                              id={`rowMinusBtnLevelC-${pi}`}
                              className="rowMinusBtn"
                              onClick={(e) => {
                                e.preventDefault();
                                this.RemoveLevelCRow(pi);
                              }}
                              disabled={curr_index == 0 ? true : false}
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.focusNextElement(e);
                                }
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faMinus}
                                className="minus-color"
                              />
                            </Button>
                          </td>
                          <td
                            className="levelc"
                            // style={{
                            //   width: "200px",
                            // }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
                            }}
                          >
                            <Select
                              // ref={this["LevelC_" + pi]}
                              menuPlacement="auto"
                              styles={level_C_DD(ABC_flag_value)}
                              menuPosition="fixed"
                              onChange={(v) => {
                                if (v !== "") {
                                  if (v.label === "Add New") {
                                    // console.log(v.label === "Add New");
                                    this.setState(
                                      { currentIdC: `selectedLevelC-${pi}` },
                                      () => {
                                        this.levelCModalShow(true, pi);
                                      }
                                    );
                                  } else {
                                    // console.log("else part", v);
                                    // handleLevelAChange(mstLevelAIndex, v);
                                    this.setElementValue(
                                      "selectedLevelC",
                                      v,
                                      pi
                                    );
                                  }
                                }
                              }}
                              options={levelCOpt}
                              value={pv.selectedLevelC}
                              placeholder="Select"
                              name={`selectedLevelC-${pi}`}
                              id={`selectedLevelC-${pi}`}
                            />
                          </td>
                        </>
                      ) : (
                        ""
                      )}

                      {/* {JSON.stringify(pv)} */}
                      <td
                        className="left-border-style"
                        style={{
                          width: "20px",
                        }}
                      >
                        {pv.selectedUnit == "" ? (
                          <></>
                        ) : (
                          <Button
                            id={`rowPlusBtnUnit-${pi}`}
                            className="rowPlusBtn"
                            onClick={(v) => {
                              v.preventDefault();
                              // console.log("Unit add Click", pi);
                              this.AddUnitRow(pi);
                            }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                              }
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="plus-color"
                            />
                          </Button>
                        )}
                        {/* <Button
                          className="rowPlusBtn"
                          onClick={(v) => {
                            v.preventDefault();
                            // console.log("Unit add Click", pi);
                            this.AddUnitRow(pi);
                          }}
                          // disabled={
                          //   pi && pi.productId && pi.productId != ""
                          //     ? true
                          //     : false
                          // }
                          isDisabled={
                            pv && pv.selectedUnit && pv.selectedUnit != ""
                              ? true
                              : false
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="plus-color"
                            isDisabled={
                              pv && pv.selectedUnit && pv.selectedUnit != ""
                                ? true
                                : false
                            }
                          />
                        </Button> */}
                      </td>
                      <td
                        style={{
                          width: "20px",
                        }}
                      >
                        {" "}
                        <Button
                          // disabled={mstLevelC.units.length === 1 ? true : false}
                          id={`rowMinusBtnUnit-${pi}`}
                          className="rowMinusBtn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.RemoveUnitRow(pi);
                          }}
                          disabled={curr_index == 0 ? true : false}
                          onKeyDown={(e) => {
                            if (e.keyCode == 13) {
                              this.focusNextElement(e);
                            }
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faMinus}
                            className="minus-color"
                          />
                        </Button>
                      </td>
                      <td
                      // style={{
                      //   width: "100px",
                      // }}
                      >
                        {pv.current_index == pi && (
                          <Form.Group
                            className={`${unitIdData && unitIdData[pi] == "Y"
                              ? "border border-danger "
                              : ""
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                if (pv.selectedUnit) this.focusNextElement(e);
                                // this.handleKeyDown(e, `conv-${pi}`);
                              } else if (e.keyCode == 9) {
                                if (!pv.selectedUnit) e.preventDefault();
                                // this.handleKeyDown(e, `conv-${pi}`);
                              }
                            }}
                          >
                            <Select
                              // ref={this["unit_" + pi]}
                              menuPlacement="auto"
                              menuPosition="fixed"
                              onChange={(v) => {
                                if (v !== "") {
                                  if (v.label === "Add New") {
                                    // console.log(v.label === "Add New");
                                    this.setState(
                                      { currentId: `selectedUnit-${pi}` },
                                      () => {
                                        this.unitModalShow(true, pi);
                                      }
                                    );
                                  } else {
                                    // console.log("else part", v);
                                    this.setElementValue("selectedUnit", v, pi);
                                  }
                                }
                              }}
                              // isClearable
                              options={unitOpts}
                              value={pv.selectedUnit}
                              placeholder="Select"
                              name={`selectedUnit-${pi}`}
                              id={`selectedUnit-${pi}`}
                              styles={newRowDropdownUnit}
                            />
                          </Form.Group>
                        )}
                      </td>
                      <td
                        // contentEditable={true}
                        // onInput={(v) => {
                        //   let val = v.target.value;
                        //   this.setElementValue("max_qty", val, pi);
                        // }}
                        // style={{
                        //   width: "53px",
                        // }}
                        className="left-border-style"
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) {
                            this.focusNextElement(e);
                            // this.handleKeyDown(e, `max_qty-${pi}`);
                          }
                        }}
                      >
                        <Form.Control
                          className="td-text-box"
                          type="text"
                          placeholder="conv. "
                          name={`conv-${pi}`}
                          id={`conv-${pi}`}
                          onChange={(e) => {
                            let val = e.target.value;

                            this.setElementValue("conv", val, pi);
                          }}
                          value={this.getElementValue("conv", pi)}
                          onKeyPress={(e) => {
                            OnlyEnterNumbers(e);
                          }}
                          maxLength={5}
                        />
                        {/* {pv.conv} */}
                      </td>
                      <td
                        // contentEditable={true}
                        // onInput={(v) => {
                        //   let val = v.target.value;
                        //   this.setElementValue("max_qty", val, pi);
                        // }}
                        // style={{
                        //   width: "140px",
                        // }}
                        className="left-border-style"
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) {
                            this.focusNextElement(e);
                            // this.handleKeyDown(e, `min_qty-${pi}`);
                          }
                        }}
                      >
                        <Form.Control
                          className="td-text-box"
                          type="text"
                          placeholder="max qty"
                          name={`max_qty-${pi}`}
                          id={`max_qty-${pi}`}
                          onKeyPress={(e) => {
                            OnlyEnterNumbers(e);
                          }}
                          onChange={(e) => {
                            let val = e.target.value;

                            this.setElementValue("max_qty", val, pi);
                          }}
                          value={this.getElementValue("max_qty", pi)}
                          maxLength={10}
                        />
                        {/* {pv.max_qty} */}
                      </td>
                      <td
                        // contentEditable={true}
                        // onInput={(v) => {
                        //   let val = v.target.value;
                        //   this.setElementValue("min_qty", val, pi);
                        // }}
                        // style={{
                        //   width: "140px",
                        // }}
                        className="left-border-style"
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) {
                            this.focusNextElement(e);
                            // if (!isBatchHideShow)
                            //   this.handleKeyDown(e, `mrp-${pi}`);
                            // else this.handleKeyDown(e, `stockBtn-${pi}`);
                          }
                        }}
                      >
                        <Form.Control
                          className="td-text-box"
                          type="text"
                          placeholder="min. qty"
                          name={`min_qty-${pi}`}
                          id={`min_qty-${pi}`}
                          onChange={(e) => {
                            let val = e.target.value;

                            this.setElementValue("min_qty", val, pi);
                          }}
                          onKeyPress={(e) => {
                            OnlyEnterNumbers(e);
                          }}
                          value={this.getElementValue("min_qty", pi)}
                          maxLength={10}
                        />
                      </td>
                      {!isBatchHideShow && (
                        <>
                          <td
                            // contentEditable={true}
                            // onInput={(v) => {
                            //   let val = v.target.value;
                            //   this.setElementValue("mrp", val, pi);
                            // }}
                            // style={{
                            //   width: "140px",
                            // }}
                            className="left-border-style"
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                                // this.handleKeyDown(e, `pur_rate-${pi}`);
                              }
                            }}
                          >
                            <Form.Control
                              className="td-text-box"
                              type="text"
                              placeholder="mrp"
                              name={`mrp-${pi}`}
                              id={`mrp-${pi}`}
                              onChange={(e) => {
                                let val = e.target.value;
                                this.setState({ mrp_val: e.target.value });

                                this.setElementValue("mrp", val, pi);
                              }}
                              value={this.getElementValue("mrp", pi)}
                              maxLength={10}
                            />
                          </td>
                          <td
                            // contentEditable={true}
                            // onInput={(v) => {
                            //   let val = v.target.value;
                            //   this.setElementValue("pur_rate", val, pi);
                            // }}
                            // style={{
                            //   width: "140px",
                            // }}
                            className="left-border-style"
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                                // this.handleKeyDown(e, `rate_1-${pi}`);
                              }
                            }}
                          >
                            <Form.Control
                              className="td-text-box"
                              type="text"
                              ref={this.purRateRef}
                              placeholder="pur rate"
                              name={`pur_rate-${pi}`}
                              id={`pur_rate-${pi}`}
                              onChange={(e) => {
                                let val = e.target.value;
                                this.setElementValue("pur_rate", val, pi);
                              }}
                              value={this.getElementValue("pur_rate", pi)}
                              maxLength={10}
                              onBlur={(e) => {
                                e.preventDefault();
                                if (e.target.value > 0) {
                                  this.validatePurchaseRate1(
                                    this.state.mrp_val,
                                    e.target.value
                                  );
                                }
                              }}
                            // onKeyDown={(e)=>{
                            //         e.preventDefault();
                            //         if (e.target.value > 0) {
                            //           this.validatePurchaseRate1(
                            //             `mrp-${pi}`,
                            //             `pur_rate-${pi}`,
                            //             `pur_rate-${pi}`,
                            //             this.getElementValue(),
                            //           );
                            //         }
                            // }

                            // }
                            />
                          </td>
                          <td
                            // contentEditable={true}
                            // onInput={(v) => {
                            //   let val = v.target.value;
                            //   this.setElementValue("rate_1", val, pi);
                            // }}
                            // style={{
                            //   width: "140px",
                            // }}
                            className="left-border-style"
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                                // this.handleKeyDown(e, `rate_2-${pi}`);
                              }
                            }}
                          >
                            <Form.Control
                              className="td-text-box"
                              type="text"
                              placeholder="rate 1"
                              name={`rate_1-${pi}`}
                              id={`rate_1-${pi}`}
                              onChange={(e) => {
                                let val = e.target.value;

                                this.setElementValue("rate_1", val, pi);
                              }}
                              value={this.getElementValue("rate_1", pi)}
                              maxLength={10}
                            />
                          </td>
                          <td
                            className="left-border-style"
                            // contentEditable={true}
                            // onInput={(v) => {
                            //   let val = v.target.value;
                            //   this.setElementValue("rate_2", val, pi);
                            // }}
                            // style={{
                            //   width: "140px",
                            // }}
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                                // this.handleKeyDown(e, `rate_3-${pi}`);
                              }
                            }}
                          >
                            <Form.Control
                              className="td-text-box"
                              type="text"
                              placeholder="rate2"
                              name={`rate_2-${pi}`}
                              id={`rate_2-${pi}`}
                              onChange={(e) => {
                                let val = e.target.value;

                                this.setElementValue("rate_2", val, pi);
                              }}
                              value={this.getElementValue("rate_2", pi)}
                              maxLength={10}
                            />
                          </td>
                          <td
                            // contentEditable={true}
                            // onInput={(v) => {
                            //   let val = v.target.value;
                            //   this.setElementValue("rate_3", val, pi);
                            // }}
                            // style={{
                            //   width: "140px",
                            // }}
                            className="left-border-style"
                            onKeyDown={(e) => {
                              if (e.keyCode == 13) {
                                this.focusNextElement(e);
                                // this.handleKeyDown(e, `stockBtn-${pi}`);
                              }
                            }}
                          >
                            <Form.Control
                              className="td-text-box"
                              type="text"
                              placeholder="rate 3"
                              name={`rate_3-${pi}`}
                              id={`rate_3-${pi}`}
                              onChange={(e) => {
                                let val = e.target.value;

                                this.setElementValue("rate_3", val, pi);
                              }}
                              value={this.getElementValue("rate_3", pi)}
                              maxLength={10}
                            />
                          </td>
                        </>
                      )}
                      {/* <td
                    
                    >
                      <Form.Control
                        className=""
                        type="text"
                        placeholder="Cost"
                        name={`cost-${pi}`}
                        id={`cost-${pi}`}
                        onChange={(e) => {
                          let val = e.target.value;

                          this.setElementValue("cost", val, pi);
                        }}
                        value={this.getElementValue("cost", pi)}
                        maxLength={5}
                      />
                    </td> */}
                      <td
                        // contentEditable={true}
                        // onInput={(v) => {
                        //   let val = v.target.value;
                        //   this.setElementValue("opn_stock", val, pi);
                        // }}
                        // style={{
                        //   width: "140px",
                        // }}
                        className="left-border-style"
                      >
                        <div className="d-flex">
                          <div>
                            <Form.Control
                              className="td-text-box"
                              type="text"
                              placeholder="opn. stock"
                              name={`opn_stock-${pi}`}
                              id={`opn_stock-${pi}`}
                              // onChange={(e) => {
                              //   let val = e.target.value;
                              //   this.setElementValue("opn_stock", val, pi);
                              // }}
                              // onClick={(e) => {
                              //   e.preventDefault();
                              //   this.handleOpeningBatchOpen(pi);
                              // }}
                              // onKeyDown={(e) => {
                              //   if (e.keyCode === 13) {
                              //     this.handleOpeningBatchOpen(pi);
                              //   }
                              // }}
                              value={
                                isInventoryFlag == true
                                  ? this.getElementValue("opn_stock", pi)
                                  : 0
                              }
                              maxLength={10}
                              readOnly
                              tabIndex={-1}
                            />
                          </div>
                          <div className="my-auto">
                            <Button
                              id={`stockBtn-${pi}`}
                              className="add-btn-img"
                              onClick={(e) => {
                                e.preventDefault();
                                this.handleOpeningBatchOpen(pi);
                              }}
                              // onKeyDown={(e) => {
                              //   if (e.keyCode === 13) {
                              //     this.CategoryMdlRef.current?.focus();
                              //   }
                              // }}
                              onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                  this.focusNextElement(e);
                                  // this.handleKeyDown(e, `is_negetive-${pi}`);
                                } else if (e.keyCode == 32) {
                                  e.preventDefault();
                                  if (isInventoryFlag)
                                    this.handleOpeningBatchOpen(pi);
                                }
                              }}
                              disabled={isInventoryFlag != true ? true : false}
                            >
                              <img
                                src={add_icon}
                                alt=""
                                className="add-img-btn"
                              />
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td
                        className="left-border-style switch-box-style"
                        style={{
                          width: "43px",
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) {
                            this.focusNextElement(e);
                            // if (productrows.length > 1) {
                            //   var form = e.target.form;
                            //   var index = Array.prototype.indexOf.call(
                            //     form,
                            //     e.target
                            //   );
                            //   form.elements[index + 2].focus();
                            // }

                            // else {
                            //   this.handleKeyDown(e, "PC_submit_btn");
                            // }
                          }
                        }}
                      >
                        <Form.Check
                          key={pi}
                          type="switch"
                          id={`is_negetive-${pi}`}
                          name={`is_negetive-${pi}`}
                          checked={pv.is_negetive}
                          onChange={(e) => {
                            let value = e.target.checked;
                            // this.handleUnitChange(
                            //   value == true ? 1 : 0,
                            //   "isNegativeStocks"
                            // );
                            productrows[pi]["is_negetive"] = value;
                            productSetChange({ productrows: productrows });
                          }}
                          className="switch_style"
                          value={pv.is_negetive}
                          label=""
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        {/* Opening stock modal */}
        <Modal
          show={opnStockModalShow}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "lg"
              : "xl"
          }
          className="mt-5 mainmodal"
          onHide={() => {
            // this.setState({
            //   opnStockModalShow: false,
            //   claIndex: -1,
            //   clbIndex: -1,
            //   clcIndex: -1,
            //   cuIndex: -1,
            // });
            this.setState({ index: -1, batchList: [] }, () => {
              productSetChange({ opnStockModalShow: false });
            });
          }}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header
            // closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Opening Stock
            </Modal.Title>

            <CloseButton
              className="pull-right"
              onClick={() => {
                this.setState({ index: -1 }, () => {
                  productSetChange({ opnStockModalShow: false });
                });
              }}
            />
            {/* <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handleOpnStockModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button> */}
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <div className="">
              <div className="m-0 mb-2">
                <Formik
                  innerRef={this.openingBatchRef}
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={batchInitVal}
                  // validationSchema={Yup.object().shape({
                  //   // b_no: Yup.string()
                  //   //   .trim()
                  //   //   .required("Batch number is required"),
                  //   opening_qty: Yup.string()
                  //     .trim()
                  //     .required("Qty is required"),
                  //   b_mrp: Yup.string().trim().required("Mrp is required"),
                  //   b_sale_rate: Yup.string()
                  //     .trim()
                  //     .required("Sales rate is required"),
                  //   b_purchase_rate: Yup.string()
                  //     .trim()
                  //     .required("Purchase rate is required"),
                  //   // b_expiry: Yup.string()
                  //   //   .trim()
                  //   //   .required("Expiry date is required"),
                  //   // b_manufacturing_date: Yup.string()
                  //   //   .trim()
                  //   //   .required("MFG date is required"),
                  // })}
                  onSubmit={(
                    values,
                    { setSubmitting, resetForm, setFieldValue }
                  ) => {
                    let errorArray = [];
                    if (isOpeningBatch == true && values.b_no == "") {
                      errorArray.push("v");
                    } else {
                      errorArray.push("");
                    }
                    if (isOpeningBatch == true && values.opening_qty == "") {
                      errorArray.push("v");
                    } else {
                      errorArray.push("");
                    }
                    // if (values.opening_qty == "") {
                    //   errorArray.push("v");
                    // } else {
                    //   errorArray.push("");
                    // }
                    // if (values.b_mrp == "") {
                    //   errorArray.push("v");
                    // } else {
                    //   errorArray.push("");
                    // }
                    // if (values.b_sale_rate == "") {
                    //   errorArray.push("v");
                    // } else {
                    //   errorArray.push("");
                    // }
                    // if (values.b_purchase_rate == "") {
                    //   errorArray.push("v");
                    // } else {
                    //   errorArray.push("");
                    // }
                    this.setState({ errorArrayBorder: errorArray }, () => {
                      if (allEqual(errorArray)) {
                        // console.log("values", values);
                        this.addBatchOpeningRow(values);
                      }
                    });
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    resetForm,
                    setFieldValue,
                  }) => (
                    <Form
                      onSubmit={handleSubmit}
                      noValidate
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.keyCode == 40) {
                          document.getElementById("BatchStockTr_0").focus();
                        }
                      }}
                    >
                      <div className="mb-2">
                        <Row className="mb-3">
                          {/* {JSON.stringify(isOpeningBatch)} */}
                          {isOpeningBatch == true ? (
                            <>
                              <Col lg={4}>
                                <Row>
                                  <Col lg={4}>
                                    <Form.Label>Batch</Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    <Form.Group>
                                      <Form.Control
                                        autoComplete="off"
                                        autoFocus={
                                          isOpeningBatch == true
                                            ? "true"
                                            : "false"
                                        }
                                        type="text"
                                        placeholder="Batch"
                                        name="b_no"
                                        id="b_no"
                                        onChange={handleChange}
                                        // onKeyPress={(e) => {
                                        //   OnlyEnterNumbers(e);
                                        // }}
                                        value={values.b_no}
                                        // className="text-box text-end"
                                        className={`${values.b_no == "" &&
                                          errorArrayBorder[0] == "v"
                                          ? "border border-danger text-box text-end"
                                          : "text-box text-end "
                                          }`}
                                        onKeyDown={(e) => {
                                          if (e.shiftKey && e.keyCode === 9) {
                                          } else if (e.keyCode === 9) {
                                            e.preventDefault();
                                            if (e.target.value.trim()) {
                                              this.setErrorBorder(
                                                0,
                                                "",
                                                "errorArrayBorder"
                                              );
                                              this.calculateCosting();
                                              this.focusNextElement(e);
                                            } else {
                                              this.setErrorBorder(
                                                0,
                                                "v",
                                                "errorArrayBorder"
                                              );
                                              // this.calculateCosting();
                                            }
                                          } else if (e.keyCode == 13) {
                                            if (e.target.value.trim()) {
                                              this.setErrorBorder(
                                                0,
                                                "",
                                                "errorArrayBorder"
                                              );
                                              this.calculateCosting();
                                              this.focusNextElement(e);
                                            } else {
                                              this.setErrorBorder(
                                                0,
                                                "v",
                                                "errorArrayBorder"
                                              );
                                              // this.calculateCosting();
                                            }
                                          }
                                        }}
                                      />
                                      <span className="text-danger errormsg">
                                        {errors.b_no}
                                      </span>
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : (
                            <></>
                          )}

                          <Col lg={4}>
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Opening Qty.</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Opening Qty"
                                    name="opening_qty"
                                    id="opening_qty"
                                    value={values.opening_qty}
                                    onChange={handleChange}
                                    onKeyPress={(e) => {
                                      OnlyEnterNumbers(e);
                                    }}
                                    // className="text-box text-end "
                                    className={`${values.opening_qty == "" &&
                                      errorArrayBorder[1] == "v"
                                      ? "border border-danger text-box text-end"
                                      : "text-box text-end "
                                      }`}
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.keyCode == 9) {
                                        if (e.target.value.trim()) {
                                          this.setErrorBorder(
                                            1,
                                            "",
                                            "errorArrayBorder"
                                          );
                                          this.calculateCosting();
                                        } else {
                                          this.setErrorBorder(
                                            1,
                                            "v",
                                            "errorArrayBorder"
                                          );
                                        }
                                      } else if (e.key === "Tab") {
                                        if (e.target.value.trim()) {
                                          e.preventDefault();
                                          this.calculateCosting();
                                          this.focusNextElement(e);
                                        } else {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        }
                                      } else if (e.keyCode == 13) {
                                        if (e.target.value.trim()) {
                                          this.calculateCosting();
                                          this.focusNextElement(e);
                                        } else {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        }
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.opening_qty}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4}>
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Free Qty.</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Free Qty"
                                    name="b_free_qty"
                                    id="b_free_qty"
                                    onChange={handleChange}
                                    value={values.b_free_qty}
                                    className="text-box text-end"
                                    onKeyPress={(e) => {
                                      OnlyEnterNumbers(e);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.keyCode == 9) {
                                      } else if (e.keyCode == 9) {
                                        e.preventDefault();
                                        this.calculateCosting();
                                        this.focusNextElement(e);
                                      } else if (e.keyCode == 13) {
                                        this.calculateCosting();
                                        this.focusNextElement(e);
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_free_qty}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          {/* </Row>
                        <Row className="mb-3"> */}
                          <Col lg={4} className="mt-1">
                            <Row>
                              <Col lg={4}>
                                <Form.Label>MRP</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    // autoFocus="true"
                                    type="text"
                                    placeholder="MRP"
                                    name="b_mrp"
                                    id="b_mrp"
                                    onChange={handleChange}
                                    value={values.b_mrp}
                                    // className="text-box"
                                    className="text-box text-end"
                                    // className={`${
                                    //   values.b_mrp == "" &&
                                    //   errorArrayBorder[2] == "v"
                                    //     ? "border border-danger text-box text-end"
                                    //     : "text-box text-end"
                                    // }`}
                                    onKeyPress={(e) => {
                                      OnlyEnterAmount(e);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.keyCode == 9) {
                                      } else if (e.key === "Tab") {
                                        // if (e.target.value.trim()) {
                                        e.preventDefault();
                                        //   this.setErrorBorder(
                                        //     2,
                                        //     "",
                                        //     "errorArrayBorder"
                                        //   );
                                        this.focusNextElement(e);
                                        // } else {
                                        //   this.setErrorBorder(
                                        //     2,
                                        //     "v",
                                        //     "errorArrayBorder"
                                        //   );
                                        //   e.preventDefault();
                                        // }
                                      } else if (e.keyCode == 13) {
                                        // if (e.target.value.trim()) {
                                        e.preventDefault();
                                        //   this.setErrorBorder(
                                        //     2,
                                        //     "",
                                        //     "errorArrayBorder"
                                        //   );
                                        this.focusNextElement(e);
                                        // } else {
                                        //   this.setErrorBorder(
                                        //     2,
                                        //     "v",
                                        //     "errorArrayBorder"
                                        //   );
                                        //   e.preventDefault();
                                        // }
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_mrp}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4} className="mt-1">
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Purchase Rate</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Purchase Rate"
                                    name="b_purchase_rate"
                                    id="b_purchase_rate"
                                    onChange={handleChange}
                                    value={values.b_purchase_rate}
                                    onKeyPress={(e) => {
                                      OnlyEnterAmount(e);
                                    }}
                                    className="text-box text-end"
                                    // className={`${
                                    //   values.b_purchase_rate == "" &&
                                    //   errorArrayBorder[3] == "v"
                                    //     ? "border border-danger text-box text-end"
                                    //     : "text-box text-end"
                                    // }`}
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.keyCode == 9) {
                                      } else if (e.key === "Tab") {
                                        if (e.target.value.trim() > 0) {
                                          e.preventDefault();
                                          // this.setErrorBorder(
                                          //   3,
                                          //   "",
                                          //   "errorArrayBorder"
                                          // );
                                          this.validatePurchaseRate(
                                            values.b_mrp,
                                            values.b_purchase_rate,
                                            setFieldValue
                                          );
                                          this.calculateCosting();
                                          // this.focusNextElement(e);
                                        } else {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                          // this.setErrorBorder(
                                          //   3,
                                          //   "v",
                                          //   "errorArrayBorder"
                                          // );
                                        }
                                      } else if (e.keyCode == 13) {
                                        if (e.target.value.trim() > 0) {
                                          // this.setErrorBorder(
                                          //   3,
                                          //   "",
                                          //   "errorArrayBorder"
                                          // );
                                          this.validatePurchaseRate(
                                            values.b_mrp,
                                            values.b_purchase_rate,
                                            setFieldValue
                                          );
                                          this.calculateCosting();
                                          // this.focusNextElement(e);
                                        } else {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                          // this.setErrorBorder(
                                          //   3,
                                          //   "v",
                                          //   "errorArrayBorder"
                                          // );
                                        }
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_purchase_rate}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4} className="mt-1">
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Costing</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    // autoFocus="true"
                                    type="text"
                                    placeholder="Costing"
                                    name="b_costing"
                                    id="b_costing"
                                    onChange={handleChange}
                                    value={values.b_costing}
                                    // readOnly

                                    onKeyPress={(e) => {
                                      OnlyEnterAmount(e);
                                    }}
                                    className="text-box text-end"
                                    onKeyDown={(e) => {
                                      if (e.keyCode == 13) {
                                        this.focusNextElement(e);
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_costing}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          {/* </Row>
                        <Row className="mb-3"> */}
                          <Col lg={4} className="mt-1">
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Sale Rate</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Sale Rate"
                                    name="b_sale_rate"
                                    id="b_sale_rate"
                                    onChange={handleChange}
                                    value={values.b_sale_rate}
                                    onKeyPress={(e) => {
                                      OnlyEnterAmount(e);
                                    }}
                                    className="text-box text-end"
                                    onKeyDown={(e) => {
                                      if (e.shiftKey && e.keyCode == 9) {
                                      } else if (e.keyCode == 9) {
                                        e.preventDefault();
                                        if (values.b_sale_rate > 0) {
                                          this.validateSalesRate(
                                            values.b_mrp,
                                            values.b_purchase_rate,
                                            values.b_sale_rate,
                                            "b_sale_rate",
                                            setFieldValue
                                          );
                                        } else this.focusNextElement(e);
                                      } else if (e.keyCode == 13) {
                                        if (values.b_sale_rate > 0) {
                                          this.validateSalesRate(
                                            values.b_mrp,
                                            values.b_purchase_rate,
                                            values.b_sale_rate,
                                            "b_sale_rate",
                                            setFieldValue
                                          );
                                        } else this.focusNextElement(e);
                                      }
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_sale_rate}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          {isOpeningBatch == true ? (
                            <>
                              <Col lg={4} className="mt-1">
                                <Row>
                                  <Col lg={4}>
                                    <Form.Label>MFG Date</Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    <MyTextDatePicker
                                      className="form-control text-box"
                                      name="b_manufacturing_date"
                                      id="b_manufacturing_date"
                                      placeholder="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"
                                      value={values.b_manufacturing_date}
                                      onChange={handleChange}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.keyCode == 9) {
                                          let datchco = e.target.value.trim();
                                          // console.log("datchco", datchco);

                                          // console.log("checkdate", checkdate);
                                          if (
                                            datchco != "__/__/____" &&
                                            // checkdate == "Invalid date"
                                            datchco.includes("_")
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date. ",
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              document
                                                .getElementById(
                                                  "b_manufacturing_date"
                                                )
                                                .focus();
                                            }, 1000);
                                          }
                                        } else if (e.keyCode == 9) {
                                          e.preventDefault();
                                          if (e.target.value == "__/__/____") {
                                            this.focusNextElement(e);
                                          } else if (
                                            e.target.value.includes("_") == true
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date",
                                              is_timeout: true,
                                              delay: 1500,
                                              // is_button_show: true,
                                            });
                                            document
                                              .getElementById(
                                                "b_manufacturing_date"
                                              )
                                              .focus();
                                            e.preventDefault();
                                          } else {
                                            let d = new Date();
                                            d.setMilliseconds(0);
                                            d.setHours(0);
                                            d.setMinutes(0);
                                            d.setSeconds(0);
                                            const enteredDate = moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            );
                                            const currentDate = moment(d);
                                            if (
                                              enteredDate.isAfter(currentDate)
                                            ) {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Entered date is greater than current date",
                                                is_timeout: true,
                                                delay: 1500,
                                              });

                                              document
                                                .getElementById(
                                                  "b_manufacturing_date"
                                                )
                                                .focus();
                                              e.preventDefault();
                                            } else {
                                              setFieldValue(
                                                "b_manufacturing_date",
                                                e.target.value
                                              );
                                              this.focusNextElement(e);
                                            }
                                          }
                                        } else if (e.keyCode == 13) {
                                          if (e.target.value == "__/__/____") {
                                            this.focusNextElement(e);
                                          } else if (
                                            e.target.value.includes("_") == true
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date",
                                              is_timeout: true,
                                              delay: 1500,
                                              // is_button_show: true,
                                            });
                                            document
                                              .getElementById(
                                                "b_manufacturing_date"
                                              )
                                              .focus();
                                          } else {
                                            let d = new Date();
                                            d.setMilliseconds(0);
                                            d.setHours(0);
                                            d.setMinutes(0);
                                            d.setSeconds(0);
                                            const enteredDate = moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            );
                                            const currentDate = moment(d);
                                            if (
                                              enteredDate.isAfter(currentDate)
                                            ) {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Entered date is greater than current date",
                                                is_timeout: true,
                                                delay: 1500,
                                              });

                                              document
                                                .getElementById(
                                                  "b_manufacturing_date"
                                                )
                                                .focus();
                                            } else {
                                              setFieldValue(
                                                "b_manufacturing_date",
                                                e.target.value
                                              );
                                              this.focusNextElement(e);
                                            }
                                          }
                                        }
                                      }}
                                    />
                                    <span className="text-danger errormsg">
                                      {errors.b_manufacturing_date}
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4} className="mt-1">
                                <Row>
                                  <Col lg={4}>
                                    <Form.Label>Expiry Date</Form.Label>
                                  </Col>
                                  <Col lg={8}>
                                    <MyTextDatePicker
                                      className="form-control text-box"
                                      name="b_expiry"
                                      id="b_expiry"
                                      placeholder="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"
                                      value={values.b_expiry}
                                      onChange={handleChange}
                                      onKeyDown={(e) => {
                                        if (e.shiftKey && e.keyCode == 9) {
                                          let datchco = e.target.value.trim();
                                          // console.log("datchco", datchco);

                                          // console.log("checkdate", checkdate);
                                          if (
                                            datchco != "__/__/____" &&
                                            // checkdate == "Invalid date"
                                            datchco.includes("_")
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date. ",
                                              is_timeout: true,
                                              delay: 1500,
                                            });
                                            setTimeout(() => {
                                              document
                                                .getElementById("b_expiry")
                                                .focus();
                                            }, 1000);
                                          }
                                        } else if (e.keyCode == 9) {
                                          e.preventDefault();
                                          if (e.target.value == "__/__/____") {
                                            this.focusNextElement(e);
                                          } else if (
                                            e.target.value.includes("_") == true
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date",
                                              is_timeout: true,
                                              delay: 1500,
                                              // is_button_show: true,
                                            });
                                            document
                                              .getElementById("b_expiry")
                                              .focus();
                                          } else {
                                            let d = new Date();
                                            d.setMilliseconds(0);
                                            d.setHours(0);
                                            d.setMinutes(0);
                                            d.setSeconds(0);
                                            const enteredDate = moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            );
                                            const currentDate = moment(d);
                                            if (
                                              // enteredDate.isAfter(currentDate)
                                              currentDate.isAfter(enteredDate)
                                            ) {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Entered date is less than current date",
                                                is_timeout: true,
                                                delay: 1500,
                                              });

                                              document
                                                .getElementById("b_expiry")
                                                .focus();
                                            } else {
                                              setFieldValue(
                                                "b_expiry",
                                                e.target.value
                                              );
                                              this.focusNextElement(e);
                                            }
                                          }
                                        } else if (e.keyCode == 13) {
                                          if (e.target.value == "__/__/____") {
                                            this.focusNextElement(e);
                                          } else if (
                                            e.target.value.includes("_") == true
                                          ) {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Please Enter Correct Date",
                                              is_timeout: true,
                                              delay: 1500,
                                              // is_button_show: true,
                                            });
                                            document
                                              .getElementById("b_expiry")
                                              .focus();
                                          } else {
                                            let d = new Date();
                                            d.setMilliseconds(0);
                                            d.setHours(0);
                                            d.setMinutes(0);
                                            d.setSeconds(0);
                                            const enteredDate = moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            );
                                            const currentDate = moment(d);
                                            if (
                                              // enteredDate.isAfter(currentDate)
                                              currentDate.isAfter(enteredDate)
                                            ) {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg: "Entered date is less than current date",
                                                is_timeout: true,
                                                delay: 1500,
                                              });

                                              document
                                                .getElementById("b_expiry")
                                                .focus();
                                            } else {
                                              setFieldValue(
                                                "b_expiry",
                                                e.target.value
                                              );
                                              this.focusNextElement(e);
                                            }
                                          }
                                        }
                                      }}
                                    />
                                    {/* <span className="text-danger errormsg">
                                  {errors.b_expiry}
                                </span> */}
                                  </Col>
                                </Row>
                              </Col>
                            </>
                          ) : (
                            <></>
                          )}
                        </Row>
                        <Row>
                          <Col md="12 mb-2" className="btn_align">
                            <Button
                              id="submitCostingBtn"
                              className="submit-btn successbtn-style me-2"
                              type="submit"
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.openingBatchRef.current.handleSubmit();
                                }
                              }}
                            >
                              {/* {values.id == "" ? "Add" : "Update"} */}
                              {values.isUpdate === false ? "Add" : "Update"}
                            </Button>
                            <Button
                              variant="secondary cancel-btn"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                resetForm();
                                this.clearOpeningStockData();
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.clearOpeningStockData();
                                }
                              }}
                              className="ms-2"
                            >
                              Clear
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="productModalStyle">
                  <Table
                    // striped
                    // bordered
                    hover
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        {/* <th>Unit</th> */}
                        {isOpeningBatch == true ? <th>Batch</th> : ""}

                        <th>Opening Qty</th>
                        <th>Free Qty</th>
                        <th>MRP</th>
                        <th>Purchase Rate</th>
                        <th>Costing</th>
                        <th>Sale Rate</th>
                        <th>MFG Date</th>
                        <th>Expiry Date</th>
                        {/* <th>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody
                      onKeyDown={(e) => {
                        e.preventDefault();
                        if (e.keyCode != 9) {
                          this.handleBatchStockTableRow(e);
                        }
                      }}
                    >
                      {batchList.length > 0 &&
                        batchList.map((v, i) => {
                          return (
                            <tr
                              value={JSON.stringify(v)}
                              id={`BatchStockTr_` + i}
                              batchId={v.id}
                              tabIndex={i}
                              onClick={(e) => {
                                e.preventDefault();
                                this.openingBatchUpdate(
                                  v,
                                  this.openingBatchRef.current.setFieldValue,
                                  i
                                );
                              }}
                            >
                              {/* <td>
                                        {mstPackaging[claIndex]["levela_id"] &&
                                          mstPackaging[claIndex]["levela_id"][
                                            "label"
                                          ]}
                                      </td>
                                      <td>
                                        {mstPackaging[claIndex]["levelb"][
                                          clbIndex
                                        ]["levelc"][clcIndex]["units"][cuIndex][
                                          "unit_id"
                                        ] &&
                                          mstPackaging[claIndex]["levelb"][
                                            clbIndex
                                          ]["levelc"][clcIndex]["units"][
                                            cuIndex
                                          ]["unit_id"]["label"]}
                                      </td> */}
                              {isOpeningBatch == true ? <td>{v.b_no}</td> : ""}
                              <td>{v.opening_qty}</td>
                              <td>{v.b_free_qty}</td>
                              <td>{v.b_mrp}</td>
                              <td>{v.b_purchase_rate}</td>
                              <td>{v.b_costing}</td>
                              <td>{v.b_sale_rate}</td>
                              <td>{v.b_manufacturing_date}</td>
                              <td>{v.b_expiry}</td>
                              <td>
                                {/* <img
                                          src={TableEdit}
                                          alt=""
                                          className="table_icons"
                                        />
                                        <img
                                          src={TableDelete}
                                          alt=""
                                          className="table_icons"
                                        /> */}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col md="12 mb-2" className="btn_align">
                <Button
                  id="batchStock_submit_btn"
                  className="submit-btn successbtn-style me-2"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState(
                      { index: -1, batchList: [], rowIndex: "no" },
                      () => {
                        productSetChange({ opnStockModalShow: false });
                      }
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode == 38) {
                      if (batchList != "" && batchList.length > 0) {
                        let ind = batchList.length - 1;
                        document.getElementById("BatchStockTr_" + ind).focus();
                      } else {
                        document.getElementById("b_no").focus();
                      }
                    } else if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      this.setState(
                        { index: -1, batchList: [], rowIndex: "no" },
                        () => {
                          productSetChange({ opnStockModalShow: false });
                        }
                      );
                    }
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="secondary cancel-btn ms-2"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ index: -1, batchList: [] }, () => {
                      productSetChange({ opnStockModalShow: false });
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                      e.preventDefault();
                    } else if (e.keyCode === 13) {
                      this.setState({ index: -1, batchList: [] }, () => {
                        productSetChange({ opnStockModalShow: false });
                      });
                    }
                  }}
                  className="ms-2"
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
        {/* Unit Modal */}
        <Modal
          show={unitModalShow}
          size="md"
          className="modal-style"
          onHide={() => this.unitModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {unitInitVal.id === "" ? "Add New" : "Update"} Unit
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.unitModalShow(false)}
            />
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={unitInitVal}
              enableReinitialize={true}
              innerRef={this.UnitMdlRef}
              // validationSchema={Yup.object().shape({
              //   unitName: Yup.string().trim().required("Unit name is required"),
              //   unitCode: Yup.object().required("Unit code is required"),
              // })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.unitName == "") {
                  errorArray.push("w");
                } else {
                  errorArray.push("");
                }
                if (values.unitCode == "" || values.unitCode == null) {
                  errorArray.push("w");
                } else {
                  errorArray.push("");
                }
                this.setState({ errorArrayBorderUnit: errorArray }, () => {
                  if (allEqual(errorArray)) {
                    // document.getElementById(`selectedUnit-${pi}`).focus();
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to submit",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          let requestData = new FormData();
                          requestData.append("unitName", values.unitName);
                          requestData.append("unitCode", values.unitCode.value);

                          if (values.id == "") {
                            createUnit(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  // MyNotifications.fire({
                                  //   show: true,
                                  //   icon: "success",
                                  //   title: "Success",
                                  //   msg: res.message,
                                  //   is_timeout: true,
                                  //   delay: 1000,
                                  // });
                                  // resetForm();
                                  this.unitModalShow(
                                    false,
                                    this.state.unitIndex
                                  );
                                  this.lstUnit(true);
                                  // this.pageReload();
                                  document.getElementById(currentId).focus();
                                } else if (res.responseStatus == 409) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                  setTimeout(() => {
                                    document
                                      .getElementById("unitNew_submit_btn")
                                      .focus();
                                  }, 2000);
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            updateUnit(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  // resetForm();
                                  this.unitModalShow(
                                    false,
                                    this.state.unitIndex
                                  );
                                  this.lstUnit(true);
                                  // this.pageReload();
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    // is_button_show: true,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  setTimeout(() => {
                                    document
                                      .getElementById("unitNew_submit_btn")
                                      .focus();
                                  }, 2000);
                                }
                              })
                              .catch((error) => { });
                          }
                        },
                        handleFailFn: () => { },
                      },
                      () => {
                        // console.warn("return_data");
                      }
                    );
                  }
                });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  className="form-style"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="5">
                        <Form.Group>
                          <Form.Control
                            style={{
                              borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            autoComplete="off"
                            // className="text-box"
                            type="text"
                            autoFocus={true}
                            placeholder="Unit Name"
                            name="unitName"
                            id="unitName"
                            onChange={handleChange}
                            value={values.unitName}
                            isValid={touched.unitName && !errors.unitName}
                            isInvalid={!!errors.unitName}
                            className={`${values.unitName == "" &&
                              errorArrayBorderUnit[0] == "w"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.key === "Tab") {
                                if (!e.target.value.trim()) e.preventDefault();
                                else {
                                  e.preventDefault();
                                  this.focusNextElement(e);
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "unitName",
                                    e.target.value
                                  );
                                }
                              } else if (e.keyCode === 13)
                                if (e.target.value.trim()) {
                                  this.focusNextElement(e);
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "unitName",
                                    e.target.value
                                  );
                                } else e.preventDefault();
                            }}
                            onBlur={(e) => {
                              e.target.value = handleDataCapitalised(e.target.value);
                              handlesetFieldValue(setFieldValue, "unitName", e.target.value);
                            }}
                          />
                          <span className="text-danger errormsg">
                            {errors.unitName}
                          </span>
                        </Form.Group>
                      </Col>
                      <Col md="7">
                        <Form.Group
                          style={{ borderRadius: "4px" }}
                          className={`${values.unitCode == "" &&
                            errorArrayBorderUnit[1] == "w"
                            ? "border border-danger selectTo"
                            : "selectTo"
                            }`}
                          onKeyDown={(e) => {
                            if (e.shiftKey && e.key === "Tab") {
                            } else if (e.key === "Tab" && !values.unitCode)
                              e.preventDefault();
                            else if (e.keyCode === 13)
                              if (values.unitCode) this.focusNextElement(e);
                              else e.preventDefault();
                          }}
                        >
                          <Select
                            className="selectTo unitpopup"
                            id="unitCode"
                            placeholder="Unit Code"
                            // styles={customStyles}
                            styles={productDropdown}
                            // styles={createPro}
                            isClearable
                            options={uomoption}
                            name="unitCode"
                            onChange={(value) => {
                              setFieldValue("unitCode", value);
                            }}
                            value={values.unitCode}
                          />

                          <span className="text-danger errormsg">
                            {errors.unitCode}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="unitNew_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.UnitMdlRef.current.handleSubmit();
                        }
                      }}
                    >
                      {unitInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      // className="mdl-cancel-btn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        this.unitModalShow(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.unitModalShow(false);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        {/* Level A */}
        <Modal
          show={levelAModalShow}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "sm"
              : "md"
          }
          className="modal-style"
          onHide={() => this.levelAModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {levelAInitVal.id === "" ? "Add New" : "Update"}{" "}
              {levelA ? levelA.label : ""}
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.levelAModalShow(false)}
            />
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={levelAInitVal}
              enableReinitialize={true}
              innerRef={this.LevelAMdlRef}
              // validationSchema={Yup.object().shape({
              //   levelName: Yup.string().trim().required("Name is required"),
              // })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.levelName == "") {
                  errorArray.push("x");
                } else {
                  errorArray.push("");
                }
                // if (values.unitCode == "" || values.unitCode == null) {
                //   errorArray.push("w");
                // } else {
                //   errorArray.push("");
                // }

                this.setState({ errorArrayBorderLevelA: errorArray }, () => {
                  if (allEqual(errorArray)) {
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to submit",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          let requestData = new FormData();
                          requestData.append("levelName", values.levelName);

                          if (values.id == "") {
                            create_levelA(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  // MyNotifications.fire({
                                  //   show: true,
                                  //   icon: "success",
                                  //   title: "Success",
                                  //   msg: res.message,`
                                  //   is_timeout: true,
                                  //   delay: 1000,
                                  // });
                                  // resetForm();
                                  this.levelAModalShow(
                                    false,
                                    this.state.levelAindex
                                  );
                                  this.getLevelALst(true);
                                  // this.pageReload();
                                  document.getElementById(currentIdA).focus();
                                } else if (res.responseStatus == 409) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                  setTimeout(() => {
                                    document
                                      .getElementById("levelA_submit_btn")
                                      .focus();
                                  }, 2000);
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            update_levelA(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  // resetForm();
                                  this.levelAModalShow(false);
                                  this.getLevelALst();

                                  // this.pageReload();
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                  setTimeout(() => {
                                    document
                                      .getElementById("levelA_submit_btn")
                                      .focus();
                                  }, 2000);
                                }
                              })
                              .catch((error) => { });
                          }
                        },
                        handleFailFn: () => { },
                      },
                      () => {
                        // console.warn("return_data");
                      }
                    );
                  }
                });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  className="form-style"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col lg={11}>
                        <Form.Group>
                          <Form.Control
                            style={{
                              borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            autoComplete="off"
                            // className="text-box"
                            type="text"
                            autoFocus="true"
                            placeholder="Level Name"
                            name="levelName"
                            id="levelName"
                            onChange={handleChange}
                            value={values.levelName}
                            isValid={touched.levelName && !errors.levelName}
                            isInvalid={!!errors.levelName}
                            className={`${values.levelName == "" &&
                              errorArrayBorderLevelA[0] == "x"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.key === "Tab") {
                                if (!e.target.value.trim()) {
                                  e.preventDefault();
                                } else {
                                  e.preventDefault();
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "levelName",
                                    e.target.value
                                  );
                                  document
                                    .getElementById("levelA_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (!e.target.value.trim()) {
                                  e.preventDefault();
                                } else {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "levelName",
                                    e.target.value
                                  );
                                  document
                                    .getElementById("levelA_submit_btn")
                                    .focus();
                                }
                              }
                            }}
                            onBlur={(e) => {
                              e.target.value = handleDataCapitalised(e.target.value);
                              handlesetFieldValue(
                                setFieldValue,
                                "levelName",
                                e.target.value
                              )
                            }}
                          />
                          <span className="text-danger errormsg">
                            {errors.levelName}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="levelA_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.LevelAMdlRef.current.handleSubmit();
                        }
                      }}
                    >
                      {levelAInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      // className="mdl-cancel-btn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        this.levelAModalShow(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.levelAModalShow(false);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        {/* Level B */}
        <Modal
          show={levelBModalShow}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "sm"
              : "md"
          }
          className="modal-style"
          onHide={() => this.levelBModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {levelBInitVal.id === "" ? "Add New" : "Update"}{" "}
              {levelB ? levelB.label : ""}
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.levelBModalShow(false)}
            />
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={levelBInitVal}
              enableReinitialize={true}
              innerRef={this.LevelBMdlRef}
              // validationSchema={Yup.object().shape({
              //   levelName: Yup.string().trim().required("Name is required"),
              // })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.levelName == "") {
                  errorArray.push("y");
                } else {
                  errorArray.push("");
                }

                this.setState({ errorArrayBorderLevelB: errorArray }, () => {
                  if (allEqual(errorArray)) {
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to submit",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          let requestData = new FormData();
                          requestData.append("levelName", values.levelName);

                          if (values.id == "") {
                            create_levelB(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  // MyNotifications.fire({
                                  //   show: true,
                                  //   icon: "success",
                                  //   title: "Success",
                                  //   msg: res.message,
                                  //   is_timeout: true,
                                  //   delay: 1000,
                                  // });
                                  // resetForm();
                                  this.levelBModalShow(
                                    false,
                                    this.state.levelBindex
                                  );
                                  this.getLevelBLst(true);
                                  // this.pageReload();
                                  document.getElementById(currentIdB).focus();
                                } else if (res.responseStatus == 409) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                  setTimeout(() => {
                                    document
                                      .getElementById("levelB_submit_btn")
                                      .focus();
                                  }, 2000);
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            update_levelB(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  // resetForm();
                                  this.levelBModalShow(false);
                                  this.getLevelBLst();

                                  // this.pageReload();
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                  setTimeout(() => {
                                    document
                                      .getElementById("levelB_submit_btn")
                                      .focus();
                                  }, 2000);
                                }
                              })
                              .catch((error) => { });
                          }
                        },
                        handleFailFn: () => { },
                      },
                      () => {
                        // console.warn("return_data");
                      }
                    );
                  }
                });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  className="form-style"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            style={{
                              borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            autoComplete="off"
                            // className="text-box"
                            type="text"
                            autoFocus="true"
                            placeholder="Level Name"
                            name="levelName"
                            id="levelName"
                            onChange={handleChange}
                            value={values.levelName}
                            isValid={touched.levelName && !errors.levelName}
                            isInvalid={!!errors.levelName}
                            className={`${values.levelName == "" &&
                              errorArrayBorderLevelB[0] == "y"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.key === "Tab") {
                                if (!e.target.value.trim()) {
                                  e.preventDefault();
                                } else {
                                  e.preventDefault();
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "levelName",
                                    e.target.value
                                  );
                                  document
                                    .getElementById("levelB_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (!e.target.value.trim()) {
                                  e.preventDefault();
                                } else {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "levelName",
                                    e.target.value
                                  );
                                  document
                                    .getElementById("levelB_submit_btn")
                                    .focus();
                                }
                              }
                            }}
                            onBlur={(e) => {
                              e.target.value = handleDataCapitalised(e.target.value);
                              handlesetFieldValue(setFieldValue,
                                "levelName", e.target.value);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="levelB_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.LevelBMdlRef.current.handleSubmit();
                        }
                      }}
                    >
                      {levelBInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      // className="mdl-cancel-btn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        this.levelBModalShow(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.levelBModalShow(false);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
        {/* Level C */}
        <Modal
          show={levelCModalShow}
          size={
            window.matchMedia("(min-width:1024px) and (max-width:1401px)")
              .matches
              ? "sm"
              : "md"
          }
          className="modal-style"
          onHide={() => this.levelCModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {levelCInitVal.id === "" ? "Add New" : "Update"}{" "}
              {levelC ? levelC.label : ""}
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.levelCModalShow(false)}
            />
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={levelCInitVal}
              enableReinitialize={true}
              innerRef={this.LevelCMdlRef}
              // validationSchema={Yup.object().shape({
              //   levelName: Yup.string().trim().required("Name is required"),
              // })}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.levelName == "") {
                  errorArray.push("z");
                } else {
                  errorArray.push("");
                }

                this.setState({ errorArrayBorderLevelB: errorArray }, () => {
                  if (allEqual(errorArray)) {
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to submit",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          let requestData = new FormData();
                          requestData.append("levelName", values.levelName);

                          if (values.id == "") {
                            create_levelC(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  // MyNotifications.fire({
                                  //   show: true,
                                  //   icon: "success",
                                  //   title: "Success",
                                  //   msg: res.message,
                                  //   is_timeout: true,
                                  //   delay: 1000,
                                  // });
                                  // resetForm();
                                  this.levelCModalShow(
                                    false,
                                    this.state.levelCindex
                                  );
                                  this.getLevelCLst(true);
                                  // this.pageReload();
                                  document.getElementById(currentIdC).focus();
                                } else if (res.responseStatus == 409) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                  setTimeout(() => {
                                    document
                                      .getElementById("levelC_submit_btn")
                                      .focus();
                                  }, 2000);
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            update_levelC(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                  });
                                  // resetForm();
                                  this.levelCModalShow(false);
                                  this.getLevelCLst();

                                  // this.pageReload();
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1500,
                                    // is_button_show: true,
                                  });
                                  setTimeout(() => {
                                    document
                                      .getElementById("levelC_submit_btn")
                                      .focus();
                                  }, 2000);
                                }
                              })
                              .catch((error) => { });
                          }
                        },
                        handleFailFn: () => { },
                      },
                      () => {
                        // console.warn("return_data");
                      }
                    );
                  }
                });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                setFieldValue,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  className="form-style"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            style={{
                              borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            autoComplete="off"
                            // className="text-box"
                            type="text"
                            autoFocus="true"
                            placeholder="Level Name"
                            name="levelName"
                            id="levelName"
                            onChange={handleChange}
                            value={values.levelName}
                            isValid={touched.levelName && !errors.levelName}
                            isInvalid={!!errors.levelName}
                            className={`${values.levelName == "" &&
                              errorArrayBorderLevelC[0] == "z"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.key === "Tab") {
                                if (!e.target.value.trim()) {
                                  e.preventDefault();
                                } else {
                                  e.preventDefault();
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "levelName",
                                    e.target.value
                                  );
                                  document
                                    .getElementById("levelC_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (!e.target.value.trim()) {
                                  e.preventDefault();
                                } else {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "levelName",
                                    e.target.value
                                  );
                                  document
                                    .getElementById("levelC_submit_btn")
                                    .focus();
                                }
                              }
                            }}
                            onBlur={(e) => {
                              e.target.value = handleDataCapitalised(e.target.value);
                              handlesetFieldValue(setFieldValue,
                                "levelName", e.target.value
                              )
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="levelC_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.LevelCMdlRef.current.handleSubmit();
                        }
                      }}
                    >
                      {unitInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      // className="mdl-cancel-btn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        this.levelCModalShow(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.levelCModalShow(false);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({ userPermissions, userControl }) => {
  return { userPermissions, userControl };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
      setUserControl,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(CMPProductTable);
