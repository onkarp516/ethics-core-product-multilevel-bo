import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Modal,
  CloseButton,
  Button,
  InputGroup,
} from "react-bootstrap";
import updown_arrow from "@/assets/images/updown_arrow.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
import add_btn from "@/assets/images/add_btn.svg";
import info_fill from "@/assets/images/info.svg";
import closeBtn from "@/assets/images/close_grey_icon@3x.png";
import delete_ico from "@/assets/images/delete_ico.png";
import add_blue_circle from "@/assets/images/add_circle_blue.svg";
import remove_img from "@/assets/images/remove-r.svg";
import add_new_tab from "@/assets/images/add_new_tab.svg";
import Select from "react-select";
import delete_gray from "@/assets/images/delete_gray.png";
import plus_img from "@/assets/images/plus_img.svg";
import plus_img_wt from "@/assets/images/plus_img_wt.svg";
import minus_img from "@/assets/images/minus_img.svg";
import minus_img_wt from "@/assets/images/minus_img_wt.svg";
import * as Yup from "yup";
import { Formik } from "formik";
import { ShowNotification, newRowDropdown, getSelectValue } from "@/helpers";
import {
  getMstPackageList,
  getAllUnit,
  createPacking,
  getFlavour,
  createFlavour,
} from "@/services/api_functions";

import NewPackaging from "./NewPackaging";

export default class  NewFlavour extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {}

  handleFlavourChange = (v) => {
    let {
      mstBrandIndex,
      mstGroupIndex,
      mstPackaging,
      mstCategoryIndex,
      handleMstState,
      mstSubCategoryIndex,
      mstFlavourIndex,
    } = this.props;
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"][mstSubCategoryIndex]["flavour"][mstFlavourIndex][
      "flavour_id"
    ] = v;
    handleMstState(mstPackaging);
  };
  handleAddFlavour = () => {
    let {
      mstBrandIndex,
      mstGroupIndex,
      mstPackaging,
      mstCategoryIndex,
      handleMstState,
      mstSubCategoryIndex,
      getMstFlavourOptions,
    } = this.props;
    let singl_flavour = {
      flavour_id: "",
      package: [
        {
          package_id: "",
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
              hsn_id: "",
              taxMaster_id: "",
              applicable_date: "",
            },
          ],
        },
      ],
    };
    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"][mstSubCategoryIndex]["flavour"] = [
      ...mstPackaging[mstBrandIndex]["category"][mstCategoryIndex][
        "subcategory"
      ][mstSubCategoryIndex]["flavour"],
      singl_flavour,
    ];
    handleMstState(mstPackaging);
  };

  handleRemoveFlavour = () => {
    let {
      mstBrandIndex,
      mstGroupIndex,
      mstPackaging,
      mstCategoryIndex,
      handleMstState,
      mstSubCategoryIndex,
      mstFlavourIndex,
    } = this.props;

    mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
      mstCategoryIndex
    ]["subcategory"][mstSubCategoryIndex]["flavour"] =
      mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
        mstCategoryIndex
      ]["subcategory"][mstSubCategoryIndex]["flavour"].length > 1
        ? mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
            mstCategoryIndex
          ]["subcategory"][mstSubCategoryIndex]["flavour"].filter(
            (v, i) => i != mstFlavourIndex
          )
        : mstPackaging[mstBrandIndex]["group"][mstGroupIndex]["category"][
            mstCategoryIndex
          ]["subcategory"][mstSubCategoryIndex]["flavour"];
    handleMstState(mstPackaging);
  };

  render() {
    let { flavourOpts, mstFlavour, is_flavour, mstFlavourIndex } = this.props;

    return (
      <>
        <tr>
          <td style={{ width: "21px", padding: "0px 0px 0px 10px" }}>
            {/* {is_flavour != "" && is_flavour == true && mstFlavourIndex == 0 ? ( */}
            <Button
              className="rowPlusBtn"
              onClick={(e) => {
                e.preventDefault();
                if (is_flavour != "" && is_flavour == true) {
                  this.handleAddFlavour();
                }
              }}
            >
              <img src={plus_img} alt="" className=" " />
            </Button>
            {/* ) : (
              <img src={plus_img_wt} alt="" style={{ marginTop: "13px" }} />
            )} */}
          </td>
          <td style={{ width: "21px", padding: "0px 0px 0px 5px" }}>
            {/* {is_flavour != "" && is_flavour == true ? ( */}
            <Button
              className="rowMinusBtn"
              onClick={(e) => {
                e.preventDefault();
                this.handleRemoveFlavour();
              }}
            >
              <img src={minus_img} alt="" className=" " />
            </Button>

            {/* ) : (
              <img src={minus_img_wt} style={{ marginTop: "13px" }} />
            )} */}
          </td>
          <td
            colSpan={2}
            style={{ width: "200px", padding: "0px 0px 0px 10px" }}
          >
            <Select
              className="prd-dd-style "
              menuPlacement="auto"
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              styles={newRowDropdown}
              onChange={(v, action) => {
                if (action.action == "clear") {
                  this.handleFlavourChange("");
                } else {
                  this.handleFlavourChange(v);
                }
              }}
              options={flavourOpts}
              value={mstFlavour.flavour_id}
              placeholder="flavour"
              isDisabled={is_flavour != "" && is_flavour == true ? false : true}
            />
          </td>
          <td style={{ padding: "0px" }}>
            {mstFlavour.package &&
              mstFlavour.package.length > 0 &&
              mstFlavour.package.map((v, i) => {
                return (
                  <NewPackaging
                    {...this.props}
                    mstPackage={v}
                    mstPackageIndex={i}
                  />
                );
              })}
          </td>
        </tr>
      </>
    );
  }
}
