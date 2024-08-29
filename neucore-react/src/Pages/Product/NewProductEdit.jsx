import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Modal,
  Table,
  CloseButton,
} from "react-bootstrap";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import TableDelete from "@/assets/images/deleteIcon.png";
import TableEdit from "@/assets/images/Edit.png";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import keyboard from "@/assets/images/keyboard.png";
import question from "@/assets/images/question.png";
import Select from "react-select";
import add_icon from "@/assets/images/add_icon.svg";
import {
  createProduct,
  createProductNew,
  createTax,
  get_taxOutlet,
  getAllHSN,
  get_outlet_groups,
  getsubGroups,
  getAllCategory,
  getAllSubCategory,
  createPacking,
  createHSN,
  validate_product,
  getMstPackageList,
  getAllUnit,
  get_outlet_levelA,
  get_outlet_levelB,
  get_outlet_levelC,
  getOutletAppConfig,
  createBrand,
  getAllBrands,
  createGroup,
  createSubGroup,
  createCategory,
  createSubCategory,
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
  get_last_product_data,
  updateNewProduct,
  getNewProductEdit,
  validate_product_code_update,
  validate_product_update,
  removeInstance,
  delete_Product_list,
} from "@/services/api_functions";

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
  taxTypeOpts,
  allEqual,
  addDataLock,
  removeDataLock,
  checkDataLockExist,
  ShowNotification,
  handlesetFieldValue,
} from "@/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faArrowUpFromBracket,
  faCalculator,
  faCirclePlus,
  faCircleQuestion,
  faFloppyDisk,
  faGear,
  faHouse,
  faPen,
  faPrint,
  faQuestion,
  faRightFromBracket,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";

import CMPProductTable from "./CMP/CMPProductTable";

const typeoption = [
  { label: "Services", value: "Services" },
  { label: "Goods", value: "Goods" },
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

class NewProductEdit extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.taxMdlRef = React.createRef();
    this.state = {
      initVal: {
        productCode: "",
        productName: "",
        productDescription: "",
        barcodeNo: "",
        barcodeSaleQuantity: "",
        shelfId: "",
        brandId: "",
        groupId: "",
        categoryId: "",
        packagingId: "",
        groupfetchid: "",
        hsnNo: "",
        taxType: "",
        tax: "",
        igst: "",
        cgst: "",
        sgst: "",
        taxApplicableDate: "",
        margin: "",
        disPer1: "",
        weight: "",
        weightUnit: "",
        minStock: "",
        maxStock: "",
        isLevelA: true,
        isLevelB: true,
        isLevelC: true,
        isLevelD: false,
        isInventory: true,
        isBatchNo: true,
        isSerialNo: false,
        isWarranty: false,
      },
      levelA: "",
      levelB: "",
      levelC: "",
      packageOpts: [],
      taxTypeOpts: [],
      optTaxList: [],
      optHSNList: [],
      brandOpt: [],
      groupOpt: [],
      subgroupOpt: [],
      categoryOpt: [],
      subcategoryOpt: [],
      ABC_flag_value: false,
      isOpeningBatch: true,
      isBatchHideShow: true,
      productrows: [],
      opnStockModalShow: false,
      product_id: "",
      isEditDataSet: false,
      setRowData: false,
      rowDelDetailsIds: [],
      initValTax: {
        id: "",
        gst_per: "",
        sratio: "50%",
        igst: "",
        cgst: "",
        sgst: "",
      },
      batchInitVal: {
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
      categoryInitValue: {
        groupId: "",
        brandId: "",
        categoryName: "",
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
      brandInitVal: {
        id: "",
        brandName: "",
      },
      brandModalShow: false,
      groupInitVal: {
        id: "",
        groupName: "",
      },
      subgroupInitVal: {
        id: "",
        subgroupName: "",
      },
      categoryInitVal: {
        id: "",
        categoryName: "",
      },
      subcategoryInitVal: {
        id: "",
        subcategoryName: "",
      },
      categoryModalShow: false,
      packageInitVal: {
        id: "",
        packageName: "",
      },
      unitList: [],
      unitModalShow: false,
      selectedUnits: [],
      taxModalShow: false,
      HSNshow: false,
      groupModalShow: false,
      subgroupModalShow: false,
      categoryModalShow: false,
      subcategoryModalShow: false,
      unitModalShow: false,
      editProductId: "",

      errorArrayBorder: "",
      errorArrayBorderModel: "",
      errorArrayBorderTax: "",
      errorArrayBorderPack: "",
      errorArrayBorderBrand: "",
      errorArrayBorderGroup: "",
      errorArrayBorderSubGroup: "",
      errorArrayBorderCategory: "",
      errorArrayBorderSubCategory: "",
      // datalockSlug: "",
      // source: "",
    };

    this.selectRef = React.createRef();
    this.selectRefS = React.createRef();
    this.selectRefT = React.createRef();
    this.selectRefA = React.createRef();
    this.selectRefTax = React.createRef();
    this.selectRefP = React.createRef();

    this.HSNFormRef = React.createRef();
    this.BrandMdlRef = React.createRef();
    this.GroupMdlRef = React.createRef();
    this.SubGroupMdlRef = React.createRef();
    this.CategoryMdlRef = React.createRef();
    this.SubCategoryMdlRef = React.createRef();
  }

  lstBrands = (isNew = false) => {
    getAllBrands()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let Opt = data.map(function (values) {
            return { value: values.id, label: values.brandName };
          });

          // if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
          // else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

          this.setState({ brandOpt: Opt });
          if (isNew) {
            this.myRef.current.setFieldValue("brandId", Opt[Opt.length - 1]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  lstGroups = (groupFlag = false) => {
    get_outlet_groups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let Opt = data.map(function (values) {
            return { value: values.id, label: values.groupName };
          });

          // if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
          // else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

          this.setState({ groupOpt: Opt });
          if (groupFlag) {
            this.myRef.current.setFieldValue("groupId", Opt[Opt.length - 1]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  lstsubGroups = (subgroupFlag = false) => {
    getsubGroups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let Opt = data.map(function (values) {
            return { value: values.id, label: values.subgroupName };
          });

          // if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
          // else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

          this.setState({ subgroupOpt: Opt });
          if (subgroupFlag) {
            this.myRef.current.setFieldValue("subgroupId", Opt[Opt.length - 1]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  lstCategories = (isNew = false) => {
    getAllCategory()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let Opt = data.map(function (values) {
            return { value: values.id, label: values.categoryName };
          });

          // if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
          // else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

          this.setState({ categoryOpt: Opt });
          if (isNew) {
            this.myRef.current.setFieldValue("categoryId", Opt[Opt.length - 1]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  lstsubCategories = (isNew = false) => {
    getAllSubCategory()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;

          let Opt = data.map(function (values) {
            return { value: values.id, label: values.subcategoryName };
          });

          // if (Opt.length == 0) Opt.unshift({ value: "0", label: "Add New" });
          // else Opt.unshift({ value: Opt.length + 1, label: "Add New" });

          this.setState({ subcategoryOpt: Opt });
          if (isNew) {
            this.myRef.current.setFieldValue(
              "subcategoryId",
              Opt[Opt.length - 1]
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getMstPackageOptions = (packageFlag = false) => {
    getMstPackageList()
      .then((response) => {
        let data = response.data;
        if (data.responseStatus == 200) {
          let Opt = data.list.map((v) => {
            return { label: v.name, value: v.id, ...v };
          });
          // if (Opt.length == 0) Opt.unshift({ label: "Add New", value: "0" });
          // else Opt.unshift({ label: "Add New", value: Opt.length + 1 });
          this.setState({ packageOpts: Opt });
          if (packageFlag) {
            this.myRef.current.setFieldValue(
              "packagingId",
              Opt[Opt.length - 1]
            );
          }
          // this.setState({ packageOpts: Opt },()=>{
          //   if (id != "") {
          //     let optSelected = getSelectValue(
          //       this.state.packageOpts,
          //       parseInt(id)
          //     );
          //     if (optSelected != "") {
          //       this.myRef.current.setFieldValue("packagingId", optSelected);
          //     }
          //   }
          // });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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

          // if (options.length == 0)
          //   options.unshift({
          //     value: "0",
          //     label: "Add New",
          //     sratio: "",
          //     igst: "",
          //     cgst: "",
          //     sgst: "",
          //   });
          // else
          //   options.unshift({
          //     value: options.length + 1,
          //     label: "Add New",
          //     sratio: "",
          //     igst: "",
          //     cgst: "",
          //     sgst: "",
          //   });

          this.setState({ optTaxList: options });
          // , () => {
          //   if (id != "") {
          //     let optSelected = getSelectValue(
          //       this.state.optTaxList,
          //       parseInt(id)
          //     );
          //     // if (optSelected != "") {
          //     //   this.myRef.current.setFieldValue("taxMasterId", optSelected);
          //     // }
          //   }
          // });
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

          // if (options.length == 0)
          //   options.unshift({
          //     value: "0",
          //     label: "Add New",
          //     hsndesc: "",
          //     igst: "",
          //     cgst: "",
          //     sgst: "",
          //   });
          // else
          //   options.unshift({
          //     value: options.length + 1,
          //     label: "Add New",
          //     hsndesc: "",
          //     igst: "",
          //     cgst: "",
          //     sgst: "",
          //   });
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
      .catch((error) => {
        console.log(error);
      });
  };

  validate_product_update = (productName, packageId, setFieldValue) => {
    let requestData = new FormData();
    let { editProductId } = this.state;
    requestData.append("productName", productName);
    requestData.append("productId", editProductId);
    requestData.append(
      "packageId",
      packageId && packageId != null ? packageId : ""
    );
    validate_product_update(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 409) {
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
            this.selectRefP.current?.focus();
          }, 1300);
        } else {
          setTimeout(() => {
            document.getElementById("addPacking").focus();
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  validate_product_code_update = (productCode) => {
    // console.log("productcode ", productCode);
    let { editProductId } = this.state;
    let requestData = new FormData();

    requestData.append("productCode", productCode);
    requestData.append("productId", editProductId);
    validate_product_code_update(requestData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 409) {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 1500,
            // is_button_show: true,
          });
          //  setFieldValue("productCode", "");
          setTimeout(() => {
            document.getElementById("productCode").focus();
          }, 2000);
        } else {
          setTimeout(() => {
            document.getElementById("productName").focus();
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  handleMaxStock = (maxStock, minstock, setFieldValue) => {
    // console.log("max", maxStock, minstock);
    if (parseInt(minstock) > parseInt(maxStock)) {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Max Stock Should greater",
        is_timeout: true,
        delay: 1500,
        // is_button_show: true,
      });
      setFieldValue("maxStock", "");
      setTimeout(() => {
        document.getElementById("maxStock").focus();
      }, 1600);
    } else {
      setFieldValue("maxStock", maxStock);
      document.getElementById("disPer1").focus();
    }
  };

  productSetChange = (obj) => {
    this.setState(obj);
  };

  initProductRow = () => {
    let productrows = [
      {
        current_index: 0,
        index_A: 0,
        index_B: 0,
        index_C: 0,
        index_Unit: 0,
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
        unitIdData: "",
      },
    ];
    this.setState({ productrows: productrows });
  };
  getUserControlLevelFromRedux = () => {
    const level = getUserControlLevel(this.props.userControl);
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
  subgroupModalShow = (value) => {
    this.setState({ subgroupModalShow: value }, () => {
      if (value == false)
        this.setState({
          subgroupInitVal: {
            id: "",
            subgroupName: "",
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

  subcategoryModalShow = (value) => {
    this.setState({ subcategoryModalShow: value }, () => {
      if (value == false)
        this.setState({
          subcategoryInitVal: {
            id: "",
            subcategoryName: "",
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

  OpenProductList = (e) => {
    eventBus.dispatch("page_change", "productlist");
  };
  // OpenLedgerList = (e) => {
  //   eventBus.dispatch("page_change", "ledgerlist");
  // };

  handleKeyPress = (event) => {
    // console.log("event", event);
    if (event.altKey && event.key == "p") {
      event.preventDefault();
      this.OpenProductList();
    } else if (event.altKey && event.key == "l") {
      event.preventDefault();
      this.OpenLedgerList();
    }
    //@vinit@focus directly shifts to submit button
    else if (event.altKey && event.keyCode === 83) {
      document.getElementById("submit").focus();
    } else if (event.altKey && event.keyCode === 67) {
      document.getElementById("cancel").focus();
    }
    //@harish @onkeypress Escape close the modal
    else if (event.key === "Escape") {
      this.setState({ packageModalShow: false });
      this.setState({ HSNshow: false });
      this.setState({ brandModalShow: false });
      this.setState({ categoryModalShow: false });
      this.setState({ subcategoryModalShow: false });
      this.setState({ groupModalShow: false });
      this.setState({ subgroupModalShow: false });
    }
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    if (AuthenticationCheck()) {
      this.lstBrands();
      this.lstGroups();
      this.lstsubGroups();
      this.lstsubCategories();
      this.lstCategories();
      this.getMstPackageOptions();
      this.lstTAX();
      this.lstHSN();
      this.initProductRow();
      this.lstUnit();
      // !get user control configuration
      this.getUserControlLevelFromRedux();

      const { prop_data } = this.props.block;
      console.warn("other component prop_data ", prop_data);

      if (prop_data.hasOwnProperty("source")) {
        this.setState({ source: prop_data.source, product_id: prop_data.id });
      } else {
        this.setState({ product_id: prop_data.prop_data });
      }

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
    // alt key button disabled start
    window.removeEventListener("keydown", this.handleAltKeyDisable);
    // alt key button disabled end
  }

  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end

  componentDidUpdate() {
    if (AuthenticationCheck()) {
      let {
        isEditDataSet,
        product_id,
        brandOpt,
        groupOpt,
        subgroupOpt,
        categoryOpt,
        subcategoryOpt,
        optHSNList,
        optTaxList,
        packageOpts,
      } = this.state;

      if (
        isEditDataSet == false &&
        product_id != "" &&
        brandOpt.length > 0 &&
        // groupOpt.length > 0 &&
        // subgroupOpt.length > 0 &&
        // categoryOpt.length > 0 &&
        // subcategoryOpt.length > 0 &&
        // packageOpts.length > 0 &&
        optHSNList.length > 0 &&
        optTaxList.length > 0
      ) {
        this.getProductDetails();
      }
    }
  }

  getProductDetails = () => {
    let { product_id } = this.state;
    const formData = new FormData();
    if (product_id.id) {
      formData.append("product_id", product_id.id);
    } else {
      formData.append("product_id", product_id);
    }

    getNewProductEdit(formData)
      .then((response) => {
        // console.log("response", response);
        let res = response.data;
        // console.log("res", res);
        if (response.data.responseStatus == 200) {
          let {
            brandOpt,
            groupOpt,
            categoryOpt,
            packageOpts,
            optHSNList,
            optTaxList,
            subgroupOpt,
            subcategoryOpt,
          } = this.state;
          let total_op_qty = 0;

          let res = response.data.responseObject;
          // console.log("res produtct---", JSON.stringify(res));
          // console.log("res", res);

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
            subgroupId: res.subgroupId
              ? getSelectValue(subgroupOpt, res.subgroupId)
              : "",

            categoryId: res.categoryId
              ? getSelectValue(categoryOpt, res.categoryId)
              : "",
            subcategoryId: res.subcategoryId
              ? getSelectValue(subcategoryOpt, res.subcategoryId)
              : "",
            packagingId: res.packagingId
              ? getSelectValue(packageOpts, res.packagingId)
              : "",
            groupfetchid: "",
            hsnNo: res.hsnNo ? getSelectValue(optHSNList, res.hsnNo) : "",
            taxType: res.taxType
              ? getSelectValue(taxTypeOpts, res.taxType.toLowerCase())
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
          let FProductRow = [];
          if (res.productrows && res.productrows.length > 0) {
            res.productrows.map((v, i) => {
              let total_op_qty = 0;
              let obj = { ...v };
              // console.log("Before set obj ", obj);
              obj["current_index"] = i;
              obj["index_A"] = i;
              obj["index_B"] = i;
              obj["index_C"] = i;
              obj["index_Unit"] = i;
              obj["orgselectedLevelA"] = obj["selectedLevelA"];
              obj["orgselectedLevelB"] = obj["selectedLevelB"];
              obj["orgselectedLevelC"] = obj["selectedLevelC"];
              obj["orgselectedUnit"] = obj["selectedUnit"];

              obj["selectedLevelA"] = "";
              obj["selectedLevelB"] = "";
              obj["selectedLevelC"] = "";
              obj["selectedUnit"] = "";

              obj["conv"] = obj.conv;
              obj["max_qty"] = obj.max_qty;
              obj["min_qty"] = obj.min_qty;
              obj["mrp"] = obj.mrp;
              obj["pur_rate"] = obj.pur_rate;
              obj["rate_1"] = obj.rate_1;
              obj["rate_2"] = obj.rate_2;
              obj["rate_3"] = obj.rate_3;
              obj["is_negetive"] = obj.is_negetive;
              obj["batchList"] = obj.batchList
                ? obj.batchList.length > 0
                  ? obj.batchList.map((vi, ii) => {
                    total_op_qty =
                      total_op_qty +
                      (vi["opening_qty"] ? parseInt(vi["opening_qty"]) : 0) +
                      (vi["b_free_qty"] ? parseInt(vi["b_free_qty"]) : 0);
                    vi["b_manufacturing_date"] = vi["b_manufacturing_date"]
                      ? moment(
                        vi["b_manufacturing_date"],
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")
                      : "";
                    vi["b_expiry"] = vi["b_expiry"]
                      ? moment(vi["b_expiry"], "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )
                      : "";
                    return vi;
                  })
                  : []
                : "";
              obj["opn_stock"] = total_op_qty;
              // console.log("After set obj ", obj);
              FProductRow.push(obj);
            });
          }

          // console.log("FProductRow", JSON.stringify(FProductRow));
          this.setState(
            {
              isOpeningBatch: res.isBatchNo,
              initVal: initVal,
              isBatchHideShow: initVal.isBatchNo,
              productrows: FProductRow,
              editProductId: res.id,
              // datalockSlug: "productMaster_" + initVal.productId
            },
            () => {
              // if (this.state.datalockSlug != "") {
              //   if (!checkDataLockExist(this.state.datalockSlug)) {
              //     addDataLock(this.state.datalockSlug)
              //   }
              // }
              setTimeout(() => {
                this.setState({ isEditDataSet: true, setRowData: true });
              }, 500);
            }
          );
        }
        // else if (res.responseStatus == 409) {
        //   // ShowNotification("Error", data.message);
        //   console.log("data msg", res.message);
        //   MyNotifications.fire({
        //     show: true,
        //     icon: "error",
        //     title: "Error",
        //     msg: res.message,
        //     is_timeout: true,
        //     delay: 3000,
        //   });
        //   setTimeout(() => {
        //     eventBus.dispatch("page_change", {
        //       to: "productlist",
        //       from: "newproductedit",
        //       isNewTab: false,
        //     });
        //   }, 2000);
        // } else {
        //   this.setState({ isEditDataSet: true });
        //   ShowNotification("Error", res.responseStatus);
        //   console.log("ShowNotification", ShowNotification("Error", res.responseStatus))
        // }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // ! function set border to required fields
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

  validateHSN = (hsnNumber, setFieldValue) => {
    let requestData = new FormData();
    requestData.append("hsnNumber", hsnNumber);
    if (hsnNumber.length > 8) {
      MyNotifications.fire({
        show: true,
        icon: "warning",
        title: "Warning",
        msg: "Invalid HSN ,Please Enter 8 digit HSN No",
        // is_button_show: true,
        is_timeout: true,
        delay: 1500,
      });
      setTimeout(() => {
        document.getElementById("hsnNumber").focus();
      }, 2000);
      // console.log("Invalid HSN No Please input 8 digit HSN");
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
              is_timeout: true,
              delay: 1500,
              // is_button_show: true,
            });
            // this.invoiceDateRef.current.focus();
            // setFieldValue("hsnNumber", "");
            setTimeout(() => {
              document.getElementById("hsnNumber").focus();
            }, 2000);
          } else {
            setTimeout(() => {
              document.getElementById("description").focus();
            }, 100);
          }
        })
        .catch((error) => { });
    }
  };
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // FUNCTION  FOR REMOVE INSTANCE
  // CancelAPICall = () => {
  //   if (checkDataLockExist(this.state.datalockSlug)) {
  //     removeDataLock(this.state.datalockSlug);
  //     let reqData = new FormData();
  //     reqData.append("key", this.state.datalockSlug)
  //     removeInstance(reqData).then((response) => {
  //       console.log("respose", response);
  //       if (this.state.source != "") {
  //         eventBus.dispatch("page_change", {
  //           from: "newproductedit",
  //           to: this.state.source.from_page,
  //           prop_data: {
  //             rows: this.state.source.rows,
  //             invoice_data:
  //               this.state.source.invoice_data,
  //             ...this.state.source,
  //           },
  //           isNewTab: false,
  //         });
  //         this.setState({ source: "", datalockSlug: "" });
  //       } else {
  //         eventBus.dispatch(
  //           "page_change",
  //           "productlist"
  //         );
  //       }
  //     }).catch(
  //       (error) => {
  //         console.log("error", error);
  //         if (this.state.source != "") {
  //           eventBus.dispatch("page_change", {
  //             from: "newproductedit",
  //             to: this.state.source.from_page,
  //             prop_data: {
  //               rows: this.state.source.rows,
  //               invoice_data:
  //                 this.state.source.invoice_data,
  //               ...this.state.source,
  //             },
  //             isNewTab: false,
  //           });
  //           this.setState({ source: "" });
  //         } else {
  //           eventBus.dispatch(
  //             "page_change",
  //             "productlist"
  //           );
  //         }
  //       }
  //     )
  //   }

  // }

  handleKeyDown = (e, index) => {
    if (e.keyCode === 13) {
      document.getElementById(index).focus();
    }
    if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index).focus();
    }
    if (e.altKey && e.keyCode === 67) {
      const index = "cancel";
      document.getElementById(index).focus();
    }
  };

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
          // this.setState({ enterKeyPress: index });
          break;
        } else {
          this.focusNextElement(e, index);
        }
      } else {
        this.focusNextElement(e, index);
      }
    }
  }

  deleteproduct = (setFieldValue) => {
    let { initVal } = this.state;
    console.warn("initVal ", initVal);
    let formData = new FormData();
    formData.append("id", initVal["productId"]);
    formData.append("source", "product_edit");
    delete_Product_list(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          setFieldValue("isInventory", false);
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
      .catch((error) => {
        this.setState({ lstLedger: [] });
      });
  };

  render() {
    let {
      initVal,
      levelA,
      levelB,
      levelC,
      isOpeningBatch,
      packageOpts,
      optTaxList,
      optHSNList,
      brandOpt,
      groupOpt,
      categoryOpt,
      subgroupOpt,
      subcategoryOpt,
      productrows,
      isBatchHideShow,
      opnStockModalShow,
      setRowData,
      rowDelDetailsIds,
      initValTax,
      source,
      HSNshow,
      taxModalShow,
      HSNinitVal,
      brandModalShow,
      brandInitVal,
      groupInitVal,
      subgroupInitVal,
      groupModalShow,
      subgroupModalShow,
      categoryInitVal,
      subcategoryInitVal,
      categoryModalShow,
      subcategoryModalShow,
      packageInitVal,
      packageModalShow,
      unitModalShow,
      unitInitVal,
      errorArrayBorder,
      errorArrayBorderModel,
      errorArrayBorderTax,
      errorArrayBorderPack,
      errorArrayBorderBrand,
      errorArrayBorderGroup,
      errorArrayBorderSubGroup,
      errorArrayBorderCategory,
      errorArrayBorderSubCategory,
      editProductId,
      unitIdData,
    } = this.state;
    return (
      <div>
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
              // productName: Yup.string()
              //   .trim()
              //   .required("Product Name is required"),
              // // description: Yup.string()
              // //   .trim()
              // //   .required('Product description is required'),
              // // groupId: Yup.object().required("Select group"),
              // brandId: Yup.object().required("Select Brand"),
              // // unitInitVal
              // // unitId: Yup.object().required("Select Unit"),
              // hsnNo: Yup.object().required("Select HSN"),
              // taxType: Yup.object().required("Select Tax Type"),
              // tax: Yup.object().required("Select Tax"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              // console.log("Values", values);

              //! validation required start
              let errorArray = [];
              if (values.productName.trim() == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.taxType == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.tax == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              if (values.hsnNo == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.brandId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  let unitrow = [];
                  {
                    productrows &&
                      productrows.map((v, i) => {
                        if (v.selectedUnit != "") {
                          unitrow.push("");
                        } else {
                          unitrow.push("Y");
                        }
                      });
                  }

                  this.setState(
                    {
                      unitIdData: unitrow,
                    },
                    () => {
                      if (allEqual(unitrow)) {
                        let { mstPackaging } = this.state;
                        let isError = false;

                        if (isError == false) {
                          MyNotifications.fire(
                            {
                              show: true,
                              icon: "confirm",
                              title: "Confirm",
                              msg: "Do you want to Update",
                              is_button_show: false,
                              is_timeout: false,
                              delay: 0,
                              handleSuccessFn: () => {
                                // let { mstPackaging } = this.state;

                                let keys = Object.keys(initVal);

                                let requestData = new FormData();

                                keys.map((v) => {
                                  if (
                                    values[v] != "" &&
                                    v != "brandId" &&
                                    v != "groupId" &&
                                    v != "subgroupId" &&
                                    v != "categoryId" &&
                                    v != "subcategoryId" &&
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
                                    if (
                                      values[v] != undefined &&
                                      values[v] != null
                                    ) {
                                      requestData.append(v, values[v]);
                                    }
                                  }
                                });
                                if (
                                  values.packagingId !== null &&
                                  values.packagingId !== undefined &&
                                  values.packagingId !== ""
                                ) {
                                  requestData.append(
                                    "packagingId",
                                    values.packagingId
                                      ? values.packagingId.value
                                      : ""
                                  );
                                }
                                if (
                                  values.brandId !== null &&
                                  values.brandId !== undefined &&
                                  values.brandId !== ""
                                ) {
                                  requestData.append(
                                    "brandId",
                                    values.brandId ? values.brandId.value : ""
                                  );
                                }
                                if (
                                  values.groupId !== null &&
                                  values.groupId !== undefined &&
                                  values.groupId !== ""
                                ) {
                                  requestData.append(
                                    "groupId",
                                    values.groupId ? values.groupId.value : ""
                                  );
                                }

                                if (
                                  values.subgroupId !== null &&
                                  values.subgroupId !== undefined &&
                                  values.subgroupId !== ""
                                ) {
                                  requestData.append(
                                    "subgroupId",
                                    values.subgroupId
                                      ? values.subgroupId.value
                                      : ""
                                  );
                                }
                                if (
                                  values.categoryId !== null &&
                                  values.categoryId !== undefined &&
                                  values.categoryId !== ""
                                ) {
                                  requestData.append(
                                    "categoryId",
                                    values.categoryId
                                      ? values.categoryId.value
                                      : ""
                                  );
                                }
                                if (
                                  values.subcategoryId !== null &&
                                  values.subcategoryId !== ""
                                ) {
                                  requestData.append(
                                    "subcategoryId",
                                    values.subcategoryId
                                      ? values.subcategoryId.value
                                      : ""
                                  );
                                }

                                if (
                                  values.hsnNo !== null &&
                                  values.hsnNo !== undefined &&
                                  values.hsnNo !== ""
                                ) {
                                  requestData.append(
                                    "hsnNo",
                                    values.hsnNo ? values.hsnNo.value : ""
                                  );
                                }
                                if (
                                  values.taxType !== null &&
                                  values.taxType !== ""
                                ) {
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
                                  values.isInventory
                                    ? values.isInventory
                                    : false
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
                                    values.isWarranty
                                      ? values.isWarranty
                                      : false
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
                                let FProductRows = productrows.filter((v) => {
                                  v["details_id"] = v["id"] ? v["id"] : 0;
                                  v["selectedLevelA"] = v["selectedLevelA"]
                                    ? v["selectedLevelA"]["value"]
                                    : "";
                                  v["selectedLevelB"] = v["selectedLevelB"]
                                    ? v["selectedLevelB"]["value"]
                                    : "";
                                  v["selectedLevelC"] = v["selectedLevelC"]
                                    ? v["selectedLevelC"]["value"]
                                    : "";
                                  v["selectedUnit"] = v["selectedUnit"]
                                    ? v["selectedUnit"]["value"]
                                    : "";
                                  v["batchList"] = v["batchList"]
                                    ? v["batchList"].map((bv, bi) => {
                                      if (bv != null) {
                                        bv["isOpeningbatch"] = isOpeningBatch;
                                        bv["batch_id"] = bv["batch_id"]
                                          ? bv["batch_id"]
                                          : "";
                                        bv["b_expiry"] =
                                          bv["b_expiry"] != "" &&
                                            bv["b_expiry"]
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
                                            ? (bv["b_manufacturing_date"] =
                                              moment(
                                                new Date(
                                                  moment(
                                                    bv[
                                                    "b_manufacturing_date"
                                                    ],
                                                    "DD/MM/YYYY"
                                                  ).toDate()
                                                )
                                              ).format("yyyy-MM-DD"))
                                            : "";

                                        return bv;
                                      }
                                    })
                                    : [];

                                  return v;
                                });

                                // console.log("FProductRows", FProductRows);

                                requestData.append(
                                  "productrows",
                                  JSON.stringify(FProductRows)
                                );

                                // del_id

                                requestData.append(
                                  "rowDelDetailsIds",
                                  JSON.stringify([])
                                );
                                // for (var pair of requestData.entries()) {
                                //   console.log(pair[0] + ", " + pair[1]);
                                // }
                                // !UpdateProductNew
                                updateNewProduct(requestData)
                                  .then((response) => {
                                    let res = response.data;
                                    // console.log("res", res);
                                    if (res.responseStatus == 200) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "success",
                                        title: "Success",
                                        msg: res.message,
                                        is_timeout: true,
                                        delay: 1000,
                                      });
                                      if (
                                        this.state.source &&
                                        this.state.source !== ""
                                      ) {
                                        if (
                                          this.state.source &&
                                          this.state.source.opType === "edit"
                                        ) {
                                          eventBus.dispatch("page_change", {
                                            from: "newproductcreate",
                                            to: this.state.source.from_page,
                                            // prop_data: {
                                            //   rows: this.state.source.rows,
                                            //   invoice_data:
                                            //     this.state.source.invoice_data,
                                            //   // rowIndex:
                                            //   //   this.state.source.rowIndex,
                                            //   productId: parseInt(res.data),
                                            //   isProduct: this.props.block.prop_data.isProduct,
                                            //   rowIndex: this.props.block.prop_data.rowIndex,
                                            // },
                                            prop_data: {
                                              prop_data: {
                                                rows: this.state.source.rows,
                                                invoice_data:
                                                  this.state.source
                                                    .invoice_data,
                                                ...this.state.source,
                                                id: this.state.source
                                                  .invoice_data.id,
                                                productId: parseInt(res.data),
                                                isProduct:
                                                  this.props.block.prop_data
                                                    .isProduct,
                                              },
                                              isProduct:
                                                this.props.block.prop_data
                                                  .isProduct,
                                              rowIndex:
                                                this.props.block.prop_data
                                                  .rowIndex,
                                              selectedBills:
                                                this.props.block.prop_data
                                                  .conversionEditData !=
                                                  undefined
                                                  ? this.props.block.prop_data
                                                    .conversionEditData
                                                    .selectedBills
                                                  : [],
                                            },
                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else if (
                                          this.state.source.opType === "create"
                                        ) {
                                          // if (this.props.block.prop_data != "") {
                                          eventBus.dispatch("page_change", {
                                            from: "newproductcreate",
                                            to: this.state.source.from_page,
                                            prop_data: {
                                              rows: this.state.source.rows,
                                              invoice_data:
                                                this.state.source.invoice_data,
                                              // rowIndex:
                                              //   this.state.source.rowIndex,
                                              productId: parseInt(res.data),
                                              isProduct:
                                                this.props.block.prop_data
                                                  .isProduct,
                                              rowIndex:
                                                this.props.block.prop_data
                                                  .rowIndex,
                                            },

                                            isNewTab: false,
                                          });
                                          this.setState({ source: "" });
                                        } else {
                                          eventBus.dispatch("page_change", {
                                            to: "productlist",
                                            isNewTab: false,
                                          });
                                        }
                                      } else {
                                        // eventBus.dispatch(
                                        //   "page_change",
                                        //   "productlist"
                                        // );
                                        eventBus.dispatch("page_change", {
                                          from: "newproductedit",
                                          to: "productlist",
                                          prop_data: {
                                            editId: this.state.product_id.id,
                                            rowId:
                                              this.props.block.prop_data.rowId,
                                          },
                                          isCancel: true,
                                          isNewTab: false,
                                        });
                                      }
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
                                  .catch((error) => {
                                    console.log("error", error);
                                    MyNotifications.fire({
                                      show: true,
                                      icon: "error",
                                      title: "Error",
                                      is_timeout: true,
                                      delay: 1500,

                                      // is_button_show: true,
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
                        } else {
                        }
                      }
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
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault();
                  }
                }}
                spellcheck="false"
              >
                {/* {JSON.stringify(mstPackaging)} */}
                {/* {JSON.stringify(values)} */}
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
                              autoFocus
                              autoComplete="productCode"
                              placeholder="Code"
                              className="text-box"
                              id="productCode"
                              name="productCode"
                              onChange={handleChange}
                              value={values.productCode}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.key === "Tab") {
                                } else if (e.keyCode == 9) {
                                  if (
                                    values.productCode != "" &&
                                    values.productCode != null
                                  ) {
                                    this.validate_product_code_update(
                                      values.productCode,
                                      setFieldValue
                                    );
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "productCode",
                                      e.target.value
                                    );
                                  } else {
                                    this.focusNextElement(e);
                                  }
                                } else if (e.keyCode === 13) {
                                  if (
                                    values.productCode != "" &&
                                    values.productCode != null
                                  ) {
                                    // debugger
                                    this.validate_product_code_update(
                                      values.productCode,
                                      setFieldValue
                                    );
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "productCode",
                                      e.target.value
                                    );
                                  } else {
                                    this.focusNextElement(e);
                                  }
                                }
                              }}
                            ></Form.Control>
                            <span className="text-danger errormsg">
                              {errors.productCode}
                            </span>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={4} md={4} sm={4} xs={4}>
                        <Row>
                          <Col lg={1} md={1} sm={1} xs={1}>
                            <Form.Label>
                              Name<span className="text-danger">*</span>{" "}
                            </Form.Label>
                          </Col>
                          <Col lg={11} md={11} sm={11} xs={11} className="pe-2">
                            <Form.Control
                              autoComplete="productName"
                              placeholder="Name"
                              id="productName"
                              name="productName"
                              onChange={handleChange}
                              // onInput={(e) => {
                              //   e.target.value = this.getDataCapitalised(
                              //     e.target.value
                              //   );
                              // }}
                              value={values.productName}
                              className={`${values.productName == "" &&
                                errorArrayBorder[0] == "Y"
                                ? "border border-danger text-box"
                                : "text-box"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "productName",
                                    e.target.value,
                                    true
                                  );
                                  if (e.target.value) {
                                    this.setErrorBorder(
                                      0,
                                      "",
                                      "errorArrayBorder"
                                    );
                                  } else {
                                    this.setErrorBorder(
                                      0,
                                      "Y",
                                      "errorArrayBorder"
                                    );
                                  }
                                } else if (e.keyCode == 9) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "productName",
                                    e.target.value,
                                    true
                                  );
                                  if (e.target.value) {
                                    this.setErrorBorder(
                                      0,
                                      "",
                                      "errorArrayBorder"
                                    );
                                    e.target.value = this.getDataCapitalised(
                                      e.target.value
                                    );
                                  } else {
                                    e.preventDefault();
                                    this.setErrorBorder(
                                      0,
                                      "Y",
                                      "errorArrayBorder"
                                    );
                                  }
                                } else if (e.keyCode == 13) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "productName",
                                    e.target.value,
                                    true
                                  );
                                  if (e.target.value === "") {
                                    e.preventDefault();
                                    this.setErrorBorder(
                                      0,
                                      "Y",
                                      "errorArrayBorder"
                                    );
                                    // e.target.value = this.getDataCapitalised(
                                    //   e.target.value
                                    // );
                                  } else {
                                    this.setErrorBorder(
                                      0,
                                      "",
                                      "errorArrayBorder"
                                    );
                                    // this.handleKeyDown(e, "productDescription");
                                    this.focusNextElement(e);
                                  }
                                }
                              }}
                            ></Form.Control>
                            <span className="text-danger errormsg">
                              {errors.productName}
                            </span>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={4} md={4} sm={4} xs={4}>
                        <Row>
                          <Col lg={2} md={2} sm={2} xs={2} className=" pe-0">
                            <Form.Label>Description</Form.Label>
                          </Col>
                          <Col lg={10} md={10} sm={10} xs={10} className="pe-2">
                            <Form.Control
                              autoComplete="productDescription"
                              className="text-box"
                              placeholder="Add description"
                              name="productDescription"
                              id="productDescription"
                              onChange={handleChange}
                              // onInput={(e) => {
                              //   e.target.value = this.getDataCapitalised(
                              //     e.target.value
                              //   );
                              // }}
                              value={values.productDescription}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "productDescription",
                                    e.target.value,
                                    true
                                  );
                                } else if (e.keyCode === 13) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "productDescription",
                                    e.target.value,
                                    true
                                  );
                                  this.selectRefP.current?.focus();
                                  // e.target.value = this.getDataCapitalised(
                                  //   e.target.value
                                  // );
                                } else if (e.keyCode === 9) {
                                  e.preventDefault();
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "productDescription",
                                    e.target.value,
                                    true
                                  );
                                  this.selectRefP.current?.focus();
                                  // e.target.value = this.getDataCapitalised(
                                  //   e.target.value
                                  // );
                                }
                              }}
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
                            <Row>
                              <Col lg={10} className="pe-0">
                                <Form.Group
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 9) {
                                      if (values.packagingId) {
                                        this.validate_product_update(
                                          values.productName,
                                          values.packagingId.value,
                                          setFieldValue
                                        );
                                      } /*  else {
                                      } */
                                    } else if (e.keyCode === 13) {
                                      if (values.packagingId !== "") {
                                        this.validate_product_update(
                                          values.productName,
                                          values.packagingId.value,
                                          setFieldValue
                                        );
                                      } else {
                                        this.focusNextElement(e);
                                      }
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.selectRefP}
                                    className="selectTo"
                                    isClearable
                                    components={{
                                      IndicatorSeparator: () => null,
                                    }}
                                    styles={productDropdown}
                                    placeholder="Packing"
                                    value={values.packagingId}
                                    name="packagingId"
                                    id="packagingId"
                                    onChange={(v, action) => {
                                      if (action.action != "clear") {
                                        if (v != "") {
                                          if (v.label === "Add New") {
                                            this.packageModalShow(true);
                                          } else
                                            setFieldValue("packagingId", v);
                                        }
                                      } else {
                                        setFieldValue("packagingId", "");
                                      }
                                    }}
                                    options={packageOpts}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={1} className="p-0">
                                <Button
                                  id="addPacking"
                                  className="add-btn-img"
                                  onClick={(e) => {
                                    this.packageModalShow(true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 32) {
                                      e.preventDefault();
                                      this.packageModalShow(true);
                                    } else if (e.keyCode == 13) {
                                      e.preventDefault();
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="add-img-btn"
                                  />
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <Row className="mx-0 mt-2">
                      <Col lg={2} md={2} sm={2} xs={2}>
                        <Row>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Form.Label>Barcode </Form.Label>
                          </Col>
                          <Col lg={9} md={9} sm={9} xs={9}>
                            <Form.Control
                              autoComplete="barcodeNo"
                              placeholder="Barcode"
                              className="text-box"
                              id="barcodeNo"
                              name="barcodeNo"
                              onChange={handleChange}
                              value={values.barcodeNo}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "barcodeNo",
                                    e.target.value
                                  );
                                  this.focusNextElement(e);
                                } else if (e.keyCode == 13) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "barcodeNo",
                                    e.target.value
                                  );
                                  this.focusNextElement(e);
                                }
                              }}
                            ></Form.Control>
                            <span className="text-danger errormsg">
                              {errors.barcodeNo}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={1} md={1} sm={1} xs={1}>
                        <Row>
                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Form.Label> Qty.</Form.Label>
                          </Col>
                          <Col
                            lg={8}
                            md={8}
                            sm={8}
                            xs={8}
                            className="paddingRight"
                          >
                            <Form.Control
                              autoComplete="barcodeSaleQuantity"
                              placeholder="Qty"
                              className="text-box p-1"
                              id="barcodeSaleQuantity"
                              name="barcodeSaleQuantity"
                              onKeyPress={(e) => {
                                OnlyEnterNumbers(e);
                              }}
                              onChange={handleChange}
                              value={values.barcodeSaleQuantity}
                              onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                  this.focusNextElement(e);
                                }
                              }}
                            ></Form.Control>
                            <span className="text-danger errormsg">
                              {errors.barcodeSaleQuantity}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} md={2} sm={2} xs={2}>
                        <Row>
                          <Col lg={3} md={3} sm={3} xs={3} className="">
                            <Form.Label>
                              Tax Type<label style={{ color: "red" }}>*</label>{" "}
                            </Form.Label>
                          </Col>
                          <Col lg={9} md={9} sm={9} xs={9}>
                            <Form.Group
                              className={`${errorArrayBorder[1] == "Y"
                                ? "border border-danger selectTo"
                                : "selectTo"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  if (values.taxType) {
                                    this.setErrorBorder(
                                      1,
                                      "",
                                      "errorArrayBorder"
                                    );
                                  } else {
                                    this.setErrorBorder(
                                      1,
                                      "Y",
                                      "errorArrayBorder"
                                    );
                                  }
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  if (!values.taxType) {
                                    e.preventDefault();
                                  } else {
                                    this.setErrorBorder(
                                      1,
                                      "",
                                      "errorArrayBorder"
                                    );
                                    this.focusNextElement(e);
                                  }
                                } else if (e.keyCode === 13) {
                                  if (!values.taxType) {
                                    e.preventDefault();
                                  } else {
                                    this.setErrorBorder(
                                      1,
                                      "",
                                      "errorArrayBorder"
                                    );
                                    this.focusNextElement(e);
                                  }
                                }
                              }}
                              style={{ borderRadius: "4px" }}
                            >
                              <Select
                                ref={this.selectRefT}
                                isClearable={true}
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
                                defaultValue={{
                                  label: "Taxable",
                                  value: "taxable",
                                }}
                                options={taxTypeOpts}
                              />
                            </Form.Group>
                            <span className="text-danger errormsg">
                              {errors.taxType}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={1} md={1} sm={1} xs={1}>
                        <Row>
                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Form.Label>
                              Tax%<label style={{ color: "red" }}>*</label>{" "}
                            </Form.Label>
                          </Col>
                          <Col lg={8} md={8} sm={8} xs={8} className="pe-2">
                            <Form.Group
                              className={`${values.tax == "" && errorArrayBorder[2] == "Y"
                                ? "border border-danger selectTo"
                                : "selectTo"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  if (values.tax) {
                                    this.setErrorBorder(
                                      2,
                                      "",
                                      "errorArrayBorder"
                                    );
                                  } else {
                                    this.setErrorBorder(
                                      2,
                                      "Y",
                                      "errorArrayBorder"
                                    );
                                    // this.selectRefS.current?.focus();
                                  }
                                } else if (e.keyCode == 9) {
                                  if (!values.tax) {
                                    e.preventDefault();
                                  } else {
                                    this.setErrorBorder(
                                      2,
                                      "",
                                      "errorArrayBorder"
                                    );
                                  }
                                } else if (e.keyCode == 13) {
                                  if (!values.tax) {
                                    e.preventDefault();
                                  } else {
                                    this.setErrorBorder(
                                      2,
                                      "",
                                      "errorArrayBorder"
                                    );
                                    // this.handleKeyDown(e, "taxApplicableDate");
                                    this.focusNextElement(e);
                                  }
                                }
                              }}
                              style={{ borderRadius: "4px" }}
                            // onKeyDown={(e) => this.handleKeyDown(e, "taxApplicableDate")}
                            >
                              <Select
                                // ref={this.selectRefS}
                                ref={this.selectRefTax}
                                // isClearable={true}
                                styles={productDropdown}
                                placeholder="Tax"
                                value={values.tax}
                                name="tax"
                                id="tax"
                                onChange={(v, action) => {
                                  // if (action.action != "clear") {
                                  if (v != "") {
                                    // if (v.label === "Add New") {
                                    //   this.taxModalShow(true);
                                    // } else {
                                    setFieldValue("tax", v);
                                    setFieldValue("igst", v.igst);
                                    setFieldValue("cgst", v.cgst);
                                    setFieldValue("sgst", v.sgst);
                                    // }
                                  }
                                  // } else {
                                  //   setFieldValue("tax", "");
                                  // }
                                }}
                                options={optTaxList}
                              />
                            </Form.Group>
                            <span className="text-danger errormsg">
                              {errors.tax}
                            </span>
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
                            <Form.Label>
                              {values.igst != "" ? values.igst + "%" : 0} |
                            </Form.Label>
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
                            <Form.Label>
                              {values.cgst != "" ? values.cgst + "%" : 0} |
                            </Form.Label>
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
                            <Form.Label>
                              {values.sgst != "" ? values.sgst + "%" : 0}
                            </Form.Label>
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
                          <Col lg={7} md={7} sm={7} xs={7} className="pe-2">
                            <MyTextDatePicker
                              // innerRef={(input) => {
                              //   this.invoiceDateRef.current = input;
                              // }}
                              className="text-box form-control p-2"
                              name="taxApplicableDate"
                              id="taxApplicableDate"
                              placeholder="DD/MM/YYYY"
                              dateFormat="dd/MM/yyyy"
                              value={values.taxApplicableDate}
                              onChange={handleChange}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  let datchco = e.target.value.trim();
                                  // console.log("datchco", datchco);
                                  let checkdate = moment(e.target.value).format(
                                    "DD/MM/YYYY"
                                  );
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
                                        .getElementById("taxApplicableDate")
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
                                      .getElementById("taxApplicableDate")
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
                                    if (enteredDate.isAfter(currentDate)) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Entered date is greater than current date",
                                        is_timeout: true,
                                        delay: 1500,
                                      });

                                      document
                                        .getElementById("taxApplicableDate")
                                        .focus();
                                      e.preventDefault();
                                    } else {
                                      setFieldValue(
                                        "taxApplicableDate",
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
                                      .getElementById("taxApplicableDate")
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
                                    if (enteredDate.isAfter(currentDate)) {
                                      MyNotifications.fire({
                                        show: true,
                                        icon: "error",
                                        title: "Error",
                                        msg: "Entered date is greater than current date",
                                        is_timeout: true,
                                        delay: 1500,
                                      });

                                      document
                                        .getElementById("taxApplicableDate")
                                        .focus();
                                    } else {
                                      setFieldValue(
                                        "taxApplicableDate",
                                        e.target.value
                                      );
                                      this.focusNextElement(e);
                                    }
                                  }
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} md={2} sm={2} xs={2}>
                        <Row>
                          <Col lg={3} md={3} sm={3} xs={3}>
                            <Form.Label>
                              HSN <label style={{ color: "red" }}>*</label>{" "}
                            </Form.Label>
                          </Col>
                          <Col lg={9} md={9} sm={9} xs={9}>
                            <Row>
                              <Col lg={10} className="pe-0">
                                <Form.Group
                                  className={`${values.hsnNo == "" &&
                                    errorArrayBorder[3] == "Y"
                                    ? "border border-danger selectTo"
                                    : "selectTo"
                                    }`}
                                  style={{ borderRadius: "4px" }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                      if (values.hsnNo) {
                                        this.setErrorBorder(
                                          3,
                                          "",
                                          "errorArrayBorder"
                                        );
                                      } else {
                                        this.setErrorBorder(
                                          3,
                                          "Y",
                                          "errorArrayBorder"
                                        );
                                        // this.selectRef.current?.focus();
                                      }
                                    } else if (e.keyCode == 9) {
                                      if (optHSNList.length > 0) {
                                        if (values.hsnNo) {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        } else {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        }
                                      }
                                      else {
                                        e.preventDefault();
                                        this.setErrorBorder(
                                          3,
                                          "",
                                          "errorArrayBorder"
                                        );
                                        this.focusNextElement(e);
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (optHSNList.length > 0) {
                                        if (values.hsnNo) {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        } else {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        }
                                      } else {
                                        this.setErrorBorder(
                                          3,
                                          "",
                                          "errorArrayBorder"
                                        );
                                        // this.handleKeyDown(e, "addHSN");
                                        this.focusNextElement(e);
                                      }
                                    }
                                  }}
                                >
                                  <Select
                                    ref={this.HSNFormRef}
                                    isClearable={true}
                                    styles={productDropdown}
                                    placeholder="HSN"
                                    value={values.hsnNo}
                                    name="hsnNo"
                                    id="hsnNo"
                                    onChange={(v, action) => {
                                      if (action.action != "clear") {
                                        if (v != "") {
                                          if (v.label === "Add New") {
                                            this.HSNshow(true);
                                          } else setFieldValue("hsnNo", v);
                                        }
                                      } else {
                                        setFieldValue("hsnNo", "");
                                      }
                                    }}
                                    options={optHSNList}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={1} className="p-0">
                                <Button
                                  id="addHSN"
                                  className="add-btn-img"
                                  onClick={(e) => {
                                    this.HSNshow(true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 32) {
                                      this.HSNshow(true);
                                    } else if (
                                      e.keyCode === 13 ||
                                      e.keyCode == 9
                                    ) {
                                      if (optHSNList.length > 0) {
                                        e.preventDefault();
                                        this.focusNextElement(e);
                                      } else {
                                        e.preventDefault();
                                      }
                                    }
                                  }}
                                >
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="add-img-btn"
                                  />
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mx-0 mt-2">
                      <Col lg={2} md={2} sm={2} xs={2}>
                        <Row>
                          <Col lg={3} md={3} sm={3} xs={3} className="">
                            <Form.Label>
                              Brand <label style={{ color: "red" }}>*</label>{" "}
                            </Form.Label>
                          </Col>
                          <Col lg={9} md={9} sm={9} xs={9}>
                            <Row>
                              <Col lg={10} className="pe-0">
                                <Form.Group
                                  className={`${values.brandId == "" &&
                                    errorArrayBorder[4] == "Y"
                                    ? "border border-danger selectTo"
                                    : "selectTo"
                                    }`}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                      if (values.brandId) {
                                        this.setErrorBorder(
                                          4,
                                          "",
                                          "errorArrayBorder"
                                        );
                                      } else {
                                        this.setErrorBorder(
                                          4,
                                          "Y",
                                          "errorArrayBorder"
                                        );
                                        // this.selectRefA.current?.focus();
                                      }
                                    } else if (e.keyCode == 9) {
                                      if (brandOpt.length > 0) {
                                        if (values.brandId) {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        } else {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        }
                                      } else {
                                        e.preventDefault();
                                        this.setErrorBorder(
                                          4,
                                          "",
                                          "errorArrayBorder"
                                        );
                                        document
                                          .getElementById("addBrand")
                                          .focus();
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (brandOpt.length > 0) {
                                        if (values.brandId) {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        } else {
                                          e.preventDefault();
                                          this.focusNextElement(e);
                                        }
                                      } else {
                                        this.setErrorBorder(
                                          4,
                                          "",
                                          "errorArrayBorder"
                                        );
                                        // this.handleKeyDown(e, "addBrand");
                                        this.focusNextElement(e);
                                      }
                                    }
                                  }}
                                  style={{ borderRadius: "4px" }}
                                >
                                  <Select
                                    ref={this.BrandMdlRef}
                                    // className="selectTo"
                                    isClearable={true}
                                    styles={productDropdown}
                                    placeholder="Brand"
                                    value={values.brandId}
                                    name="brandId"
                                    id="brandId"
                                    onChange={(v, action) => {
                                      if (action.action != "clear") {
                                        if (v != "") {
                                          if (v.label === "Add New") {
                                            this.brandModalShow(true);
                                          } else setFieldValue("brandId", v);
                                        }
                                      } else {
                                        setFieldValue("brandId", "");
                                      }
                                    }}
                                    options={brandOpt}
                                  />
                                </Form.Group>
                              </Col>
                              <Col lg={1} className="p-0">
                                <Button
                                  id="addBrand"
                                  className="add-btn-img"
                                  onClick={(e) => {
                                    this.brandModalShow(true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 32) {
                                      this.brandModalShow(true);
                                    } else if (
                                      e.keyCode === 13 ||
                                      e.keyCode == 9
                                    ) {
                                      if (brandOpt.length > 0) {
                                        e.preventDefault();
                                        this.focusNextElement(e);
                                      } else {
                                        e.preventDefault();
                                      }
                                    }
                                  }}
                                >
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="add-img-btn"
                                  />
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} md={2} sm={2} xs={2}>
                        <Row>
                          <Col lg={2} md={2} sm={2} xs={2} className="">
                            <Form.Label>Group </Form.Label>
                          </Col>
                          <Col lg={10} md={10} sm={10} xs={10}>
                            <Row>
                              <Col lg={10} className="pe-0">
                                <Select
                                  ref={this.GroupMdlRef}
                                  className="selectTo"
                                  isClearable={true}
                                  styles={productDropdown}
                                  placeholder="Group"
                                  value={values.groupId}
                                  name="groupId"
                                  id="groupId"
                                  onChange={(v, action) => {
                                    if (action.action != "clear") {
                                      if (v != "") {
                                        if (v.label === "Add New") {
                                          this.groupModalShow(true);
                                        } else setFieldValue("groupId", v);
                                      }
                                    } else {
                                      setFieldValue("groupId", "");
                                    }
                                  }}
                                  options={groupOpt}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      document
                                        .getElementById("addGroup")
                                        .focus();
                                    } else if (e.keyCode == 13) {
                                      // this.handleKeyDown(e, "addGroup");
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                              </Col>
                              <Col lg={1} className="p-0">
                                <Button
                                  id="addGroup"
                                  className="add-btn-img"
                                  onClick={(e) => {
                                    this.groupModalShow(true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 32) {
                                      this.groupModalShow(true);
                                    } else if (e.keyCode === 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="add-img-btn"
                                  />
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} md={2} sm={2} xs={2}>
                        <Row>
                          <Col lg={4} md={4} sm={4} xs={4} className="">
                            <Form.Label>Sub Group </Form.Label>
                          </Col>
                          <Col lg={8} md={8} sm={8} xs={8}>
                            <Row>
                              <Col lg={10} className="pe-0">
                                <Select
                                  ref={this.SubGroupMdlRef}
                                  className="selectTo"
                                  isClearable={true}
                                  styles={productDropdown}
                                  placeholder="Sub Group"
                                  value={values.subgroupId}
                                  name="subgroupId"
                                  id="subgroupId"
                                  // onChange={(v) => {
                                  //   setFieldValue("subgroupId", "");
                                  //   if (v != "") {
                                  //     if (v.label === "Add New") {
                                  //       this.subgroupModalShow(true);
                                  //     } else setFieldValue("subgroupId", v);
                                  //   }
                                  // }}
                                  onChange={(v, action) => {
                                    if (action.action != "clear") {
                                      if (v != "") {
                                        if (v.label === "Add New") {
                                          this.subgroupModalShow(true);
                                        } else setFieldValue("subgroupId", v);
                                      }
                                    } else {
                                      setFieldValue("subgroupId", "");
                                    }
                                  }}
                                  options={subgroupOpt}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      document
                                        .getElementById("addSubgroup")
                                        .focus();
                                    } else if (e.keyCode == 13) {
                                      // this.handleKeyDown(e, "addSubgroup");
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                              </Col>
                              <Col lg={1} className="p-0">
                                <Button
                                  id="addSubgroup"
                                  className="add-btn-img"
                                  onClick={(e) => {
                                    this.subgroupModalShow(true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode === 32) {
                                      this.subgroupModalShow(true);
                                    } else if (e.keyCode === 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="add-img-btn"
                                  />
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} md={2} sm={2} xs={2}>
                        <Row>
                          <Col lg={4} md={4} sm={4} xs={4} className="">
                            <Form.Label>Category </Form.Label>
                          </Col>
                          <Col lg={8} md={8} sm={8} xs={8}>
                            <Row>
                              <Col lg={10} className="pe-0">
                                <Select
                                  ref={this.CategoryMdlRef}
                                  className="selectTo"
                                  isClearable={true}
                                  styles={productDropdown}
                                  placeholder="Category"
                                  value={values.categoryId}
                                  name="categoryId"
                                  id="categoryId"
                                  onChange={(v, action) => {
                                    if (action.action != "clear") {
                                      if (v != "") {
                                        if (v.label === "Add New") {
                                          this.categoryModalShow(true);
                                        } else setFieldValue("categoryId", v);
                                      }
                                    } else {
                                      setFieldValue("categoryId", "");
                                    }
                                  }}
                                  options={categoryOpt}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      document
                                        .getElementById("addCategory")
                                        .focus();
                                    } else if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                              </Col>
                              <Col lg={1} className="p-0">
                                <Button
                                  id="addCategory"
                                  className="add-btn-img"
                                  onClick={(e) => {
                                    this.categoryModalShow(true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 32) {
                                      this.categoryModalShow(true);
                                    } else if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="add-img-btn"
                                  />
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={2} md={2} sm={2} xs={2}>
                        <Row>
                          <Col lg={4} md={4} sm={4} xs={4}>
                            <Form.Label>Sub Category </Form.Label>
                          </Col>
                          <Col
                            lg={8}
                            md={8}
                            sm={8}
                            xs={8}
                            className="subpadding"
                          >
                            <Row>
                              <Col lg={10} className="pe-0">
                                <Select
                                  ref={this.SubCategoryMdlRef}
                                  className="selectTo"
                                  isClearable={true}
                                  styles={productDropdown}
                                  placeholder="Sub Cat"
                                  value={values.subcategoryId}
                                  name="subcategoryId"
                                  id="subcategoryId"
                                  onChange={(v, action) => {
                                    if (action.action != "clear") {
                                      if (v != "") {
                                        if (v.label === "Add New") {
                                          this.subcategoryModalShow(true);
                                        } else
                                          setFieldValue("subcategoryId", v);
                                      }
                                    } else {
                                      setFieldValue("subcategoryId", "");
                                    }
                                  }}
                                  options={subcategoryOpt}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      document
                                        .getElementById("addSubCategory")
                                        .focus();
                                    } else if (e.keyCode == 13) {
                                      // this.handleKeyDown(e, "addSubCategory");
                                      this.focusNextElement(e);
                                    }
                                  }}
                                />
                              </Col>
                              <Col lg={1} className="p-0">
                                <Button
                                  id="addSubCategory"
                                  className="add-btn-img"
                                  onClick={(e) => {
                                    this.subcategoryModalShow(true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 32) {
                                      this.subcategoryModalShow(true);
                                    } else if (e.keyCode == 13) {
                                      this.focusNextElement(e);
                                    }
                                  }}
                                >
                                  <img
                                    src={add_icon}
                                    alt=""
                                    className="add-img-btn"
                                  />
                                </Button>
                              </Col>
                            </Row>
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
                              autoComplete="shelfId"
                              placeholder="Shelf ID"
                              className="text-box"
                              id="shelfId"
                              name="shelfId"
                              onChange={handleChange}
                              value={values.shelfId}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "shelfId",
                                    e.target.value
                                  );
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "shelfId",
                                    e.target.value
                                  );
                                  if (values.isInventory == true) {
                                    // this.handleKeyDown(e, "minStock");
                                    this.focusNextElement(e);
                                  } else {
                                    // this.handleKeyDown(e, "disPer1");
                                    this.focusNextElement(e);
                                  }
                                } else if (e.keyCode == 13) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "shelfId",
                                    e.target.value
                                  );
                                  if (values.isInventory == true) {
                                    // this.handleKeyDown(e, "minStock");
                                    this.focusNextElement(e);
                                  } else {
                                    // this.handleKeyDown(e, "disPer1");
                                    this.focusNextElement(e);
                                  }
                                }
                              }}
                            ></Form.Control>
                            <span className="text-danger errormsg">
                              {errors.shelfId}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mx-0 mt-2">
                      {values.isInventory == true ? (
                        <>
                          <Col lg={1} md={1} sm={1} xs={1}>
                            <Row>
                              <Col lg={6} md={6} sm={6} xs={6}>
                                <Form.Label>Min Stk</Form.Label>
                              </Col>
                              <Col
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6}
                                className="paddingRight"
                              >
                                <Form.Control
                                  autoComplete="minStock"
                                  placeholder="Min"
                                  className=" text-box p-1 text-end"
                                  id="minStock"
                                  name="minStock"
                                  onChange={handleChange}
                                  // onKeyPress={(e) => {
                                  //   OnlyEnterNumbers(e);
                                  // }}
                                  value={values.minStock}
                                  onKeyDown={(e) => {
                                    if (
                                      (e.shiftKey && e.keyCode == 9) ||
                                      e.keyCode == 9 ||
                                      e.keyCode == 13
                                    ) {
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "minStock",
                                        e.target.value
                                      );
                                    }

                                    if (e.keyCode == 13) {
                                      // this.handleKeyDown(e, "maxStock");
                                      this.focusNextElement(e);
                                    }
                                  }}
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
                                className="for_padding"
                              >
                                <Form.Label>Max Stk</Form.Label>
                              </Col>
                              <Col
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6}
                                className="paddingLeft"
                              >
                                <Form.Control
                                  autoComplete="maxStock"
                                  placeholder="Max"
                                  className=" text-box p-1 text-end"
                                  id="maxStock"
                                  name="maxStock"
                                  onChange={handleChange}
                                  onKeyPress={(e) => {
                                    OnlyEnterNumbers(e);
                                  }}
                                  value={values.maxStock}
                                  onKeyDown={(e) => {
                                    if (
                                      (e.shiftKey && e.keyCode == 9) ||
                                      e.keyCode == 9 ||
                                      e.keyCode == 13
                                    ) {
                                      handlesetFieldValue(
                                        setFieldValue,
                                        "maxStock",
                                        e.target.value
                                      );
                                    }

                                    if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      let maxStock = e.target.value;

                                      this.handleMaxStock(
                                        maxStock,
                                        values.minStock,
                                        setFieldValue
                                      );
                                    } else if (e.keyCode == 13) {
                                      let maxStock = e.target.value;

                                      this.handleMaxStock(
                                        maxStock,
                                        values.minStock,
                                        setFieldValue
                                      );
                                    }
                                  }}
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
                              autoComplete="disPer1"
                              placeholder="%"
                              className="text-box p-1 text-end"
                              id="disPer1"
                              name="disPer1"
                              onChange={handleChange}
                              onKeyPress={(e) => {
                                OnlyEnterNumbers(e);
                              }}
                              value={values.disPer1}
                              onKeyDown={(e) => {
                                if (
                                  (e.shiftKey && e.keyCode == 9) ||
                                  e.keyCode == 9 ||
                                  e.keyCode == 13
                                ) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "disPer1",
                                    e.target.value
                                  );
                                }

                                if (e.keyCode == 13) {
                                  // this.handleKeyDown(e, "margin");
                                  this.focusNextElement(e);
                                }
                              }}
                            ></Form.Control>
                            <span className="text-danger errormsg">
                              {errors.disPer1}
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
                            className="for_padding"
                          >
                            <Form.Label>Margin%</Form.Label>
                          </Col>
                          <Col
                            lg={6}
                            md={6}
                            sm={6}
                            xs={6}
                            className="paddingLeft"
                          >
                            <Form.Control
                              placeholder="Margin"
                              className="text-box p-1 text-end"
                              id="margin"
                              name="margin"
                              onChange={handleChange}
                              onKeyPress={(e) => {
                                OnlyEnterNumbers(e);
                              }}
                              autoComplete="margin"
                              value={values.margin}
                              onKeyDown={(e) => {
                                if (
                                  (e.shiftKey && e.keyCode == 9) ||
                                  e.keyCode == 9 ||
                                  e.keyCode == 13
                                ) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "margin",
                                    e.target.value
                                  );
                                }

                                if (e.shiftKey && e.keyCode == 9) {
                                } else if (e.keyCode == 9) {
                                  e.preventDefault();
                                  if (values.isSerialNo == true) {
                                    // this.handleKeyDown(e, "isSerialNo");
                                    this.focusNextElement(e);
                                  } else {
                                    // this.handleKeyDown(e, "isBatchNo");
                                    this.focusNextElement(e);
                                  }
                                } else if (e.keyCode == 13) {
                                  if (values.isSerialNo == true) {
                                    // this.handleKeyDown(e, "isSerialNo");
                                    this.focusNextElement(e);
                                  } else {
                                    // this.handleKeyDown(e, "isBatchNo");
                                    this.focusNextElement(e);
                                  }
                                }
                              }}
                            ></Form.Control>
                            <span className="text-danger errormsg">
                              {errors.margin}
                            </span>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={4} md={4} sm={4} xs={4}>
                        <Row>
                          {values.isSerialNo == true ? (
                            <>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="switch-box-style "
                              >
                                <Form.Check
                                  label="Batch"
                                  type="switch"
                                  name="isBatchNo"
                                  id="isBatchNo"
                                  checked={
                                    values.isBatchNo == true ? true : false
                                  }
                                  onClick={(e) => {
                                    if (e.target.checked) {
                                      setFieldValue("isBatchNo", true);
                                      setFieldValue("isInventory", true);
                                      // console.log(
                                      //   "values.isBatchNo",
                                      //   e.target.checked
                                      // );
                                      this.setState({
                                        isOpeningBatch: true,
                                        isBatchHideShow: true,
                                      });
                                    } else {
                                      setFieldValue("isBatchNo", false);
                                      // console.log(
                                      //   "values.isBatchNffo",
                                      //   e.target.checked
                                      // );

                                      this.setState({
                                        isOpeningBatch: false,
                                        isBatchHideShow: false,
                                      });
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 32) {
                                      if (e.target.checked) {
                                        setFieldValue("isBatchNo", true);
                                        setFieldValue("isInventory", true);
                                        // console.log(
                                        //   "values.isBatchNo",
                                        //   e.target.checked
                                        // );
                                        this.setState({
                                          isOpeningBatch: true,
                                          isBatchHideShow: true,
                                        });
                                      } else {
                                        setFieldValue("isBatchNo", false);
                                        // console.log(
                                        //   "values.isBatchNffo",
                                        //   e.target.checked
                                        // );

                                        this.setState({
                                          isOpeningBatch: false,
                                          isBatchHideShow: false,
                                        });
                                      }
                                    }
                                  }}
                                  disabled
                                  value={values.isBatchNo}
                                />
                              </Col>
                            </>
                          ) : (
                            <>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                className="switch-box-style "
                              >
                                <Form.Check
                                  label="Batch"
                                  type="switch"
                                  name="isBatchNo"
                                  id="isBatchNo"
                                  checked={
                                    values.isBatchNo == true ? true : false
                                  }
                                  onClick={(e) => {
                                    if (e.target.checked) {
                                      setFieldValue("isBatchNo", true);
                                      setFieldValue("isInventory", true);
                                      // console.log(
                                      //   "values.isBatchNo",
                                      //   e.target.checked
                                      // );
                                      this.setState({
                                        isOpeningBatch: true,
                                        isBatchHideShow: true,
                                      });
                                    } else {
                                      setFieldValue("isBatchNo", false);
                                      // console.log(
                                      //   "values.isBatchNffo",
                                      //   e.target.checked
                                      // );

                                      this.setState({
                                        isOpeningBatch: false,
                                        isBatchHideShow: false,
                                      });
                                    }
                                  }}
                                  value={values.isBatchNo}
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 32) {
                                      if (e.target.checked) {
                                        setFieldValue("isBatchNo", true);
                                        setFieldValue("isInventory", true);
                                        // console.log(
                                        //   "values.isBatchNo",
                                        //   e.target.checked
                                        // );
                                        this.setState({
                                          isOpeningBatch: true,
                                          isBatchHideShow: true,
                                        });
                                      } else {
                                        setFieldValue("isBatchNo", false);
                                        // console.log(
                                        //   "values.isBatchNffo",
                                        //   e.target.checked
                                        // );

                                        this.setState({
                                          isOpeningBatch: false,
                                          isBatchHideShow: false,
                                        });
                                      }
                                    } else if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      if (values.isBatchNo == false) {
                                        // this.handleKeyDown(e, "isSerialNo");
                                        this.focusNextElement(e);
                                      } else {
                                        // this.handleKeyDown(e, "isInventory");
                                        this.focusNextElement(e);
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (values.isBatchNo == false) {
                                        // this.handleKeyDown(e, "isSerialNo");
                                        this.focusNextElement(e);
                                      } else {
                                        // this.handleKeyDown(e, "isInventory");
                                        this.focusNextElement(e);
                                      }
                                    }
                                  }}
                                />
                              </Col>
                            </>
                          )}

                          {values.isBatchNo == true ? (
                            <>
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
                                  checked={
                                    values.isSerialNo == true ? true : false
                                  }
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
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 32) {
                                      if (e.target.checked) {
                                        setFieldValue("isSerialNo", true);
                                        setFieldValue("isInventory", true);
                                        //  this.setState({ isOpeningBatch: true });
                                      } else {
                                        setFieldValue("isSerialNo", false);
                                        this.setState({
                                          isOpeningSerial: false,
                                        });
                                      }
                                    }
                                  }}
                                  disabled
                                  value={values.isSerialNo}
                                />
                              </Col>
                            </>
                          ) : (
                            <>
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
                                  checked={
                                    values.isSerialNo == true ? true : false
                                  }
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
                                  onKeyDown={(e) => {
                                    if (e.keyCode == 32) {
                                      if (e.target.checked) {
                                        setFieldValue("isSerialNo", true);
                                        setFieldValue("isInventory", true);
                                        // this.setState({ isOpeningBatch: true });
                                      } else {
                                        setFieldValue("isSerialNo", false);
                                        this.setState({
                                          isOpeningSerial: false,
                                        });
                                      }
                                    } else if (e.shiftKey && e.keyCode == 9) {
                                    } else if (e.keyCode == 9) {
                                      e.preventDefault();
                                      if (values.isSerialNo === true) {
                                        // this.handleKeyDown(e, "isWarranty");
                                        this.focusNextElement(e);
                                      } else {
                                        // this.handleKeyDown(e, "isInventory");
                                        this.focusNextElement(e);
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (values.isSerialNo === true) {
                                        // this.handleKeyDown(e, "isWarranty");
                                        this.focusNextElement(e);
                                      } else {
                                        // this.handleKeyDown(e, "isInventory");
                                        this.focusNextElement(e);
                                      }
                                    }
                                  }}
                                />
                              </Col>
                            </>
                          )}

                          {values.isSerialNo == true ? (
                            <>
                              <Col
                                lg={`${values.isWarranty == true
                                  ? "4 pe-0"
                                  : "2 me-2"
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
                                        name="isWarranty"
                                        id="isWarranty"
                                        checked={
                                          values.isWarranty == true
                                            ? true
                                            : false
                                        }
                                        onClick={(e) => {
                                          if (e.target.checked) {
                                            setFieldValue("isWarranty", true);
                                          } else {
                                            setFieldValue("isWarranty", false);
                                          }
                                        }}
                                        value={values.isWarranty}
                                        onKeyDown={(e) => {
                                          if (e.keyCode == 32) {
                                            if (e.target.checked) {
                                              setFieldValue("isWarranty", true);
                                            } else {
                                              setFieldValue(
                                                "isWarranty",
                                                false
                                              );
                                            }
                                          } else if (
                                            e.shiftKey &&
                                            e.keyCode == 9
                                          ) {
                                          } else if (e.keyCode == 9) {
                                            e.preventDefault();
                                            if (
                                              values.isSerialNo === true &&
                                              values.isWarranty === true
                                            ) {
                                              document
                                                .getElementById("nodays")
                                                .focus();
                                            } else {
                                              document
                                                .getElementById("isInventory")
                                                .focus();
                                            }
                                          } else if (e.keyCode == 13) {
                                            if (
                                              values.isSerialNo === true &&
                                              values.isWarranty === true
                                            ) {
                                              // this.handleKeyDown(e, "nodays");
                                              this.focusNextElement(e);
                                            } else {
                                              this.handleKeyDown(
                                                e,
                                                "isInventory"
                                              );
                                            }
                                          }
                                        }}
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
                                          autoComplete="nodays"
                                          className="m-auto text-box p-1"
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
                                          maxLength={3}
                                          onKeyDown={(e) => {
                                            if (
                                              (e.shiftKey && e.keyCode == 9) ||
                                              e.keyCode == 9 ||
                                              e.keyCode == 13
                                            ) {
                                              handlesetFieldValue(
                                                setFieldValue,
                                                "nodays",
                                                e.target.value
                                              );
                                            }

                                            if (e.shiftKey && e.keyCode == 9) {
                                            } else if (e.keyCode == 9) {
                                              e.preventDefault();
                                              document
                                                .getElementById("isInventory")
                                                .focus();
                                            }
                                            if (e.keyCode == 13) {
                                              this.handleKeyDown(
                                                e,
                                                "isInventory"
                                              );
                                            }
                                          }}
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
                              }
                              onClick={(e) => {
                                if (e.target.checked) {
                                  setFieldValue("isInventory", true);
                                } else {
                                  this.deleteproduct(setFieldValue);
                                  // setFieldValue("isInventory", false);
                                }
                              }}
                              value={values.isInventory}
                              onKeyDown={(e) => {
                                if (e.keyCode == 32) {
                                  if (e.target.checked) {
                                    setFieldValue("isInventory", true);
                                  } else {
                                    setFieldValue("isInventory", false);
                                  }
                                } else if (e.keyCode == 13) {
                                  this.focusNextElement(e);
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div>
                  <CMPProductTable
                    productSetChange={this.productSetChange.bind(this)}
                    productrows={productrows}
                    isBatchHideShow={isBatchHideShow}
                    isOpeningBatch={isOpeningBatch}
                    opnStockModalShow={opnStockModalShow}
                    setRowData={setRowData}
                    rowDelDetailsIds={rowDelDetailsIds}
                    unitIdData={unitIdData}
                    isInventoryFlag={values.isInventory}
                  />
                </div>

                <Row className="mx-0 btm-rows-btn">
                  <Col lg={12} className="text-end">
                    <Button
                      id="submit"
                      className="successbtn-style ms-2 "
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.myRef.current.handleSubmit();
                        } else {
                          this.handleKeyDown(e, "cancel");
                        }
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      id="cancel"
                      variant="secondary cancel-btn ms-2"
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
                              if (
                                this.state.source &&
                                this.state.source != ""
                              ) {
                                if (this.state.source.opType === "edit") {
                                  // debugger;
                                  // console.log(
                                  //   "this.props.block. ",
                                  //   this.props.block.prop_data
                                  //     .conversionEditData
                                  // );
                                  eventBus.dispatch("page_change", {
                                    from: "newproductedit",
                                    to: this.state.source.from_page,
                                    prop_data: {
                                      prop_data: {
                                        ...this.state.source,

                                        rows: this.state.source.rows,
                                        invoice_data:
                                          this.state.source.invoice_data,
                                        id: this.state.source.invoice_data.id,
                                        isProduct:
                                          this.props.block.prop_data.isProduct,
                                      },
                                      isProduct:
                                        this.props.block.prop_data.isProduct,
                                      rowIndex:
                                        this.props.block.prop_data.rowIndex,
                                      selectedBills:
                                        this.props.block.prop_data
                                          .conversionEditData != undefined
                                          ? this.props.block.prop_data
                                            .conversionEditData.selectedBills
                                          : [],
                                    },
                                    isNewTab: false,
                                  });
                                  this.setState({ source: "" });
                                } else if (
                                  this.state.source.opType === "create"
                                ) {
                                  eventBus.dispatch("page_change", {
                                    from: "newproductedit",
                                    to: this.state.source.from_page,
                                    prop_data: {
                                      rows: this.state.source.rows,
                                      invoice_data:
                                        this.state.source.invoice_data,
                                      ...this.state.source,
                                      id: this.state.source.invoice_data.id,
                                      isProduct:
                                        this.props.block.prop_data.isProduct,
                                      rowIndex:
                                        this.props.block.prop_data.rowIndex,
                                    },
                                    isNewTab: false,
                                  });
                                  this.setState({ source: "" });
                                } else {
                                  eventBus.dispatch("page_change", {
                                    from: "newproductedit",
                                    to: "productlist",
                                    isNewTab: false,
                                    isCancel: true,
                                  });
                                }
                              } else {
                                // eventBus.dispatch("page_change", "productlist");
                                eventBus.dispatch("page_change", {
                                  from: "newproductedit",
                                  to: "productlist",
                                  prop_data: {
                                    editId: this.state.product_id.id,
                                    rowId: this.props.block.prop_data.rowId,
                                  },
                                  isNewTab: false,
                                  isCancel: true,
                                });
                              }
                            },
                            handleFailFn: () => {
                              // eventBus.dispatch(
                              //   "page_change",
                              //   "newproductcreate"
                              // );
                            },
                          },
                          () => {
                            // console.warn("return_data");
                          }
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
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
                                // this.CancelAPICall();
                                // console.log(
                                //   "this.state.source",
                                //   this.state.source
                                // );

                                // if (
                                //   this.state.source &&
                                //   this.state.source != ""
                                // ) {
                                //   eventBus.dispatch("page_change", {
                                //     from: "newproductcreate",
                                //     to: this.state.source.from_page,
                                //     prop_data: {
                                //       rows: this.state.source.rows,
                                //       invoice_data: this.state.source
                                //         .invoice_data,
                                //       ...this.state.source,
                                //       id: this.state.source.invoice_data.id,
                                //       isProduct: this.props.block.prop_data.isProduct,
                                //       rowIndex: this.props.block.prop_data.rowIndex,
                                //     },
                                //     isNewTab: false,
                                //   });
                                //   this.setState({ source: "" });
                                // }
                                if (
                                  this.state.source &&
                                  this.state.source != ""
                                ) {
                                  if (this.state.source.opType === "edit") {
                                    eventBus.dispatch("page_change", {
                                      from: "newproductedit",
                                      to: this.state.source.from_page,
                                      prop_data: {
                                        prop_data: {
                                          ...this.state.source,

                                          rows: this.state.source.rows,
                                          invoice_data:
                                            this.state.source.invoice_data,
                                          id: this.state.source.invoice_data.id,
                                          isProduct:
                                            this.props.block.prop_data.isProduct,
                                        },
                                        isProduct:
                                          this.props.block.prop_data.isProduct,
                                        rowIndex:
                                          this.props.block.prop_data.rowIndex,
                                        selectedBills:
                                          this.props.block.prop_data
                                            .conversionEditData != undefined
                                            ? this.props.block.prop_data
                                              .conversionEditData
                                              .selectedBills
                                            : [],
                                      },
                                      isNewTab: false,
                                    });
                                    this.setState({ source: "" });
                                  } else if (
                                    this.state.source.opType === "create"
                                  ) {
                                    eventBus.dispatch("page_change", {
                                      from: "newproductedit",
                                      to: this.state.source.from_page,
                                      prop_data: {
                                        rows: this.state.source.rows,
                                        invoice_data:
                                          this.state.source.invoice_data,
                                        ...this.state.source,
                                        id: this.state.source.invoice_data.id,
                                        isProduct:
                                          this.props.block.prop_data.isProduct,
                                        rowIndex:
                                          this.props.block.prop_data.rowIndex,
                                      },
                                      isNewTab: false,
                                    });
                                    this.setState({ source: "" });
                                  } else {
                                    eventBus.dispatch("page_change", {
                                      from: "newproductedit",
                                      to: "productlist",
                                      isNewTab: false,
                                      isCancel: true,
                                    });
                                  }
                                } else {
                                  // eventBus.dispatch("page_change", "productlist");
                                  eventBus.dispatch("page_change", {
                                    from: "newproductedit",
                                    to: "productlist",
                                    prop_data: {
                                      editId: this.state.product_id.id,
                                      rowId: this.props.block.prop_data.rowId,
                                    },
                                  });
                                }
                              },
                              handleFailFn: () => {
                                // eventBus.dispatch(
                                //   "page_change",
                                //   "newproductcreate"
                                // );
                              },
                            },
                            () => {
                              // console.warn("return_data");
                            }
                          );
                        } else {
                          this.handleKeyDown(e, "productCode");
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
                {/* <Row className="mx-0 btm-rows-btn1">
                  <Col md="2" className="px-0 d-flex">
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
                  <Col md="2" className="text-end">
                    <img src={question} className="svg-style ms-1"></img>
                  </Col>
                </Row> */}
                <Row className="mx-0 btm-rows-btn1 ">
                  <Col md="12" className="my-auto">
                    {/* <Row>
                      <Col md="2" className="">
                        <Row>
                          <Col md="6">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faHouse}
                                className="svg-style icostyle mt-0 mx-2"
                              />

                              <span className="shortkey">Ctrl+A</span>
                            </Form.Label>
                          </Col>
                          <Col md="6">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faCirclePlus}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">F2</span>
                            </Form.Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col md="2" className="">
                        <Row>
                          <Col md="6" className="">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faPen}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">Ctrl+E</span>
                            </Form.Label>
                          </Col>
                          <Col md="6">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faFloppyDisk}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">Ctrl+S</span>
                            </Form.Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col md="2" className="">
                        <Row>
                          <Col md="6">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">Ctrl+D</span>
                            </Form.Label>
                          </Col>
                          <Col md="6" className="">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">Ctrl+C</span>
                            </Form.Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col md="2" className="">
                        <Row>
                          <Col md="6">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faCalculator}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">Alt+C</span>
                            </Form.Label>
                          </Col>
                          <Col md="6">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faGear}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">F11</span>
                            </Form.Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col md="2" className="">
                        <Row>
                          <Col md="6">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faRightFromBracket}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">Ctrl+Z</span>
                            </Form.Label>
                          </Col>
                          <Col md="6" className="">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faPrint}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">Ctrl+P</span>
                            </Form.Label>
                          </Col>
                        </Row>
                      </Col>
                      <Col md="2" className="">
                        <Row>
                          <Col md="6" className="">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faArrowUpFromBracket}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">Export</span>
                            </Form.Label>
                          </Col>
                          <Col md="6">
                            <Form.Label className="btm-label d-flex">
                              <FontAwesomeIcon
                                icon={faCircleQuestion}
                                className="svg-style icostyle mt-0 mx-2"
                              />
                              <span className="shortkey">F1</span>
                            </Form.Label>
                          </Col>
                        </Row>
                      </Col>
                    </Row> */}
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
          {/* Tax modal */}
          <Modal
            show={taxModalShow}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "md"
                : "lg"
            }
            className="mt-5 mainmodal"
            onHide={() => this.setState({ show: false })}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup">
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Tax
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.handleTaxModalShow(false)}
              />
              {/* <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handleTaxModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button> */}
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <div className="">
                <div className="m-0 mb-2">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    enableReinitialize={true}
                    initialValues={initValTax}
                    innerRef={this.taxMdlRef}
                    // validationSchema={Yup.object().shape({
                    //   gst_per: Yup.string()
                    //     .trim()
                    //     .required("GST number is required"),
                    //   igst: Yup.string().trim().required("Igst is required"),
                    //   cgst: Yup.string().trim().required("Cgst is required"),
                    //   sgst: Yup.string().trim().required("Sgst is required"),
                    // })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      let errorArray = [];
                      if (values.gst_per == "") {
                        errorArray.push("x");
                      } else {
                        errorArray.push("");
                      }

                      if (values.igst == "") {
                        errorArray.push("x");
                      } else {
                        errorArray.push("");
                      }

                      if (values.cgst == "") {
                        errorArray.push("x");
                      } else {
                        errorArray.push("");
                      }

                      if (values.sgst == "") {
                        errorArray.push("x");
                      } else {
                        errorArray.push("");
                      }

                      this.setState({ errorArrayBorderTax: errorArray }, () => {
                        if (allEqual(errorArray)) {
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
                          document.getElementById("tax").focus();
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
                                      // MyNotifications.fire({
                                      //   show: true,
                                      //   icon: "success",
                                      //   title: "Success",
                                      //   msg: res.message,
                                      //   is_timeout: true,
                                      //   delay: 1000,
                                      // });
                                      this.handleTaxModalShow(false);
                                      this.lstTAX(true);
                                      // this.pageReload();
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
                                          .getElementById("tax_submit_btn")
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
                                  .catch((error) => {
                                    setSubmitting(false);
                                    console.log("error", error);
                                  });
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
                      isSubmitting,
                      resetForm,
                      setFieldValue,
                    }) => (
                      <Form
                        onSubmit={handleSubmit}
                        noValidate
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) {
                            e.preventDefault();
                          }
                        }}
                        spellcheck="false"
                      >
                        <div className="mb-2">
                          <Row className="mb-3">
                            <Col md={2}>
                              <Form.Label>
                                GST %
                                <span className="pt-1 pl-1 req_validation text-danger">
                                  *
                                </span>
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  autoFocus={true}
                                  autoComplete="gst_per"
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
                                  // className="text-box"
                                  className={`${values.gst_per == "" &&
                                    errorArrayBorderTax[0] == "x"
                                    ? "border border-danger text-box"
                                    : "text-box"
                                    }`}
                                  // onBlur={(e) => {
                                  //   e.preventDefault();
                                  //   if (e.target.value) {
                                  //     this.setErrorBorder(
                                  //       0,
                                  //       "",
                                  //       "errorArrayBorderTax"
                                  //     );
                                  //   } else {
                                  //     this.setErrorBorder(
                                  //       0,
                                  //       "x",
                                  //       "errorArrayBorderTax"
                                  //     );
                                  //     // document
                                  //     //   .getElementById("productName")
                                  //     //   .focus();
                                  //   }
                                  // }}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                      if (e.target.value) {
                                        this.setErrorBorder(
                                          0,
                                          "",
                                          "errorArrayBorderTax"
                                        );
                                      } else {
                                        this.setErrorBorder(
                                          0,
                                          "x",
                                          "errorArrayBorderTax"
                                        );
                                        // document
                                        //   .getElementById("productName")
                                        //   .focus();
                                      }
                                    } else if (
                                      e.keyCode == 9 &&
                                      !e.target.value
                                    )
                                      e.preventDefault();
                                    else if (e.keyCode === 13)
                                      if (!e.target.value) e.preventDefault();
                                      else
                                        document.getElementById("igst").focus();
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.gst_per}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Label>
                                IGST
                                <span className="pt-1 pl-1 req_validation text-danger">
                                  *
                                </span>
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  autoComplete="igst"
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
                                  // className="text-box"
                                  className={`${values.igst == "" &&
                                    errorArrayBorderTax[1] == "x"
                                    ? "border border-danger text-box"
                                    : "text-box"
                                    }`}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                      if (e.target.value) {
                                        this.setErrorBorder(
                                          1,
                                          "",
                                          "errorArrayBorderTax"
                                        );
                                      } else {
                                        this.setErrorBorder(
                                          1,
                                          "x",
                                          "errorArrayBorderTax"
                                        );
                                        // document
                                        //   .getElementById("productName")
                                        //   .focus();
                                      }
                                    } else if (
                                      e.keyCode == 9 &&
                                      !e.target.value
                                    )
                                      e.preventDefault();
                                    else if (e.keyCode === 13)
                                      if (!e.target.value) e.preventDefault();
                                      else
                                        document.getElementById("cgst").focus();
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.igst}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Label>
                                CGST
                                <span className="pt-1 pl-1 req_validation text-danger">
                                  *
                                </span>
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  autoComplete="cgst"
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
                                  // className="text-box"
                                  className={`${values.cgst == "" &&
                                    errorArrayBorderTax[2] == "x"
                                    ? "border border-danger text-box"
                                    : "text-box"
                                    }`}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                      if (e.target.value) {
                                        this.setErrorBorder(
                                          2,
                                          "",
                                          "errorArrayBorderTax"
                                        );
                                      } else {
                                        this.setErrorBorder(
                                          2,
                                          "x",
                                          "errorArrayBorderTax"
                                        );
                                        // document
                                        //   .getElementById("productName")
                                        //   .focus();
                                      }
                                    } else if (
                                      e.keyCode == 9 &&
                                      !e.target.value
                                    )
                                      e.preventDefault();
                                    else if (e.keyCode === 13)
                                      if (!e.target.value) e.preventDefault();
                                      else
                                        document.getElementById("sgst").focus();
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.cgst}
                                </span>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className="mb-2">
                            <Col md={2}>
                              <Form.Label>
                                SGST
                                <span className="pt-1 pl-1 req_validation text-danger">
                                  *
                                </span>
                              </Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="SGST"
                                  name="sgst"
                                  id="sgst"
                                  autoComplete="sgst"
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
                                  // className="text-box"
                                  className={`${values.sgst == "" &&
                                    errorArrayBorderTax[3] == "x"
                                    ? "border border-danger text-box"
                                    : "text-box"
                                    }`}
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                      if (e.target.value) {
                                        this.setErrorBorder(
                                          3,
                                          "",
                                          "errorArrayBorderTax"
                                        );
                                      } else {
                                        this.setErrorBorder(
                                          3,
                                          "x",
                                          "errorArrayBorderTax"
                                        );
                                        // document
                                        //   .getElementById("productName")
                                        //   .focus();
                                      }
                                    } else if (
                                      e.keyCode == 9 &&
                                      !e.target.value
                                    )
                                      e.preventDefault();
                                    else if (e.keyCode === 13)
                                      if (!e.target.value) e.preventDefault();
                                      else
                                        document
                                          .getElementById("applicable_date")
                                          .focus();
                                  }}
                                />
                                <span className="text-danger errormsg">
                                  {errors.sgst}
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md={2} className="p-0">
                              <Form.Label>Applicable Date</Form.Label>
                            </Col>
                            <Col md="2">
                              <Form.Group>
                                <MyTextDatePicker
                                  name="applicable_date"
                                  placeholderText="DD/MM/YYYY"
                                  id="applicable_date"
                                  dateFormat="dd/MM/yyyy"
                                  onChange={(date) => {
                                    setFieldValue("applicable_date", date);
                                  }}
                                  selected={values.applicable_date}
                                  maxDate={new Date()}
                                  className="text-box"
                                  onKeyDown={(e) => {
                                    if (e.shiftKey && e.keyCode == 9) {
                                      let datchco = e.target.value.trim();

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
                                            .getElementById("applicable_date")
                                            .focus();
                                        }, 1000);
                                      }
                                    } else if (e.keyCode == 9) {
                                      if (e.target.value == "__/__/____") {
                                        document
                                          .getElementById("tax_submit_btn")
                                          .focus();
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
                                          .getElementById("applicable_date")
                                          .focus();
                                        e.preventDefault();
                                      } else {
                                        setFieldValue(
                                          "applicable_date",
                                          e.target.value
                                        );
                                        document
                                          .getElementById("tax_submit_btn")
                                          .focus();
                                      }
                                    } else if (e.keyCode == 13) {
                                      if (e.target.value == "__/__/____") {
                                        document
                                          .getElementById("tax_submit_btn")
                                          .focus();
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
                                          .getElementById("applicable_date")
                                          .focus();
                                      } else {
                                        setFieldValue(
                                          "applicable_date",
                                          e.target.value
                                        );
                                        document
                                          .getElementById("tax_submit_btn")
                                          .focus();
                                      }
                                    }
                                  }}
                                />
                                {/* <span className="text-danger errormsg">{errors.bill_dt}</span> */}
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12 mt-1" className="btn_align">
                              <Button
                                id="tax_submit_btn"
                                className="submit-btn successbtn-style"
                                type="submit"
                                onKeyDown={(e) => {
                                  if (e.keyCode == 32) {
                                    e.preventDefault();
                                  } else if (e.keyCode == 13) {
                                    this.taxMdlRef.current.handleSubmit();
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
          {/* HSN modal */}
          <Modal
            show={HSNshow}
            size="lg"
            className="brandnewmodal mt-5 mainmodal"
            onHide={() => this.HSNshow(false)}
            dialogClassName="modal-400w"
            // aria-labelledby="example-custom-modal-styling-title"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header
              // closeButton
              className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
            >
              <Modal.Title id="example-custom-modal-styling-title" className="">
                Add New HSN
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.handleHSNModalShow(false)}
              />
              {/* <Button
              className="ml-2 btn-refresh pull-right clsbtn"
              type="submit"
              onClick={() => this.handleHSNModalShow(false)}
            >
              <img src={closeBtn} alt="icon" className="my-auto" />
            </Button> */}
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <div className="">
                <div className="m-0 mb-2">
                  <Formik
                    validateOnChange={false}
                    validateOnBlur={false}
                    enableReinitialize={true}
                    initialValues={HSNinitVal}
                    innerRef={this.HSNFormRef}
                    // validationSchema={Yup.object().shape({
                    //   hsnNumber: Yup.string()
                    //     .trim()
                    //     .required("HSN number is required"),
                    //   // description: Yup.string()
                    //   //   .trim()
                    //   //   .required("HSN description is required"),
                    //   type: Yup.object().required("Select type").nullable(),
                    // })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      let errorArray = [];
                      if (values.hsnNumber == "") {
                        errorArray.push("z");
                      } else {
                        errorArray.push("");
                      }
                      if (values.type == "" || values.type == null) {
                        errorArray.push("z");
                      } else {
                        errorArray.push("");
                      }
                      this.setState(
                        { errorArrayBorderModel: errorArray },
                        () => {
                          if (allEqual(errorArray)) {
                            let keys = Object.keys(values);
                            let requestData = new FormData();

                            keys.map((v) => {
                              if (v != "type") {
                                requestData.append(
                                  v,
                                  values[v] ? values[v] : ""
                                );
                              } else if (v == "type") {
                                requestData.append("type", values.type.value);
                              }
                            });
                            document
                              .getElementById("taxApplicableDate")
                              .focus();
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
                                        // MyNotifications.fire({
                                        //   show: true,
                                        //   icon: "success",
                                        //   title: "Success",
                                        //   msg: res.message,
                                        //   is_timeout: true,
                                        //   delay: 1000,
                                        // });
                                        // this.handleModalStatus(false);
                                        // ShowNotification("Success", res.message);
                                        // this.lstHSN(res.responseObject);
                                        // resetForm();
                                        // this.props.handleRefresh(true);
                                        this.handleHSNModalShow(false);
                                        this.lstHSN(true);
                                        setTimeout(() => {
                                          document
                                            .getElementById("hsnNo")
                                            .focus();
                                        }, 2000);
                                        // this.pageReload();
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
                                            .getElementById("PE_hsn_submit_btn")
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
                                    .catch((error) => {
                                      setSubmitting(false);
                                    });
                                },
                                handleFailFn: () => { },
                              },
                              () => {
                                // console.warn("return_data");
                              }
                            );
                          }
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
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) {
                            e.preventDefault();
                          }
                        }}
                        spellcheck="false"
                      >
                        <Row className="mb-2 px-2">
                          <Col md={1}>
                            <Form.Label>HSN</Form.Label>
                          </Col>
                          <Col md="2">
                            <Form.Group>
                              <Form.Control
                                autoFocus={true}
                                type="text"
                                autoComplete="hsnNumber"
                                placeholder="HSN No"
                                name="hsnNumber"
                                id="hsnNumber"
                                // onBlur={(e) => {
                                //   e.preventDefault();
                                //   if (
                                //     e.target.value != null &&
                                //     e.target.value != ""
                                //   ) {
                                //     this.validateHSN(
                                //       values.hsnNumber,
                                //       setFieldValue
                                //     );
                                //   } else {
                                //   }
                                // }}
                                maxLength={8}
                                onChange={handleChange}
                                value={values.hsnNumber}
                                isValid={touched.hsnNumber && !errors.hsnNumber}
                                // isInvalid={!!errors.hsnNumber}
                                style={{ boxShadow: "none" }}
                                // className="text-box"
                                className={`${values.hsnNumber == "" &&
                                  errorArrayBorderModel[0] == "z"
                                  ? "border border-danger text-box"
                                  : "text-box"
                                  }`}
                                onKeyDown={(e) => {
                                  if (e.shiftKey && e.keyCode == 9) {
                                    e.preventDefault();
                                  } else if (e.keyCode == 9) {
                                    if (!e.target.value) {
                                      e.preventDefault();
                                    } else {
                                      this.validateHSN(
                                        values.hsnNumber,
                                        setFieldValue
                                      );
                                      this.setErrorBorder(
                                        0,
                                        "",
                                        "errorArrayBorderModel"
                                      );
                                    }
                                  } else if (e.keyCode === 13) {
                                    if (e.target.value.trim()) {
                                      this.validateHSN(
                                        values.hsnNumber,
                                        setFieldValue
                                      );
                                      this.setErrorBorder(
                                        0,
                                        "",
                                        "errorArrayBorderModel"
                                      );
                                    } else
                                      document
                                        .getElementById("hsnNumber")
                                        .focus();
                                  }
                                }}
                              />
                              {/* <span className="text-danger errormsg"> */}
                              <span className="text-danger errormsg">
                                {errors.hsnNumber}
                              </span>
                              {/* </Form.Control.Feedback> */}
                            </Form.Group>
                          </Col>
                          <Col md={2} className="p-0">
                            <Form.Label>HSN Description</Form.Label>
                          </Col>
                          <Col md="3">
                            <Form.Group>
                              <Form.Control
                                type="text"
                                placeholder="HSN Description"
                                name="description"
                                id="description"
                                autoComplete="description"
                                onChange={handleChange}
                                value={values.description}
                                // isValid={touched.description && !errors.description}
                                // isInvalid={!!errors.description}
                                style={{ boxShadow: "none" }}
                                className="text-box"
                                onKeyDown={(e) => {
                                  if (
                                    (e.shiftKey && e.keyCode == 9) ||
                                    e.keyCode == 9 ||
                                    e.keyCode == 13
                                  ) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "description",
                                      e.target.value
                                    );
                                  }

                                  if (e.keyCode == 13) {
                                    this.selectRefA.current?.focus();
                                  }
                                }}
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
                            <Form.Group
                              style={{ borderRadius: "4px" }}
                              className={`${values.type == "" &&
                                errorArrayBorderModel[1] == "z"
                                ? "border border-danger selectTo"
                                : "selectTo"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  if (values.type) {
                                    this.setErrorBorder(
                                      1,
                                      "",
                                      "errorArrayBorderModel"
                                    );
                                  } else {
                                    this.setErrorBorder(
                                      1,
                                      "z",
                                      "errorArrayBorderModel"
                                    );
                                    // this.selectRefA.current?.focus();
                                  }
                                } else if (e.keyCode == 9) {
                                  if (!values.type) e.preventDefault();
                                  else {
                                    e.preventDefault();
                                    this.setErrorBorder(
                                      1,
                                      "",
                                      "errorArrayBorderModel"
                                    );
                                    document
                                      .getElementById("PE_hsn_submit_btn")
                                      .focus();
                                  }
                                } else if (e.keyCode === 13)
                                  if (values.type) {
                                    this.setErrorBorder(
                                      1,
                                      "",
                                      "errorArrayBorderModel"
                                    );
                                    document
                                      .getElementById("PE_hsn_submit_btn")
                                      .focus();
                                  } else e.preventDefault();
                              }}
                            >
                              <Select
                                ref={this.selectRefA}
                                className="selectTo"
                                id="type"
                                placeholder="Select Type"
                                styles={productDropdown}
                                // styles={createPro}
                                isClearable
                                options={typeoption}
                                name="type"
                                onChange={(value) => {
                                  setFieldValue(
                                    "type",
                                    value != null ? value : ""
                                  );
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
                              id="PE_hsn_submit_btn"
                              className="submit-btn successbtn-style"
                              type="submit"
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  e.preventDefault();
                                  this.HSNFormRef.current.handleSubmit();
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
                                this.HSNshow(false);
                              }}
                              onKeyDown={(e) => {
                                if (e.keyCode === 32) {
                                  e.preventDefault();
                                } else if (e.keyCode === 13) {
                                  this.HSNshow(false);
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Row>
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
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "sm"
                : "md"
            }
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
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={brandInitVal}
                enableReinitialize={true}
                innerRef={this.BrandMdlRef}
                // validationSchema={Yup.object().shape({
                //   brandName: Yup.string()
                //     .nullable()
                //     .trim()
                //     .required("Brand name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.brandName == "") {
                    errorArray.push("w");
                  } else {
                    errorArray.push("");
                  }
                  this.setState({ errorArrayBorderBrand: errorArray }, () => {
                    if (allEqual(errorArray)) {
                      document.getElementById("brandId").focus();
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
                                  // MyNotifications.fire({
                                  //   show: true,
                                  //   icon: "success",
                                  //   title: "Success",
                                  //   msg: res.message,
                                  //   is_timeout: true,
                                  //   delay: 1000,
                                  // });
                                  // resetForm();
                                  this.brandModalShow(false);
                                  this.lstBrands(true);
                                  // this.pageReload();
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
                                      .getElementById("PE_brand_submit_btn")
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
                    spellcheck="false"
                  >
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            // className="text-box"
                            type="text"
                            autoFocus={true}
                            placeholder="Brand Name"
                            name="brandName"
                            id="brandName"
                            autoComplete="brandName"
                            onChange={handleChange}
                            value={values.brandName}
                            isValid={touched.brandName && !errors.brandName}
                            // isInvalid={!!errors.brandName}
                            // onInput={(e) => {
                            //   e.target.value =
                            //   e.target.value.charAt(0).toUpperCase() +
                            //   e.target.value.slice(1);
                            // }}
                            onInput={(e) => {
                              e.target.value = e.target.value.trimStart();
                              e.target.value = this.getDataCapitalised(
                                e.target.value
                              );
                            }}
                            style={{ boxShadow: "none" }}
                            className={`${errorArrayBorderBrand[0] == "w"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.keyCode == 9) {
                                e.preventDefault();
                              } else if (e.keyCode == 9) {
                                if (!e.target.value) {
                                  e.preventDefault();
                                } else {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "brandName",
                                    e.target.value
                                  );
                                }
                              } else if (e.keyCode === 13)
                                if (e.target.value.trim()) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "brandName",
                                    e.target.value
                                  );
                                  document
                                    .getElementById("PE_brand_submit_btn")
                                    .focus();
                                } else e.preventDefault();
                            }}
                          />
                          <span className="text-danger errormsg">
                            {errors.brandName}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Modal.Footer className="border-0 mt-1">
                      <Button
                        id="PE_brand_submit_btn"
                        className="successbtn-style"
                        type="submit"
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            e.preventDefault();
                            this.BrandMdlRef.current.handleSubmit();
                          }
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        // className="cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.brandModalShow(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.brandModalShow(false);
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
          {/* Category Modal */}
          <Modal
            show={categoryModalShow}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "sm"
                : "md"
            }
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
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={categoryInitVal}
                enableReinitialize={true}
                innerRef={this.CategoryMdlRef}
                // validationSchema={Yup.object().shape({
                //   categoryName: Yup.string()
                //     .nullable()
                //     .trim()
                //     .required("Category name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.categoryName == "") {
                    errorArray.push("u");
                  } else {
                    errorArray.push("");
                  }
                  this.setState(
                    { errorArrayBorderCategory: errorArray },
                    () => {
                      if (allEqual(errorArray)) {
                        document.getElementById("categoryId").focus();
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
                              requestData.append(
                                "categoryName",
                                values.categoryName
                              );
                              createCategory(requestData)
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
                                    this.categoryModalShow(false);
                                    this.lstCategories(true);
                                    // this.pageReload();
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
                                        .getElementById("PE_cate_submit_btn")
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
                            },
                            handleFailFn: () => { },
                          },
                          () => {
                            // console.warn("return_data");
                          }
                        );
                      }
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
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                      }
                    }}
                    spellcheck="false"
                  >
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            // className="text-box"
                            type="text"
                            autoComplete="categoryName"
                            placeholder="Category Name"
                            name="categoryName"
                            id="categoryName"
                            autoFocus={true}
                            onChange={handleChange}
                            value={values.categoryName}
                            isValid={
                              touched.categoryName && !errors.categoryName
                            }
                            // isInvalid={!!errors.categoryName}
                            // onInput={(e) => {
                            //   e.target.value =
                            //   e.target.value.charAt(0).toUpperCase() +
                            //   e.target.value.slice(1);
                            // }}
                            onInput={(e) => {
                              e.target.value = e.target.value.trimStart();
                              e.target.value = this.getDataCapitalised(
                                e.target.value
                              );
                            }}
                            style={{ boxShadow: "none" }}
                            className={`${errorArrayBorderCategory[0] == "u"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.keyCode == 9) {
                                if (e.target.value) {
                                  this.setErrorBorder(
                                    0,
                                    "",
                                    "errorArrayBorderCategory"
                                  );
                                } else {
                                  this.setErrorBorder(
                                    0,
                                    "u",
                                    "errorArrayBorderCategory"
                                  );
                                }
                              } else if (e.keyCode == 9 && !e.target.value)
                                e.preventDefault();
                              else if (e.keyCode === 13)
                                if (e.target.value.trim())
                                  document
                                    .getElementById("PE_cate_submit_btn")
                                    .focus();
                                else e.preventDefault();
                            }}
                          />
                          <span className="text-danger errormsg">
                            {errors.categoryName}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Modal.Footer className="border-0">
                      <Button
                        id="PE_cate_submit_btn"
                        className="successbtn-style"
                        type="submit"
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            e.preventDefault();
                            this.CategoryMdlRef.current.handleSubmit();
                          }
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        // className="mdl-cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.categoryModalShow(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.categoryModalShow(false);
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
          {/* SubCategory Modal */}
          <Modal
            show={subcategoryModalShow}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "sm"
                : "md"
            }
            className="modal-style"
            onHide={() => this.subcategoryModalShow(false)}
            dialogClassName="modal-400w"
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Add New Subcategory</Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.subcategoryModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={subcategoryInitVal}
                enableReinitialize={true}
                innerRef={this.SubCategoryMdlRef}
                // validationSchema={Yup.object().shape({
                //   subcategoryName: Yup.string()
                //     .nullable()
                //     .trim()
                //     .required("Subcategory name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.subcategoryName == "") {
                    errorArray.push("t");
                  } else {
                    errorArray.push("");
                  }
                  this.setState(
                    { errorArrayBorderSubCategory: errorArray },
                    () => {
                      if (allEqual(errorArray)) {
                        document.getElementById("subcategoryId").focus();
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
                              requestData.append(
                                "subCategoryName",
                                values.subcategoryName
                              );
                              createSubCategory(requestData)
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
                                    this.subcategoryModalShow(false);
                                    this.lstsubCategories(true);
                                    // this.pageReload();
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
                                        .getElementById(
                                          "PE_sub_cate_submit_btn"
                                        )
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
                            },
                            handleFailFn: () => { },
                          },
                          () => {
                            // console.warn("return_data");
                          }
                        );
                      }
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
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                      }
                    }}
                    spellcheck="false"
                  >
                    <Modal.Body className=" p-0 pb-3 border-0">
                      <Row className="justify-content-center">
                        <Col md="11">
                          <Form.Group>
                            <Form.Control
                              // className="text-box"
                              type="text"
                              placeholder="Subcategory Name"
                              name="subcategoryName"
                              id="subcategoryName"
                              autoFocus={true}
                              autoComplete="subcategoryName"
                              onChange={handleChange}
                              value={values.subcategoryName}
                              isValid={
                                touched.subcategoryName &&
                                !errors.subcategoryName
                              }
                              // isInvalid={!!errors.categoryName}
                              // onInput={(e) => {
                              //   e.target.value =
                              //   e.target.value.charAt(0).toUpperCase() +
                              //   e.target.value.slice(1);
                              // }}
                              onInput={(e) => {
                                e.target.value = e.target.value.trimStart();
                                e.target.value = this.getDataCapitalised(
                                  e.target.value
                                );
                              }}
                              style={{ boxShadow: "none" }}
                              className={`${errorArrayBorderSubCategory[0] == "t"
                                ? "border border-danger text-box"
                                : "text-box"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  if (e.target.value) {
                                    this.setErrorBorder(
                                      0,
                                      "",
                                      "errorArrayBorderSubCategory"
                                    );
                                  } else {
                                    this.setErrorBorder(
                                      0,
                                      "t",
                                      "errorArrayBorderSubCategory"
                                    );
                                  }
                                } else if (e.keyCode == 9 && !e.target.value)
                                  e.preventDefault();
                                else if (e.keyCode === 13)
                                  if (e.target.value.trim())
                                    document
                                      .getElementById("PE_sub_cate_submit_btn")
                                      .focus();
                                  else e.preventDefault();
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.subcategoryName}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button
                        id="PE_sub_cate_submit_btn"
                        className="successbtn-style"
                        type="submit"
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            e.preventDefault();
                            this.SubCategoryMdlRef.current.handleSubmit();
                          }
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn ms-2"
                        // className="mdl-cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.subcategoryModalShow(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.subcategoryModalShow(false);
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
          {/* Group Modal */}
          <Modal
            show={groupModalShow}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "sm"
                : "md"
            }
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
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={groupInitVal}
                enableReinitialize={true}
                innerRef={this.GroupMdlRef}
                // validationSchema={Yup.object().shape({
                //   groupName: Yup.string()
                //     .nullable()
                //     .trim()
                //     .required("Group name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.groupName == "") {
                    errorArray.push("s");
                  } else {
                    errorArray.push("");
                  }
                  this.setState({ errorArrayBorderGroup: errorArray }, () => {
                    if (allEqual(errorArray)) {
                      document.getElementById("groupId").focus();
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
                                  // MyNotifications.fire({
                                  //   show: true,
                                  //   icon: "success",
                                  //   title: "Success",
                                  //   msg: res.message,
                                  //   is_timeout: true,
                                  //   delay: 1000,
                                  // });
                                  // resetForm();
                                  this.groupModalShow(false);
                                  this.lstGroups(true);
                                  // this.pageReload();
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
                                      .getElementById("PE_grp_submit_btn")
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
                    spellcheck="false"
                  >
                    <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                      <Row className="justify-content-center">
                        <Col md="11">
                          <Form.Group>
                            <Form.Control
                              // className="text-box"
                              type="text"
                              placeholder="Group Name"
                              name="groupName"
                              autoFocus={true}
                              autoComplete="groupName"
                              id="groupName"
                              onChange={handleChange}
                              value={values.groupName}
                              isValid={touched.groupName && !errors.groupName}
                              // isInvalid={!!errors.groupName}
                              // onInput={(e) => {
                              //   e.target.value =
                              //   e.target.value.charAt(0).toUpperCase() +
                              //   e.target.value.slice(1);
                              // }}
                              onInput={(e) => {
                                e.target.value = e.target.value.trimStart();
                                e.target.value = this.getDataCapitalised(
                                  e.target.value
                                );
                              }}
                              style={{ boxShadow: "none" }}
                              className={`${errorArrayBorderGroup[0] == "s"
                                ? "border border-danger text-box"
                                : "text-box"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  e.preventDefault();
                                } else if (e.keyCode == 9) {
                                  if (!e.target.value) {
                                    e.preventDefault();
                                  } else {
                                    e.preventDefault();
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "groupName",
                                      e.target.value
                                    );
                                    document
                                      .getElementById("PC_grp_submit_btn")
                                      .focus();
                                  }
                                } else if (e.keyCode === 13)
                                  if (e.target.value.trim()) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "groupName",
                                      e.target.value
                                    );
                                    document
                                      .getElementById("PE_grp_submit_btn")
                                      .focus();
                                  } else e.preventDefault();
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.groupName}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button
                        id="PE_grp_submit_btn"
                        className="successbtn-style"
                        type="submit"
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            e.preventDefault();
                            this.GroupMdlRef.current.handleSubmit();
                          }
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        // className="mdl-cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.groupModalShow(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.groupModalShow(false);
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
          {/* Sub Group Modal */}
          <Modal
            show={subgroupModalShow}
            size={
              window.matchMedia("(min-width:1024px) and (max-width:1401px)")
                .matches
                ? "sm"
                : "md"
            }
            className="modal-style"
            onHide={() => this.subgroupModalShow(false)}
            dialogClassName="modal-400w"
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Add New Subgroup</Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.subgroupModalShow(false)}
              />
            </Modal.Header>
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={subgroupInitVal}
                enableReinitialize={true}
                innerRef={this.SubGroupMdlRef}
                // validationSchema={Yup.object().shape({
                //   subgroupName: Yup.string()
                //     .nullable()
                //     .trim()
                //     .required("Subgroup name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.subgroupName == "") {
                    errorArray.push("r");
                  } else {
                    errorArray.push("");
                  }
                  this.setState(
                    { errorArrayBorderSubGroup: errorArray },
                    () => {
                      if (allEqual(errorArray)) {
                        document.getElementById("categoryId").focus();
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
                              requestData.append(
                                "subgroupName",
                                values.subgroupName
                              );
                              createSubGroup(requestData)
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
                                    this.subgroupModalShow(false);
                                    this.lstsubGroups(true);
                                    // this.pageReload();
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
                                        .getElementById("PE_sub_grp_submit_btn")
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
                            },
                            handleFailFn: () => { },
                          },
                          () => {
                            // console.warn("return_data");
                          }
                        );
                      }
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
                    onKeyDown={(e) => {
                      if (e.keyCode == 13) {
                        e.preventDefault();
                      }
                    }}
                    spellcheck="false"
                  >
                    <Modal.Body className=" p-0  pb-3 border-0">
                      <Row className="justify-content-center">
                        <Col md="11">
                          <Form.Group>
                            <Form.Control
                              // className="text-box"
                              type="text"
                              autoComplete="subgroupName"
                              placeholder="Subgroup Name"
                              name="subgroupName"
                              autoFocus={true}
                              id="subgroupName"
                              onChange={handleChange}
                              value={values.subgroupName}
                              isValid={
                                touched.subgroupName && !errors.subgroupName
                              }
                              // isInvalid={!!errors.subgroupName}
                              /*  onInput={(e) => {
                                e.target.value =
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1);
                              }} */
                              onInput={(e) => {
                                e.target.value = e.target.value.trimStart();
                                e.target.value = this.getDataCapitalised(
                                  e.target.value
                                );
                              }}
                              style={{ boxShadow: "none" }}
                              className={`${errorArrayBorderSubGroup[0] == "r"
                                ? "border border-danger text-box"
                                : "text-box"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  e.preventDefault();
                                } else if (e.keyCode == 9) {
                                  if (!e.target.value) e.preventDefault();
                                  else {
                                    e.preventDefault();
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "subgroupName",
                                      e.target.value
                                    );
                                    document
                                      .getElementById("PE_sub_grp_submit_btn")
                                      .focus();
                                  }
                                } else if (e.keyCode === 13)
                                  if (e.target.value.trim()) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "subgroupName",
                                      e.target.value
                                    );
                                    document
                                      .getElementById("PE_sub_grp_submit_btn")
                                      .focus();
                                  } else e.preventDefault();
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.subgroupName}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button
                        id="PE_sub_grp_submit_btn"
                        className="successbtn-style"
                        type="submit"
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            e.preventDefault();
                            this.SubGroupMdlRef.current.handleSubmit();
                          }
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn ms-2"
                        // className="mdl-cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.subgroupModalShow(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.subgroupModalShow(false);
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
            <Modal.Body className="purchaseumodal p-3 p-invoice-modal">
              <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={packageInitVal}
                enableReinitialize={true}
                // validationSchema={Yup.object().shape({
                //   packageName: Yup.string()
                //     .nullable()
                //     .trim()
                //     // .matches(alphaNumericRex, "Enter alpha-numeric")
                //     .required("Package name is required"),
                // })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let errorArray = [];
                  if (values.packageName == "") {
                    errorArray.push("q");
                  } else {
                    errorArray.push("");
                  }
                  this.setState({ errorArrayBorderPack: errorArray }, () => {
                    if (allEqual(errorArray)) {
                      document.getElementById("packagingId").focus();
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
                            requestData.append(
                              "packing_name",
                              values.packageName
                            );
                            createPacking(requestData)
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
                                  this.packageModalShow(false);
                                  this.getMstPackageOptions(true);
                                  // this.pageReload();
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
                                      .getElementById("PE_pkg_submit_btn")
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
                          },
                          handleFailFn: () => { },
                        },
                        () => {
                          console.warn("return_data");
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
                    spellcheck="false"
                  >
                    <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                      <Row className="justify-content-center">
                        <Col md="11">
                          <Form.Group>
                            <Form.Control
                              // className="text-box"
                              type="text"
                              placeholder="Package Name"
                              name="packageName"
                              id="packageName"
                              autoFocus={true}
                              autoComplete="packageName"
                              onChange={handleChange}
                              value={values.packageName}
                              isValid={
                                touched.packageName && !errors.packageName
                              }
                              // isInvalid={!!errors.packageName}
                              style={{ boxShadow: "none" }}
                              className={`${errorArrayBorderPack[0] == "q"
                                ? "border border-danger text-box"
                                : "text-box"
                                }`}
                              onKeyDown={(e) => {
                                if (e.shiftKey && e.keyCode == 9) {
                                  e.preventDefault();
                                } else if (e.keyCode == 9) {
                                  if (!e.target.value) {
                                    e.preventDefault();
                                  } else {
                                    e.preventDefault();
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "packageName",
                                      e.target.value
                                    );
                                    document
                                      .getElementById("PE_pkg_submit_btn")
                                      .focus();
                                  }
                                } else if (e.keyCode === 13) {
                                  if (e.target.value.trim()) {
                                    handlesetFieldValue(
                                      setFieldValue,
                                      "packageName",
                                      e.target.value
                                    );
                                    document
                                      .getElementById("PE_pkg_submit_btn")
                                      .focus();
                                  } else e.preventDefault();
                                }
                              }}
                            />
                            <span className="text-danger errormsg">
                              {errors.packageName}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                      <Button
                        className="successbtn-style"
                        type="submit"
                        id="PE_pkg_submit_btn"
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            e.preventDefault();
                            handleSubmit();
                          }
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        // className="mdl-cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.packageModalShow(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 32) {
                            e.preventDefault();
                          } else if (e.keyCode === 13) {
                            this.packageModalShow(false);
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
                                delay: 1500,
                              });
                              // resetForm();
                              this.unitModalShow(false);
                              this.lstUnit();
                              // this.pageReload();
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
                              this.unitModalShow(false);
                              this.lstUnit();
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
                  spellcheck="false"
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="5">
                        <Form.Group>
                          <Form.Control
                            autoComplete="unitName"
                            style={{
                              borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            className="text-box"
                            type="text"
                            autoFocus={true}
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
                        <Form.Group>
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
                    <Button className="successbtn-style" type="submit">
                      {unitInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn"
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
        </div>
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

export default connect(mapStateToProps, mapActionsToProps)(NewProductEdit);
