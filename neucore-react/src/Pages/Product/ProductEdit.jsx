import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Modal,
  CloseButton,
  Table,
} from "react-bootstrap";
import { Formik } from "formik";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";

import * as Yup from "yup";
import moment from "moment";
import file_icon from "@/assets/images/product/file_icon.svg";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import filter from "@/assets/images/product/filter.svg";
import Select from "react-select";
import {
  updateProduct,
  createTax,
  get_taxOutlet,
  getAllHSN,
  getAllBrands,
  get_outlet_groups,
  getAllCategory,
  getAllSubCategory,
  createHSN,
  updateHSN,
  validate_product,
  getBrandCategoryLevelOpt,
  getMstPackageList,
  getAllUnit,
  getProductEdit,
  get_product_units_levels,
  get_outlet_levelA,
  get_outlet_levelB,
  get_outlet_levelC,
  createBrand,
  createGroup,
  createCategory,
  createPacking,
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
  validate_HSN,
} from "@/services/api_functions";

import {
  ShowNotification,
  AuthenticationCheck,
  MyDatePicker,
  customStylesWhite,
  eventBus,
  getSelectValue,
  MyNotifications,
  getValue,
  createPro,
  MyTextDatePicker,
  productDropdown,
  isMultiRateExist,
  AlphabetwithSpecialChars,
  getUserControlData,
  getUserControlLevel,
  isUserControl,
  OnlyEnterNumbers,
} from "@/helpers";

import LevelA from "./LevelA";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    border: state.isFocused
      ? "1px solid #2B2D42 !important"
      : "1px solid #D9D9D9",
    boxShadow: state.isFocused
      ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      : "0px 3px 3px rgba(0, 0, 0, 0.06)",
    height: 40,
    minHeight: 40,
    borderRadius: "4px",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "19px",
    color: "#383838",
    paddingLeft: "8px",
    // paddingLeft: "5px",
    "&:hover": {
      border: "1px solid #D9D9D9",
      // boxShadow: "0px 0px 6px #ff8b67"
    },
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#0B9CBC",
    padding: "5px",
    "&:hover": {
      color: "#0B9CBC",
      // boxShadow: "0px 0px 6px #ff8b67"
    },
  }),
  menu: (base) => ({ ...base, zIndex: 91, fontSize: "14px" }),
};

const typeoption = [
  { label: "Services", value: "Services" },
  { label: "Goods", value: "Goods" },
];

const taxTypeOpts = [
  { label: "Taxable", value: "Taxable" },
  { label: "Tax Paid", value: "taxPaid" },
  { label: "Exempted", value: "exempted" },
];
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
class ProductEdit extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.openingBatchRef = React.createRef();

    this.state = {
      isEditDataSet: false,
      show: false,
      opendiv: false,
      toggle: false,
      currentDate: new Date(),
      groupModalShow: false,
      subgroupModalShow: false,
      categoryModalShow: false,
      subcategoryModalShow: false,
      flavourModalShow: false,
      unitModalShow: false,
      packageModalShow: false,
      productEditmodal1: false,
      transaction_mdl_show: false,
      HSNshow: false,
      isOpeningBatch: false,
      taxModalShow: false,
      inventoryRadio: "",
      source: "",
      selectData: "",
      invoice_data: "",
      groupidshow: [],
      isOpeningBatch: false,
      groupLst: [],
      brandLst: [],
      categoryLst: [],
      subCategoryLst: [],
      isLoading: false,
      unitLevel: ["High", "Medium", "Low"],
      unitarray: [],
      optHSNList: [],
      optTaxList: [],
      isLoading: false,
      getproducttable: [],
      isBatchHideShow: false,
      initValTax: {
        id: "",
        gst_per: "",
        sratio: "50%",
        igst: "",
        cgst: "",
        sgst: "",
      },
      initVal: {
        productName: "",
        description: "",
        alias: "",
        brandId: "",
        groupId: "",
        categoryId: "",
        subcategoryId: "",
        groupfetchid: "",
        hsnId: "",
        taxMasterId: "",
        taxApplicableDate: "",
        isBrand: false,
        isGroup: false,
        isCategory: false,
        isSubCategory: false,
        isPackage: false,
        isSerialNo: false,
        isInventory: false,
        isNegativeStocks: "no",
        isWarranty: false,
        nodays: 0,
        is_packaging: false,
        is_flavour: false,
        no_packagings: 0,
        isBatchNo: false,
        isLevelA: true,
        isLevelB: true,
        isLevelC: true,
        isLevelD: false,
        isInventory: false,
        isSerialNo: false,
      },
      batchInitVal: {
        id: 0,
        b_no: "",
        batch_id: "",
        opening_qty: "",
        b_free_qty: 0,
        b_mrp: "",
        b_sale_rate: "",
        b_purchase_rate: "",
        b_costing: 0,
        b_expiry: "",
        b_manufacturing_date: "",
        isOpeningbatch: false,
      },
      HSNinitVal: {
        id: "",
        hsnNumber: "",
        igst: "",
        cgst: "",
        sgst: "",
        description: "",
        type: "",
      },
      subGroupInitValue: {
        groupId: "",
        brandName: "",
      },
      categoryInitValue: {
        groupId: "",
        brandId: "",
        categoryName: "",
      },
      subcategoryInitvalue: {
        groupId: "",
        brandId: "",
        categoryId: "",
        subCategoryName: "",
      },
      flavourInitval: {
        id: "",
        flavour_name: "",
      },
      packagingInitVal: {
        id: "",
        packing_name: "",
      },
      unitInitVal: {
        id: "",
        unitName: "",
        unitCode: "",
        uom: "",
      },
      packageModalShow: false,
      flavourModalShow: false,
      unitModalShow: false,
      mstUnits: [""],
      mstPackaging: [],
      mstFlavour: [],
      fileModalShow: false,
      files: [],
      brandOpt: [],
      groupOpt: [],
      categoryOpt: [],
      packageOpt: [],
      unitOpts: [],
      filterOpts: [],
      subFilterOpts: [],
      single_unit: {
        unit_id: "",
        unit_conv: 0,
        unit_marg: 0,
        min_qty: 0,
        max_qty: 0,
        disc_amt: 0,
        disc_per: 0,
        mrp: 0,
        purchase_rate: 0,
        sales_rate: 0,
        min_sales_rate: 0,
        opening_qty: 0,
        opening_valution: 0,
        retailer_rate: 0,
        distributor_rate: 0,
      },
      rowDelDetailsIds: [],
      brandInitVal: {
        id: "",
        brandName: "",
      },
      brandModalShow: false,
      groupInitVal: {
        id: "",
        groupName: "",
      },
      categoryInitVal: {
        id: "",
        categoryName: "",
      },
      categoryModalShow: false,
      packageInitVal: {
        id: "",
        packageName: "",
      },
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

      opnStockModalShow: false,
      claIndex: -1,
      clbIndex: -1,
      clcIndex: -1,
      cuIndex: -1,

      ABC_flag_value: "",
    };
  }

  lstBrands = (brandFlag = false) => {
    console.warn("rahul::brandFlag", brandFlag);
    // if (groupFlag) {
    getAllBrands()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let Opt = data.map(function (values) {
            return { value: values.id, label: values.brandName };
          });
          if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
          else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

          this.setState({ brandOpt: Opt });
          if (brandFlag) {
            this.myRef.current.setFieldValue("brandId", Opt[Opt.length - 1]);
          }
        }
      })
      .catch((error) => {});
  };

  lstGroups = (groupFlag = false) => {
    // if (groupFlag) {
    get_outlet_groups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let Opt = data.map(function (values) {
            return { value: values.id, label: values.groupName };
          });

          if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
          else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

          this.setState({ groupOpt: Opt });
          if (groupFlag) {
            this.myRef.current.setFieldValue("groupId", Opt[Opt.length - 1]);
          }
        }
      })
      .catch((error) => {});
    // } else {
    //   this.setState({ groupOpt: [] });
    // }
  };

  lstCategories = (categoryFlag = false) => {
    // if (categoryFlag) {
    getAllCategory()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let Opt = data.map(function (values) {
            return { value: values.id, label: values.categoryName };
          });

          if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
          else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

          this.setState({ categoryOpt: Opt });
          if (categoryFlag) {
            this.myRef.current.setFieldValue("categoryId", Opt[Opt.length - 1]);
          }
        }
      })
      .catch((error) => {});
    // } else {
    //   this.setState({ categoryOpt: [] });
    // }
  };
  validatePurchaseRate = (mrp = 0, p_rate = 0, setFieldValue) => {
    if (parseFloat(mrp) < parseFloat(p_rate) === true) {
      MyNotifications.fire({
        show: true,
        icon: "warn",
        title: "Warning",
        msg: "Purchase rate should less than MRP",
        //  is_timeout: true,
        //  delay: 1000,
      });
      setFieldValue("b_purchase_rate", p_rate);
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
        icon: "warn",
        title: "Warning",
        msg: "Sales rate is always between Purchase and Mrp",
        //  is_timeout: true,
        //  delay: 1000,
      });
      setFieldValue("b_purchase_rate", purchaseRate);
      setFieldValue("b_sale_rate", salesRates);
    }
  };

  lstSubCategories = (subCategoryFlag = false) => {
    if (subCategoryFlag) {
      getAllSubCategory()
        .then((response) => {
          let res = response.data;
          if (res.responseStatus == 200) {
            let data = res.responseObject;

            let Opt = data.map(function (values) {
              return { value: values.id, label: values.subcategoryName };
            });
            this.setState({ subCategoryLst: Opt });
          }
        })
        .catch((error) => {});
    } else {
      this.setState({ subCategoryLst: [] });
    }
  };

  lstUnit = () => {
    getAllUnit()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          let Opt = [];
          if (data.length > 0) {
            Opt = data.map(function (values) {
              return { value: values.id, label: values.unitCode };
            });

            if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
            else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

            this.setState({ unitOpts: Opt });
          } else {
            if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
            else Opt.unshift({ value: Opt.length + 1, label: "Add New" });
            this.setState({ unitOpts: Opt });
          }
        }
      })
      .catch((error) => {});
  };

  getMstPackageOptions = (packageFlag = false) => {
    // if (packageFlag) {
    getMstPackageList()
      .then((response) => {
        let data = response.data;
        if (data.responseStatus == 200) {
          let Opt = data.list.map((v) => {
            return { label: v.name, value: v.id, ...v };
          });

          if (Opt.length == 0) Opt.unshift({ label: "Add New", value: "0" });
          else Opt.unshift({ label: "Add New", value: Opt.length + 1 });

          this.setState({ packageOpt: Opt });
          if (packageFlag) {
            this.myRef.current.setFieldValue(
              "packagingId",
              Opt[Opt.length - 1]
            );
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
    // } else {
    //   this.setState({ packageOpt: [] });
    // }
  };

  validateProduct = (element, value, setFieldValue) => {
    // let requestData = new FormData();
    // requestData.append("productName", productName);
    let requestData = new FormData();
    let flag = false;
    requestData.append("element", element);
    requestData.append("value", value);
    validate_product(requestData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          // console.log("res----", res);
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_button_show: true,
          });
          setFieldValue("productName", "");
          flag = true;
        }
      })
      .catch((error) => {});
    return flag;
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

  handleMstStateClose = () => {
    this.setState({ show: false });
  };

  handleGstChange = (value, element, valObject, setFieldValue) => {
    let flag = false;
    let igst = 0;
    if (element == "gst_per") {
      if (value != "") {
        let gst_per = value;
        igst = value.replace("%", "");

        setFieldValue("gst_per", gst_per);
        setFieldValue("igst", igst);
      } else {
        setFieldValue("gst_per", "");
        setFieldValue("igst", "");
      }
    }

    if (valObject.sratio != "") {
      // if (value != '') {
      igst = igst > 0 ? igst : valObject.igst;
      let sratio = parseFloat(valObject.sratio);
      let per = parseFloat((igst * sratio) / 100);
      let rem = parseFloat(igst - per);
      setFieldValue("sratio", sratio);
      setFieldValue("cgst", per);
      setFieldValue("sgst", rem);
      // } else {
      //   setFieldValue('sratio', '');
      //   setFieldValue('cgst', '');
      //   setFieldValue('sgst', '');
      // }
    }
  };

  lstTAX = (id = false) => {
    get_taxOutlet()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.gst_per,
              sratio: data.ratio,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });

          if (options.length == 0)
            options.unshift({
              value: "0",
              label: "Add New",
              sratio: "",
              igst: "",
              cgst: "",
              sgst: "",
            });
          else
            options.unshift({
              value: options.length + 1,
              label: "Add New",
              sratio: "",
              igst: "",
              cgst: "",
              sgst: "",
            });

          this.setState({ optTaxList: options });
          if (id) {
            this.myRef.current.setFieldValue(
              "tax",
              options[options.length - 1]
            );
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  initUnitArray = () => {
    let uarray = [];
    const { unitLevel } = this.state;
    unitLevel.map((v, i) => {
      let innerd = {
        unitType: v,
        unitId: 0,
        unitConv: 0,
        unitConvMargn: 0,
        minQty: 0,
        maxQty: 0,
        minDisPer: 0,
        maxDisPer: 0,
        minDisAmt: 0,
        maxDisAmt: 0,
        mrp: 0,
        purchaseRate: 0,
        saleRate: 0,
        minSaleRate: 0,
        distributorRate: 0,
        retailerRate: 0,
      };
      uarray.push(innerd);
    });
    this.setState({ unitarray: uarray });
  };

  initUnitArrFilter = () => {
    let { single_unit } = this.state;
    let unit_arr = [{ unit_arr: [{ ...single_unit }] }];
    this.setState({ mstFinalFilterLevel: unit_arr });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.initUnitArray();
      this.initUnitArrFilter();
      this.initPacaking();

      this.lstBrands();
      this.lstGroups();
      this.lstCategories();
      this.getMstPackageOptions();
      this.lstTAX();
      this.lstHSN();
      this.lstUnit();
      this.getLevelALst();
      this.getLevelBLst();
      this.getLevelCLst();

      // console.log("rahul::props in product", this.props);
      const { prop_data } = this.props.block;
      // console.log("props-->", prop_data);
      if (prop_data.hasOwnProperty("source")) {
        this.setState({ source: prop_data.source, product_id: prop_data.id });
      } else {
        this.setState({ product_id: prop_data });
      }

      // console.log("rahul::props in product", prop_data);
      // if (prop_data) {
      //   this.setState({ source: prop_data }
      //   );
      // }

      this.setState({ product_id: prop_data }, () => {
        this.get_product_units_levelsFun();
      });
      this.getUserControlLevelFromRedux();
    }
  }

  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
    // console.log("getUserControlLevelFromRedux : ", level);
    this.setState({ ABC_flag_value: level });

    if (level == "A") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
    } else if (level == "AB") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
    } else if (level == "ABC") {
      const l_A = getUserControlData("is_level_a", this.props.userControl);
      this.setState({ levelA: l_A });
      const l_B = getUserControlData("is_level_b", this.props.userControl);
      this.setState({ levelB: l_B });
      const l_C = getUserControlData("is_level_c", this.props.userControl);
      this.setState({ levelC: l_C });
    }
  };

  get_product_units_levelsFun = () => {
    let { product_id } = this.state;
    // console.log("product id---", product_id);
    let reqData = new FormData();
    if (product_id.id) {
      reqData.append("productId", product_id.id);
    } else {
      reqData.append("productId", product_id);
    }

    get_product_units_levels(reqData)
      .then((response) => {
        // console.log("get product uniyts ---", response);
        if (response.data.responseStatus == 200) {
          let res = response.data.responseObject;
          let levelAOpt = res.levelALst.map(function (values) {
            return { value: values.id, label: values.levelName };
          });
          let levelBOpt = res.levelBLst.map(function (values) {
            return { value: values.id, label: values.levelName };
          });
          let levelCOpt = res.levelCLst.map(function (values) {
            return { value: values.id, label: values.levelName };
          });

          this.setState({
            levelAOpt: levelAOpt,
            levelBOpt: levelBOpt,
            levelCOpt: levelCOpt,
          });
        } else {
          this.setState({
            levelAOpt: [],
            levelBOpt: [],
            levelCOpt: [],
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState(
          {
            lstBrandOpt: [],
            groupLst: [],
            categoryLst: [],
            subCategoryLst: [],
            packageOpt: [],
          },
          () => {}
        );
      });
  };

  getProductDetails = () => {
    let { product_id } = this.state;
    const formData = new FormData();
    if (product_id.id) {
      formData.append("product_id", product_id.id);
    } else {
      formData.append("product_id", product_id);
    }

    getProductEdit(formData)
      .then((response) => {
        // console.log("response", response);
        if (response.data.responseStatus == 200) {
          let {
            brandOpt,
            groupOpt,
            categoryOpt,
            packageOpt,
            unitOpts,
            optHSNList,
            optTaxList,
            levelAOpt,
            levelBOpt,
            levelCOpt,

            isOpeningBatch,
          } = this.state;
          let total_op_qty = 0;

          let res = response.data.responseObject;
          // console.log("res produtct---", JSON.stringify(res));

          let initVal = {
            productId: res.id ? res.id : "",
            productName: res.productName ? res.productName : "",
            productCode: res.productCode ? res.productCode : "",
            productDescription: res.description ? res.description : "",
            barcodeNo: res.barcodeNo ? res.barcodeNo : "",
            barcodeSaleQuantity: res.barcodeSalesQty ? res.barcodeSalesQty : "",
            shelfId: res.shelfId ? res.shelfId : "",
            brandId: res.brandId ? getSelectValue(brandOpt, res.brandId) : "",
            groupId: res.groupId ? getSelectValue(groupOpt, res.groupId) : "",
            categoryId: res.categoryId
              ? getSelectValue(categoryOpt, res.categoryId)
              : "",
            packagingId: res.packagingId
              ? getSelectValue(packageOpt, res.packagingId)
              : "",
            groupfetchid: "",
            hsnNo: res.hsnNo ? getSelectValue(optHSNList, res.hsnNo) : "",
            taxType: res.taxType
              ? getSelectValue(taxTypeOpts, res.taxType)
              : "",
            tax: res.tax ? getSelectValue(optTaxList, res.tax) : "",
            igst: res.igst ? res.igst : "",
            cgst: res.cgst ? res.cgst : "",
            sgst: res.sgst ? res.sgst : "",
            taxApplicableDate: res.taxApplicableDate
              ? moment(
                  new Date(moment(res.taxApplicableDate, "YYYY-MM-DD").toDate())
                ).format("DD/MM/YYYY")
              : "",
            margin: res.margin ? res.margin : "",
            disPer1: res.disPer1 ? res.disPer1 : "",
            weight: res.weight ? res.weight : "",
            weightUnit: res.weightUnit ? res.weightUnit : "",
            minStock: res.minStock != 0 ? res.minStock : 0,
            maxStock: res.maxStock != 0 ? res.maxStock : 0,

            isLevelA: res.isLevelA != null ? res.isLevelA : true,
            isLevelB: res.isLevelB != null ? res.isLevelB : true,
            isLevelC: res.isLevelC != null ? res.isLevelC : true,
            isInventory: res.isInventory,
            isBatchNo: res.isBatchNo ? res.isBatchNo : false,
            isSerialNo: res.isSerialNo ? res.isSerialNo : false,
            isWarranty: res.isWarranty ? res.isWarranty : false,
            nodays: res.nodays ? res.nodays : "",
          };
          // console.log("initVal--", initVal);
          // console.log("res.mstPackaging--", res.mstPackaging);
          this.setState({ isOpeningBatch: res.isBatchNo });

          let packaging_arr = res.mstPackaging.map((v) => {
            // console.log("v==->", JSON.stringify(v));
            if (v.levela_id == "" || v.levela_id == undefined) {
              v.levela_id = getSelectValue(levelAOpt, "");
            } else if (v.levela_id) {
              v.levela_id =
                v.levela_id &&
                getSelectValue(
                  levelAOpt,
                  v.levela_id != "" ? parseInt(v.levela_id) : ""
                );
            }
            // console.log("v", v);
            v["levelb"] = v.levelb.map((vc) => {
              if (vc.levelb_id == "" || vc.levelb_id == undefined) {
                vc.levelb_id = getSelectValue(levelBOpt, "");
              } else if (vc.levelb_id) {
                vc.levelb_id =
                  vc.levelb_id &&
                  getSelectValue(
                    levelBOpt,
                    vc.levelb_id !== "" ? parseInt(vc.levelb_id) : ""
                  );

                // vc.levelb_id = getSelectValue(levelBOpt, vc.levelb_id);
              }

              // console.log("vc", vc);
              vc["levelc"] = vc.levelc.map((vs) => {
                if (vs.levelc_id == "") {
                  vs.levelc_id = getSelectValue(levelCOpt, "");
                } else if (vs.levelc_id) {
                  vs.levelc_id =
                    vs.levelc_id &&
                    getSelectValue(
                      levelCOpt,
                      vs.levelc_id !== "" ? parseInt(vs.levelc_id) : ""
                    );
                }
                // console.log("vs", vs);
                vs["units"] = vs.units.map((vu) => {
                  if (vu.unit_id == "") {
                    vu.unit_id = getSelectValue(unitOpts, "");
                  } else if (vu.unit_id) {
                    vu.unit_id = getSelectValue(unitOpts, vu.unit_id);
                  }
                  // console.log("vu", vu);
                  vu.details_id = vu.details_id != "" ? vu.details_id : 0;
                  vu.isNegativeStocks =
                    vu.isNegativeStocks != "" ? vu.isNegativeStocks : 0;
                  vu.unit_id = vu.unit_id != "" ? vu.unit_id : "";
                  vu.unit_conv = vu.unit_conv != "" ? vu.unit_conv : 1;
                  vu.unit_marg = vu.unit_marg != "" ? vu.unit_marg : 0;
                  vu.unit_name = vu.unit_name != "" ? vu.unit_name : "";
                  vu.min_qty = vu.min_qty != "" ? vu.min_qty : 0;
                  vu.max_qty = vu.max_qty != "" ? vu.max_qty : 0;
                  vu.mrp = vu.mrp != "" ? vu.mrp : 0;
                  vu.purchase_rate =
                    vu.purchase_rate != "" ? vu.purchase_rate : 0;
                  vu.sales_rate = 0;
                  vu.opening_qty = vu.opening_qty != "" ? vu.opening_qty : 0;
                  vu.opening_rate = 0;
                  vu.min_rate_a = vu.rateA != "" ? vu.rateA : 0;
                  vu.min_rate_b = vu.rateB != "" ? vu.rateB : 0;
                  vu.min_rate_c = vu.rateC != "" ? vu.rateC : 0;
                  // vu.cost = vu.cost != "" ? vu.cost : 0,
                  // batchList: vu.batchList ? vu.batchList : [],

                  vu["batchList"] = vu.batchList.map((bv) => {
                    if (v.isBatchNo == true) {
                      bv["isOpeningbatch"] = true;
                      bv["batch_id"] = bv.batch_id != "" ? bv.batch_id : "";
                      bv["id"] = bv.id;

                      bv["b_expiry"] = bv.b_expiry
                        ? moment(
                            new Date(moment(bv.b_expiry, "YYYY-MM-DD").toDate())
                          ).format("DD/MM/YYYY")
                        : "";

                      bv["opening_qty"] =
                        bv.opening_qty != "" ? bv.opening_qty : "";

                      total_op_qty =
                        parseInt(total_op_qty) + parseInt(bv.opening_qty);

                      bv["b_manufacturing_date"] = bv.b_manufacturing_date
                        ? moment(
                            new Date(
                              moment(
                                bv.b_manufacturing_date,
                                "YYYY-MM-DD"
                              ).toDate()
                            )
                          ).format("DD/MM/YYYY")
                        : "";
                    } else {
                      bv["isOpeningbatch"] = false;
                      bv["batch_id"] = bv.batch_id != "" ? bv.batch_id : "";
                      bv["id"] = bv.id;

                      bv["b_expiry"] = bv.b_expiry
                        ? moment(
                            new Date(moment(bv.b_expiry, "YYYY-MM-DD").toDate())
                          ).format("DD/MM/YYYY")
                        : "";
                      bv["opening_qty"] =
                        bv.opening_qty != "" ? bv.opening_qty : "";
                      // console.log("total_op_qty--11111-", total_op_qty);

                      total_op_qty =
                        parseInt(total_op_qty) + parseInt(bv.opening_qty);

                      bv["b_manufacturing_date"] = bv.b_manufacturing_date
                        ? moment(
                            new Date(
                              moment(
                                bv.b_manufacturing_date,
                                "YYYY-MM-DD"
                              ).toDate()
                            )
                          ).format("DD/MM/YYYY")
                        : "";
                    }
                    // bv["batch_id"] = bv.batch_id != "" ? bv.batch_id : 0;
                    // bv["id"] = bv.id != 0 ? bv.id : 0;

                    // bv["b_expiry"] = bv.b_expiry
                    //   ? moment(
                    //     new Date(moment(bv.b_expiry, "YYYY-MM-DD").toDate())
                    //   ).format("DD/MM/YYYY")
                    //   : "";

                    // bv["b_manufacturing_date"] = bv.b_manufacturing_date
                    //   ? moment(
                    //     new Date(
                    //       moment(
                    //         bv.b_manufacturing_date,
                    //         "YYYY-MM-DD"
                    //       ).toDate()
                    //     )
                    //   ).format("DD/MM/YYYY")
                    //   : "";
                    // console.log("total_op_qty---", total_op_qty);
                    return bv;
                  });
                  // console.log("total_op_qty", total_op_qty);
                  vu.opening_qty = total_op_qty;
                  return vu;
                });
                return vs;
              });
              return vc;
            });

            return v;
          });

          // console.warn("rahul::initVal initVal.isBatchNo", packaging_arr, initVal.isBatchNo);
          this.setState({
            isEditDataSet: true,
            initVal: initVal,
            isBatchHideShow: initVal.isBatchNo,
            mstPackaging: packaging_arr,
          });
        }
      })
      .catch((error) => {
        console.log("error");
      });
  };

  getLevelALst = () => {
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
            else opts.unshift({ value: opts.length + 1, label: "Add New" });

            this.setState({ levelAOpt: opts });
          } else {
            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: opts.length + 1, label: "Add New" });

            this.setState({ levelAOpt: opts });
          }
        }
      })
      .catch((error) => {
        this.setState({ levelAOpt: [] });
      });
  };

  getLevelBLst = () => {
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
            else opts.unshift({ value: opts.length + 1, label: "Add New" });
            // console.log("opts", opts);

            this.setState({ levelBOpt: opts });
          } else {
            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: opts.length + 1, label: "Add New" });
            // console.log("opts", opts);
            this.setState({ levelBOpt: opts });
          }
        }
      })
      .catch((error) => {
        this.setState({ levelBOpt: [] });
      });
  };

  getLevelCLst = () => {
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
            else opts.unshift({ value: opts.length + 1, label: "Add New" });

            this.setState({ levelCOpt: opts });
          } else {
            if (opts.length == 0)
              opts.unshift({ value: "0", label: "Add New" });
            else opts.unshift({ value: opts.length + 1, label: "Add New" });

            this.setState({ levelCOpt: opts });
          }
        }
      })
      .catch((error) => {
        this.setState({ levelCOpt: [] });
      });
  };

  componentDidUpdate() {
    if (AuthenticationCheck()) {
      const {
        isEditDataSet,
        product_id,
        brandOpt,
        groupOpt,
        categoryOpt,
        packageOpt,
        unitOpts,
        optHSNList,
        optTaxList,
      } = this.state;

      // console.log("rahul::didupdate", {
      //   isEditDataSet,
      //   product_id,
      //   brandOpt,
      //   groupOpt,
      //   categoryOpt,
      //   packageOpt,
      //   unitOpts,
      //   optHSNList,
      //   optTaxList,
      // });
      if (
        isEditDataSet == false &&
        product_id != "" &&
        brandOpt.length > 0 &&
        groupOpt.length > 0 &&
        categoryOpt.length > 0 &&
        packageOpt.length > 0 &&
        optHSNList.length > 0 &&
        optTaxList.length > 0 &&
        unitOpts.length > 0
      ) {
        this.getProductDetails();
      }
    }
  }

  pageReload = () => {
    this.componentDidMount();
    this.tableManager.current.asyncApi.resetRows();
    this.tableManager.current.searchApi.setSearchText("");
  };
  handelcategoryModalShow = (status, groupId = null, brandId = null) => {
    if (status == true) {
      let categoryInitValue = {
        groupId: groupId,
        brandId: brandId,
        categoryName: "",
      };
      this.setState({
        categoryInitValue: categoryInitValue,
        categoryModalShow: status,
      });
    } else {
      this.setState({
        categoryModalShow: status,
      });
    }
  };

  handleFlavourModalShow = (status) => {
    this.setState({
      flavourModalShow: status,
    });
  };
  handelUnitModalShow = (status) => {
    this.setState({
      unitModalShow: status,
    });
  };

  handleHSNModalShow = (status) => {
    this.setState({
      HSNshow: status,
    });
  };

  handleTaxModalShow = (status) => {
    this.setState({
      taxModalShow: status,
    });
  };

  handleUnitModalShow = (status) => {
    this.setState({
      unitModalShow: status,
    });
  };

  handlePackageModalShow = (status) => {
    this.setState({
      packageModalShow: status,
    });
  };

  handleModalStatus = (status) => {
    this.setState({ show: status });
  };

  setInitPackagingAfterUnitChanges = () => {
    let { mstUnits, mstPackaging } = this.state;
    if (mstPackaging.length > 0) {
      let FmstPackaging = mstPackaging.map((v) => {
        let current_unit = v.units;
        if (v.units.length != mstUnits.length) {
          let rem_len = mstUnits.length - v.units.length;
          if (rem_len > 0) {
            for (let index = 0; index < rem_len; index++) {
              let single_unit = {
                unit_id: "",
                unit_conv: 0,
                unit_marg: 0,
                min_qty: 0,
                max_qty: 0,
                cost: 0,
                disc_amt: 0,
                disc_per: 0,
                mrp: 0,
                purchase_rate: 0,
                sales_rate: 0,
                min_sales_rate: 0,
                opening_qty: 0,
                opening_valution: 0,
                retailer_rate: 0,
                distributor_rate: 0,
              };
              current_unit = [...current_unit, single_unit];
            }
          } else if (rem_len < 0) {
            current_unit = current_unit.splice(0, mstUnits.length);
          }
        }

        v.units = current_unit;

        return v;
      });
      this.setState({ mstPackaging: FmstPackaging });
    }
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

  initPacaking = () => {
    let packaging_arr = [
      {
        levela_id: "",
        levelb: [
          {
            levelb_id: "",
            levelc: [
              {
                levelc_id: "",
                units: [
                  {
                    details_id: 0,
                    isNegativeStocks: 0,
                    unit_id: "",
                    unit_conv: 1,
                    unit_marg: 0,
                    min_qty: 0,
                    max_qty: 0,
                    disc_amt: 0,
                    disc_per: 0,
                    mrp: 0,
                    purchase_rate: 0,
                    sales_rate: 0,
                    min_sales_rate: 0,
                    opening_qty: 0,
                    opening_valution: 0,
                    opening_rate: 0,
                    min_rate_a: 0,
                    min_rate_b: 0,
                    min_rate_c: 0,
                    min_margin: 0,
                    max_discount: 0,
                    min_discount: 0,
                    applicable_date: "",
                    batchList: [],
                    cost: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    this.setState({ mstPackaging: packaging_arr });
  };

  handleMstState = (mstPackaging) => {
    this.setState({ mstPackaging: mstPackaging });
  };
  handleMstFilterState = (mstFinalFilterLevel) => {
    this.setState({ mstFinalFilterLevel: mstFinalFilterLevel }, () => {
      // console.log("mstFinalFilterLevel", JSON.stringify(mstFinalFilterLevel));
    });
  };

  lstHSN = (id = false) => {
    getAllHSN()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus === 200) {
          let data1 = res.responseObject;
          let options = data1.map(function (data) {
            return {
              value: data.id,
              label: data.hsnno,
              hsndesc: data.hsndesc,
              igst: data.igst,
              cgst: data.cgst,
              sgst: data.sgst,
            };
          });

          if (options.length == 0)
            options.unshift({
              value: "0",
              label: "Add New",
              hsndesc: "",
              igst: "",
              cgst: "",
              sgst: "",
            });
          else
            options.unshift({
              value: options.length + 1,
              label: "Add New",
              hsndesc: "",
              igst: "",
              cgst: "",
              sgst: "",
            });

          this.setState({ optHSNList: options });
          if (id) {
            this.myRef.current.setFieldValue(
              "hsnNo",
              options[options.length - 1]
            );
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleBrandChange = (mstBrandIndex, value = "") => {
    let { mstPackaging } = this.state;
    mstPackaging[mstBrandIndex]["brand_id"] = value;
    this.setState({ mstPackaging: mstPackaging });
  };

  handleLevelAChange = (mstLevelAIndex, value = "") => {
    let { mstPackaging } = this.state;
    mstPackaging[mstLevelAIndex]["levela_id"] = value;
    this.setState({ mstPackaging: mstPackaging });
  };

  handleOpnStockModalShow = (
    status,
    aIndex = -1,
    bIndex = -1,
    cIndex = -1,
    uIndex = -1
  ) => {
    // console.log(
    //   " mstPackaging",
    //   this.state.mstPackaging,
    //   aIndex,
    //   bIndex,
    //   cIndex,
    //   uIndex
    // );

    this.setState({
      opnStockModalShow: status,
      claIndex: aIndex,
      clbIndex: bIndex,
      clcIndex: cIndex,
      cuIndex: uIndex,
    });
  };
  openingBatchUpdate = (values, setFieldValue) => {
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
    };

    this.setState({ batchInitVal: batchInitVal });

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
  openingBatchClear = () => {
    // console.log("clear---");
    let batchInitVal = {
      id: 0,
      b_no: "",
      opening_qty: "",
      b_free_qty: 0,
      b_mrp: "",
      b_sale_rate: "",
      b_purchase_rate: "",
      b_costing: 0,
      b_expiry: "",
      b_manufacturing_date: "",
      isOpeningbatch: false,
    };
    this.setState({ batchInitVal: batchInitVal });

    // setFieldValue("b_no", "");
    // setFieldValue("batch_id", "");
    // setFieldValue("opening_qty", 0);
    // setFieldValue("b_free_qty", 0);
    // setFieldValue("b_mrp", 0);
    // setFieldValue("b_sale_rate", 0);
    // setFieldValue("b_purchase_rate", 0);
    // setFieldValue("b_costing", 0);
    // setFieldValue("b_expiry", "");
    // setFieldValue("b_manufacturing_date", "");
  };

  addBatchOpeningRow = (values) => {
    let {
      mstPackaging,
      claIndex,
      clbIndex,
      clcIndex,
      cuIndex,
      isOpeningBatch,
    } = this.state;

    // console.log({
    //   values,
    //   mstPackaging,
    //   claIndex,
    //   clbIndex,
    //   clcIndex,
    //   cuIndex,
    //   isOpeningBatch
    // });
    // console.log("values--", values);

    if (claIndex > -1 && clbIndex > -1 && clcIndex > -1 && cuIndex > -1) {
      let old_lst =
        mstPackaging[claIndex]["levelb"][clbIndex]["levelc"][clcIndex]["units"][
          cuIndex
        ]["batchList"];

      // console.log("values---old_lst", old_lst);
      let is_updated = false;
      let final_state = [];
      if (isOpeningBatch == true) {
        final_state = old_lst.map((item) => {
          if (values.id === 0 && values.b_no === item.b_no) {
            is_updated = true;
            const updatedItem = values;
            return updatedItem;
          } else if (values.id !== 0 && values.id === item.id) {
            is_updated = true;
            const updatedItem = values;
            return updatedItem;
          }

          return item;
        });
      } else {
        final_state = old_lst.map((item) => {
          if (values.id === 0) {
            is_updated = true;
            const updatedItem = values;
            return updatedItem;
          } else if (values.id !== 0 && values.id === item.id) {
            is_updated = true;
            const updatedItem = values;
            return updatedItem;
          }

          return item;
        });
      }
      // console.log("kkk", { final_state });
      if (is_updated == false) {
        final_state = [...old_lst, values];
      }
      // console.log({ final_state });
      mstPackaging[claIndex]["levelb"][clbIndex]["levelc"][clcIndex]["units"][
        cuIndex
      ]["batchList"] = final_state;

      let total_op_qty = 0;
      mstPackaging[claIndex]["levelb"][clbIndex]["levelc"][clcIndex]["units"][
        cuIndex
      ]["batchList"].map((v, i) => {
        total_op_qty = parseInt(total_op_qty) + parseInt(v["opening_qty"]);
      });

      mstPackaging[claIndex]["levelb"][clbIndex]["levelc"][clcIndex]["units"][
        cuIndex
      ]["opening_qty"] = total_op_qty;
      // mstPackaging[claIndex]["levelb"][clbIndex]["levelc"][clcIndex]["units"][
      //   cuIndex
      // ]["isOpeningbatch"] = isOpeningBatch;

      // console.log({ mstPackaging });
      this.setState({ mstPackaging: mstPackaging }, () => {
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
        }
      });
    }
  };

  brandModalShow = (value) => {
    this.setState({ brandModalShow: value }, () => {
      if (value == false)
        this.setState({
          brandInitVal: {
            id: "",
            brandName: "",
          },
        });
    });
  };
  groupModalShow = (value) => {
    this.setState({ groupModalShow: value }, () => {
      if (value == false)
        this.setState({
          groupInitVal: {
            id: "",
            groupName: "",
          },
        });
    });
  };
  categoryModalShow = (value) => {
    this.setState({ categoryModalShow: value }, () => {
      if (value == false)
        this.setState({
          categoryInitVal: {
            id: "",
            categoryName: "",
          },
        });
    });
  };
  packageModalShow = (value) => {
    this.setState({ packageModalShow: value }, () => {
      if (value == false)
        this.setState({
          packageInitVal: {
            id: "",
            packageName: "",
          },
        });
    });
  };
  HSNshow = (value) => {
    this.setState({ HSNshow: value }, () => {
      if (value == false)
        this.setState({
          HSNinitVal: {
            id: "",
            hsnNumber: "",
            igst: "",
            cgst: "",
            sgst: "",
            description: "",
            type: getValue(typeoption, "Goods"),
          },
        });
    });
  };
  taxModalShow = (value) => {
    this.setState({ taxModalShow: value }, () => {
      if (value == false)
        this.setState({
          initValTax: {
            id: "",
            gst_per: "",
            sratio: "50%",
            igst: "",
            cgst: "",
            sgst: "",
          },
        });
    });
  };
  unitModalShow = (value) => {
    this.setState({ unitModalShow: value }, () => {
      if (value == false)
        this.setState({
          unitInitVal: {
            id: "",
            unitName: "",
            unitCode: "",
            uom: "",
          },
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
            is_button_show: true,
          });
        }
      })
      .catch((error) => {});
  };
  validateHSN = (hsnNumber, setFieldValue) => {
    let requestData = new FormData();
    requestData.append("hsnNumber", hsnNumber);
    if (hsnNumber.length > 8) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Invalid HSN ,Please Enter 8 digit HSN No",
        is_button_show: true,
      });
      // console.log("Invaid HSN No Please input 8 digit HSN");
    } else {
      validate_HSN(requestData)
        .then((response) => {
          let res = response.data;

          if (res.responseStatus == 409) {
            // console.log("res----", res);
            MyNotifications.fire({
              show: true,
              icon: "error",
              title: "Error",
              msg: res.message,
              is_button_show: true,
            });
            this.invoiceDateRef.current.focus();
            setFieldValue("hsnNumber", "");
          }
        })
        .catch((error) => {});
    }
  };
  levelAModalShow = (value) => {
    this.setState({ levelAModalShow: value }, () => {
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
            is_button_show: true,
          });
        }
      })
      .catch((error) => {});
  };
  levelBModalShow = (value) => {
    this.setState({ levelBModalShow: value }, () => {
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
            is_button_show: true,
          });
        }
      })
      .catch((error) => {});
  };

  levelCModalShow = (value) => {
    this.setState({ levelCModalShow: value }, () => {
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
            is_button_show: true,
          });
        }
      })
      .catch((error) => {});
  };

  render() {
    let {
      brandModalShow,
      brandInitVal,
      groupModalShow,
      groupInitVal,
      categoryInitVal,
      categoryModalShow,
      packageModalShow,
      packageInitVal,
      mstPackaging,
      transaction_mdl_show,
      initVal,
      optTaxList,
      initValTax,
      optHSNList,
      source,
      HSNshow,
      taxModalShow,
      HSNinitVal,
      brandOpt,
      packageOpt,
      unitOpts,
      groupOpt,
      categoryOpt,
      levelA,
      levelB,
      levelC,
      subCategoryLst,
      levelAOpt,
      levelBOpt,
      levelCOpt,
      isLoading,
      rowDelDetailsIds,
      opnStockModalShow,
      claIndex,
      clbIndex,
      clcIndex,
      cuIndex,
      batchInitVal,
      ABC_flag_value,
      unitModalShow,
      unitInitVal,
      levelAInitVal,
      levelBInitVal,
      levelCInitVal,
      levelAModalShow,
      levelBModalShow,
      levelCModalShow,
      isOpeningBatch,
      isBatchHideShow,
    } = this.state;

    return (
      <div
        id="example-collapse-text"
        className="product-create-form-style px-0"
      >
        <Formik
          innerRef={this.myRef}
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={initVal}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            productName: Yup.string()
              .trim()
              .required("product name is required"),
            // description: Yup.string()
            //   .trim()
            //   .required('Product description is required'),
            // groupId: Yup.object().required("Select group"),

            // brandId: Yup.object().required("Select brand"),

            // brandId: Yup.object().required("Select group"),
            // hsnId: Yup.object().required("Select HSN"),
            // taxMasterId: Yup.object().required("Select tax"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            MyNotifications.fire(
              {
                show: true,
                icon: "confirm",
                title: "Confirm",
                msg: "Do you want update",
                is_button_show: false,
                is_timeout: false,
                delay: 0,
                handleSuccessFn: () => {
                  let { mstPackaging } = this.state;
                  // console.warn("rahul::values", values, mstPackaging);

                  let keys = Object.keys(initVal);

                  let requestData = new FormData();

                  keys.map((v) => {
                    if (
                      values[v] != "" &&
                      v != "brandId" &&
                      v != "groupId" &&
                      v != "categoryId" &&
                      v != "packagingId" &&
                      v != "hsnNo" &&
                      v != "taxType" &&
                      v != "tax" &&
                      v != "taxApplicableDate" &&
                      v != "isLevelA" &&
                      v != "isLevelB" &&
                      v != "isLevelC" &&
                      v != "isBatchNo" &&
                      v != "isSerialNo" &&
                      v != "isInventory"
                    ) {
                      if (values[v] != undefined && values[v] != null) {
                        requestData.append(v, values[v]);
                      }
                    }
                  });
                  if (
                    values.packagingId !== null &&
                    values.packagingId !== ""
                  ) {
                    requestData.append(
                      "packagingId",
                      values.packagingId ? values.packagingId.value : ""
                    );
                  }
                  if (values.brandId !== null && values.brandId !== "") {
                    requestData.append(
                      "brandId",
                      values.brandId ? values.brandId.value : ""
                    );
                  }
                  if (values.groupId !== null && values.groupId !== "") {
                    requestData.append(
                      "groupId",
                      values.groupId ? values.groupId.value : ""
                    );
                  }
                  if (values.categoryId !== null && values.categoryId !== "") {
                    requestData.append(
                      "categoryId",
                      values.categoryId ? values.categoryId.value : ""
                    );
                  }
                  if (values.hsnNo !== null && values.hsnNo !== "") {
                    requestData.append(
                      "hsnNo",
                      values.hsnNo ? values.hsnNo.value : ""
                    );
                  }
                  if (values.taxType !== null && values.taxType !== "") {
                    requestData.append(
                      "taxType",
                      values.taxType ? values.taxType.value : ""
                    );
                  }
                  if (values.tax !== null && values.tax !== "") {
                    requestData.append(
                      "tax",
                      values.tax ? values.tax.value : ""
                    );
                  }
                  if (
                    values.taxApplicableDate !== null &&
                    values.taxApplicableDate !== ""
                  ) {
                    let date = moment(
                      values.taxApplicableDate,
                      "DD/MM/YYYY"
                    ).toDate();
                    requestData.append(
                      "taxApplicableDate",
                      moment(new Date(date)).format("yyyy-MM-DD")
                    );
                  }
                  requestData.append(
                    "isInventory",
                    values.isInventory ? values.isInventory : false
                  );
                  requestData.append(
                    "isBatchNo",
                    values.isBatchNo ? values.isBatchNo : false
                  );
                  requestData.append(
                    "isSerialNo",
                    values.isSerialNo ? values.isSerialNo : false
                  );
                  if (values.isSerialNo == true) {
                    requestData.append(
                      "isWarranty",
                      values.isWarranty ? values.isWarranty : false
                    );
                    requestData.append(
                      "nodays",
                      values.nodays ? values.nodays : 0
                    );
                  }

                  requestData.append(
                    "minStock",
                    values.minStock ? values.minStock : 0
                  );
                  requestData.append(
                    "maxStock",
                    values.maxStock ? values.maxStock : 0
                  );

                  // console.log("mstPackaging", mstPackaging);
                  let FmstPackaging = mstPackaging.filter((v) => {
                    v["levela_id"] =
                      values.isLevelA == true &&
                      v.levela_id != "" &&
                      v.levela_id
                        ? v.levela_id.value
                        : "";
                    v["levelb"] = v.levelb.map((vi) => {
                      vi["levelb_id"] =
                        values.isLevelB == true &&
                        vi.levelb_id != "" &&
                        vi.levelb_id
                          ? vi.levelb_id.value
                          : "";
                      vi["levelc"] = vi.levelc.map((vii) => {
                        vii["levelc_id"] =
                          values.isLevelC == true &&
                          vii.levelc_id != "" &&
                          vii.levelc_id
                            ? vii.levelc_id.value
                            : "";
                        vii.units = vii.units.map((y) => {
                          y["unit_id"] =
                            y["unit_id"] != "" ? y["unit_id"]["value"] : "";

                          y["batchList"] = y["batchList"].map((bv, bi) => {
                            if (bv != null) {
                              bv["isOpeningbatch"] = isOpeningBatch;
                              bv["b_expiry"] =
                                bv["b_expiry"] != "" && bv["b_expiry"]
                                  ? (bv["b_expiry"] = moment(
                                      new Date(
                                        moment(
                                          bv["b_expiry"],
                                          "DD/MM/YYYY"
                                        ).toDate()
                                      )
                                    ).format("yyyy-MM-DD"))
                                  : "";
                              bv["b_manufacturing_date"] =
                                bv["b_manufacturing_date"] != "" &&
                                bv["b_manufacturing_date"]
                                  ? (bv["b_manufacturing_date"] = moment(
                                      new Date(
                                        moment(
                                          bv["b_manufacturing_date"],
                                          "DD/MM/YYYY"
                                        ).toDate()
                                      )
                                    ).format("yyyy-MM-DD"))
                                  : "";

                              return bv;
                            }
                          });
                          return y;
                        });
                        return vii;
                      });
                      return vi;
                    });
                    return v;
                  });

                  requestData.append(
                    "mstPackaging",
                    JSON.stringify(FmstPackaging)
                  );

                  let filterRowDetail = [];
                  if (rowDelDetailsIds.length > 0) {
                    filterRowDetail = rowDelDetailsIds.map((v) => {
                      return { del_id: v };
                    });
                  }
                  // console.log("filterRowDetail", filterRowDetail);
                  requestData.append(
                    "rowDelDetailsIds",
                    JSON.stringify(filterRowDetail)
                  );

                  for (var pair of requestData.entries()) {
                    // console.log(pair[0] + ", " + pair[1]);
                  }

                  updateProduct(requestData)
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
                        if (this.state.source != "") {
                          eventBus.dispatch("page_change", {
                            from: "newproductcreate",
                            to: this.state.source.from_page,
                            prop_data: {
                              rows: this.state.source.rows,
                              invoice_data: this.state.source.invoice_data,
                            },
                            isNewTab: false,
                          });
                          this.setState({ source: "" });
                        } else {
                          eventBus.dispatch("page_change", "productlist");
                        }
                      } else {
                        MyNotifications.fire({
                          show: true,
                          icon: "error",
                          title: "Error",
                          msg: res.message,
                          is_button_show: true,
                        });
                      }
                    })
                    .catch((error) => {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",

                        is_button_show: true,
                      });
                    });
                },
                handleFailFn: () => {
                  // eventBus.dispatch("page_change", "productlist");
                },
              },
              () => {
                // console.warn("return_data");
              }
            );
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
            <Form onSubmit={handleSubmit} autoComplete="off">
              {/* {JSON.stringify(mstPackaging)} */}
              {/* {JSON.stringify(values.isLevelA)} */}
              <div className="div-style">
                <div className=" inner-div-style">
                  <Row className="mx-0">
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3}>
                          <Form.Label>Code</Form.Label>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}>
                          <Form.Control
                            autoFocus="true"
                            placeholder="Code"
                            autoComplete="off"
                            className="text-box"
                            id="productCode"
                            name="productCode"
                            onChange={handleChange}
                            value={values.productCode}
                            onBlur={(e) => {
                              e.preventDefault();
                              // this.validateProduct(
                              //   "productCode",
                              //   values.productCode,
                              //   setFieldValue

                              // );
                            }}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.productCode}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={4} md={4} sm={4} xs={4}>
                      <Row>
                        <Col lg={1} md={1} sm={1} xs={1}>
                          <Form.Label>Name</Form.Label>
                        </Col>
                        <Col lg={11} md={11} sm={11} xs={11}>
                          <Form.Control
                            placeholder="Name"
                            className="text-box"
                            id="productName"
                            name="productName"
                            autoComplete="off"
                            onChange={handleChange}
                            onInput={(e) => {
                              e.target.value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                            }}
                            value={values.productName}
                            onBlur={(e) => {
                              e.preventDefault();

                              // this.validateProduct(
                              //   "productName",
                              //   values.productName,
                              //   setFieldValue
                              // );
                            }}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.productName}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={4} md={4} sm={4} xs={4}>
                      <Row>
                        <Col lg={2} md={2} sm={2} xs={2} className="pe-0">
                          <Form.Label>Description </Form.Label>
                        </Col>
                        <Col lg={10} md={10} sm={10} xs={10}>
                          <Form.Control
                            className="text-box"
                            placeholder="Add description"
                            name="productDescription"
                            autoComplete="off"
                            id="productDescription"
                            onChange={handleChange}
                            value={values.productDescription}
                          ></Form.Control>
                          <span className="text-danger errormsg">
                            {errors.productDescription}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3} className="">
                          <Form.Label>Packing </Form.Label>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}>
                          <Select
                            className="selectTo"
                            // isClearable
                            styles={productDropdown}
                            placeholder="Packing"
                            value={values.packagingId}
                            name="packagingId"
                            id="packagingId"
                            onChange={(v) => {
                              setFieldValue("packagingId", "");
                              if (v != "") {
                                if (v.label === "Add New") {
                                  this.packageModalShow(true);
                                } else setFieldValue("packagingId", v);
                              }
                            }}
                            options={packageOpt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.packagingId}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className="mx-0" style={{ marginTop: "15px" }}>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3}>
                          <Form.Label>Barcode </Form.Label>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}>
                          <Form.Control
                            placeholder="Barcode"
                            className="text-box"
                            id="barcodeNo"
                            name="barcodeNo"
                            onChange={handleChange}
                            value={values.barcodeNo}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.barcodeNo}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={1} md={1} sm={1} xs={1}>
                      <Row>
                        <Col
                          lg={4}
                          md={4}
                          sm={4}
                          xs={4}
                          className="paddingRight"
                        >
                          <Form.Label>Qty.</Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Control
                            placeholder="Qty"
                            className="text-box"
                            id="barcodeSaleQuantity"
                            name="barcodeSaleQuantity"
                            onChange={handleChange}
                            onKeyPress={(e) => {
                              OnlyEnterNumbers(e);
                            }}
                            value={values.barcodeSaleQuantity}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.barcodeSaleQuantity}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3} className="">
                          <Form.Label>Tax Type</Form.Label>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}>
                          <Select
                            className="selectTo"
                            // isClearable
                            styles={productDropdown}
                            placeholder="Tax Type"
                            value={values.taxType}
                            name="taxType"
                            id="taxType"
                            onChange={(v) => {
                              setFieldValue("taxType", "");
                              if (v != "") {
                                setFieldValue("taxType", v);
                              }
                            }}
                            options={taxTypeOpts}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.taxType}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={1} md={1} sm={1} xs={1}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Label>Tax </Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Select
                            className="selectTo"
                            // isClearable
                            styles={productDropdown}
                            placeholder="Tax"
                            value={values.tax}
                            name="tax"
                            id="tax"
                            onChange={(v) => {
                              setFieldValue("tax", "");
                              setFieldValue("igst", "");
                              setFieldValue("cgst", "");
                              setFieldValue("sgst", "");
                              if (v != "") {
                                // console.log({ v });
                                if (v.label === "Add New") {
                                  this.taxModalShow(true);
                                } else {
                                  setFieldValue("tax", v);
                                  setFieldValue("igst", v.igst);
                                  setFieldValue("cgst", v.cgst);
                                  setFieldValue("sgst", v.sgst);
                                }
                              }
                            }}
                            options={optTaxList}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.tax}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={2} md={2} sm={2} xs={2}>
                          <Form.Label>IGST: </Form.Label>
                        </Col>
                        <Col lg={2} md={2} sm={2} xs={2}>
                          {/* <Form.Control
                            placeholder="IGST"
                            className="text-box-readonly text-box"
                            // style={{ background: "#e7eff7" }}
                            id="igst"
                            name="igst"
                            onChange={handleChange}
                            readOnly
                            value={values.igst}
                          ></Form.Control> */}
                          <Form.Label>99% |</Form.Label>
                          <span className="text-danger errormsg">
                            {errors.igst}
                          </span>
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={2}>
                          <Form.Label>CGST: </Form.Label>
                        </Col>
                        <Col lg={2} md={2} sm={2} xs={2}>
                          {/* <Form.Control
                            placeholder="CGST"
                            className="text-box-readonly text-box"
                            id="cgst"
                            name="cgst"
                            onChange={handleChange}
                            // style={{ background: "#e7eff7" }}
                            readOnly
                            value={values.cgst}
                          ></Form.Control> */}
                          <Form.Label>99% |</Form.Label>
                          <span className="text-danger errormsg">
                            {errors.cgst}
                          </span>
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={2}>
                          <Form.Label>SGST:</Form.Label>
                        </Col>
                        <Col lg={2} md={2} sm={2} xs={2}>
                          {/* <Form.Control
                            placeholder="SGST"
                            className="text-box-readonly text-box"
                            // style={{ background: "#e7eff7" }}
                            id="sgst"
                            name="sgst"
                            onChange={handleChange}
                            readOnly
                            value={values.sgst}
                          ></Form.Control> */}
                          <Form.Label>99% </Form.Label>
                          <span className="text-danger errormsg">
                            {errors.sgst}
                          </span>
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={5} md={5} sm={5} xs={5}>
                          <Form.Label>Applicable From</Form.Label>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                          <MyTextDatePicker
                            // innerRef={(input) => {
                            //   this.invoiceDateRef.current = input;
                            // }}
                            className="text-box form-control"
                            name="taxApplicableDate"
                            id="taxApplicableDate"
                            placeholder="DD/MM/YYYY"
                            dateFormat="dd/MM/yyyy"
                            value={values.taxApplicableDate}
                            onChange={handleChange}
                            onBlur={(e) => {
                              if (
                                e.target.value != null &&
                                e.target.value != ""
                              ) {
                                if (
                                  moment(
                                    e.target.value,
                                    "DD-MM-YYYY"
                                  ).isValid() == true
                                ) {
                                  setFieldValue(
                                    "taxApplicableDate",
                                    e.target.value
                                  );
                                } else {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: "Invalid Date",
                                    is_button_show: true,
                                  });
                                  // this.invoiceDateRef.current.focus();
                                  setFieldValue("taxApplicableDate", "");
                                }
                              } else {
                                setFieldValue("taxApplicableDate", "");
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3}>
                          <Form.Label>HSN </Form.Label>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}>
                          <Select
                            className="selectTo"
                            // isClearable
                            styles={productDropdown}
                            placeholder="HSN"
                            value={values.hsnNo}
                            name="hsnNo"
                            id="hsnNo"
                            onChange={(v) => {
                              setFieldValue("hsnNo", "");
                              if (v != "") {
                                if (v.label === "Add New") {
                                  this.HSNshow(true);
                                } else setFieldValue("hsnNo", v);
                              }
                            }}
                            options={optHSNList}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.hsnNo}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className="mx-0" style={{ marginTop: "15px" }}>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3} className="my-auto">
                          <Form.Label>Brand </Form.Label>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}>
                          <Select
                            className="selectTo"
                            // isClearable
                            styles={productDropdown}
                            placeholder="Brand"
                            value={values.brandId}
                            name="brandId"
                            id="brandId"
                            onChange={(v) => {
                              setFieldValue("brandId", "");
                              if (v != "") {
                                // console.log("v1 -> ", v);
                                if (v.label === "Add New") {
                                  // console.log("v2 -> ", v);
                                  this.brandModalShow(true);
                                } else setFieldValue("brandId", v);
                              }
                            }}
                            options={brandOpt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.brandId}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={2} md={2} sm={2} xs={2} className="my-auto">
                          <Form.Label>Group </Form.Label>
                        </Col>
                        <Col lg={10} md={10} sm={10} xs={10}>
                          <Select
                            className="selectTo"
                            // isClearable
                            styles={productDropdown}
                            placeholder="Group"
                            value={values.groupId}
                            name="groupId"
                            id="groupId"
                            onChange={(v) => {
                              setFieldValue("groupId", "");
                              if (v != "") {
                                if (v.label === "Add New") {
                                  this.groupModalShow(true);
                                } else setFieldValue("groupId", v);
                              }
                            }}
                            options={groupOpt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.groupId}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4} className="">
                          <Form.Label>Sub Group </Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Select
                            className="selectTo"
                            // isClearable
                            styles={productDropdown}
                            placeholder="Sub Group"
                            value={values.groupId}
                            name="groupId"
                            id="groupId"
                            onChange={(v) => {
                              setFieldValue("groupId", "");
                              if (v != "") {
                                if (v.label === "Add New") {
                                  this.groupModalShow(true);
                                } else setFieldValue("groupId", v);
                              }
                            }}
                            options={groupOpt}
                          />
                          <span className="text-danger errormsg">
                            {errors.groupId}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4} className="my-auto">
                          <Form.Label>Category </Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Select
                            className="selectTo"
                            isClearable
                            styles={productDropdown}
                            placeholder="Category"
                            value={values.categoryId}
                            name="categoryId"
                            id="categoryId"
                            onChange={(v) => {
                              setFieldValue("categoryId", "");
                              if (v != "") {
                                if (v.label === "Add New") {
                                  this.categoryModalShow(true);
                                } else setFieldValue("categoryId", v);
                              }
                            }}
                            options={categoryOpt}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.categoryId}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={4} md={4} sm={4} xs={4}>
                          <Form.Label>Sub Category </Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8} className="subpadding">
                          <Select
                            className="selectTo"
                            // isClearable
                            styles={productDropdown}
                            placeholder="Sub Category"
                            value={values.categoryId}
                            name="categoryId"
                            id="categoryId"
                            onChange={(v) => {
                              setFieldValue("categoryId", "");
                              if (v != "") {
                                if (v.label === "Add New") {
                                  this.categoryModalShow(true);
                                } else setFieldValue("categoryId", v);
                              }
                            }}
                            options={categoryOpt}
                          />
                          <span className="text-danger errormsg">
                            {errors.categoryId}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={2}>
                      <Row>
                        <Col lg={3} md={3} sm={3} xs={3} className="my-auto">
                          <Form.Label>Shelf ID </Form.Label>
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={9}>
                          <Form.Control
                            placeholder="Shelf ID"
                            className="text-box"
                            id="shelfId"
                            name="shelfId"
                            onChange={handleChange}
                            value={values.shelfId}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.shelfId}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row className="mx-0" style={{ marginTop: "15px" }}>
                    {values.isInventory == true ? (
                      <>
                        <Col lg={1} md={1} sm={1} xs={1}>
                          <Row>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Form.Label>Min Stk</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Form.Control
                                placeholder="Min."
                                className="text-box-readonly"
                                id="minStock"
                                name="minStock"
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                value={values.minStock}
                              ></Form.Control>
                              <span className="text-danger errormsg">
                                {errors.minStock}
                              </span>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={1} md={1} sm={1} xs={1}>
                          <Row>
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              xs={6}
                              className=" for_padding"
                            >
                              <Form.Label>Max Stk</Form.Label>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                              <Form.Control
                                placeholder="Max."
                                className="text-box-readonly"
                                id="maxStock"
                                name="maxStock"
                                onChange={handleChange}
                                onKeyPress={(e) => {
                                  OnlyEnterNumbers(e);
                                }}
                                onBlur={(e) => {
                                  // console.log("values.minStock", values.minStock, e.target.value);

                                  if (e.target.value > values.minStock) {
                                    setFieldValue("maxStock", e.target.value);
                                  } else {
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      msg: "Max Stock Should greater",
                                      is_button_show: true,
                                    });

                                    setFieldValue("maxStock", "");
                                  }
                                }}
                                value={values.maxStock}
                              ></Form.Control>
                              <span className="text-danger errormsg">
                                {errors.maxStock}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    ) : (
                      <></>
                    )}
                    <Col lg={1} md={1} sm={1} xs={1}>
                      <Row>
                        <Col
                          lg={`${values.isInventory == true ? "4" : "6"}`}
                          md={`${values.isInventory == true ? "4" : "6"}`}
                          sm={`${values.isInventory == true ? "4" : "6"}`}
                          xs={`${values.isInventory == true ? "4" : "6"}`}
                          className="for_padding"
                        >
                          <Form.Label>Disc%</Form.Label>
                        </Col>
                        <Col
                          lg={`${values.isInventory == true ? "8" : "6"}`}
                          md={`${values.isInventory == true ? "8" : "6"}`}
                          sm={`${values.isInventory == true ? "8" : "6"}`}
                          xs={`${values.isInventory == true ? "8" : "6"}`}
                          className="paddingRight"
                        >
                          <Form.Control
                            placeholder="%"
                            className="text-box"
                            id="disPer1"
                            name="disPer1"
                            onChange={handleChange}
                            onKeyPress={(e) => {
                              OnlyEnterNumbers(e);
                            }}
                            value={values.disPer1}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.disPer1}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={1} md={1} sm={1} xs={1}>
                      <Row>
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          xs={6}
                          className=" for_padding"
                        >
                          <Form.Label>Margin</Form.Label>
                        </Col>
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          xs={6}
                          className="paddingLeft"
                        >
                          <Form.Control
                            placeholder="Margin(%)"
                            className="text-box"
                            id="margin"
                            name="margin"
                            onChange={handleChange}
                            onKeyPress={(e) => {
                              OnlyEnterNumbers(e);
                            }}
                            value={values.margin}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.margin}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>

                    {/* <Row className="mx-0" style={{ marginTop: "15px" }}>
                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col
                          lg={4}
                          md={4}
                          sm={4}
                          xs={4}
                          className="my-auto for_padding"
                        >
                          <Form.Label>Weight </Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Control
                            placeholder="Weight"
                            className="text-box"
                            id="weight"
                            name="weight"
                            onChange={handleChange}
                            value={values.weight}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.weight}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3}>
                      <Row>
                        <Col
                          lg={4}
                          md={4}
                          sm={4}
                          xs={4}
                          className="my-auto for_padding"
                        >
                          <Form.Label>Weight Unit</Form.Label>
                        </Col>
                        <Col lg={8} md={8} sm={8} xs={8}>
                          <Form.Control
                            placeholder="Weight Unit"
                            className="text-box"
                            id="weightUnit"
                            name="weightUnit"
                            onChange={handleChange}
                            value={values.weightUnit}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.weightUnit}
                          </Form.Control.Feedback>
                        </Col>
                      </Row>
                    </Col>
                  </Row> */}

                    <Col lg={4} md={4} sm={4} xs={4}>
                      <Row>
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="switch-box-style "
                        >
                          <Form.Check
                            type="switch"
                            label="Batch"
                            name="isBatchNo"
                            id="isBatchNo"
                            checked={values.isBatchNo == true ? true : false}
                            onClick={(e) => {
                              if (e.target.checked) {
                                setFieldValue("isBatchNo", true);
                                setFieldValue("isInventory", true);
                                this.setState({
                                  isOpeningBatch: true,
                                  isBatchHideShow: true,
                                });
                              } else {
                                setFieldValue("isBatchNo", false);
                                this.setState({
                                  isOpeningBatch: false,
                                  isBatchHideShow: false,
                                });
                              }
                            }}
                            value={values.isBatchNo}
                          />
                        </Col>
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="switch-box-style for_padding me-3"
                        >
                          <Form.Check
                            type="switch"
                            label="Serial No"
                            name="isSerialNo"
                            id="isSerialNo"
                            checked={values.isSerialNo == true ? true : false}
                            onClick={(e) => {
                              if (e.target.checked) {
                                setFieldValue("isSerialNo", true);
                                setFieldValue("isInventory", true);
                                this.setState({ isOpeningBatch: true });
                              } else {
                                setFieldValue("isSerialNo", false);
                                this.setState({ isOpeningSerial: false });
                              }
                            }}
                            value={values.isSerialNo}
                          />
                        </Col>
                        {values.isSerialNo == true ? (
                          <>
                            <Col
                              lg={`${
                                values.isWarranty == true ? "4 pe-0" : "2 me-2"
                              }`}
                              md={`${values.isWarranty == true ? "4" : "2"}`}
                              sm={`${values.isWarranty == true ? "4" : "2"}`}
                              xs={`${values.isWarranty == true ? "4" : "2"}`}
                            >
                              <div>
                                <Row>
                                  <Col
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                    className="switch-box-style"
                                  >
                                    <Form.Check
                                      type="switch"
                                      label="Warranty"
                                      className="m-auto"
                                      name="isWarranty"
                                      id="isWarranty"
                                      checked={
                                        values.isWarranty == true ? true : false
                                      }
                                      onClick={(e) => {
                                        if (e.target.checked) {
                                          setFieldValue("isWarranty", true);
                                        } else {
                                          setFieldValue("isWarranty", false);
                                        }
                                      }}
                                      value={values.isWarranty}
                                    />
                                  </Col>
                                  {values.isWarranty == true ? (
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={6}
                                      xs={6}
                                      className="my-auto paddingRight"
                                    >
                                      <Form.Control
                                        className="m-auto text-box"
                                        name="nodays"
                                        id="nodays"
                                        onKeyPress={(e) => {
                                          OnlyEnterNumbers(e);
                                        }}
                                        onChange={handleChange}
                                        value={values.nodays}
                                        isValid={
                                          touched.nodays && !errors.nodays
                                        }
                                        isInvalid={!!errors.nodays}
                                        placeholder="Enter"
                                      />
                                    </Col>
                                  ) : (
                                    ""
                                  )}
                                </Row>
                              </div>
                            </Col>
                          </>
                        ) : (
                          <></>
                        )}
                        <Col
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="switch-box-style"
                        >
                          <Form.Check
                            type="switch"
                            label="Inventory"
                            name="isInventory"
                            id="isInventory"
                            checked={
                              values.isInventory == true ? true : false
                              // || values.isBatchNo == true
                              //   ? true
                              //   : false
                            }
                            onClick={(e) => {
                              if (e.target.checked) {
                                setFieldValue("isInventory", true);
                              } else {
                                setFieldValue("isInventory", false);
                              }
                            }}
                            value={values.isInventory}
                          />
                        </Col>
                        {/* {JSON.stringify(ABC_flag_value)} */}

                        {/* <Col lg={1} md={2} sm={2} xs={2} className="for_padding">
                      <Form.Check
                        type="radio"
                        label="No Levels"
                        name="ABC_flags"
                        id="No_flag"
                        checked={ABC_flag_value == "" ? true : false}
                        onClick={(e) => {
                          if (e.target.checked) {
                            this.setState({ ABC_flag_value: "" });
                          } else {
                            this.setState({ ABC_flag_value: "" });
                          }
                        }}
                      />
                    </Col>

                    <Col lg={1} md={2} sm={2} xs={2} className="for_padding">
                      <Form.Check
                        type="radio"
                        label="A"
                        name="ABC_flags"
                        id="A_flag"
                        checked={ABC_flag_value == "A" ? true : false}
                        onClick={(e) => {
                          if (e.target.checked) {
                            this.setState({ ABC_flag_value: "A" });
                          } else {
                            this.setState({ ABC_flag_value: "" });
                          }
                        }}
                      />
                    </Col>

                    <Col lg={1} md={2} sm={2} xs={2} className="for_padding">
                      <Form.Check
                        type="radio"
                        label="AB"
                        name="ABC_flags"
                        id="AB_flag"
                        checked={ABC_flag_value == "AB" ? true : false}
                        onClick={(e) => {
                          if (e.target.checked) {
                            this.setState({ ABC_flag_value: "AB" });
                          } else {
                            this.setState({ ABC_flag_value: "" });
                          }
                        }}
                      />
                    </Col> */}

                        {/* <Col lg={1} md={2} sm={2} xs={2} className="for_padding">
                      <Form.Check
                        type="radio"
                        label="ABC"
                        name="ABC_flags"
                        id="ABC_flag"
                        checked={ABC_flag_value == "ABC" ? true : false}
                        onClick={(e) => {
                          if (e.target.checked) {
                            this.setState({ ABC_flag_value: "ABC" });
                          } else {
                            this.setState({ ABC_flag_value: "" });
                          }
                        }}
                      />
                    </Col> */}
                      </Row>
                    </Col>
                  </Row>
                </div>
              </div>

              <div class="product_table_style">
                <div class="table-wrapper">
                  <Table>
                    <thead
                      // className="tbl-heading-style-A"
                      className={`${
                        ABC_flag_value == "A"
                          ? "tbl-heading-style-A"
                          : ABC_flag_value == "AB"
                          ? "tbl-heading-style-AB"
                          : ABC_flag_value == "ABC"
                          ? "tbl-heading-style-ABC"
                          : "tbl-heading-style"
                      }`}
                      style={
                        {
                          // borderBottom: "2px solid transparent",
                        }
                      }
                    >
                      <tr>
                        {ABC_flag_value == "A" ||
                        ABC_flag_value == "AB" ||
                        ABC_flag_value == "ABC" ? (
                          <>
                            <td
                              style={{
                                width: "30px",
                                borderTop: "1px solid #A8ADB3",
                              }}
                            ></td>
                            <td
                              style={{
                                width: "30px",
                                borderTop: "1px solid #A8ADB3",
                              }}
                            ></td>
                            <th
                              style={{
                                width: "206px",
                                borderTop: "1px solid #A8ADB3",
                              }}
                              className="level-a"
                            >
                              {levelA.label}
                            </th>
                          </>
                        ) : (
                          ""
                        )}
                        <th
                          style={{
                            borderTop: "1px solid #A8ADB3",
                            padding: "0px",
                            // width: "1500px",
                          }}
                          className={`${
                            ABC_flag_value == "AB" || ABC_flag_value == "ABC"
                              ? "left-border-style"
                              : ""
                          }`}
                        >
                          <tr>
                            {ABC_flag_value == "AB" ||
                            ABC_flag_value == "ABC" ? (
                              <>
                                <td
                                  style={{
                                    width: "30px",
                                  }}
                                ></td>
                                <td
                                  style={{
                                    width: "30px",
                                  }}
                                ></td>
                                <th
                                  style={{
                                    width: "178px",
                                  }}
                                  className="level-b"
                                >
                                  {levelB.label}
                                </th>
                              </>
                            ) : (
                              ""
                            )}

                            <th
                              style={{
                                padding: "0px",
                                // width: "1605px",
                              }}
                              className={`${
                                ABC_flag_value != "" && ABC_flag_value == "ABC"
                                  ? "left-border-style with-level-AB-width"
                                  : "left-border-style no-level-width"
                              }`}
                            >
                              <tr>
                                {ABC_flag_value == "ABC" ? (
                                  <>
                                    <td
                                      style={{
                                        width: "30px",
                                      }}
                                    ></td>
                                    <td
                                      style={{
                                        width: "30px",
                                      }}
                                    ></td>
                                    <th
                                      style={{
                                        width: "200px",
                                      }}
                                      className="level-c"
                                    >
                                      {levelC.label}
                                    </th>
                                  </>
                                ) : (
                                  ""
                                )}

                                <th
                                  style={{
                                    padding: "0px",
                                    // width: "1480px",
                                  }}
                                  className={`${
                                    ABC_flag_value != ""
                                      ? "left-border-style with-level-ABC-width"
                                      : "left-border-style no-level-width"
                                  }`}
                                >
                                  <tr>
                                    <td
                                      style={{
                                        width: "30px",
                                      }}
                                    ></td>
                                    <td
                                      style={{
                                        width: "30px",
                                      }}
                                    ></td>
                                    <th
                                      style={{
                                        width: "86px",
                                        textAlign: "start",
                                      }}
                                      className="unit"
                                    >
                                      Units
                                    </th>
                                    <th
                                      style={{
                                        width: "52px",
                                        paddingLeft: "5px",
                                      }}
                                      className="conv left-border-style"
                                    >
                                      Conv.
                                    </th>

                                    <th
                                      style={{
                                        width: "140px",
                                        paddingLeft: "5px",
                                      }}
                                      className="maxqty left-border-style"
                                    >
                                      Max. Qty
                                    </th>

                                    <th
                                      style={{
                                        width: "142px",
                                        paddingLeft: "5px",
                                      }}
                                      className="minqty left-border-style"
                                    >
                                      Min. Qty
                                    </th>

                                    {isBatchHideShow != true ? (
                                      <>
                                        <th
                                          style={{
                                            width: "140px",
                                            paddingLeft: "5px",
                                          }}
                                          // className="rate left-border-style"
                                          className={`${
                                            ABC_flag_value == "A" &&
                                            isMultiRateExist(
                                              "is_multi_rates",
                                              this.props.userControl
                                            ) === true
                                              ? "ALevel_multi_mrp left-border-style"
                                              : ABC_flag_value == "AB" &&
                                                isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "ABLevel_multi_mrp left-border-style"
                                              : ABC_flag_value == "ABC" &&
                                                isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "ABCLevel_multi_rate left-border-style"
                                              : isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "noLevel_multi_rate left-border-style"
                                              : "mrp left-border-style"
                                          }`}
                                        >
                                          MRP
                                        </th>

                                        <th
                                          style={{
                                            width: "140px",
                                            paddingLeft: "5px",
                                          }}
                                          // className="pur-rate left-border-style"
                                          className={`${
                                            ABC_flag_value == "A" &&
                                            isMultiRateExist(
                                              "is_multi_rates",
                                              this.props.userControl
                                            ) === true
                                              ? "ALevel_multi_pur left-border-style"
                                              : ABC_flag_value == "AB" &&
                                                isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "ABLevel_multi_pur left-border-style"
                                              : ABC_flag_value == "ABC" &&
                                                isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "ABCLevel_multi_rate left-border-style"
                                              : isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "noLevel_multi_rate left-border-style"
                                              : "pur-rate left-border-style"
                                          }`}
                                        >
                                          Pur Rate
                                        </th>

                                        <th
                                          style={{
                                            width: "140px",
                                            paddingLeft: "5px",
                                          }}
                                          // className="rate left-border-style"
                                          className={`${
                                            ABC_flag_value == "A" &&
                                            isMultiRateExist(
                                              "is_multi_rates",
                                              this.props.userControl
                                            ) === true
                                              ? "ALevel_multi_rate1 left-border-style"
                                              : ABC_flag_value == "AB" &&
                                                isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "ABLevel_multi_rate1 left-border-style"
                                              : ABC_flag_value == "ABC" &&
                                                isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "ABCLevel_multi_rate left-border-style"
                                              : isMultiRateExist(
                                                  "is_multi_rates",
                                                  this.props.userControl
                                                ) === true
                                              ? "noLevel_multi_rate left-border-style"
                                              : "rate left-border-style"
                                          }`}
                                        >
                                          Rate 1
                                        </th>
                                      </>
                                    ) : (
                                      <></>
                                    )}

                                    {isMultiRateExist(
                                      "is_multi_rates",
                                      this.props.userControl
                                    ) && (
                                      <th
                                        style={{
                                          width: "141px",
                                          paddingLeft: "5px",
                                        }}
                                        className="rate left-border-style"
                                      >
                                        Rate 2
                                      </th>
                                    )}

                                    {isMultiRateExist(
                                      "is_multi_rates",
                                      this.props.userControl
                                    ) && (
                                      <th
                                        style={{
                                          width: "141px",
                                          paddingLeft: "5px",
                                        }}
                                        className="rate left-border-style"
                                      >
                                        Rate 3
                                      </th>
                                    )}
                                    <th
                                      style={{
                                        width: "52px",
                                        paddingLeft: "5px",
                                      }}
                                      className="conv left-border-style"
                                    >
                                      Cost
                                    </th>

                                    <th
                                      style={{
                                        width: "140px",
                                        paddingLeft: "5px",
                                      }}
                                      className="maxqty left-border-style"
                                    >
                                      Opn. Stock
                                    </th>

                                    <th
                                      style={{
                                        width: "43px",
                                        paddingLeft: "5px",
                                      }}
                                      className="negative left-border-style"
                                    >
                                      -ve
                                    </th>
                                  </tr>
                                </th>
                              </tr>
                            </th>
                          </tr>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mstPackaging.length > 0 &&
                        mstPackaging.map((v, i) => {
                          return (
                            <LevelA
                              isLevelA={values.isLevelA}
                              isLevelB={values.isLevelB}
                              isLevelC={values.isLevelC}
                              isLevelD={values.isLevelD}
                              isPackage={values.isPackage}
                              mstLevelA={v}
                              isBatchNo={values.isBatchNo}
                              mstLevelAIndex={i}
                              mstPackaging={mstPackaging}
                              levelAOpt={levelAOpt}
                              levelBOpt={levelBOpt}
                              levelCOpt={levelCOpt}
                              handleLevelAChange={this.handleLevelAChange.bind(
                                this
                              )}
                              handleMstState={this.handleMstState.bind(this)}
                              handleOpnStockModalShow={this.handleOpnStockModalShow.bind(
                                this
                              )}
                              handleDisablePlusButton={this.handleDisablePlusButton.bind(
                                this
                              )}
                              isInventory={values.isInventory}
                              unitOpts={unitOpts}
                              rowDelDetailsIds={rowDelDetailsIds}
                              ABC_flag_value={ABC_flag_value}
                              // unitModalShow={unitModalShow}
                              handelUnitModalShow={this.handelUnitModalShow}
                              // handleFlavourModalShow={this.handleFlavourModalShow}
                              levelAModalShow={this.levelAModalShow}
                              levelBModalShow={this.levelBModalShow}
                              levelCModalShow={this.levelCModalShow}
                            />
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Old Table product start */}
              {/* Old Table product end */}

              <Row className="mx-0 btm-rows-btn">
                <Col className="text-end">
                  <Button className="successbtn-style" type="submit">
                    Update
                  </Button>
                  <Button
                    className="ms-2 cancel-btn"
                    variant="secondary "
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to cancel",
                          is_button_show: false,
                          is_timeout: false,
                          delay: 0,
                          handleSuccessFn: () => {
                            if (this.state.source != "") {
                              eventBus.dispatch("page_change", {
                                from: "newproductcreate",
                                to: this.state.source.from_page,
                                prop_data: {
                                  rows: this.state.source.rows,
                                  invoice_data: this.state.source.invoice_data,
                                },
                                isNewTab: false,
                              });
                              this.setState({ source: "" });
                            } else {
                              eventBus.dispatch("page_change", "productlist");
                            }
                          },
                          handleFailFn: () => {},
                        },
                        () => {
                          // console.warn("return_data");
                        }
                      );

                      // if (this.state.source != "") {
                      //   eventBus.dispatch("page_change", {
                      //     from: "newproductcreate",
                      //     to: this.state.source.from_page,
                      //     prop_data: {
                      //       rows: this.state.source.rows,
                      //       invoice_data: this.state.source.invoice_data,
                      //     },
                      //     isNewTab: false,
                      //   });
                      //   this.setState({ source: "" });
                      // } else {
                      //   eventBus.dispatch("page_change", "productlist");
                      // }
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
              <Row className="mx-0 btm-rows-btn1">
                <Col md="2" className="px-0">
                  <Form.Label className="btm-label">
                    <img src={keyboard} className="svg-style mt-0 mx-2"></img>
                    New entry: <span className="shortkey">Ctrl + N</span>
                  </Form.Label>
                </Col>
                <Col md="8">
                  <Form.Label className="btm-label">
                    Duplicate: <span className="shortkey">Ctrl + D</span>
                  </Form.Label>
                </Col>
                {/* <Col md="8"></Col> */}
                <Col md="2" className="text-end">
                  <img src={question} className="svg-style ms-1"></img>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>

        {/* Tax modal */}
        <Modal
          show={taxModalShow}
          size="lg"
          className="mt-5 mainmodal"
          onHide={() => this.setState({ show: false })}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Tax
            </Modal.Title>
            <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handleTaxModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button>
          </Modal.Header>
          <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
            <div className="">
              <div className="m-0 mb-2">
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  enableReinitialize={true}
                  initialValues={initValTax}
                  validationSchema={Yup.object().shape({
                    gst_per: Yup.string()
                      .trim()
                      .required("HSN number is required"),
                    igst: Yup.string().trim().required("Igst is required"),
                    cgst: Yup.string().trim().required("Cgst is required"),
                    sgst: Yup.string().trim().required("Sgst is required"),
                  })}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    let requestData = new FormData();
                    if (values.id != "") {
                      requestData.append("id", values.id);
                    }
                    requestData.append("gst_per", values.gst_per);
                    requestData.append("sratio", values.sratio);
                    requestData.append("igst", values.igst);
                    requestData.append("cgst", values.cgst);
                    requestData.append("sgst", values.sgst);
                    requestData.append(
                      "applicable_date",
                      moment(values.applicable_date).format("yyyy-MM-DD")
                    );
                    MyNotifications.fire(
                      {
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to submit",
                        is_button_show: false,
                        is_timeout: false,
                        handleSuccessFn: () => {
                          createTax(requestData)
                            .then((response) => {
                              resetForm();
                              setSubmitting(false);
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
                                this.handleTaxModalShow(false);
                                this.lstTAX(true);
                              } else if (res.responseStatus == 409) {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: res.message,
                                  is_button_show: true,
                                });
                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: res.message,
                                  is_button_show: true,
                                });
                              }
                            })
                            .catch((error) => {
                              setSubmitting(false);
                              console.log("error", error);
                            });
                        },
                        handleFailFn: () => {},
                      },
                      () => {
                        // console.warn("return_data");
                      }
                    );
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
                    <Form onSubmit={handleSubmit} noValidate>
                      <div className="mb-2">
                        <Row className="mb-3">
                          <Col md={2}>
                            <Form.Label>GST %</Form.Label>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Control
                                autoFocus="true"
                                type="text"
                                placeholder="GST %"
                                name="gst_per"
                                id="gst_per"
                                // onChange={handleChange}
                                onChange={(e) => {
                                  this.handleGstChange(
                                    e.target.value,
                                    "gst_per",
                                    values,
                                    setFieldValue
                                  );
                                }}
                                value={values.gst_per}
                                isValid={touched.gst_per && !errors.gst_per}
                                // isInvalid={!!errors.gst_per}
                              />
                              <span className="text-danger errormsg">
                                {errors.gst_per}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md={2}>
                            <Form.Label>IGST</Form.Label>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="IGST"
                                name="igst"
                                id="igst"
                                // onChange={handleChange}
                                onChange={(e) => {
                                  this.handleGstChange(
                                    e.target.value,
                                    "igst",
                                    values,
                                    setFieldValue
                                  );
                                }}
                                value={values.igst}
                                isValid={touched.igst && !errors.igst}
                                // isInvalid={!!errors.igst}
                              />
                              <span className="text-danger errormsg">
                                {errors.igst}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md={2}>
                            <Form.Label>CGST</Form.Label>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="CGST"
                                name="cgst"
                                id="cgst"
                                onChange={(e) => {
                                  this.handleGstChange(
                                    e.target.value,
                                    "cgst",
                                    values,
                                    setFieldValue
                                  );
                                }}
                                value={values.cgst}
                                isValid={touched.cgst && !errors.cgst}
                                // isInvalid={!!errors.cgst}
                              />
                              <span className="text-danger errormsg">
                                {errors.cgst}
                              </span>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mb-2">
                          <Col md={2}>
                            <Form.Label>SGST</Form.Label>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="SGST"
                                name="sgst"
                                id="sgst"
                                onChange={(e) => {
                                  this.handleGstChange(
                                    e.target.value,
                                    "sgst",
                                    values,
                                    setFieldValue
                                  );
                                }}
                                value={values.sgst}
                                isValid={touched.sgst && !errors.sgst}
                                // isInvalid={!!errors.sgst}
                              />
                              <span className="text-danger errormsg">
                                {errors.sgst}
                              </span>
                            </Form.Group>
                          </Col>
                          <Col md={2} className="p-0">
                            <Form.Label>
                              Applicable Date
                              <span className="pt-1 pl-1 req_validation">
                                *
                              </span>
                            </Form.Label>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <MyDatePicker
                                name="applicable_date"
                                placeholderText="DD/MM/YYYY"
                                id="applicable_date"
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                  setFieldValue("applicable_date", date);
                                }}
                                selected={values.applicable_date}
                                maxDate={new Date()}
                                className="form-control"
                              />
                              {/* <span className="text-danger errormsg">{errors.bill_dt}</span> */}
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12" className="btn_align">
                            <Button
                              className="submit-btn successbtn-style"
                              type="submit"
                            >
                              Submit
                            </Button>
                            <Button
                              variant="secondary cancel-btn ms-2"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                this.taxModalShow(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                          {/* <Col md="12" className="btn_align">
                            <Button
                              variant="secondary cancel-btn"
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                this.taxModalShow(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </Col> */}
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* transaction modal */}
        <Modal
          show={transaction_mdl_show}
          size="lg"
          className="mt-5 transaction_mdl"
          onHide={() => this.setState({ transaction_mdl_show: false })}
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
          // closeButton
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Packaging Parameters
            </Modal.Title>
            {/* <CloseButton
              variant="white"
              className="close-btn-style pull-right"
              onClick={() => this.setState({ transaction_mdl_show: false })}
            /> */}
            <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.setState({ transaction_mdl_show: false })}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button>
          </Modal.Header>
          <Modal.Body className="">
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={initVal}
              validationSchema={Yup.object().shape({})}
              onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                <Form onSubmit={handleSubmit}>
                  <div className="company-from mb-2">
                    <Row>
                      <Col md="3" xs={3} sm={3}>
                        <Form.Group>
                          <Form.Label>Select Packaging</Form.Label>
                          <Select
                            className="selectTo"
                            // isClearable={false}
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            onChange={this.handleChangeTax}
                            value={this.props.value}
                            styles={customStylesWhite}
                            placeholder="Select"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col md="3" sm={3} xs={3}>
                        <Form.Group>
                          <Form.Label>Select Packaging</Form.Label>
                          <Select
                            className="selectTo"
                            // isClearable={false}
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            onChange={this.handleChangeTax}
                            value={this.props.value}
                            styles={customStylesWhite}
                            placeholder="Select"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="3" sm={3} xs={3}>
                        <Form.Group>
                          <Form.Label>Qty</Form.Label>
                          <Form.Control type="text" placeholder="0" />
                        </Form.Group>
                      </Col>
                      <Col md="3" sm={3} xs={3}>
                        <Form.Group>
                          <Form.Label>Price</Form.Label>
                          <Form.Control type="text" placeholder="0" />
                        </Form.Group>
                      </Col>
                      <Col md="3" sm={3} xs={3} className="text-center">
                        {/* <Button type="button"> */}
                        <a href="">
                          <i className="fa fa-trash mt-3 trash-style"></i>
                        </a>
                        {/* </Button> */}
                      </Col>
                    </Row>
                    <div className="mt-4 pkg-style">
                      <Row>
                        <Col md={12} xs={12} className="text-center">
                          <Button
                            type="button"
                            className="btn-add-pckg"
                            style={{ width: "25%" }}
                          >
                            Add New Packaging
                          </Button>
                        </Col>
                      </Row>
                    </div>
                    <Row>
                      <Col md="12" className="mt-4 btn_align">
                        <Button
                          className="submit-btn"
                          type="submit"
                          style={{ borderRadius: "20px" }}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="secondary"
                          className="cancel-btn ms-2"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({
                              transaction_mdl_show: false,
                            });
                          }}
                          style={{ borderRadius: "20px" }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
              createPro
            </Formik>
          </Modal.Body>
        </Modal>

        {/* HSN modal */}
        <Modal
          show={HSNshow}
          size="lg"
          className="brandnewmodal mt-5 mainmodal"
          onHide={() => this.handleFlavourModalShow(false)}
          dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            // closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              HSN
            </Modal.Title>
            <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handleHSNModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button>
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={HSNinitVal}
            validationSchema={Yup.object().shape({
              hsnNumber: Yup.string().trim().required("HSN number is required"),
              // description: Yup.string()
              //   .trim()
              //   .required("HSN description is required"),
              type: Yup.object().required("Select type").nullable(),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let keys = Object.keys(values);
              let requestData = new FormData();

              keys.map((v) => {
                if (v != "type") {
                  requestData.append(v, values[v] ? values[v] : "");
                } else if (v == "type") {
                  requestData.append("type", values.type.value);
                }
              });
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to submit",
                  is_button_show: false,
                  is_timeout: false,
                  handleSuccessFn: () => {
                    createHSN(requestData)
                      .then((response) => {
                        resetForm();
                        setSubmitting(false);
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

                          this.handleHSNModalShow(false);
                          this.lstHSN(true);
                        } else if (res.responseStatus == 409) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        }
                      })
                      .catch((error) => {
                        setSubmitting(false);
                      });
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
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
                className="form-style"
                noValidate
                autoComplete="off"
              >
                <Row className="mb-2">
                  <Col md={1}>
                    <Form.Label>HSN</Form.Label>
                  </Col>
                  <Col md="2">
                    <Form.Group>
                      <Form.Control
                        autoFocus="true"
                        type="text"
                        placeholder="HSN No"
                        name="hsnNumber"
                        id="hsnNumber"
                        onChange={handleChange}
                        value={values.hsnNumber}
                        isValid={touched.hsnNumber && !errors.hsnNumber}
                        onBlur={(e) => {
                          e.preventDefault();
                          if (e.target.value != null && e.target.value != "") {
                            this.validateHSN(values.hsnNumber, setFieldValue);
                          } else {
                          }
                        }}
                        maxLength={8}
                        style={{ boxShadow: "none" }}
                      />
                      {/* <span className="text-danger errormsg"> */}
                      <span className="text-danger errormsg">
                        {errors.hsnNumber}
                      </span>
                      {/* </Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Label>HSN Description</Form.Label>
                  </Col>
                  <Col md="3">
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="HSN Description"
                        name="description"
                        id="description"
                        onChange={handleChange}
                        value={values.description}
                        isValid={touched.description && !errors.description}
                        // isInvalid={!!errors.description}
                        style={{ boxShadow: "none" }}
                      />
                      {/* <span className="text-danger errormsg"> */}
                      <span className="text-danger errormsg"></span>
                      {/* </Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    <Form.Label>Type</Form.Label>
                  </Col>
                  <Col md="3">
                    <Form.Group className="">
                      <Select
                        className="selectTo"
                        id="type"
                        placeholder="Select Type"
                        // styles={customStyles}
                        styles={createPro}
                        // isClearable
                        options={typeoption}
                        name="type"
                        onChange={(value) => {
                          setFieldValue("type", value);
                        }}
                        value={values.type}
                      />
                      <span className="text-danger errormsg">
                        {errors.type}
                      </span>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="pt-1 btn_align">
                    <Button
                      className="submit-btn successbtn-style"
                      type="submit"
                    >
                      Submit
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        this.HSNshow(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal>

        {/* additional information */}

        {/* Opening stock modal */}

        <Modal
          show={opnStockModalShow}
          size="xl"
          className="mt-5 mainmodal"
          onHide={() =>
            this.setState({
              opnStockModalShow: false,
              claIndex: -1,
              clbIndex: -1,
              clcIndex: -1,
              cuIndex: -1,
            })
          }
          // dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            // closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Opening Stock
            </Modal.Title>
            {/* <CloseButton
    variant="white"
    className="pull-right"
    // onClick={this.handleClose}
    onClick={() => this.handleTaxModalShow(false)}
  /> */}
            <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handleOpnStockModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button>
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
                  validationSchema={Yup.object().shape({
                    // b_no: Yup.string()
                    //   .trim()
                    //   .required("Batch number is required"),
                    opening_qty: Yup.string()
                      .trim()
                      .required("Qty is required"),
                    b_mrp: Yup.string().trim().required("Mrp is required"),
                    b_sale_rate: Yup.string()
                      .trim()
                      .required("Sales rate is required"),
                    b_purchase_rate: Yup.string()
                      .trim()
                      .required("Purchase rate is required"),
                    // b_expiry: Yup.string()
                    //   .trim()
                    //   .required("Expiry date is required"),
                    // b_manufacturing_date: Yup.string()
                    //   .trim()
                    //   .required("MFG date is required"),
                  })}
                  onSubmit={(
                    values,
                    { setSubmitting, resetForm, setFieldValue }
                  ) => {
                    this.addBatchOpeningRow(values);
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
                    <Form onSubmit={handleSubmit} noValidate>
                      <div className="mb-2">
                        <Row className="mb-3">
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
                                        autoFocus="true"
                                        type="text"
                                        placeholder="Batch"
                                        name="b_no"
                                        id="b_no"
                                        onChange={handleChange}
                                        value={values.b_no}
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
                          <Col lg={4} className="mt-1">
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Opening Qty.</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    placeholder="Opening Qty"
                                    name="opening_qty"
                                    id="opening_qty"
                                    value={values.opening_qty}
                                    onChange={handleChange}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.opening_qty}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4} className="mt-1">
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Free Qty.</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    placeholder="Free Qty"
                                    name="b_free_qty"
                                    id="b_free_qty"
                                    onChange={handleChange}
                                    value={values.b_free_qty}
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
                                    autoFocus="true"
                                    type="text"
                                    placeholder="MRP"
                                    name="b_mrp"
                                    id="b_mrp"
                                    onChange={handleChange}
                                    value={values.b_mrp}
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
                                    type="text"
                                    placeholder="Purchase Rate"
                                    name="b_purchase_rate"
                                    id="b_purchase_rate"
                                    onChange={handleChange}
                                    value={values.b_purchase_rate}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      this.validatePurchaseRate(
                                        values.b_mrp,
                                        values.b_purchase_rate,
                                        setFieldValue
                                      );
                                    }}
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_purchase_rate}
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
                                <Form.Label>Costing</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    autoFocus="true"
                                    type="text"
                                    placeholder="Costing"
                                    name="b_costing"
                                    id="b_costing"
                                    onChange={handleChange}
                                    value={values.b_costing}
                                    readOnly
                                  />
                                  <span className="text-danger errormsg">
                                    {errors.b_costing}
                                  </span>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={4} className="mt-1">
                            <Row>
                              <Col lg={4}>
                                <Form.Label>Sale Rate</Form.Label>
                              </Col>
                              <Col lg={8}>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    placeholder="Sale Rate"
                                    name="b_sale_rate"
                                    id="b_sale_rate"
                                    onChange={handleChange}
                                    value={values.b_sale_rate}
                                    onBlur={(e) => {
                                      e.preventDefault();
                                      if (values.b_sale_rate > 0) {
                                        this.validateSalesRate(
                                          values.b_mrp,
                                          values.b_purchase_rate,
                                          values.b_sale_rate,
                                          "b_sale_rate",
                                          setFieldValue
                                        );
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
                                      className="form-control"
                                      name="b_manufacturing_date"
                                      id="b_manufacturing_date"
                                      placeholder="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"
                                      value={values.b_manufacturing_date}
                                      onChange={handleChange}
                                      onBlur={(e) => {
                                        if (
                                          e.target.value != null &&
                                          e.target.value != ""
                                        ) {
                                          if (
                                            moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            ).isValid() == true
                                          ) {
                                            let curdate = new Date(
                                              moment(
                                                this.state.currentDate,
                                                "DD/MM/YYYY"
                                              ).toDate()
                                            );

                                            let mfgDate = new Date(
                                              moment(
                                                e.target.value,
                                                "DD/MM/YYYY"
                                              ).toDate()
                                            );
                                            // console.log("mfgdate", mfgDate);
                                            // console.log(
                                            //   "state date",
                                            //   this.state.currentDate
                                            // );
                                            // console.log(
                                            //   "after converting",
                                            //   curdate
                                            // );
                                            if (curdate >= mfgDate) {
                                              // console.log(
                                              //   "compare",
                                              //   this.state.currentDate >=
                                              //   mfgDate
                                              // );

                                              setFieldValue(
                                                "b_manufacturing_date",
                                                e.target.value
                                              );
                                            } else {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg:
                                                  "Mfg Date Should not be Greater than todays date",
                                                is_button_show: true,
                                              });
                                              setFieldValue(
                                                "b_manufacturing_date",
                                                ""
                                              );
                                            }
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid Date",
                                              is_button_show: true,
                                            });
                                            setFieldValue(
                                              "b_manufacturing_date",
                                              ""
                                            );
                                          }
                                        } else {
                                          setFieldValue(
                                            "b_manufacturing_date",
                                            ""
                                          );
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
                                      className="form-control"
                                      name="b_expiry"
                                      id="b_expiry"
                                      placeholder="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"
                                      value={values.b_expiry}
                                      onChange={handleChange}
                                      onBlur={(e) => {
                                        if (
                                          e.target.value != null &&
                                          e.target.value != ""
                                        ) {
                                          if (
                                            moment(
                                              e.target.value,
                                              "DD-MM-YYYY"
                                            ).isValid() == true
                                          ) {
                                            // setFieldValue(
                                            //   "b_expiry",
                                            //   e.target.value
                                            // );
                                            let mfgDate =
                                              values.b_manufacturing_date;
                                            if (
                                              mfgDate == "" ||
                                              mfgDate == null ||
                                              mfgDate == "Invalid Date"
                                            ) {
                                              MyNotifications.fire({
                                                show: true,
                                                icon: "error",
                                                title: "Error",
                                                msg:
                                                  "First input manufacturing date",
                                                is_button_show: true,
                                              });
                                              // console.log("this is if Block ");
                                              setFieldValue("b_expiry", "");
                                              this.mfgDateRef.current.focus();
                                            } else {
                                              mfgDate = new Date(
                                                moment(
                                                  values.b_manufacturing_date,
                                                  "DD-MM-yyyy"
                                                ).toDate()
                                              );

                                              let expDate = new Date(
                                                moment(
                                                  e.target.value,
                                                  "DD/MM/YYYY"
                                                ).toDate()
                                              );
                                              // console.log(
                                              //   "rahul:: mfgDate, expDate",
                                              //   mfgDate,
                                              //   expDate
                                              // );
                                              // console.warn(
                                              //   "rahul::compare",
                                              //   mfgDate < expDate
                                              // );

                                              if (mfgDate < expDate) {
                                                setFieldValue(
                                                  "b_expiry",
                                                  e.target.value
                                                );
                                                // this.checkInvoiceDateIsBetweenFYFun(
                                                //   e.target.value
                                                // );
                                              } else {
                                                MyNotifications.fire({
                                                  show: true,
                                                  icon: "error",
                                                  title: "Error",
                                                  msg:
                                                    "Expiry date should be greater MFG date",
                                                  is_button_show: true,
                                                });
                                                setFieldValue("b_expiry", "");
                                                this.batchdpRef.current.focus();
                                              }
                                            }
                                          } else {
                                            MyNotifications.fire({
                                              show: true,
                                              icon: "error",
                                              title: "Error",
                                              msg: "Invalid Date",
                                              is_button_show: true,
                                            });
                                            this.batchdpRef.current.focus();
                                            setFieldValue("b_expiry", "");
                                          }
                                        } else {
                                          setFieldValue("b_expiry", "");
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
                              className="submit-btn successbtn-style"
                              type="submit"
                            >
                              {values.id == "" ? "Add" : "Update"}
                            </Button>
                            <Button
                              variant="secondary cancel-btn ms-2"
                              type="button"
                              onClick={(e) => {
                                alert("Hello");

                                e.preventDefault();
                                // resetForm();
                                this.openingBatchClear();
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                        <div className="productModalStyle">
                          <Table
                            // striped
                            // bordered
                            hover
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr>
                                <th>Flavour</th>
                                <th>Unit</th>
                                <th>Batch</th>
                                <th>Opening Qty</th>
                                <th>Free Qty</th>
                                <th>MRP</th>
                                <th>Sale Rate</th>
                                <th>Purchase Rate</th>
                                <th>Costing</th>
                                <th>Expiry Date</th>
                                <th>MFG Date</th>
                                {/* <th>Actions</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {claIndex > -1 &&
                                clbIndex > -1 &&
                                clcIndex > -1 &&
                                cuIndex > -1 &&
                                mstPackaging[claIndex]["levelb"][clbIndex][
                                  "levelc"
                                ][clcIndex]["units"][cuIndex]["batchList"]
                                  .length > 0 &&
                                mstPackaging[claIndex]["levelb"][clbIndex][
                                  "levelc"
                                ][clcIndex]["units"][cuIndex]["batchList"].map(
                                  (v, i) => {
                                    return (
                                      <tr
                                        onClick={(e) => {
                                          this.openingBatchUpdate(
                                            v,
                                            setFieldValue
                                          );
                                        }}
                                      >
                                        <td>
                                          {mstPackaging[claIndex][
                                            "levela_id"
                                          ] &&
                                            mstPackaging[claIndex]["levela_id"][
                                              "label"
                                            ]}
                                        </td>
                                        <td>
                                          {mstPackaging[claIndex]["levelb"][
                                            clbIndex
                                          ]["levelc"][clcIndex]["units"][
                                            cuIndex
                                          ]["unit_id"] &&
                                            mstPackaging[claIndex]["levelb"][
                                              clbIndex
                                            ]["levelc"][clcIndex]["units"][
                                              cuIndex
                                            ]["unit_id"]["label"]}
                                        </td>
                                        <td>{v.b_no}</td>
                                        <td>{v.opening_qty}</td>
                                        <td>{v.b_free_qty}</td>
                                        <td>{v.b_mrp}</td>
                                        <td>{v.b_sale_rate}</td>
                                        <td>{v.b_purchase_rate}</td>
                                        <td>{v.b_costing}</td>
                                        <td>{v.b_expiry}</td>
                                        <td>{v.b_manufacturing_date}</td>
                                        {/* <td>
                                          <img
                                            src={TableEdit}
                                            alt=""
                                            className="table_icons"

                                          />
                                          <img
                                            src={TableDelete}
                                            alt=""
                                            className="table_icons"
                                          />
                                        </td> */}
                                      </tr>
                                    );
                                  }
                                )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {/* Brand Modal */}
        <Modal
          show={brandModalShow}
          size="md"
          className="modal-style"
          onHide={() => this.brandModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Add New Brand</Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.brandModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={brandInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              brandName: Yup.string()
                .nullable()
                .trim()
                .required("Brand name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              MyNotifications.fire(
                {
                  show: true,
                  icon: "confirm",
                  title: "Confirm",
                  msg: "Do you want to submit",
                  is_button_show: false,
                  is_timeout: false,
                  handleSuccessFn: () => {
                    let requestData = new FormData();
                    requestData.append("brandName", values.brandName);
                    createBrand(requestData)
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

                          this.brandModalShow(false);
                          this.lstBrands(true);
                        } else if (res.responseStatus == 409) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        }
                      })
                      .catch((error) => {});
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                autoComplete="off"
              >
                <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                  <Row className="justify-content-center">
                    <Col md="11">
                      <Form.Group>
                        <Form.Control
                          className="text-box"
                          type="text"
                          autoFocus="true"
                          placeholder="Brand Name"
                          name="brandName"
                          id="brandName"
                          onChange={handleChange}
                          value={values.brandName}
                          isValid={touched.brandName && !errors.brandName}
                          // isInvalid={!!errors.brandName}
                          onInput={(e) => {
                            e.target.value = e.target.value.trimStart();
                            e.target.value =
                              e.target.value.charAt(0).toUpperCase() +
                              e.target.value.slice(1);
                          }}
                          style={{ boxShadow: "none" }}
                        />
                        <span className="text-danger errormsg">
                          {errors.brandName}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button className="successbtn-style" type="submit">
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn ms-2"
                    // className="cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.brandModalShow(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        {/* Group Modal */}
        <Modal
          show={groupModalShow}
          size="md"
          className="modal-style"
          onHide={() => this.groupModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Add New Group</Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.groupModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={groupInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              groupName: Yup.string()
                .nullable()
                .trim()
                .required("Group name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    requestData.append("groupName", values.groupName);
                    createGroup(requestData)
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

                          this.groupModalShow(false);
                          this.lstGroups(true);
                        } else if (res.responseStatus == 409) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        }
                      })
                      .catch((error) => {});
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                autoComplete="off"
              >
                <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                  <Row className="justify-content-center">
                    <Col md="11">
                      <Form.Group>
                        <Form.Control
                          className="text-box"
                          type="text"
                          placeholder="Group Name"
                          name="groupName"
                          autoFocus="true"
                          id="groupName"
                          onChange={handleChange}
                          value={values.groupName}
                          isValid={touched.groupName && !errors.groupName}
                          // isInvalid={!!errors.groupName}
                          onInput={(e) => {
                            e.target.value = e.target.value.trimStart();
                            e.target.value =
                              e.target.value.charAt(0).toUpperCase() +
                              e.target.value.slice(1);
                          }}
                          style={{ boxShadow: "none" }}
                        />
                        <span className="text-danger errormsg">
                          {errors.groupName}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button className="successbtn-style" type="submit">
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn ms-2"
                    // className="mdl-cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.groupModalShow(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        {/* Category Modal */}
        <Modal
          show={categoryModalShow}
          size="md"
          className="modal-style"
          onHide={() => this.categoryModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Add New Category</Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.categoryModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={categoryInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              categoryName: Yup.string()
                .nullable()
                .trim()
                .required("Category name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    requestData.append("categoryName", values.categoryName);
                    createCategory(requestData)
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

                          this.categoryModalShow(false);
                          this.lstCategories(true);
                        } else if (res.responseStatus == 409) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        }
                      })
                      .catch((error) => {});
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                autoComplete="off"
              >
                <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                  <Row className="justify-content-center">
                    <Col md="11">
                      <Form.Group>
                        <Form.Control
                          className="text-box"
                          type="text"
                          placeholder="Category Name"
                          name="categoryName"
                          id="categoryName"
                          autoFocus="true"
                          onChange={handleChange}
                          value={values.categoryName}
                          isValid={touched.categoryName && !errors.categoryName}
                          // isInvalid={!!errors.categoryName}
                          onInput={(e) => {
                            e.target.value = e.target.value.trimStart();
                            e.target.value =
                              e.target.value.charAt(0).toUpperCase() +
                              e.target.value.slice(1);
                          }}
                          style={{ boxShadow: "none" }}
                        />
                        <span className="text-danger errormsg">
                          {errors.categoryName}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button className="successbtn-style" type="submit">
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn ms-2"
                    // className="mdl-cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.categoryModalShow(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        {/* Package Modal */}
        <Modal
          show={packageModalShow}
          size="md"
          className="modal-style"
          onHide={() => this.packageModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Add New Package</Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.packageModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={packageInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              packageName: Yup.string()
                .nullable()
                .trim()
                // .matches(alphaNumericRex, "Enter alpha-numeric")
                .required("Package name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    requestData.append("packing_name", values.packageName);
                    createPacking(requestData)
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

                          this.packageModalShow(false);
                          this.getMstPackageOptions(true);
                        } else if (res.responseStatus == 409) {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        } else {
                          MyNotifications.fire({
                            show: true,
                            icon: "error",
                            title: "Error",
                            msg: res.message,
                            is_button_show: true,
                          });
                        }
                      })
                      .catch((error) => {});
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                autoComplete="off"
              >
                <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                  <Row className="justify-content-center">
                    <Col md="11">
                      <Form.Group>
                        <Form.Control
                          className="text-box"
                          type="text"
                          placeholder="Package Name"
                          name="packageName"
                          id="packageName"
                          autoFocus="true"
                          onChange={handleChange}
                          value={values.packageName}
                          isValid={touched.packageName && !errors.packageName}
                          // isInvalid={!!errors.packageName}
                          style={{ boxShadow: "none" }}
                        />
                        <span className="text-danger errormsg">
                          {errors.packageName}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button className="successbtn-style" type="submit">
                    Submit
                  </Button>
                  <Button
                    variant="secondary cancel-btn ms-2"
                    // className="mdl-cancel-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.packageModalShow(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
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
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={unitInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              unitName: Yup.string().trim().required("Unit name is required"),
              unitCode: Yup.object().required("Unit code is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                            MyNotifications.fire({
                              show: true,
                              icon: "success",
                              title: "Success",
                              msg: res.message,
                              is_timeout: true,
                              delay: 1000,
                            });

                            this.unitModalShow(false);
                            this.lstUnit();
                          } else if (res.responseStatus == 409) {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
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
                              delay: 1000,
                            });
                            resetForm();
                            this.unitModalShow(false);
                            this.pageReload();
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
                    }
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
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
                          className="text-box"
                          type="text"
                          autoFocus="true"
                          placeholder="Unit Name"
                          name="unitName"
                          id="unitName"
                          onChange={handleChange}
                          value={values.unitName}
                          isValid={touched.unitName && !errors.unitName}
                          isInvalid={!!errors.unitName}
                        />
                        <span className="text-danger errormsg">
                          {errors.unitName}
                        </span>
                      </Form.Group>
                    </Col>
                    <Col md="7">
                      <Form.Group style={{ border: "1px solid #dcdcdc" }}>
                        <Select
                          className="selectTo unitpopup"
                          id="unitCode"
                          placeholder="Unit Code"
                          // styles={customStyles}
                          styles={createPro}
                          // isClearable
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
                  <Button className="successbtn-style" type="submit">
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
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        {/* Level A */}
        <Modal
          show={levelAModalShow}
          size="md"
          className="modal-style"
          onHide={() => this.levelAModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {levelAInitVal.id === "" ? "Add New" : "Update"} LevelA
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.levelAModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={levelAInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              levelName: Yup.string().trim().required("Name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                            MyNotifications.fire({
                              show: true,
                              icon: "success",
                              title: "Success",
                              msg: res.message,
                              is_timeout: true,
                              delay: 1000,
                            });
                            // resetForm();
                            this.levelAModalShow(false);
                            this.getLevelALst();
                            // this.pageReload();
                          } else if (res.responseStatus == 409) {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
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
                              delay: 1000,
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
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
                    }
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
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
                          className="text-box"
                          type="text"
                          autoFocus="true"
                          placeholder="Level Name"
                          name="levelName"
                          id="levelName"
                          onChange={handleChange}
                          value={values.levelName}
                          isValid={touched.levelName && !errors.levelName}
                          isInvalid={!!errors.levelName}
                        />
                        <span className="text-danger errormsg">
                          {errors.levelName}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button className="successbtn-style" type="submit">
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
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>

        {/* Level B */}
        <Modal
          show={levelBModalShow}
          size="md"
          className="modal-style"
          onHide={() => this.levelBModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {levelBInitVal.id === "" ? "Add New" : "Update"} LevelB
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.levelBModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={levelBInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              levelName: Yup.string().trim().required("Name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                            MyNotifications.fire({
                              show: true,
                              icon: "success",
                              title: "Success",
                              msg: res.message,
                              is_timeout: true,
                              delay: 1000,
                            });
                            // resetForm();
                            this.levelBModalShow(false);
                            this.getLevelBLst();

                            // this.pageReload();
                          } else if (res.responseStatus == 409) {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
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
                              delay: 1000,
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
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
                    }
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
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
                          className="text-box"
                          type="text"
                          autoFocus="true"
                          placeholder="Level Name"
                          name="levelName"
                          id="levelName"
                          onChange={handleChange}
                          value={values.levelName}
                          isValid={touched.levelName && !errors.levelName}
                          isInvalid={!!errors.levelName}
                        />
                        <span className="text-danger errormsg">
                          {errors.levelName}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button className="successbtn-style" type="submit">
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
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        {/* Level C */}
        <Modal
          show={levelCModalShow}
          size="md"
          className="modal-style"
          onHide={() => this.levelCModalShow(false)}
          dialogClassName="modal-400w"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              {levelCInitVal.id === "" ? "Add New" : "Update"} LevelC
            </Modal.Title>
            <CloseButton
              className="pull-right"
              onClick={() => this.levelCModalShow(false)}
            />
          </Modal.Header>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={levelCInitVal}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              levelName: Yup.string().trim().required("Name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                            MyNotifications.fire({
                              show: true,
                              icon: "success",
                              title: "Success",
                              msg: res.message,
                              is_timeout: true,
                              delay: 1000,
                            });
                            // resetForm();
                            this.levelCModalShow(false);
                            this.getLevelCLst();
                            // this.pageReload();
                          } else if (res.responseStatus == 409) {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: res.message,
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
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
                              delay: 1000,
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
                              is_button_show: true,
                            });
                          }
                        })
                        .catch((error) => {});
                    }
                  },
                  handleFailFn: () => {},
                },
                () => {
                  // console.warn("return_data");
                }
              );
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
                          className="text-box"
                          type="text"
                          autoFocus="true"
                          placeholder="Level Name"
                          name="levelName"
                          id="levelName"
                          onChange={handleChange}
                          value={values.levelName}
                          isValid={touched.levelName && !errors.levelName}
                          isInvalid={!!errors.levelName}
                        />
                        <span className="text-danger errormsg">
                          {errors.levelName}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button className="successbtn-style" type="submit">
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
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
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

export default connect(mapStateToProps, mapActionsToProps)(ProductEdit);
