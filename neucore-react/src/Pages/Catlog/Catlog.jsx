import React from "react";
import {
  Form,
  Row,
  Col,
  Table,
  Button,
  Modal,
  CloseButton,
} from "react-bootstrap";

import { Formik } from "formik";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { setUserControl } from "@/redux/userControl/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Select from "react-select";

import {
  MyNotifications,
  only_alphabets,
  AlphabetwithSpecialChars,
  alphaNumericRex,
  createPro,
  isActionExist,
  getValue,
  isUserControl,
  getUserControlData,
  getUserControlLevel,
  getSelectValue,
  allEqual,
  handlesetFieldValue,
} from "@/helpers";

import {
  createBrand,
  getAllBrands,
  updateBrand,
  get_brand,
  createGroup,
  updateGroup,
  get_outlet_groups,
  get_groups_by_id,
  createCategory,
  getAllCategory,
  updateCategory,
  get_category_by_id,
  createSubCategory,
  getAllSubCategory,
  updateSubCategory,
  get_subcategory,
  updatePacking,
  getPackings,
  createPacking,
  getPackingById,
  createUnit,
  getAllUnit,
  removeGroups,
  updateUnit,
  get_units,
  removeBrandlist,
  removeCategories,
  removeSubCategories,
  removePackages,
  create_levelA,
  update_levelA,
  get_outlet_levelA,
  get_levelA_by_id,
  remove_levelA,
  create_levelB,
  update_levelB,
  get_outlet_levelB,
  get_levelB_by_id,
  remove_levelB,
  create_levelC,
  update_levelC,
  get_outlet_levelC,
  get_levelC_by_id,
  remove_levelC,
  createSubGroup,
  updatesubGroup,
  getsubGroups,
  get_sub_groups_by_id,
  removesubGroups,
} from "@/services/api_functions";
import { removeUnits } from "../../services/api_functions/unit.service";

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
class Catlog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefresh: false,
      eventKey: "profile",

      brandInitVal: {
        id: "",
        brandName: "",
      },
      brandList: [],
      brandModalShow: false,
      selectedBrands: [],
      selectedBrandForRemove: [],

      groupInitVal: {
        id: "",
        groupName: "",
      },

      subgroupInitVal: {
        id: "",
        subgroupName: "",
      },
      subgroupList: [],
      subgroupModalShow: false,
      groupList: [],
      groupModalShow: false,
      selectedGroups: [],
      selectedsubGroups: [],

      categoryInitVal: {
        id: "",
        categoryName: "",
      },
      categoryList: [],
      categoryModalShow: false,

      subcategoryList: [],

      subcategoryModalShow: false,

      selectedCategories: [],
      selectedsubCategories: [],

      subCategoryInitVal: {
        id: "",
        subCategoryName: "",
      },
      subCategoryList: [],
      subCategoryModalShow: false,
      selectedSubCategories: [],

      packageInitVal: {
        id: "",
        packageName: "",
      },
      packageList: [],
      packageModalShow: false,
      selectedPackages: [],

      unitInitVal: {
        id: "",
        unitName: "",
        unitCode: "",
        uom: "",
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
      levelA: "",
      levelB: "",
      levelC: "",
      data: [
        { key: "level_a", value: true },
        { key: "level_b", value: false },
        { key: "level_c", value: false },
      ],
      // actualdata: [],
      // width: window.innerWidth,
      // heigth: window.innerHeight,
      // actp: {
      //   level_a_only: [
      //     0.5, 16, 0.5, 0.5, 16, 0.5, 0.5, 16, 0.5, 0.5, 16, 0.5, 0.5, 16, 0.5,
      //     0.5, 16, 0.5, 0, 0, 0, 0, 0, 0,
      //   ],
      //   level_a_b: [
      //     0.5, 13.5, 0.5, 0.5, 13.5, 0.5, 0.5, 13.5, 0.5, 0.5, 13.5, 0.5, 0.5,
      //     13.5, 0.5, 0.5, 13.5, 0.5, 0.5, 13.5, 0.5, 0, 0, 0,
      //   ],
      //   level_a_b_c: [
      //     0.5, 11.5, 0.5, 0.5, 11.5, 0.5, 0.5, 11.5, 0.5, 0.5, 11.5, 0.5, 0.5,
      //     11.5, 0.5, 0.5, 11.5, 0.5, 0.5, 11.5, 0.5, 0.5, 11.5, 0.5,
      //   ],
      //   without_level_abc: [
      //     0.5, 19, 0.5, 0.5, 19, 0.5, 0.5, 19, 0.5, 0.5, 19, 0.5, 0.5, 19, 0.5,
      //     0, 0, 0, 0, 0, 0, 0, 0, 0,
      //   ],
      // },
      // method_used: "level_a_b_c",

      ABC_flag_value: "",
      errorArrayBorderUnit: "",
      errorArrayBorderPack: "",
      errorArrayBorderBrand: "",
      errorArrayBorderGroup: "",
      errorArrayBorderSubGroup: "",
      errorArrayBorderCategory: "",
      errorArrayBorderSubCategory: "",
      errorArrayBorderLevelA: "",
      errorArrayBorderLevelB: "",
      errorArrayBorderLevelC: "",
    };
    this.selectRefA = React.createRef();
    this.FormRef = React.createRef();
  }

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

  subCategoryModalShow = (value) => {
    this.setState({ subCategoryModalShow: value }, () => {
      if (value == false)
        this.setState({
          subCategoryInitVal: {
            id: "",
            subCategoryName: "",
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
          errorArrayBorderUnit: "",
        });
    });
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

  getBrandLst = () => {
    getAllBrands()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          this.setState({
            brandList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ brandList: [] });
      });
  };

  getGroupLst = () => {
    get_outlet_groups()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          this.setState({
            groupList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ groupList: [] });
      });
  };
  getSubGroupLst = () => {
    getsubGroups()
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 200) {
          this.setState({
            subgroupList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ groupList: [] });
      });
  };

  getCategoryLst = () => {
    getAllCategory()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            categoryList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ categoryList: [] });
      });
  };

  getSubCategoryLst = () => {
    getAllSubCategory()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            subCategoryList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ subCategoryList: [] });
      });
  };

  getPackageLst = () => {
    getPackings()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            packageList: res.list,
          });
        }
      })
      .catch((error) => {
        this.setState({ packageList: [] });
      });
  };

  getUnitLst = () => {
    getAllUnit()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            unitList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ unitList: [] });
      });
  };

  getLevelALst = () => {
    get_outlet_levelA()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            levelAList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ levelAList: [] });
      });
  };

  getLevelBLst = () => {
    get_outlet_levelB()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            levelBList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ levelBList: [] });
      });
  };

  getLevelCLst = () => {
    get_outlet_levelC()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            levelCList: res.responseObject,
          });
        }
      })
      .catch((error) => {
        this.setState({ levelCList: [] });
      });
  };

  handleBrandFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_brand(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let ob = result.responseObject;
          let initVal = {
            id: ob.id,
            brandName: ob.brandName,
          };
          this.setState({ brandInitVal: initVal, brandModalShow: true });
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
      .catch((error) => { });
  };

  handleGroupFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_groups_by_id(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let ob = result.responseObject;
          let initVal = {
            id: ob.id,
            groupName: ob.groupName,
          };
          this.setState({
            groupInitVal: initVal,
            groupModalShow: true,
          });
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
      .catch((error) => { });
  };
  handleSubGroupFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_sub_groups_by_id(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let ob = result.responseObject;
          let initVal = {
            id: ob.id,
            subgroupName: ob.subgroupName,
          };
          this.setState({
            subgroupInitVal: initVal,
            subgroupModalShow: true,
          });
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
      .catch((error) => { });
  };

  handleCategoryFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_category_by_id(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let ob = result.responseObject;
          let initVal = {
            id: ob.id,
            categoryName: ob.categoryName,
          };
          this.setState({
            categoryInitVal: initVal,
            categoryModalShow: true,
          });
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
      .catch((error) => { });
  };

  handleSubCategoryFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_subcategory(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.responseObject;

          let initVal = {
            id: res.id,
            subCategoryName: res.subcategoryName,
          };
          this.setState({
            subCategoryInitVal: initVal,
            subCategoryModalShow: true,
          });
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
      .catch((error) => { });
  };

  handlePackageFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    getPackingById(reqData)
      .then((response) => {
        let result = response.data;
        if (result.responseStatus == 200) {
          let res = result.data;

          let initVal = {
            id: res.id,
            packageName: res.name,
          };
          this.setState({ packageInitVal: initVal, packageModalShow: true });
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
      .catch((error) => { });
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
            unitCode: res.unitCode
              ? getSelectValue(uomoption, res.unitCode)
              : "",
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
      .catch((error) => { });
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
      .catch((error) => { });
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
      .catch((error) => { });
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
      .catch((error) => { });
  };

  addBrandSelection = (id, checkBoxFlag = false) => {
    let { selectedBrands, brandList } = this.state;

    let f_selectedBrands = selectedBrands;
    let f_Brands = brandList;

    if (checkBoxFlag == true) {
      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(id)) {
          f_selectedBrands = [...f_selectedBrands, id];
        }
      } else {
        f_selectedBrands = [...f_selectedBrands, id];
      }
    } else {
      f_selectedBrands = f_selectedBrands.filter((v, i) => v != id);
    }

    this.setState({
      isAllChecked: f_Brands.length == f_selectedBrands.length ? true : false,
      selectedBrands: f_selectedBrands,
      brandList: f_Brands,
    });
  };

  getDeleteResponseMessage = (removedArray, usedArray) => {
    let removedMsg = "";
    let usedMsg = "";
    let rLength = removedArray.length;
    let uLength = usedArray.length;

    if (removedArray.length > 0) {
      removedMsg = removedArray.map((obj) => {
        rLength === removedArray.length - 1
          ? (removedMsg = obj.name + ", ")
          : (removedMsg = obj.name);
        return removedMsg;
      });
      removedMsg = "Removed : " + removedMsg;
    }
    if (usedArray.length > 0) {
      usedMsg = usedArray.map((obj) => {
        uLength === usedArray.length - 1
          ? (usedMsg = obj.name + ", ")
          : (usedMsg = obj.name);
        return usedMsg;
      });
      usedMsg = "Is already in use : " + usedMsg;
    }

    return removedMsg + "\n" + usedMsg;
  };

  deleteUnits = (selectedUnits) => {
    if (selectedUnits.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete Units",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append("removedunitlist", JSON.stringify(selectedUnits));

            removeUnits(formData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedArray,
                    res.usedArray
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedUnits: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Package to Remove",
        is_button_show: true,
      });
    }
  };

  deletePackages = (selectedPackages) => {
    if (selectedPackages.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete Package",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append(
              "removepackageslist",
              JSON.stringify(selectedPackages)
            );

            removePackages(formData)
              .then((response) => {
                // debugger;

                let res = response.data;

                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedArray,
                    res.usedArray
                  );

                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedPackages: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Package to Remove",
        is_button_show: true,
      });
      // console.log("List is empty");
    }
  };

  deleteGroups = (selectedGroups) => {
    if (selectedGroups.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete Group",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append("removegrouplist", JSON.stringify(selectedGroups));

            removeGroups(formData)
              .then((response) => {
                let res = response.data;

                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedGroups,
                    res.usedGroups
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedGroups: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Brand to Remove",
        is_button_show: true,
      });
    }
  };

  deleteSubGroups = (selectedSubGroups) => {
    if (selectedSubGroups.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete SubGroup",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append(
              "removesubgrouplist",
              JSON.stringify(selectedSubGroups)
            );

            removesubGroups(formData)
              .then((response) => {
                let res = response.data;

                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedsubGroups,
                    res.usedsubGroups
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedSubGroups: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Brand to Remove",
        is_button_show: true,
      });
    }
  };

  deleteCategories = (selectedCategories) => {
    if (selectedCategories.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete Category",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append(
              "removecategorylist",
              JSON.stringify(selectedCategories)
            );

            removeCategories(formData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedCategory,
                    res.usedCategory
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedCategories: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Category to Remove",
        is_button_show: true,
      });
    }
  };

  deleteSubCategories = (selectedSubCategories) => {
    if (selectedSubCategories.length > 0) {
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
            let formData = new FormData();
            formData.append(
              "removesubcategorylist",
              JSON.stringify(selectedSubCategories)
            );

            removeSubCategories(formData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedCategory,
                    res.usedCategory
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedSubCategories: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select SubCategory to Remove",
        is_button_show: true,
      });
    }
  };
  deleteBrands = (selectedBrands) => {
    if (selectedBrands.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete Brand",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append("removebrandlist", JSON.stringify(selectedBrands));

            removeBrandlist(formData)
              .then((response) => {
                let res = response.data;

                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedBrands,
                    res.usedBrands
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedBrands: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Brand to Remove",
        is_button_show: true,
      });
      // console.log("List is empty");
    }
  };

  addGroupSelection = (id, checkBoxFlag = false) => {
    let { selectedGroups, groupList } = this.state;
    console.log("selected Group->", id);
    let f_selectedGroups = selectedGroups;
    let f_groups = groupList;
    if (checkBoxFlag == true) {
      if (selectedGroups.length > 0) {
        if (!selectedGroups.includes(id)) {
          f_selectedGroups = [...f_selectedGroups, id];
        }
      } else {
        f_selectedGroups = [...f_selectedGroups, id];
      }
    } else {
      f_selectedGroups = f_selectedGroups.filter((v, i) => v != id);
    }

    this.setState({
      isAllChecked: f_groups.length == f_selectedGroups.length ? true : false,

      selectedGroups: f_selectedGroups,
      groupList: f_groups,
    });
  };
  addsubGroupSelection = (id, checkBoxFlag = false) => {
    let { selectedsubGroups, subgroupList } = this.state;

    let f_selectedsubGroups = selectedsubGroups;
    let f_subgroups = subgroupList;
    if (checkBoxFlag == true) {
      if (selectedsubGroups.length > 0) {
        if (!selectedsubGroups.includes(id)) {
          f_selectedsubGroups = [...f_selectedsubGroups, id];
        }
      } else {
        f_selectedsubGroups = [...f_selectedsubGroups, id];
      }
    } else {
      f_selectedsubGroups = f_selectedsubGroups.filter((v, i) => v != id);
    }

    this.setState({
      isAllChecked:
        f_subgroups.length == f_selectedsubGroups.length ? true : false,

      selectedsubGroups: f_selectedsubGroups,
      subgroupList: f_subgroups,
    });
  };

  addCategorySelection = (id, checkBoxFlag = false) => {
    let { selectedCategories } = this.state;

    let f_selectedCategories = selectedCategories;
    if (checkBoxFlag == true) {
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(id)) {
          f_selectedCategories = [...f_selectedCategories, id];
        }
      } else {
        f_selectedCategories = [...f_selectedCategories, id];
      }
    } else {
      f_selectedCategories = f_selectedCategories.filter((v, i) => v != id);
    }

    this.setState({ selectedCategories: f_selectedCategories });
  };

  addSubCategorySelection = (id, checkBoxFlag = false) => {
    let { selectedSubCategories } = this.state;
    let f_selectedSubCategories = selectedSubCategories;
    if (checkBoxFlag == true) {
      if (selectedSubCategories.length > 0) {
        if (!selectedSubCategories.includes(id)) {
          f_selectedSubCategories = [...f_selectedSubCategories, id];
        }
      } else {
        f_selectedSubCategories = [...f_selectedSubCategories, id];
      }
    } else {
      f_selectedSubCategories = f_selectedSubCategories.filter(
        (v, i) => v != id
      );
    }

    this.setState({ selectedSubCategories: f_selectedSubCategories });
  };

  addPackageSelection = (id, checkBoxFlag = false) => {
    let { selectedPackages } = this.state;
    let f_selectedPackages = selectedPackages;
    if (checkBoxFlag == true) {
      if (selectedPackages.length > 0) {
        if (!selectedPackages.includes(id)) {
          f_selectedPackages = [...f_selectedPackages, id];
        }
      } else {
        f_selectedPackages = [...f_selectedPackages, id];
      }
    } else {
      f_selectedPackages = f_selectedPackages.filter((v, i) => v != id);
    }

    this.setState({ selectedPackages: f_selectedPackages });
  };

  addUnitSelection = (id, checkBoxFlag = false) => {
    let { selectedUnits } = this.state;
    let f_selectedUnits = selectedUnits;
    if (checkBoxFlag == true) {
      if (selectedUnits.length > 0) {
        if (!selectedUnits.includes(id)) {
          f_selectedUnits = [...f_selectedUnits, id];
        }
      } else {
        f_selectedUnits = [...f_selectedUnits, id];
      }
    } else {
      f_selectedUnits = f_selectedUnits.filter((v, i) => v != id);
    }

    this.setState({ selectedUnits: f_selectedUnits });
  };

  addLevelASelection = (id, checkBoxFlag = false) => {
    let { selectedLevelA } = this.state;
    let f_selectedLevelA = selectedLevelA;
    if (checkBoxFlag == true) {
      if (selectedLevelA.length > 0) {
        if (!selectedLevelA.includes(id)) {
          f_selectedLevelA = [...f_selectedLevelA, id];
        }
      } else {
        f_selectedLevelA = [...f_selectedLevelA, id];
      }
    } else {
      f_selectedLevelA = f_selectedLevelA.filter((v, i) => v != id);
    }

    this.setState({ selectedLevelA: f_selectedLevelA });
  };

  addLevelBSelection = (id, checkBoxFlag = false) => {
    let { selectedLevelB } = this.state;
    let f_selectedLevelB = selectedLevelB;
    if (checkBoxFlag == true) {
      if (selectedLevelB.length > 0) {
        if (!selectedLevelB.includes(id)) {
          f_selectedLevelB = [...f_selectedLevelB, id];
        }
      } else {
        f_selectedLevelB = [...f_selectedLevelB, id];
      }
    } else {
      f_selectedLevelB = f_selectedLevelB.filter((v, i) => v != id);
    }

    this.setState({ selectedLevelB: f_selectedLevelB });
  };

  addLevelCSelection = (id, checkBoxFlag = false) => {
    let { selectedLevelC } = this.state;
    let f_selectedLevelC = selectedLevelC;
    if (checkBoxFlag == true) {
      if (selectedLevelC.length > 0) {
        if (!selectedLevelC.includes(id)) {
          f_selectedLevelC = [...f_selectedLevelC, id];
        }
      } else {
        f_selectedLevelC = [...f_selectedLevelC, id];
      }
    } else {
      f_selectedLevelC = f_selectedLevelC.filter((v, i) => v != id);
    }

    this.setState({ selectedLevelC: f_selectedLevelC });
  };

  deleteLevelA = (selectedLevelA) => {
    if (selectedLevelA.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete Level A",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append("removeLevelAList", JSON.stringify(selectedLevelA));

            remove_levelA(formData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedArray,
                    res.usedArray
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedLevelA: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Level A to Remove",
        is_button_show: true,
      });
      // console.log("List is empty");
    }
  };

  deleteLevelB = (selectedLevelB) => {
    if (selectedLevelB.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete Level B",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append("removeLevelBList", JSON.stringify(selectedLevelB));

            remove_levelB(formData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedArray,
                    res.usedArray
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedLevelB: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Level B to Remove",
        is_button_show: true,
      });
      // console.log("List is empty");
    }
  };

  deleteLevelC = (selectedLevelC) => {
    // console.log("selectedLevelC.length", selectedLevelC.length);
    if (selectedLevelC.length > 0) {
      MyNotifications.fire(
        {
          show: true,
          icon: "confirm",
          title: "Confirm",
          msg: "Do you want to Delete Level C",
          is_button_show: false,
          is_timeout: false,
          delay: 0,
          handleSuccessFn: () => {
            let formData = new FormData();
            formData.append("removeLevelCList", JSON.stringify(selectedLevelC));
            // console.log("selected LevelC->", selectedLevelC);
            remove_levelC(formData)
              .then((response) => {
                let res = response.data;
                if (res.responseStatus == 200) {
                  let message = this.getDeleteResponseMessage(
                    res.removedArray,
                    res.usedArray
                  );
                  MyNotifications.fire({
                    show: true,
                    icon: "success",
                    title: "Success",
                    msg: message,
                    is_timeout: true,
                    delay: 1200,
                  });
                  this.pageReload();
                  this.setState({ selectedLevelC: [] });
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
              .catch((error) => { });
          },
          handleFailFn: () => { },
        },
        () => {
          // console.warn("return_data");
        }
      );
    } else {
      MyNotifications.fire({
        show: true,
        icon: "error",
        title: "Error",
        msg: "Please Select Level C to Remove",
        is_button_show: true,
      });
      // console.log("List is empty");
    }
  };

  componentDidMount() {
    this.getBrandLst();
    this.getGroupLst();
    this.getSubGroupLst();
    this.getCategoryLst();
    this.getSubCategoryLst();
    this.getPackageLst();
    this.getUnitLst();
    this.getLevelALst();
    this.getLevelBLst();
    this.getLevelCLst();
    // this.handleMethodUsed();
    // window.addEventListener("resize", this.detectHW);
    // const l_A = getUserControlData("is_level_a", this.props.userControl);

    // this.setState({ levelA: l_A });
    // const l_B = getUserControlData("is_level_b", this.props.userControl);

    // this.setState({ levelB: l_B });
    // const l_C = getUserControlData("is_level_c", this.props.userControl);

    // this.setState({ levelC: l_C });

    this.getUserControlLevelFromRedux();

    // alt key button disabled start
    window.addEventListener("keydown", this.handleAltKeyDisable);
    // alt key button disabled end
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

  componentWillUnmount() {
    window.removeEventListener("resize", this.detectHW);
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

  pageReload = () => {
    this.componentDidMount();
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

  render() {
    const {
      brandModalShow,
      brandInitVal,
      brandList,
      groupInitVal,
      groupModalShow,
      groupList,
      categoryInitVal,
      categoryModalShow,
      categoryList,
      subCategoryInitVal,
      subCategoryModalShow,
      subCategoryList,
      packageInitVal,
      packageModalShow,
      packageList,
      unitInitVal,
      unitModalShow,
      unitList,
      selectedBrands,
      selectedGroups,
      selectedCategories,
      selectedSubCategories,
      selectedPackages,
      selectedUnits,
      levelAInitVal,
      levelBInitVal,
      levelCInitVal,
      levelAModalShow,
      levelBModalShow,
      levelCModalShow,
      selectedLevelA,
      selectedLevelB,
      selectedLevelC,
      levelAList,
      levelBList,
      levelCList,
      levelA,
      levelB,
      levelC,
      method_used,
      ABC_flag_value,
      subgroupModalShow,
      subgroupInitVal,
      subgroupList,
      selectedsubGroups,
      errorArrayBorderUnit,
      errorArrayBorderPack,
      errorArrayBorderBrand,
      errorArrayBorderGroup,
      errorArrayBorderSubGroup,
      errorArrayBorderCategory,
      errorArrayBorderSubCategory,
      errorArrayBorderLevelA,
      errorArrayBorderLevelB,
      errorArrayBorderLevelC,
    } = this.state;
    return (
      <>
        <div className="catlog-form-styles d-flex">
          {/* brand */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      className="rowPlusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "create",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.brandModalShow(true);
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
                      <FontAwesomeIcon icon={faPlus} className="plus-color" />
                      {/* <img src={plus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    Brand
                  </th>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      disabled={selectedBrands.length === 0 ? true : false}
                      className="rowMinusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "delete",
                            this.props.userPermissions
                          )
                        ) {
                          // console.log("brand minus clicked");
                          e.preventDefault();
                          this.deleteBrands(selectedBrands);
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
                      <FontAwesomeIcon icon={faMinus} className="minus-color" />
                      {/* <img src={minus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {brandList.map((bv, bi) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handleBrandFetchData(bv.id);
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
                        <Form.Check
                          inline
                          label={bv.brandName}
                          name="brands"
                          type="checkbox"
                          value={bv.id}
                          id={`inline-brand${bv.id}-1`}
                          checked={
                            selectedBrands.includes(bv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addBrandSelection(bv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* group */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      className="rowPlusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "create",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.groupModalShow(true);
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
                      <FontAwesomeIcon icon={faPlus} className="plus-color" />
                      {/* <img src={plus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    Group
                  </th>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      disabled={selectedGroups.length === 0 ? true : false}
                      className="rowMinusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "delete",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.deleteGroups(selectedGroups);
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
                      <FontAwesomeIcon icon={faMinus} className="minus-color" />
                      {/* <img src={minus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupList.map((gv, gi) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                            // if (
                            //   isActionExist(
                            //     "group",
                            //     "edit",
                            //     this.props.userPermissions
                            //   )
                          ) {
                            this.handleGroupFetchData(gv.id);
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
                        <Form.Check
                          inline
                          label={gv.groupName}
                          name="group"
                          type="checkbox"
                          id={`inline-group${gv.id}-1`}
                          checked={
                            selectedGroups.includes(gv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addGroupSelection(gv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {/*sub group */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      className="rowPlusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "create",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.subgroupModalShow(true);
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
                      <FontAwesomeIcon icon={faPlus} className="plus-color" />
                      {/* <img src={plus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    Sub Group
                  </th>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      disabled={selectedsubGroups.length === 0 ? true : false}
                      className="rowMinusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "delete",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.deleteSubGroups(selectedsubGroups);
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
                      <FontAwesomeIcon icon={faMinus} className="minus-color" />
                      {/* <img src={minus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {subgroupList.map((sgv, gi) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                            // if (
                            //   isActionExist(
                            //     "group",
                            //     "edit",
                            //     this.props.userPermissions
                            //   )
                          ) {
                            this.handleSubGroupFetchData(sgv.id);
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
                        <Form.Check
                          inline
                          label={sgv.subgroupName}
                          name="subgroup"
                          type="checkbox"
                          id={`inline-subgroup${sgv.id}-1`}
                          checked={
                            selectedsubGroups.includes(sgv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addsubGroupSelection(sgv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {/* category */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      className="rowPlusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "create",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          // console.warn("rahul::category btn clicked");
                          this.categoryModalShow(true);
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
                      <FontAwesomeIcon icon={faPlus} className="plus-color" />
                      {/* <img src={plus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      disabled={selectedCategories.length === 0 ? true : false}
                      className="rowMinusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "delete",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.deleteCategories(selectedCategories);
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
                      <FontAwesomeIcon icon={faMinus} className="minus-color" />
                      {/* <img src={minus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryList.map((cv, ci) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          // if (
                          //   isActionExist(
                          //     "category",
                          //     "edit",
                          //     this.props.userPermissions
                          //   )
                          if (
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handleCategoryFetchData(cv.id);
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
                        <Form.Check
                          inline
                          label={cv.categoryName}
                          name="categories"
                          type="checkbox"
                          id={`inline-category${cv.id}-1`}
                          checked={
                            selectedCategories.includes(cv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addCategorySelection(cv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* sub category */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th style={{ width: "20px" }}>
                    <Button
                      className="rowPlusBtn"
                      onClick={(e) => {
                        e.preventDefault();
                        this.subCategoryModalShow(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} className="plus-color" />
                    </Button>
                  </th>
                  <th
                    className="text-center th-width"
                    style={{ width: "260px" }}
                  >
                    Sub category
                  </th>
                  <th style={{ width: "20px" }}>
                    <Button
                      disabled={
                        selectedSubCategories.length === 0 ? true : false
                      }
                      className="rowMinusBtn"
                      onClick={(e) => {
                        e.preventDefault();
                        // console.log("subcategory remove clicked");
                        this.deleteSubCategories(selectedSubCategories);
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} className="minus-color" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {subCategoryList.map((scv, sci) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          if (
                            isActionExist(
                              "sub-category",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handleSubCategoryFetchData(scv.id);
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
                        <Form.Check
                          inline
                          label={scv.subcategoryName}
                          name="subcategories"
                          type="checkbox"
                          id={`inline-subcategory${scv.id}-1`}
                          checked={
                            selectedSubCategories.includes(scv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addSubCategorySelection(
                              scv.id,
                              e.target.checked
                            );
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* package */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      className="rowPlusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "create",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.packageModalShow(true);
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
                      <FontAwesomeIcon icon={faPlus} className="plus-color" />
                      {/* <img src={plus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    Package
                  </th>{" "}
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      disabled={selectedPackages.length === 0 ? true : false}
                      className="rowMinusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "delete",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.deletePackages(selectedPackages);
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
                      <FontAwesomeIcon icon={faMinus} className="minus-color" />
                      {/* <img src={minus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {packageList.map((pv, pi) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          // if (
                          //   isActionExist(
                          //     "package",
                          //     "edit",
                          //     this.props.userPermissions
                          //   )
                          if (
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handlePackageFetchData(pv.id);
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
                        <Form.Check
                          inline
                          label={pv.name}
                          name="packages"
                          type="checkbox"
                          id={`inline-pkg${pv.id}-1`}
                          checked={
                            selectedPackages.includes(pv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addPackageSelection(pv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* unit */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      className="rowPlusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "create",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.unitModalShow(true);
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
                      <FontAwesomeIcon icon={faPlus} className="plus-color" />
                      {/* <img src={plus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    Unit
                  </th>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    <Button
                      disabled={selectedUnits.length === 0 ? true : false}
                      className="rowMinusBtn"
                      onClick={(e) => {
                        if (
                          isActionExist(
                            "catlog",
                            "delete",
                            this.props.userPermissions
                          )
                        ) {
                          e.preventDefault();
                          this.deleteUnits(selectedUnits);
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
                      <FontAwesomeIcon icon={faMinus} className="minus-color" />
                      {/* <img src={minus_img} alt="" className=" " /> */}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {unitList.map((uv, ui) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          if (
                            // isActionExist(
                            //   "package",
                            //   "edit",
                            //   this.props.userPermissions
                            // )
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handleUnitFetchData(uv.id);
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
                        <Form.Check
                          inline
                          label={uv.unitName}
                          name="units"
                          type="checkbox"
                          id={`inline-unit${uv.id}-1`}
                          checked={
                            selectedUnits.includes(uv.id) == true ? true : false
                          }
                          onChange={(e) => {
                            this.addUnitSelection(uv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* Level A */}

          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    {isUserControl("is_level_a", this.props.userControl) ? (
                      <Button
                        className="rowPlusBtn"
                        onClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "create",
                              this.props.userPermissions
                            )
                          ) {
                            e.preventDefault();
                            this.levelAModalShow(true);
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
                        <FontAwesomeIcon icon={faPlus} className="plus-color" />
                        {/* <img src={plus_img} alt="" className=" " /> */}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    {isUserControl("is_level_a", this.props.userControl)
                      ? levelA["label"]
                      : ""}
                  </th>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    {isUserControl("is_level_a", this.props.userControl) ? (
                      <Button
                        disabled={selectedLevelA.length === 0 ? true : false}
                        className="rowMinusBtn"
                        onClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "delete",
                              this.props.userPermissions
                            )
                          ) {
                            e.preventDefault();
                            this.deleteLevelA(selectedLevelA);
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
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="minus-color"
                        />
                        {/* <img src={minus_img} alt="" className=" " /> */}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {levelAList.map((uv, ui) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          if (
                            // isActionExist(
                            //   "levela",
                            //   "edit",
                            //   this.props.userPermissions
                            // )
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handleLevelAFetchData(uv.id);
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
                        <Form.Check
                          inline
                          label={uv.levelName}
                          name="levela"
                          type="checkbox"
                          id={`inline-levela${uv.id}-1`}
                          checked={
                            selectedLevelA.includes(uv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addLevelASelection(uv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* Level B */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    {" "}
                    {isUserControl("is_level_b", this.props.userControl) ? (
                      <Button
                        className="rowPlusBtn"
                        onClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "create",
                              this.props.userPermissions
                            )
                          ) {
                            e.preventDefault();
                            this.levelBModalShow(true);
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
                        <FontAwesomeIcon icon={faPlus} className="plus-color" />
                        {/* <img src={plus_img} alt="" className=" " /> */}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    {isUserControl("is_level_b", this.props.userControl)
                      ? levelB["label"]
                      : ""}
                  </th>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    {isUserControl("is_level_b", this.props.userControl) ? (
                      <Button
                        disabled={selectedLevelB.length === 0 ? true : false}
                        className="rowMinusBtn"
                        onClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "delete",
                              this.props.userPermissions
                            )
                          ) {
                            e.preventDefault();
                            this.deleteLevelB(selectedLevelB);
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
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="minus-color"
                        />
                        {/* <img src={minus_img} alt="" className=" " /> */}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {levelBList.map((uv, ui) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          if (
                            // isActionExist(
                            //   "levelb",
                            //   "edit",
                            //   this.props.userPermissions
                            // )
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handleLevelBFetchData(uv.id);
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
                        <Form.Check
                          inline
                          label={uv.levelName}
                          name="levelb"
                          type="checkbox"
                          id={`inline-levelb${uv.id}-1`}
                          checked={
                            selectedLevelB.includes(uv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addLevelBSelection(uv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

          {/* Level C */}
          <div className="col-table-style">
            <Table
              className={`${ABC_flag_value == "A"
                ? "level-A-table"
                : ABC_flag_value == "AB"
                  ? "level-AB-table"
                  : ABC_flag_value == "ABC"
                    ? "level-ABC-table"
                    : "no-level-table"
                }`}
            >
              <thead
                style={{
                  borderBottom: "2px solid transparent",
                }}
              >
                <tr>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    {isUserControl("is_level_c", this.props.userControl) ? (
                      <Button
                        className="rowPlusBtn"
                        onClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "create",
                              this.props.userPermissions
                            )
                          ) {
                            e.preventDefault();
                            this.levelCModalShow(true);
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
                        <FontAwesomeIcon icon={faPlus} className="plus-color" />
                        {/* <img src={plus_img} alt="" className=" " /> */}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </th>
                  <th
                    className="text-center th-width"
                    style={{
                      width: "260px",
                    }}
                  >
                    {isUserControl("is_level_c", this.props.userControl)
                      ? levelC["label"]
                      : ""}
                  </th>
                  <th
                    style={{
                      width: "20px",
                    }}
                  >
                    {isUserControl("is_level_c", this.props.userControl) ? (
                      <Button
                        disabled={selectedLevelC.length === 0 ? true : false}
                        className="rowMinusBtn"
                        onClick={(e) => {
                          if (
                            isActionExist(
                              "catlog",
                              "delete",
                              this.props.userPermissions
                            )
                          ) {
                            e.preventDefault();
                            this.deleteLevelC(selectedLevelC);
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
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="minus-color"
                        />
                        {/* <img src={minus_img} alt="" className=" " /> */}
                      </Button>
                    ) : (
                      <></>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {levelCList.map((uv, ui) => {
                  return (
                    <tr>
                      <td
                        colSpan={4}
                        onDoubleClick={(e) => {
                          if (
                            // isActionExist(
                            //   "levelc",
                            //   "edit",
                            //   this.props.userPermissions
                            // )
                            isActionExist(
                              "catlog",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.handleLevelCFetchData(uv.id);
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
                        <Form.Check
                          inline
                          label={uv.levelName}
                          name="levelc"
                          type="checkbox"
                          id={`inline-levelc${uv.id}-1`}
                          checked={
                            selectedLevelC.includes(uv.id) == true
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            this.addLevelCSelection(uv.id, e.target.checked);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>

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
                {levelAInitVal.id === "" ? "Add New" : "Update"}{" "}
                {levelA["label"]}
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
              innerRef={this.FormRef}
              enableReinitialize={true}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.levelName == "") {
                  errorArray.push("x");
                } else {
                  errorArray.push("");
                }
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
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                  resetForm();
                                  this.levelAModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("levelName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                                    // msg: res.message,
                                    msg: levelA["label"] + " updated successfully",
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                  resetForm();
                                  this.levelAModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("levelName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
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
                              // borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            // className="modal_text_box"
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
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
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
                                if (e.target.value.trim() !== "") {
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
                          />
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
                          this.FormRef.current.handleSubmit();
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
                {levelBInitVal.id === "" ? "Add New" : "Update"}{" "}
                {levelB["label"]}
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
              innerRef={this.FormRef}
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
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                  resetForm();
                                  this.levelBModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("levelName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                                    // msg: res.message,
                                    msg: levelB["label"] + " updated successfully",
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                  resetForm();
                                  this.levelBModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("levelName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
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
                              // borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            // className="modal_text_box"
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
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
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
                                if (e.target.value.trim() !== "") {
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
                          this.FormRef.current.handleSubmit();
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
                {levelCInitVal.id === "" ? "Add New" : "Update"}{" "}
                {levelC["label"]}
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
              innerRef={this.FormRef}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.levelName == "") {
                  errorArray.push("z");
                } else {
                  errorArray.push("");
                }
                this.setState({ errorArrayBorderLevelC: errorArray }, () => {
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
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                  resetForm();
                                  this.levelCModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("levelName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                                    // msg: res.message,
                                    msg: levelC["label"] + " updated successfully",
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                  resetForm();
                                  this.levelCModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("levelName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
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
                              // borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            // className="modal_text_box"
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
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "levelName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("levelC_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "levelName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("levelC_submit_btn")
                                    .focus();
                                }
                              }
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
                          this.FormRef.current.handleSubmit();
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
              innerRef={this.FormRef}
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
                                  resetForm();
                                  this.unitModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("unitName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                                    delay: 1000,
                                  });
                                  resetForm();
                                  this.unitModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("unitName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 border-0">
                    <Row className="justify-content-center p-3">
                      <Col md="5">
                        <Form.Group>
                          <Form.Control
                            style={{
                              // borderColor: "#ced4da",
                              backgroundImage: "none",
                            }}
                            // className="modal_text_box"
                            type="text"
                            autoFocus="true"
                            placeholder="Unit Name"
                            name="unitName"
                            id="unitName"
                            onChange={handleChange}
                            value={values.unitName}
                            isValid={touched.unitName && !errors.unitName}
                            isInvalid={!!errors.unitName}
                            className={`${values.unitName == "" &&
                              errorArrayBorderUnit[0] == "w"
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "unitName",
                                    e.target.value
                                  );
                                  this.selectRefA.current?.focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "unitName",
                                    e.target.value
                                  );
                                  this.selectRefA.current?.focus();
                                }
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md="7">
                        <Form.Group
                          style={{
                            border: "1px solid #dcdcdc",
                            borderRadius: "4px",
                          }}
                          className={`${values.unitCode == "" &&
                            errorArrayBorderUnit[1] == "w"
                            ? "border border-danger selectTo"
                            : "selectTo"
                            }`}
                          onKeyDown={(e) => {
                            if (e.shiftKey && e.keyCode === 9) {
                              if (
                                values.unitCode === "" ||
                                values.unitCode === null
                              ) {
                                this.setErrorBorder(
                                  1,
                                  "w",
                                  "errorArrayBorderUnit"
                                );
                              } else {
                                this.setErrorBorder(
                                  1,
                                  "",
                                  "errorArrayBorderUnit"
                                );
                              }
                            } else if (e.keyCode === 9) {
                              e.preventDefault();
                              if (
                                values.unitCode !== "" &&
                                values.unitCode !== null
                              ) {
                                document
                                  .getElementById("unit_submit_btn")
                                  .focus();
                              }
                            } else if (e.keyCode === 13) {
                              if (
                                values.unitCode !== "" &&
                                values.unitCode !== null
                              ) {
                                document
                                  .getElementById("unit_submit_btn")
                                  .focus();
                              }
                            }
                          }}
                        >
                          <Select
                            ref={this.selectRefA}
                            className="selectTo unitpopup"
                            id="unitCode"
                            placeholder="Unit Code"
                            // styles={customStyles}
                            styles={createPro}
                            isClearable
                            options={uomoption}
                            name="unitCode"
                            onChange={(value) => {
                              setFieldValue("unitCode", value);
                            }}
                            value={values.unitCode}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="unit_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.FormRef.current.handleSubmit();
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
              <Modal.Title>
                {packageInitVal.id === "" ? "Add New" : "Update"} Package
              </Modal.Title>
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
              innerRef={this.FormRef}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.packageName == "") {
                  errorArray.push("v");
                } else {
                  errorArray.push("");
                }
                this.setState({ errorArrayBorderPack: errorArray }, () => {
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
                          requestData.append(
                            "packing_name",
                            values.packageName
                          );

                          if (values.id == "") {
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
                                  resetForm();
                                  this.packageModalShow(false);
                                  this.pageReload();
                                } else {
                                  document
                                    .getElementById("packageName")
                                    .focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            updatePacking(requestData)
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
                                  this.packageModalShow(false);
                                  this.pageReload();
                                } else {
                                  document
                                    .getElementById("packageName")
                                    .focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            // className="modal_text_box"
                            type="text"
                            placeholder="Package Name"
                            name="packageName"
                            id="packageName"
                            autoFocus="true"
                            onChange={handleChange}
                            value={values.packageName}
                            isValid={touched.packageName && !errors.packageName}
                            isInvalid={!!errors.packageName}
                            className={`${values.packageName == "" &&
                              errorArrayBorderPack[0] == "v"
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "packageName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("pkg_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "packageName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("pkg_submit_btn")
                                    .focus();
                                }
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
                      id="pkg_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.FormRef.current.handleSubmit();
                        }
                      }}
                    >
                      {packageInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
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
          </Modal>

          {/* SubCategory Modal */}
          <Modal
            show={subCategoryModalShow}
            size="md"
            className="modal-style"
            onHide={() => this.subCategoryModalShow(false)}
            dialogClassName="modal-400w"
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>
                {subCategoryInitVal.id === "" ? "Add New" : "Update"}{" "}
                Subcategory
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.subCategoryModalShow(false)}
              />
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={subCategoryInitVal}
              enableReinitialize={true}
              innerRef={this.FormRef}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.subCategoryName == "") {
                  errorArray.push("u");
                } else {
                  errorArray.push("");
                }
                this.setState({ errorArrayBorderGroup: errorArray }, () => {
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
                          requestData.append(
                            "subCategoryName",
                            values.subCategoryName
                          );

                          if (values.id == "") {
                            createSubCategory(requestData)
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
                                  this.subCategoryModalShow(false);
                                  this.pageReload();
                                } else {
                                  document
                                    .getElementById("subCategoryName")
                                    .focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            updateSubCategory(requestData)
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
                                  this.subCategoryModalShow(false);
                                  this.pageReload();
                                } else {
                                  document
                                    .getElementById("subCategoryName")
                                    .focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            // className="modal_text_box"
                            type="text"
                            placeholder="Flavour Name"
                            name="subCategoryName"
                            autoFocus="true"
                            id="subCategoryName"
                            onChange={handleChange}
                            value={values.subCategoryName}
                            isValid={
                              touched.subCategoryName && !errors.subCategoryName
                            }
                            isInvalid={!!errors.subCategoryName}
                            className={`${values.subCategoryName == "" &&
                              errorArrayBorderGroup[0] == "u"
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "subCategoryName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("subCat_submit_btn")
                                    .focus();
                                }
                              }
                              if (e.keyCode === 13) {
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "subCategoryName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("subCat_submit_btn")
                                    .focus();
                                }
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="subCat_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.FormRef.current.handleSubmit();
                        }
                      }}
                    >
                      {subCategoryInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      // className="mdl-cancel-btn"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        this.subCategoryModalShow(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.subCategoryModalShow(false);
                        }
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
              <Modal.Title>
                {categoryInitVal.id === "" ? "Add New" : "Update"} Category
              </Modal.Title>
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
              innerRef={this.FormRef}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.categoryName == "") {
                  errorArray.push("u");
                } else {
                  errorArray.push("");
                }
                this.setState({ errorArrayBorderCategory: errorArray }, () => {
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
                          requestData.append(
                            "categoryName",
                            values.categoryName
                          );

                          if (values.id == "") {
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
                                  resetForm();
                                  this.categoryModalShow(false);
                                  this.pageReload();
                                } else {
                                  document
                                    .getElementById("categoryName")
                                    .focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            updateCategory(requestData)
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
                                  this.categoryModalShow(false);
                                  this.pageReload();
                                } else {
                                  document
                                    .getElementById("categoryName")
                                    .focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            // className="modal_text_box"
                            type="text"
                            placeholder="Category Name"
                            name="categoryName"
                            id="categoryName"
                            autoFocus="true"
                            onChange={handleChange}
                            value={values.categoryName}
                            isValid={
                              touched.categoryName && !errors.categoryName
                            }
                            isInvalid={!!errors.categoryName}
                            className={`${values.categoryName == "" &&
                              errorArrayBorderCategory[0] == "u"
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();

                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "categoryName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("cat_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "categoryName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("cat_submit_btn")
                                    .focus();
                                }
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="cat_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.FormRef.current.handleSubmit();
                        }
                      }}
                    >
                      {categoryInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
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
              <Modal.Title>
                {groupInitVal.id === "" ? "Add New" : "Update"} Group
              </Modal.Title>
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
              innerRef={this.FormRef}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.groupName == "") {
                  errorArray.push("t");
                } else {
                  errorArray.push("");
                }
                this.setState({ errorArrayBorderGroup: errorArray }, () => {
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
                          requestData.append("groupName", values.groupName);

                          if (values.id == "") {
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
                                  resetForm();
                                  this.groupModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("groupName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            updateGroup(requestData)
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
                                  this.groupModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("groupName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            // className="modal_text_box"
                            type="text"
                            placeholder="Group Name"
                            name="groupName"
                            autoFocus="true"
                            id="groupName"
                            onChange={handleChange}
                            value={values.groupName}
                            isValid={touched.groupName && !errors.groupName}
                            isInvalid={!!errors.groupName}
                            className={`${values.groupName == "" &&
                              errorArrayBorderGroup[0] == "t"
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "groupName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("group_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "groupName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("group_submit_btn")
                                    .focus();
                                }
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="group_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.FormRef.current.handleSubmit();
                        }
                      }}
                    >
                      {groupInitVal.id === "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
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
          </Modal>

          {/* Sub Group Modal */}
          <Modal
            show={subgroupModalShow}
            size="md"
            className="modal-style"
            onHide={() => this.subgroupModalShow(false)}
            dialogClassName="modal-400w"
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>
                {subgroupInitVal.id === "" ? "Add New" : "Update"} Subgroup
              </Modal.Title>
              <CloseButton
                className="pull-right"
                onClick={() => this.subgroupModalShow(false)}
              />
            </Modal.Header>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={subgroupInitVal}
              enableReinitialize={true}
              innerRef={this.FormRef}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.subgroupName == "") {
                  errorArray.push("s");
                } else {
                  errorArray.push("");
                }
                this.setState({ errorArrayBorderSubGroup: errorArray }, () => {
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
                          requestData.append(
                            "subgroupName",
                            values.subgroupName
                          );

                          if (values.id == "") {
                            createSubGroup(requestData)
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
                                  this.subgroupModalShow(false);
                                  this.pageReload();
                                } else {
                                  document
                                    .getElementById("subgroupName")
                                    .focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            updatesubGroup(requestData)
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
                                  this.subgroupModalShow(false);
                                  this.pageReload();
                                } else {
                                  document
                                    .getElementById("subgroupName")
                                    .focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            // className="modal_text_box"
                            type="text"
                            placeholder="Sub Group Name"
                            name="subgroupName"
                            autoFocus="true"
                            id="subgroupName"
                            onChange={handleChange}
                            value={values.subgroupName}
                            isValid={
                              touched.subgroupName && !errors.subgroupName
                            }
                            isInvalid={!!errors.subgroupName}
                            className={`${values.subgroupName == "" &&
                              errorArrayBorderSubGroup[0] == "s"
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "subgroupName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("subgroup_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (e.target.value.trim()) {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "subgroupName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("subgroup_submit_btn")
                                    .focus();
                                }
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="subgroup_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.FormRef.current.handleSubmit();
                        }
                      }}
                    >
                      {subgroupInitVal.id === "" ? "Submit" : "Update"}
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
              <Modal.Title>
                {brandInitVal.id == "" ? "Add New" : "Update"} Brand
              </Modal.Title>
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
              innerRef={this.FormRef}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                let errorArray = [];
                if (values.brandName == "") {
                  errorArray.push("s");
                } else {
                  errorArray.push("");
                }
                this.setState({ errorArrayBorderBrand: errorArray }, () => {
                  if (allEqual(errorArray)) {
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

                          if (values.id == "") {
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
                                  resetForm();
                                  this.brandModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("brandName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
                                  });
                                }
                              })
                              .catch((error) => { });
                          } else {
                            requestData.append("id", values.id);
                            updateBrand(requestData)
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
                                  this.brandModalShow(false);
                                  this.pageReload();
                                } else {
                                  document.getElementById("brandName").focus();
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "error",
                                    title: "Error",
                                    msg: res.message,
                                    is_button_show: true,
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
                    if (e.keyCode === 13) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Modal.Body className=" p-0 pt-2 pb-4 border-0">
                    <Row className="justify-content-center">
                      <Col md="11">
                        <Form.Group>
                          <Form.Control
                            // className="modal_text_box"
                            type="text"
                            autoFocus="true"
                            placeholder="Brand Name"
                            name="brandName"
                            id="brandName"
                            onChange={handleChange}
                            value={values.brandName}
                            isValid={touched.brandName && !errors.brandName}
                            isInvalid={!!errors.brandName}
                            className={`${values.brandName == "" &&
                              errorArrayBorderBrand[0] == "s"
                              ? "border border-danger modal_text_box"
                              : "modal_text_box"
                              }`}
                            onKeyDown={(e) => {
                              if (e.keyCode === 9) {
                                e.preventDefault();
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "brandName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("brand_submit_btn")
                                    .focus();
                                }
                              } else if (e.keyCode === 13) {
                                if (e.target.value.trim() !== "") {
                                  handlesetFieldValue(
                                    setFieldValue,
                                    "brandName",
                                    e.target.value,
                                    true
                                  );
                                  document
                                    .getElementById("brand_submit_btn")
                                    .focus();
                                }
                              }
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer className="border-0">
                    <Button
                      id="brand_submit_btn"
                      className="successbtn-style"
                      type="submit"
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.FormRef.current.handleSubmit();
                        }
                      }}
                    >
                      {brandInitVal.id == "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
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
          </Modal>
        </div>
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

export default connect(mapStateToProps, mapActionsToProps)(Catlog);
