import React, { Component } from "react";
import { Row, Col, Form, Modal, CloseButton, Button } from "react-bootstrap";
import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  ShowNotification,
  calculatePercentage,
  AuthenticationCheck,
  customStyles,
  MyDatePicker,
  customStylesWhite,
  MyNotifications,
  isActionExist,
} from "@/helpers";
import {
  getMstPackageList,
  getAllUnit,
  createPacking,
  getPackings,
  createUnit,
} from "@/services/api_functions";
import UnitLevel from "./UnitLevel";
import UnitSelect from "./UnitSelect";

const uomoption = [
  { label: "BAG", value: "Services" },
  { label: "BAL", value: "BAL" },
  { label: "BDL", value: "BDL" },
  { label: "BKL", value: "BKL" },
  { label: "BOU", value: "BOU" },
  { label: "BOX", value: "BOX" },
  { label: "BTL", value: "BTL" },
  { label: "BUN", value: "BUN" },
  { label: "CAN", value: "CAN" },
  { label: "CBM", value: "CBM" },
  { label: "CCM", value: "CCM" },
  { label: "CMS", value: "CMS" },
  { label: "CTN", value: "CTN" },
  { label: "DOZ", value: "DOZ" },
  { label: "DRM", value: "DRM" },
  { label: "GGK", value: "GGK" },
  { label: "GMS", value: "GMS" },
  { label: "GRS", value: "GRS" },
  { label: "GYD", value: "GYD" },
  { label: "KGS", value: "KGS" },
  { label: "KLR", value: "KLR" },
  { label: "KME", value: "KME" },
  { label: "MLT", value: "MLT" },
  { label: "MTR", value: "MTR" },
  { label: "MTS", value: "MTS" },
  { label: "NOS", value: "NOS" },
  { label: "PAC", value: "PAC" },
  { label: "PCS", value: "PCS" },
  { label: "PRS", value: "PRS" },
  { label: "QTL", value: "QTL" },
  { label: "ROL", value: "ROL" },
  { label: "SET", value: "SET" },
  { label: "SQF", value: "SQF" },
  { label: "SQM", value: "SQM" },
  { label: "TBS", value: "TBS" },
  { label: "TGM", value: "TGM" },
  { label: "THD", value: "THD" },
  { label: "TON", value: "TON" },
  { label: "TUB", value: "TUB" },
  { label: "UGS", value: "UGS" },
  { label: "UNT", value: "UNT" },
  { label: "YDS", value: "YDS" },
  { label: "OTH", value: "OTH" },
];

export default class Packaging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packageOpts: [],
      unitLst: [],
      pkgModalShow: false,
      unitModalShow: false,
    };
  }

  getMstPackageOptions = () => {
    getMstPackageList()
      .then((response) => {
        let data = response.data;
        if (data.responseStatus == 200) {
          let opts = data.list.map((v) => {
            return { label: v.name, value: v.id, ...v };
          });
          this.setState({ packageOpts: opts });
        } else {
          this.setState({ packageOpts: [] });
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
          if (data.length > 0) {
            this.setState({ getunittable: data });
          }
        }
      })
      .catch((error) => {});
  };

  handelunitModalShow = (status) => {
    console.log("in model");
    this.setState({ unitModalShow: status });
  };
  handelpkgModalShow = (status) => {
    console.log("in model");
    this.setState({ pkgModalShow: status });
  };
  lstUnit = () => {
    getAllUnit()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          if (data.length > 0) {
            let Opt = data.map(function (values) {
              return { value: values.id, label: values.unitCode, ...values };
            });
            this.setState({ unitLst: Opt });
          }
        }
      })
      .catch((error) => {});
  };
  componentDidMount() {
    this.getMstPackageOptions();
    this.lstUnit();
  }

  handlePackageUnit = (unitIndex, mstPackageIndex, element, value) => {
    let { mstPackaging, handleMstPackageState } = this.props;
    mstPackaging[mstPackageIndex]["units"][unitIndex][element] = value;

    handleMstPackageState(mstPackaging);
  };

  getPackageUnit = (unitIndex, mstPackageIndex, element) => {
    let { mstPackaging } = this.props;

    return mstPackaging
      ? mstPackaging[mstPackageIndex]["units"][unitIndex][element]
      : "";
  };

  handleUnitElement = (mstPackageIndex, element, value) => {
    let { mstPackaging, handleMstPackageState } = this.props;
    mstPackaging[mstPackageIndex][element] = value;
    handleMstPackageState(mstPackaging);
  };

  getUnitElement = (mstPackageIndex, element) => {
    let { mstPackaging } = this.props;

    return mstPackaging ? mstPackaging[mstPackageIndex][element] : "";
  };
  lstPackings = () => {
    getPackings()
      .then((response) => {
        let res = response.data;
        console.log("res", res);
        if (res.responseStatus == 200) {
          let data = res.list;
          if (data.length > 0) {
            this.setState({ getpactable: data });
          }
        }
      })
      .catch((error) => {});
  };

  // let { mstUnits, mstPackaging } = this.state;

  // this.setState({ mstUnits: fUnits }, () => {
  //   this.setInitPackagingAfterUnitChanges();
  // });
  handleUnitCount = (value, mstPackageIndex) => {
    let { mstPackaging, handleMstPackageState } = this.props;

    mstPackaging = mstPackaging.map((v, i) => {
      if (i == mstPackageIndex) {
        let blankcnt = parseInt(value) - v.units.length;
        let fUnits = [...v.units];
        if (blankcnt > 0) {
          for (let index = 0; index < blankcnt; index++) {
            let single_unit = {
              details_id: 0,
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
            };
            fUnits.push(single_unit);
          }
          // let narr = new Array(blankcnt).fill(single_unit).map((v) => v);
          // console.log("narr", narr);
          // fUnits = [...v.units, ...narr];
        } else if (blankcnt < 0) {
          fUnits = fUnits.splice(0, value);
        }
        v.units = fUnits;
      }
      return v;
    });

    handleMstPackageState(mstPackaging);
  };
  render() {
    let {
      mstPackage,
      mstPackageIndex,
      handleRemovePackaging,
      handlePackageChange,
      getPackageSelected,
      mstUnits,

      is_packaging,
    } = this.props;
    let { packageOpts, unitLst, pkgModalShow, unitModalShow } = this.state;

    return (
      <>
        <div className="mt-5 row-border px-3">
          <Row className="mb-4 pkg-row">
            <div className="pkg-div">
              <h6 className="title-style">
                {is_packaging && is_packaging == true ? "Packaging" : "Units"}
              </h6>
            </div>
            {is_packaging && is_packaging == true && (
              <>
                <Col md={1} xs={1}>
                  <Form.Label className="float-end">
                    Package :
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        this.handelpkgModalShow(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        class="bi bi-plus-square-dotted svg-style"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                      </svg>{" "}
                    </a>
                  </Form.Label>
                </Col>
                <Col md={2} xs={3}>
                  <Select
                    className="selectTo"
                    isClearable={true}
                    styles={customStylesWhite}
                    placeholder="Select"
                    onChange={(v, action) => {
                      if (action.action == "clear") {
                        handlePackageChange(mstPackageIndex, "");
                      } else {
                        handlePackageChange(mstPackageIndex, v);
                      }
                    }}
                    options={packageOpts}
                    value={getPackageSelected(mstPackageIndex)}
                  />
                  <span className="text-danger"></span>
                </Col>
              </>
            )}

            <Col md={1} xs={1} className="text-center mt-2">
              <Form.Group>
                <Form.Label className="float-end">
                  Unit
                  <a
                    href="#."
                    onClick={(e) => {
                      e.preventDefault();
                      this.handelunitModalShow(true);
                    }}
                  >
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      class="bi bi-plus-square-dotted svg-style"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>{" "} */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      class="bi bi-plus-square-dotted svg-style"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>{" "}
                  </a>
                </Form.Label>
              </Form.Group>
            </Col>

            <Col md={1} xs={1} className="text-center mt-2">
              <Form.Group>
                <Form.Check
                  inline
                  label="Single Unit"
                  name={`is_multi_unit_${mstPackageIndex}`}
                  type={"radio"}
                  id={`sigle_unit_${mstPackageIndex}`}
                  checked={mstPackage.is_multi_unit == false ? true : false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      this.handleUnitElement(
                        mstPackageIndex,
                        "is_multi_unit",
                        false
                      );
                      this.handleUnitElement(mstPackageIndex, "unitCount", 1);
                      this.handleUnitCount(1, mstPackageIndex);
                    } else {
                      this.handleUnitElement(
                        mstPackageIndex,
                        "is_multi_unit",
                        true
                      );
                    }
                  }}
                  value={this.getUnitElement(mstPackageIndex, "is_multi_unit")}
                />
              </Form.Group>
            </Col>

            <Col md={1} xs={1} className="text-center mt-2">
              <Form.Group>
                <Form.Check
                  inline
                  label="Multi Unit"
                  name={`is_multi_unit_${mstPackageIndex}`}
                  id={`multi_unit_${mstPackageIndex}`}
                  type={"radio"}
                  checked={mstPackage.is_multi_unit == false ? false : true}
                  onChange={(e) => {
                    if (e.target.checked) {
                      this.handleUnitElement(
                        mstPackageIndex,
                        "is_multi_unit",
                        true
                      );
                      this.handleUnitCount(1, mstPackageIndex);
                    } else {
                      this.handleUnitElement(
                        mstPackageIndex,
                        "is_multi_unit",
                        false
                      );
                    }
                  }}
                  value={this.getUnitElement(mstPackageIndex, "is_multi_unit")}
                />
              </Form.Group>
            </Col>
            {this.getUnitElement(mstPackageIndex, "is_multi_unit") == true && (
              <Col className="" md="1" xs={1}>
                <Form.Control
                  type="text"
                  placeholder="No of Unit"
                  name="unitCount"
                  onChange={(e) => {
                    let v = e.target.value;
                    this.handleUnitElement(mstPackageIndex, "unitCount", v);
                    this.handleUnitCount(v, mstPackageIndex);
                  }}
                  value={this.getUnitElement(mstPackageIndex, "unitCount")}
                  style={{ background: "transparent" }}
                />
              </Col>
            )}
            {is_packaging && is_packaging == true && mstPackageIndex != 0 && (
              <Col md={7}>
                <div className="text-end ">
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemovePackaging(mstPackageIndex);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      class="bi bi-dash-square-dotted"
                      viewBox="0 0 16 16"
                      style={{ color: "black" }}
                    >
                      <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834 0h.916v-1h-.916v1zm1.833 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                    </svg>
                  </a>
                </div>
              </Col>
            )}
          </Row>

          {mstPackage.units.length > 0 &&
            mstPackage.units.map((vv, ii) => {
              return (
                <UnitLevel
                  UnitData={vv}
                  unitIndex={ii}
                  mstPackageIndex={mstPackageIndex}
                  mstUnits={unitLst}
                  handlePackageUnit={this.handlePackageUnit.bind(this)}
                  getPackageUnit={this.getPackageUnit.bind(this)}
                />
              );
            })}
        </div>

        <Modal
          show={pkgModalShow}
          size="lg"
          className="groupnewmodal mt-5 mainmodal"
          onHide={() => this.handelpkgModalShow(false)}
          dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            //closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Package
            </Modal.Title>
            <CloseButton
              // variant="white"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.handelpkgModalShow(false)}
            />
          </Modal.Header>

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              packing_name: "",
            }}
            validationSchema={Yup.object().shape({
              packing_name: Yup.string()
                .trim()
                .required("Packgae name is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();
              requestData.append("packing_name", values.packing_name);
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
                    this.lstPackings();
                    this.handelpkgModalShow(false);
                    resetForm();
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
            }) => (
              <Form onSubmit={handleSubmit} className="form-style">
                <Modal.Body className=" p-2">
                  <div className="common-form-style">
                    <Row>
                      <Col md="9">
                        <Form.Group>
                          <Form.Label>Packgae Name</Form.Label>
                          <Form.Control
                            autoFocus="true"
                            type="text"
                            placeholder="Packgae Name"
                            name="packing_name"
                            id="packing_name"
                            onChange={handleChange}
                            value={values.packing_name}
                            isValid={
                              touched.packing_name && !errors.packing_name
                            }
                            isInvalid={!!errors.packing_name}
                          />
                          {/* <Form.Control.Feedback type="invalid"> */}
                          <span className="text-danger errormsg">
                            {errors.packing_name}
                          </span>
                          {/* </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>
                      <Col md="3" className="mt-4 btn_align">
                        <Button className="createbtn mt-3" type="submit">
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal
          show={unitModalShow}
          size="lg"
          className="groupnewmodal mt-5 mainmodal"
          onHide={() => this.handelunitModalShow(false)}
          dialogClassName="modal-400w"
          // aria-labelledby="example-custom-modal-styling-title"
          aria-labelledby="contained-modal-title-vcenter"
          //centered
        >
          <Modal.Header
            //closeButton
            className="pl-1 pr-1 pt-0 pb-0 purchaseinvoicepopup"
          >
            <Modal.Title id="example-custom-modal-styling-title" className="">
              Package
            </Modal.Title>
            <CloseButton
              // variant="white"
              className="pull-right"
              //onClick={this.handleClose}
              onClick={() => this.handelunitModalShow(false)}
            />
          </Modal.Header>

          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              packing_name: "",
            }}
            validationSchema={Yup.object().shape({
              unitName: Yup.string().trim().required("Unit name is required"),
              unitCode: Yup.object().required("Unit code is required"),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              let requestData = new FormData();
              requestData.append("unitName", values.unitName);
              requestData.append("unitCode", values.unitCode.value);
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
                    this.lstUnit();
                    this.handelunitModalShow(false);
                    resetForm();
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
              <Form onSubmit={handleSubmit} className="form-style">
                <Modal.Body className=" p-2">
                  <div className="common-form-style">
                    <Row>
                      <Col md="9">
                        <Form.Group>
                          <Form.Label>Unit Name</Form.Label>
                          <Form.Control
                            autoFocus="true"
                            type="text"
                            placeholder="Unit Name"
                            name="unitName"
                            id="unitName"
                            onChange={handleChange}
                            value={values.unitName}
                            isValid={touched.unitName && !errors.unitName}
                            isInvalid={!!errors.unitName}
                          />
                          {/* <Form.Control.Feedback type="invalid"> */}
                          <span className="text-danger errormsg">
                            {errors.unitName}
                          </span>

                          {/* </Form.Control.Feedback> */}
                        </Form.Group>
                      </Col>
                      <Col md="3">
                        <Form.Group>
                          <Form.Label>Unit Code</Form.Label>
                          <Select
                            className="selectTo"
                            id="unitCode"
                            placeholder="unitCode"
                            styles={customStyles}
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
                      <Col md="3" className="mt-4 btn_align">
                        <Button className="createbtn mt-3" type="submit">
                          Save
                        </Button>
                        <Button
                          variant="secondary cancel-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            this.handelunitModalShow(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
              </Form>
            )}
          </Formik>
        </Modal>
      </>
    );
  }
}
