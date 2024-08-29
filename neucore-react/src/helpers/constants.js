import Select from "react-select";
import {
  authenticationService,
  checkInvoiceDateIsBetweenFY,
} from "@/services/api_functions";

import { Modal, Spinner } from "react-bootstrap";
import moment from "moment";
export const OTPTimeoutMinutes = 5;
export const OTPTimeoutSeconds = 0;
// Mobile Regex
export const MobileRegx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const FSSAIno = /^([0-9]{14})/;
export const HSNno = /^([0-9])/;

export const SET_USER_PERMISSIONS = "SET_USER_PERMISSIONS";
export const GET_USER_PERMISSIONS = "GET_USER_PERMISSIONS";

export const SET_USER_CONTROL = "SET_USER_CONTROL";
export const GET_USER_CONTROL = "GET_USER_CONTROL";

//Only character allowed regex
export const alphaRegExp = /^(([a-zA-Z\s]))+$/;
//Only letter accept
export const onlyletterPattern = /^[A-Za-z][A-Za-z\s]*$/;
// Alphanumeric Regex
// export const alphaNumericRex = /^[a-zA-Z0-9]*$/;
export const alphaNumericRex = /^(?=.*?[A-Za-z])(?=.*?[0-9])[A-Za-z0-9]+$/;
export const MOBILEREGEXP = /^[7689][0-9]{9}$/;

export const dateRegex =
  /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
export const drivingLicenseNewRex = /^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]+$/;
//checksum validation for GSTIN:
//export const GSTINREX = /^d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[Z]{1}\d{1}/;
export const GSTINREX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[a-zA-Z0-9]{1}$/;

// !Driving Licence
// !example=> MH12 20190034760
export const drivingLicenseReg =
  /^(([A-Z]{2}[0-9]{2})()|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;

export const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
// !url regular expression
export const urlRegExp =
  /^((https?):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/;

// AdharNo Regex
export const numericRegExp =
  /^((\\+[7-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const EMAILREGEXP = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;

export const onlydigitsRegExp = /^[0-9]*$/;

export const ADHAAR_REGEX = "^[2-9]{1}[0-9]{11}$";

//export const ifsc_code_regex = "^[A-Z]{4}0[A-Z0-9]{6}$";

export const ifsc_code_regex = /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/;

export const pan = /^([A-Z]){5}\d{4}([A-Z]){1}/;

export const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const SUPPORTED_FORMATS_PDF = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const OnlyAlphabets = (e) => {
  console.log("e", e);
  var regex = new RegExp("^[a-zA-Z_ ]*$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  //   if (key === "Backspace" || key === "Delete") {
  //     // $('#GFG_DOWN').html(key + ' is Pressed!');
  // }

  if (regex.test(str)) {
    return true;
  }
  e.preventDefault();
  return false;
};

export const pincodeReg = /^[1-9][0-9]{5}$/;

export const postalCode = /(^\d{6}$)|(^\d{5}-\d{4}$)/;

export const bankAccountNumber = /^\d{6,18}$/;

export const characterRegEx = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

export const Accepts_numeric_regex = /^(0|[1-9][0-9]*)$/;

export const only_alphabets = /^[a-zA-Z\s]+$/;

export const AlphabetwithSpecialChars =
  /^[A-Z @~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]*$/i;

export const alphanumericRegEx = /^[\w\s]*$/;

export const alphanumericWithCommaRegEx = /^[\w\s,_@./!@#$%^&*()-_+]*$/;

export const doubleNumRegEx = /^[0-9]+(\.[0-9]+)?$/;

export const getSelectValue = (opts, val) => {
  return opts.find((o) => o.value === val);
};
export const getSelectLabel = (opts, val) => {
  return opts.find((o) => o.label.toLowerCase() === val);
};
export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

export const calculatePercentage = (amt, per) => {
  let res = (parseFloat(per) / 100) * parseFloat(amt);
  return res;
};
export const calculatePercentageReverse = (amt, per) => {
  let res = (parseFloat(per) * parseFloat(amt)) / (100 + parseFloat(per));
  return res;
};

export const calculatePrValue = (final_amt, discount_amt, total_amt) => {
  let res = parseFloat(
    (parseFloat(discount_amt) * parseFloat(total_amt)) / parseFloat(final_amt)
  );

  return res;
};

export const calculateAddChgValue = (
  total_gross_amt,
  discount_amt,
  gross_amt
) => {
  let res = parseFloat(
    (parseFloat(gross_amt) * parseFloat(discount_amt)) /
    parseFloat(total_gross_amt)
  );

  return res;
};

export const calculateInvoiceDisValue = (
  total_gross_amt1,
  discount_amt,
  gross_amt1
) => {
  let res = parseFloat(
    (parseFloat(gross_amt1) * parseFloat(discount_amt)) /
    parseFloat(total_gross_amt1)
  );

  return res;
};

// comma sepretor value function
export const INRformat = Intl.NumberFormat("en-IN", {
  // style: 'currency',
  currency: "INR",
  minimumFractionDigits: 2,
});

export const simbol = Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

/**
 * Description - it will return number which will be rounded off to given decimal places (like 2,3 or 4 places)
 * @param { (String | Number)  } value - actual number
 * @param {Number} decimals - no of decimal places
 * @returns {Number} - formatted roundoff number
 * @author kirankumar.gadagi
 */
export const roundDigit = (value, decimals) => {
  value = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals).toFixed(
    decimals
  );
};

export const configDecimalPlaces = 2;

export const customStyles = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    ///border: 'none',
    //paddingBottom: "12px",
    // boxShadow: 'none',
    // border: '1px solid #ccc',
    border: "none",
    boxShadow: "0px 2px 0px #cacaca !important",
    borderRadius: "3px",
    // marginTop: "-5px",
    //lineHeight: "20px",
    fontSize: "14px",
    lineHeight: "normal",
    // zIndex: 5,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "5px",
  }),
  menu: (base) => ({ ...base, zIndex: 9, fontSize: "13px" }),
};
export const NewcustomStyles = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    ///border: 'none',
    //paddingBottom: "12px",
    // boxShadow: 'none',
    // border: '1px solid #ccc',
    border: "none",
    // borderTop: "none",
    // borderLeft: "none",
    // borderRight: "none",
    boxShadow: "0px 1px 0px #212535 !important",
    borderRadius: "1px",
    // marginTop: "-5px",
    //lineHeight: "20px",
    fontSize: "14px",
    lineHeight: "normal",
    background: "transparent",
    color: "#212535",
    width: "100%",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "5px",
  }),
  // menu: (base) => ({ ...base, zIndex: 99999999 }),

  // menuPortal: (base) => ({ ...base, zIndex: 99999999 }),
};

export const customStylesForJoin = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    ///border: 'none',
    //paddingBottom: "12px",
    // boxShadow: 'none',
    // border: '1px solid #ccc',
    border: "none",
    boxShadow: "0px 2px 0px #cacaca !important",
    borderRadius: "3px",
    marginTop: "-1px !important",
    //lineHeight: "20px",
    fontSize: "14px",
    lineHeight: "normal",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "5px",
  }),
};

export const customStylesWhite = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30,
    border: "none",
    boxShadow: "0px 2px 0px #cacaca !important",
    borderRadius: "3px",
    marginTop: "-3px",
    //lineHeight: "20px",
    fontSize: "14px",
    lineHeight: "normal",
    background: "transperent",
    backgroundColor: "transparent",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "5px",
  }),
};

export const OnlyEnterNumbers = (e) => {
  var regex = new RegExp("^[0-9]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (regex.test(str)) {
    return true;
  }
  e.preventDefault();
  return false;
};

export const OnlyEnterAmount = (e) => {
  // ^[1-9][\.\d]*(,\d+)?$
  // var regex = new RegExp("^[0-9.]+$");
  var regex = new RegExp("^[0-9.]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (regex.test(str)) {
    return true;
  }
  e.preventDefault();
  return false;
};

export const OnlyEnterAmountDecimalPoint = (str) => {
  // ^[1-9][\.\d]*(,\d+)?$

  // var regex = new RegExp("^[1-9][\\.\\d]*(,\\d+)?$");
  // var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  var regex = /^[1-9][\.\d]*(,\d+)?$/;
  if (regex.test(str)) {
    return true;
  }
  // e.preventDefault();
  return false;
};

export const OnlyEnterAlphaNumbers = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (regex.test(str)) {
    return true;
  }
  return false;
};

export const InputMaskNumber = () => {
  // ^([0-9]{0,3}|0)(,[0-9]{3})?(,[0-9]{3})?(\.[0-9]{1,2})?$
};

export const isPermission = (acceeCode = null, actions = null) => {
  const secureData =
    authenticationService.currentUserValue &&
    JSON.parse(authenticationService.currentUserValue.permissionJson);
  console.log({ secureData });

  let accessContolList = secureData && secureData.accessContolList;

  accessContolList.map((v, i) => {
    if (v.accessCode == acceeCode) {
      if (v.permissions.includes(actions)) {
        let perm = v.permissions.find((vi) => vi == actions);
        if (perm && perm == true) {
          return true;
        }
      }
    }
  });
  return false;
};

export const isWriteAuthorized = (slug = null, permission = null) => {
  // const secureData = JSON.parse(localStorage.getItem("loginUser"));
  // if (secureData && secureData.isAdmin == true) {
  //   return true;
  // } else {
  //   let policies =
  //     secureData != null ? JSON.parse(secureData.permission) : undefined;

  //   if (policies && policies[parentpermission][subpermission] == "write") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  return true;
};

export const convertToSlug = (Text) => {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const getValue = (opts, val) => opts.find((o) => o.label === val);

export const ArraySplitChunkElement = (inputArray, perChunk = 10) => {
  var result = inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
  return result;
};

//! Product Select 03-06-2022
export let categorySelectTo = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  categorySelectTo = {
    control: (base) => ({
      ...base,
      marginTop: 0,
      height: 26,
      minHeight: 26,
      fontSize: "11px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "11px",
      width: "100%",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  categorySelectTo = {
    control: (base) => ({
      ...base,
      marginTop: 0,
      height: 28,
      minHeight: 28,
      fontSize: "12px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "12px",
      width: "100%",
    }),
  };
} else if (window.matchMedia("(min-width:1369px)").matches) {
  categorySelectTo = {
    control: (base) => ({
      ...base,
      marginTop: 0,
      height: 32,
      minHeight: 32,
      fontSize: "13px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "13px",
      width: "100%",
    }),
  };
}
// export const categorySelectTo = {
//   control: (base) => ({
//     ...base,
//     // marginLeft: -25,
//     marginTop: 0,
//     height: 32,
//     minHeight: 32,
//     fontSize: "13px",
//     width: "100%",
//     // width: "288px",
//     marginBottom: 0,
//     marginRight: -10,
//     boxSizing: "border-box",
//     background: "#FFFFFF",
//     border: "1px solid #DDE2ED",
//     boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
//     borderRadius: "4px",
//     // marginLeft: "10px",
//   }),
//   dropdownIndicator: (base) => ({
//     // background: "black",
//   }),
//   menu: (base) => ({
//     ...base,
//     zIndex: 5,
//     fontSize: "13px",
//     width: "100%",
//     // width: "288px",
//     // marginLeft: "10px",
//   }),
// };
export const TaxSelectTo = {
  control: (base) => ({
    ...base,
    // marginLeft: -25,
    marginTop: 0,
    height: 32,
    minHeight: 32,
    fontSize: "13px",
    width: "100%",
    // width: "95px",
    marginBottom: 0,
    marginRight: -10,
    boxSizing: "border-box",
    background: "#FFFFFF",
    border: "1px solid #DDE2ED",
    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
    borderRadius: "4px",
    // marginLeft: "10px",
  }),
  dropdownIndicator: (base) => ({
    // background: "black",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 5,
    fontSize: "13px",
    width: "100%",
    // width: "95px",
    // marginLeft: "10px",
  }),
};

export let HSNSelectTo = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  HSNSelectTo = {
    control: (base) => ({
      ...base,
      marginTop: 0,
      height: 26,
      minHeight: 26,
      fontSize: "11px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "11px",
      width: "100%",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  HSNSelectTo = {
    control: (base) => ({
      ...base,
      marginTop: 0,
      height: 28,
      minHeight: 28,
      fontSize: "12px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "12px",
      width: "100%",
    }),
  };
} else if (window.matchMedia("(min-width:1369px)").matches) {
  HSNSelectTo = {
    control: (base) => ({
      ...base,
      marginTop: 0,
      height: 32,
      minHeight: 32,
      fontSize: "13px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "13px",
      width: "100%",
    }),
  };
}

export let warrantyBox = 0;

if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  warrantyBox = 1;
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  warrantyBox = 1;
} else if (window.matchMedia("(min-width:1369px)").matches) {
  warrantyBox = 0;
}

// ! Unit Select style 27-06-2022

export let UnitSelectTo = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  UnitSelectTo = {
    control: (base) => ({
      ...base,
      marginLeft: "25px",
      marginTop: "3px",
      height: 26,
      minHeight: 26,
      fontSize: "11px",
      width: "174px",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
      // marginLeft: "10px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "11px",
      width: "174px",
      marginLeft: "25px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  UnitSelectTo = {
    control: (base) => ({
      ...base,
      marginLeft: "25px",
      marginTop: "3px",
      height: 25,
      minHeight: 25,
      fontSize: "12px",
      width: "174px",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
      // marginLeft: "10px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "12px",
      width: "174px",
      marginLeft: "25px",
    }),
  };
} else if (window.matchMedia("(min-width:1369px)").matches) {
  UnitSelectTo = {
    control: (base) => ({
      ...base,
      marginLeft: "25px",
      marginTop: "3px",
      height: 36,
      minHeight: 36,
      fontSize: "13px",
      width: "174px",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
      // marginLeft: "10px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "13px",
      width: "174px",
      marginLeft: "25px",
    }),
  };
}

export let NegativeSelectTo = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  NegativeSelectTo = {
    control: (base) => ({
      ...base,
      marginLeft: "15px",
      marginTop: "3px",
      height: 26,
      minHeight: 26,
      fontSize: "11px",
      width: "92px",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
      // marginLeft: "10px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "11px",
      width: "92px",
      marginLeft: "25px",
      // marginLeft: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  NegativeSelectTo = {
    control: (base) => ({
      ...base,
      marginLeft: "15px",
      marginTop: "3px",
      height: 25,
      minHeight: 25,
      fontSize: "12px",
      width: "92px",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
      // marginLeft: "10px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "12px",
      width: "92px",
      marginLeft: "25px",
      // marginLeft: "10px",
    }),
  };
} else if (window.matchMedia("(min-width:1369px)").matches) {
  NegativeSelectTo = {
    control: (base) => ({
      ...base,
      marginLeft: "15px",
      marginTop: "3px",
      height: 36,
      minHeight: 36,
      fontSize: "13px",
      width: "92px",
      marginBottom: 0,
      marginRight: -10,
      boxSizing: "border-box",
      background: "#FFFFFF",
      border: "1px solid #DDE2ED",
      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
      borderRadius: "4px",
      // marginLeft: "10px",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "13px",
      width: "92px",
      marginLeft: "25px",
      // marginLeft: "10px",
    }),
  };
}

export let transSelectTo = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  transSelectTo = {
    control: (base) => ({
      ...base,
      height: 26,
      minHeight: 26,
      ///border: 'none',
      //paddingBottom: "12px",
      // boxShadow: 'none',
      // border: '1px solid #ccc',
      border: "none",
      boxShadow: "0px 2px 0px #cacaca !important",
      borderRadius: "3px",
      // marginTop: "-5px",
      //lineHeight: "20px",
      fontSize: "11px",
      lineHeight: "normal",
      // zIndex: 5,
      borderRadius: "0px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
    menu: (base) => ({ ...base, zIndex: 999, fontSize: "11px" }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  transSelectTo = {
    control: (base) => ({
      ...base,
      height: 25,
      minHeight: 25,
      ///border: 'none',
      //paddingBottom: "12px",
      // boxShadow: 'none',
      // border: '1px solid #ccc',
      border: "none",
      boxShadow: "0px 2px 0px #cacaca !important",
      borderRadius: "3px",
      // marginTop: "-5px",
      //lineHeight: "20px",
      fontSize: "12px",
      lineHeight: "normal",
      // zIndex: 5,
      borderRadius: "0px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
    menu: (base) => ({ ...base, zIndex: 999, fontSize: "12px" }),
  };
} else if (window.matchMedia("(min-width:1369px)").matches) {
  transSelectTo = {
    control: (base) => ({
      ...base,
      height: 25,
      minHeight: 25,
      ///border: 'none',
      //paddingBottom: "12px",
      // boxShadow: 'none',
      // border: '1px solid #ccc',
      border: "none",
      boxShadow: "0px 2px 0px #cacaca !important",
      borderRadius: "3px",
      // marginTop: "-5px",
      //lineHeight: "20px",
      fontSize: "14px",
      lineHeight: "normal",
      // zIndex: 5,
      borderRadius: "0px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
    menu: (base) => ({ ...base, zIndex: 999, fontSize: "14px" }),
  };
}

export let transSelectToWhite = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  transSelectToWhite = {
    control: (base) => ({
      ...base,
      height: 26,
      minHeight: 26,
      ///border: 'none',
      //paddingBottom: "12px",
      // boxShadow: 'none',
      // border: '1px solid #ccc',
      border: "none",
      boxShadow: "0px 2px 0px #cacaca !important",
      borderRadius: "3px",
      // marginTop: "-5px",
      //lineHeight: "20px",
      fontSize: "11px",
      lineHeight: "normal",
      // zIndex: 5,
      borderRadius: "0px",
      background: "transperent",
      backgroundColor: "transparent",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
    menu: (base) => ({ ...base, zIndex: 999, fontSize: "11px" }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  transSelectToWhite = {
    control: (base) => ({
      ...base,
      height: 25,
      minHeight: 25,
      ///border: 'none',
      //paddingBottom: "12px",
      // boxShadow: 'none',
      // border: '1px solid #ccc',
      border: "none",
      boxShadow: "0px 2px 0px #cacaca !important",
      borderRadius: "3px",
      // marginTop: "-5px",
      //lineHeight: "20px",
      fontSize: "12px",
      lineHeight: "normal",
      // zIndex: 5,
      borderRadius: "0px",
      background: "transperent",
      backgroundColor: "transparent",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
    menu: (base) => ({ ...base, zIndex: 999, fontSize: "12px" }),
  };
} else if (window.matchMedia("(min-width:1369px)").matches) {
  transSelectToWhite = {
    control: (base) => ({
      ...base,
      height: 25,
      minHeight: 25,
      ///border: 'none',
      //paddingBottom: "12px",
      // boxShadow: 'none',
      // border: '1px solid #ccc',
      border: "none",
      boxShadow: "0px 2px 0px #cacaca !important",
      borderRadius: "3px",
      // marginTop: "-5px",
      //lineHeight: "20px",
      fontSize: "14px",
      lineHeight: "normal",
      // zIndex: 5,
      borderRadius: "0px",
      background: "transperent",
      backgroundColor: "transparent",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
    menu: (base) => ({ ...base, zIndex: 999, fontSize: "14px" }),
  };
}

export let invoiceSelectTo = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  invoiceSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 5,
      border: "1px solid transparent",
      height: 26,
      minHeight: 26,
      fontSize: "11px",
      width: "90%",
      marginBottom: 0,
      // marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  invoiceSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 5,
      border: "1px solid transparent",
      height: 25,
      minHeight: 25,
      fontSize: "13px",
      width: "90%",
      marginBottom: 0,
      // marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1369px) and (max-width:1440px)").matches
) {
  invoiceSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 5,
      border: "1px solid transparent",
      height: 32,
      minHeight: 32,
      fontSize: "13px",
      width: "90%",
      marginBottom: 0,
      // marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1441px) and (max-width:1680px)").matches
) {
  invoiceSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 5,
      border: "1px solid transparent",
      height: 32,
      minHeight: 32,
      fontSize: "13px",
      width: "90%",
      marginBottom: 0,
      // marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (window.matchMedia("(min-width:1681px)").matches) {
  invoiceSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 5,
      border: "1px solid transparent",
      height: 36,
      minHeight: 36,
      fontSize: "14px",
      width: "90%",
      marginBottom: 0,
      // marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "13px",
    }),
  };
}

export const PackageSelectTo = {
  control: (base) => ({
    ...base,
    marginTop: "3px",
    height: 25,
    minHeight: 25,
    fontSize: "13px",
    width: "92px",
    marginBottom: 0,
    marginRight: -10,
    boxSizing: "border-box",
    background: "#FFFFFF",
    border: "1px solid #DDE2ED",
    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.16)",
    borderRadius: "4px",
    // marginLeft: "10px",
  }),
  dropdownIndicator: (base) => ({
    // background: "black",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 5,
    fontSize: "13px",
    width: "92px",
    // marginLeft: "10px",
  }),
};

export const disc_select_to = {
  control: (base) => ({
    ...base,
    border: "1px solid #DCDCDC4D",
    background: "#FFFFFF",
    height: 30,
    minHeight: 30,
    width: "100%",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "17px",
    // marginLeft: "10px",
  }),
  dropdownIndicator: (base) => ({
    color: "#ADADAD",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 5,
    fontSize: "13px",
    width: "100%",
    // marginLeft: "10px",
  }),
};
// export const ddselect_to = {
//   control: (base) => ({
//     ...base,
//     fontFamily: "Inter",
//     fontStyle: "normal",
//     fontWeight: "400",
//     fontSize: "15px",
//     lineHeight: "18px",
//     display: "flex",
//     alignItems: "center",
//     letterSpacing: "-0.02em",
//     textDecorationLine: "underline",
//     background: "transparent",
//     border: "1px solid transparent",
//     color: "#000000",
//   }),
//   dropdownIndicator: (base) => ({
//     color: "#ADADAD",
//     marginRight: "10px",
//   }),
//   menu: (base) => ({
//     ...base,
//     zIndex: 5,
//     fontSize: "13px",
//     width: "100%",
//     // marginLeft: "10px",
//   }),
// };
export const CustomCss = {
  control: (base) => ({
    ...base,
    // marginLeft: -25,
    borderRadius: "none",
    border: "none",
    marginTop: 0,
    height: 40,
    minHeight: 40,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: "18px",
    width: "100%",
    letterSpacing: "-0.02em",
    //textDecorationLine: "underline",

    color: "#000000",
  }),
  dropdownIndicator: (base) => ({
    // background: "black",
    color: " #ADADAD",
    // height: "4.5px",
    // width: "9px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 999,
    fontSize: "13px",
  }),
};

//! Product Select 03-06-2022
// export let purchaseSelect = "";
// // Check if the media query is true
// if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
//   purchaseSelect = {
//     control: (base) => ({
//       ...base,
//       fontFamily: "Inter",
//       fontStyle: "normal",
//       fontWeight: "400",
//       fontSize: "15px",
//       lineHeight: "18px",
//       display: "flex",
//       alignItems: "center",
//       letterSpacing: "-0.02em",
//       //textDecorationLine: "underline",
//       border: "none",
//       color: "#000000",
//       minHeight: 26,
//       height: 26,
//     }),
//     dropdownIndicator: (base) => ({
//       color: "#ADADAD",
//       marginRight: "10px",
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 999,
//       fontSize: "13px",
//       width: "100%",
//       // marginLeft: "10px",
//     }),
//   };
// } else if (
//   window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
// ) {
//   purchaseSelect = {
//     control: (base) => ({
//       ...base,
//       fontFamily: "Inter",
//       fontStyle: "normal",
//       fontWeight: "400",
//       fontSize: "15px",
//       lineHeight: "18px",
//       display: "flex",
//       alignItems: "center",
//       letterSpacing: "-0.02em",
//       //textDecorationLine: "underline",
//       border: "none",
//       minHeight: 30,
//       color: "#000000",
//     }),
//     dropdownIndicator: (base) => ({
//       color: "#ADADAD",
//       marginRight: "10px",
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 999,
//       fontSize: "13px",
//       width: "100%",
//       // marginLeft: "10px",
//     }),
//   };
// } else if (window.matchMedia("(min-width:1369px)").matches) {
//   purchaseSelect = {
//     control: (base) => ({
//       ...base,
//       fontFamily: "Inter",
//       fontStyle: "normal",
//       fontWeight: "400",
//       fontSize: "15px",
//       lineHeight: "18px",
//       display: "flex",
//       alignItems: "center",
//       letterSpacing: "-0.02em",
//       //textDecorationLine: "underline",
//       border: "none",
//       color: "#000000",
//       minHeight: 36,
//       height: 36,
//     }),
//     dropdownIndicator: (base) => ({
//       color: "#ADADAD",
//       marginRight: "10px",
//     }),
//     menu: (base) => ({
//       ...base,
//       zIndex: 999,
//       fontSize: "13px",
//       width: "100%",
//       // marginLeft: "10px",
//     }),
//   };
// }

export let createPro = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  createPro = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid #dcdcdc",
      marginTop: 2,
      height: "22px",
      minHeight: "22px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "11px",
      borderRadius: "4px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #dcdcdc",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "11px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1280px)").matches
) {
  createPro = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid #dcdcdc",
      marginTop: "0",
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        "&:hover": {
          background: "#d5effb",
          border: "1px solid #dcdcdc !important",
        },
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
) {
  createPro = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid #dcdcdc",
      marginTop: "0",
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        "&:hover": {
          background: "#d5effb",
          border: "1px solid #dcdcdc !important",
        },
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1369px) and (max-width:1440px)").matches
) {
  createPro = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid #dcdcdc",
      marginTop: "0",
      height: "30px",
      minHeight: "30px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        "&:hover": {
          background: "#d5effb",
          border: "1px solid #dcdcdc !important",
        },
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1441px) and (max-width:1600px)").matches
) {
  createPro = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid #dcdcdc",
      marginTop: "0",
      height: "30px",
      minHeight: "30px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        "&:hover": {
          background: "#d5effb",
          border: "1px solid #dcdcdc !important",
        },
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1601px) and(max-width:1680px)").matches
) {
  createPro = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid #dcdcdc",
      marginTop: "0",
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 17,
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      // "&:hover": {
      //   "&:hover": {
      //     background: "#d5effb",
      //     border: "1px solid #dcdcdc !important",
      //   },
      // },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else {
  createPro = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #dcdcdc",
      marginTop: "0",
      height: 36,
      minHeight: 36,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "#d5effb",
        border: "1px solid #dcdcdc !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
}

export let trcreatePro = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  trcreatePro = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent",
      marginTop: 2,
      height: 26,
      minHeight: 26,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "11px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  trcreatePro = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent",
      marginTop: 2,
      height: 25,
      minHeight: 25,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "11px",
    }),
  };
} else {
  trcreatePro = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent",
      marginTop: 2,
      height: 36,
      minHeight: 36,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
}

export let ledger_select = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  ledger_select = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      height: "25px",
      minHeight: "25px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      // "&:hover": {
      //   background: "transparent",
      //   border: "1px solid #dcdcdc !important",
      // },
      "&:focus": {
        background: "#00a0f5",
        border: "2px solid #dcdcdc !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "11px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1280px)").matches
) {
  ledger_select = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      // "&:hover": {
      //   "&:hover": {
      //     background: "#d5effb",
      //     border: "1px solid #dcdcdc !important",
      //   },
      // },
      "&:focus": {
        background: "#00a0f5",
        border: "2px solid #dcdcdc !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "0px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "11px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1281px) and (max-width: 1368px)").matches
) {
  ledger_select = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      // "&:hover": {
      //   "&:hover": {
      //     background: "#d5effb",
      //     border: "1px solid #dcdcdc !important",
      //   },
      // },
      "&:focus": {
        background: "#00a0f5",
        border: "2px solid #dcdcdc !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "0px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1369px) and (max-width: 1600px)").matches
) {
  ledger_select = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: "30px",
      minHeight: "30px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      // "&:hover": {
      //   "&:hover": {
      //     background: "#d5effb",
      //     border: "1px solid #dcdcdc !important",
      //   },
      // },
      "&:focus": {
        background: "#00a0f5",
        border: "2px solid #dcdcdc !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "0px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1601px) and (max-width: 1680px)").matches
) {
  ledger_select = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: "32px",
      minHeight: "32px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      // "&:hover": {
      //   "&:hover": {
      //     background: "#d5effb",
      //     border: "1px solid #dcdcdc !important",
      //   },
      // },
      "&:focus": {
        background: "#00a0f5",
        border: "2px solid #dcdcdc !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "0px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "14px",
    }),
  };
} else {
  ledger_select = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #dcdcdc ",
      marginTop: "0",
      height: "34px",
      minHeight: "34px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      // "&:hover": {
      //   background: "#d5effb",
      //   border: "1px solid #dcdcdc !important",
      // },
      "&:focus": {
        background: "#00a0f5",
        border: "2px solid #dcdcdc !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: "12px",
      marginTop: "3px",
    }),
  };
}

export let purchaseSelect = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: 2,
      height: "25px",
      minHeight: "25px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        // border: "1px solid #00a0f5 !important",
      },
      "&:focus": {
        lineHeight: "0px",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "0px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
) {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },

      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1025px) and (max-width:1280px)").matches
) {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: 28,
      minHeight: 28,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
) {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1601px) and (max-width:1680px)").matches
) {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: 32,
      minHeight: 32,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1401px) and (max-width:1440px)").matches
) {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: 33,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1441px) and (max-width:1600px)").matches
) {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1601px) and (max-width:1680px)").matches
) {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "1px solid #DCDCDC",
      marginTop: "0",
      height: 32,
      minHeight: 32,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else {
  purchaseSelect = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      marginTop: "0",
      height: "34px",
      minHeight: "34px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
}

export let purchaseSelect1 = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "none",
      marginTop: 2,
      height: "25px",
      minHeight: "25px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        // border: "1px solid #00a0f5 !important",
      },
      "&:focus": {
        lineHeight: "0px",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "0px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
) {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "none",
      marginTop: "0",
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },

      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1025px) and (max-width:1280px)").matches
) {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "none",
      marginTop: "0",
      height: 28,
      minHeight: 28,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
) {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "none",
      marginTop: "0",
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1601px) and (max-width:1680px)").matches
) {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "none",
      marginTop: "0",
      height: 32,
      minHeight: 32,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1401px) and (max-width:1440px)").matches
) {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "none",
      marginTop: "0",
      height: 33,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1441px) and (max-width:1600px)").matches
) {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "none",
      marginTop: "0",
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1601px) and (max-width:1680px)").matches
) {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: "none",
      marginTop: "0",
      height: 32,
      minHeight: 32,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
} else {
  purchaseSelect1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      marginTop: "0",
      height: "34px",
      minHeight: "34px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      "&:hover": {
        // border: "1px solid #00a0f5 !important",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "none",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
}

export let purchaseInvSelect = "";
if (window.matchMedia("(min-width:1681px)").matches) {
  purchaseInvSelect = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 0,
      border: "1px solid transparent",
      height: 36,
      minHeight: 36,
      fontSize: "14px",
      width: "100%",
      marginBottom: 0,
      // marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "13px",
    }),
  };
}

export const LoadingComponent = (showloader = false) => {
  return (
    <Modal
      show={showloader}
      backdrop="static"
      keyboard={false}
      size={"sm"}
      centered
      className="bg-transparent"
      dialogClassName="bg-transparent"
      contentClassName="bg-transparent border-0"
    >
      <div className="bg-transparent text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </Modal>
  );
};

// ? Pravin sytle 11-12-2022

export let newProductSelectStyle = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  newProductSelectStyle = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent",
      marginTop: 2,
      height: 26,
      minHeight: 26,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "11px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  newProductSelectStyle = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent",
      marginTop: "0",
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        "&:hover": {
          background: "#d5effb",
          border: "1px solid #dcdcdc !important",
        },
      },
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "2px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else {
  newProductSelectStyle = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "3px",
      border: "1px solid rgb(220, 220, 220)",
      marginTop: "0",
      height: 28,
      minHeight: 28,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "17px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "#d5effb",
        border: "1px solid #dcdcdc !important",
      },
      boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999999,
      fontSize: "12px",
    }),
  };
}

export let newRowDropdown = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  newRowDropdown = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent",
      marginTop: 2,
      height: 26,
      minHeight: 26,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "11px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  newRowDropdown = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent",
      marginTop: 2,
      height: 25,
      minHeight: 25,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "11px",
    }),
  };
} else {
  newRowDropdown = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      marginTop: 1,
      height: 33,
      minHeight: 33,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "12px",
      width: 169,
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      "&:hover": {
        background: "#d5effb !important",
        border: "1px solid #dcdcdc !important",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
}

export const RecursiveComponent = ({ data }) => {
  return (
    <>
      {data.map((parent) => {
        return (
          <>
            {parent.isFolder && (
              <td>
                <Select
                  isClearable
                  isMulti={true}
                  className="selectTo"
                  // options={filterOpts}
                  onChange={(v) => {
                    // setFieldValue("filterId", v);
                    // this.onFilterChange(v);
                  }}
                  name="filterId"
                  styles={customStyles}
                />
              </td>
            )}
            {/* rendering unit files */}
            {!parent.isFolder && (
              <Select
                isClearable
                isMulti={true}
                className="selectTo"
                // options={filterOpts}
                onChange={(v) => {
                  // setFieldValue("filterId", v);
                  // this.onFilterChange(v);
                }}
                name="filterId"
                styles={customStyles}
              />
            )}
            <td>
              <tr>
                {parent.level && <RecursiveComponent data={parent.level} />}
              </tr>
            </td>
          </>
        );
      })}
    </>
  );
};

export const RecursiveComponent1 = ({ data }) => {
  return (
    <div style={{ paddingLeft: "20px" }}>
      {data.map((parent) => {
        return (
          <div key={parent.value}>
            {/* rendering folders */}
            {parent.isFolder && <button>{parent.label}</button>}
            {/* rendering files */}
            {!parent.isFolder && <span>{parent.label}</span>}
            <div>
              {parent.level && <RecursiveComponent data={parent.level} />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const findObject = (obj, id) => {
  if (Array.isArray(obj)) {
    let res = obj.map((v) => {
      return v.id === id
        ? v
        : v.level &&
        v.level.reduce((acc, obj) => acc ?? findObject(obj, id), undefined);
    });
    let org_res = res.filter((v) => v != null);
    return org_res.length > 0 ? org_res[0] : undefined;
  } else {
    return obj.id === id
      ? obj
      : obj.level &&
      obj.level.reduce((acc, obj) => acc ?? findObject(obj, id), undefined);
  }
};

export const findObjReplace = (data, id, replacedata) => {
  if (data.id === id) {
    return replacedata;
  }
  if (data.id != id && data.level) {
    data.level = data.level.map((v) => {
      return findObjReplace(v, id, replacedata);
    });
  }
  return data;
};

export const checkInvoiceDateIsBetweenFYFun = (invoiceDate = "") => {
  console.warn("rahul :: invoiceDate", invoiceDate);
  let requestData = new FormData();
  requestData.append(
    "invoiceDate",
    moment(invoiceDate, "DD-MM-YYYY").format("YYYY-MM-DD")
  );
  checkInvoiceDateIsBetweenFY(requestData)
    .then((response) => {
      console.log("res", response);
      let res = response.data;
      if (res.responseStatus != 200) {
        return false;
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
  return true;
};

export function truncateString(fullStr, strLen, separator) {
  //! http://jsfiddle.net/2eUYN/1/
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || "...";

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
}

export let customStyles1 = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  customStyles1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 28,
      minHeight: 28,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #00a0f5 !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1025px) and (max-width:1280px)").matches
) {
  customStyles1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #00a0f5 !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1281px) and (max-width:1368px)").matches
) {
  customStyles1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #00a0f5 !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      color: " #ADADAD",
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1369px) and (max-width:1600px)").matches
) {
  customStyles1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 32,
      minHeight: 32,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #00a0f5 !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      color: " #ADADAD",
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
} else {
  customStyles1 = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 36,
      minHeight: 36,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #00a0f5 !important",
      },
      "&:focus": {
        width: "100%",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      color: " #ADADAD",
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
}

export let unitDD = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  unitDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 28,
      minHeight: 28,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "1px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "10px",
      marginTop: "1px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1025px) and (max-width:1280px)").matches
) {
  unitDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "1px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1281px) and (max-width:1368px)").matches
) {
  unitDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "1px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1369px) and (max-width:1600px)").matches
) {
  unitDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 32,
      minHeight: 32,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "12px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "1px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
} else {
  unitDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      border: "1px solid transparent !important",
      marginTop: 0,
      height: 36,
      minHeight: 36,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "16px",
      // width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        width: "100%",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "1px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      fontSize: "12px",
      marginTop: "1px",
    }),
  };
}

export let newRowDropdownUnit = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  newRowDropdownUnit = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      // marginTop: 3,
      height: "25px",
      minHeight: "25px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",
      padding: "0px",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),

    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1025px) and (max-width:1280px)").matches
) {
  newRowDropdownUnit = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      // marginTop: 3,
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",
      padding: "0px",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),

    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1281px) and (max-width:1368px)").matches
) {
  newRowDropdownUnit = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      // marginTop: 3,
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",
      padding: "0px",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),

    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1369px) and (max-width:1440px)").matches
) {
  newRowDropdownUnit = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      // marginTop: 3,
      height: "30px",
      minHeight: "30px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",
      padding: "0px",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),

    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1441px) and (max-width:1600px)").matches
) {
  newRowDropdownUnit = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      // marginTop: 3,
      height: "32px",
      minHeight: "32px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",
      padding: "0px",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),

    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1601px) and (max-width:1680px)").matches
) {
  newRowDropdownUnit = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      // marginTop: 3,
      height: "32px",
      minHeight: "32px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",
      padding: "0px",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),

    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else {
  newRowDropdownUnit = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      // marginTop: 3,
      height: "34px",
      minHeight: "34px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "20px",
      // width: "89px",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",
      padding: "0px",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      // border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),

    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      marginTop: "0px",
      fontSize: "12px",
    }),
  };
}

export let flavourDD = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  flavourDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      marginTop: 0,
      height: 28,
      minHeight: 28,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "12px",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent !important",
      width: "100%",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        border: "1px solid #dcdcdc !important",
        outline: "none",
        width: "100%",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1025px) and (max-width:1280px)").matches
) {
  flavourDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      marginTop: 0,
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent !important",
      width: "100%",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        border: "1px solid #dcdcdc !important",
        outline: "none",
        width: "100%",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1281px) and (max-width:1368px)").matches
) {
  flavourDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      marginTop: 0,
      height: 30,
      minHeight: 30,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent !important",
      width: "100%",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        border: "1px solid #dcdcdc !important",
        outline: "none",
        width: "100%",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1369px) and (max-width:1600px)").matches
) {
  flavourDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      marginTop: 0,
      height: 32,
      minHeight: 32,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "12px",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent !important",
      width: "100%",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        border: "1px solid #dcdcdc !important",
        outline: "none",
        width: "100%",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else {
  flavourDD = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "none",
      // border: "1px solid transparent",
      marginTop: 0,
      height: 38,
      minHeight: 38,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "12px",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent !important",
      width: "100%",
      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        border: "1px solid #dcdcdc !important",
        outline: "none",
        width: "100%",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "1px solid #00A0F5" : "1px solid transparent",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
}

export let companystyle = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  companystyle = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: " 1px solid #c4cbd2 !important",
      marginTop: 0,
      height: "25px",
      minHeight: "25px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1025px) and (max-width:1280px)").matches
) {
  companystyle = {
    control: (base, state) => ({
      ...base,
      borderRadius: "4px",
      border: " 1px solid #c4cbd2 !important",
      marginTop: 0,
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "14px",
      width: "100%",

      color: "#000000",
      background: "transparent",

      "&:hover": {
        background: "transparent",
        border: "1px solid #dcdcdc !important",
      },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1281px) and (max-width:1368px)").matches
) {
  companystyle = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: " 1px solid #c4cbd2 !important",
      marginTop: 0,
      height: "28px",
      minHeight: "28px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "12px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",

      background: "transparent",

      // "&:hover": {
      //   background: "transparent",
      //   border: "1px solid #dcdcdc !important",
      // },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1369px) and (max-width:1600px)").matches
) {
  companystyle = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: " 1px solid #c4cbd2 !important",
      marginTop: 0,
      height: " 30px !important",
      minHeight: " 30px !important",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      // "&:hover": {
      //   background: "transparent",
      //   border: "1px solid #dcdcdc !important",
      // },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width: 1601px) and (max-width:1680px)").matches
) {
  companystyle = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: " 1px solid #c4cbd2 !important",
      marginTop: 0,
      height: " 32px !important",
      minHeight: " 32px !important",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "15px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      // "&:hover": {
      //   background: "transparent",
      //   border: "1px solid #dcdcdc !important",
      // },
      "&:focus": {
        width: "100%",
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else {
  companystyle = {
    control: (base, state) => ({
      ...base,
      // marginLeft: -25,
      borderRadius: "4px",
      border: " 1px solid #c4cbd2 !important",
      marginTop: 0,
      height: "34px",
      minHeight: "34px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "18px",
      width: "100%",
      // letterSpacing: "-0.02em",
      // textDecorationLine: "underline",
      color: "#000000",
      background: "transparent",

      "&:hover": {
        // background: "#d5effb !important",
        // border: "1px solid #00a0f5 !important",
      },
      "&:focus": {
        width: "100%",
      },
      // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
      color: " #ADADAD",
      // marginRight: "5px",
      // height: "4.5px",
      // width: "9px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
}

// For Product DropDown
export let productDropdown = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  productDropdown = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2B2D42 !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: "25px",
      minHeight: "25px",
      borderRadius: "4px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "10px",
      color: "#383838",
      // paddingLeft: "4px",
      // paddingLeft: "5px",
      "&:hover": {
        border: "1px solid #D9D9D9",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
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
    menu: (base) => ({ ...base, zIndex: 9999, fontSize: "10px" }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1280px)").matches
) {
  productDropdown = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: "28px",
      minHeight: "28px",
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      color: "#000000",
      padding: "0px 0px !important",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        // background: "#d5effb",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
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
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
) {
  productDropdown = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: "28px",
      minHeight: "28px",
      borderRadius: "4px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      color: "#000000",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        // background: "#d5effb",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
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
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1369px) and (max-width:1440px)").matches
) {
  productDropdown = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: "30px",
      minHeight: "30px",
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      color: "#000000",
      padding: "2px 2px",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        // background: "#d5effb",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
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
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1441px) and (max-width:1600px)").matches
) {
  productDropdown = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: "30px",
      minHeight: "30px",
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      color: "#000000",
      padding: "2px 2px",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        // background: "#d5effb",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
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
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1601px) and (max-width:1680px)").matches
) {
  productDropdown = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: "32px",
      minHeight: "32px",
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      color: "#000000",
      padding: "2px 2px",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        // background: "#d5effb",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
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
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
} else {
  productDropdown = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: "34px",
      minHeight: "34px",
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "17px",
      color: "#000000",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        // background: "#d5effb",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
      "&:focus": {
        background: "#d5effb !important",
        border: "2px solid #dcdcdc !important",
      },
      "&:active": {
        background: "#d5effb",
        border: "2px solid #dcdcdc !important",
      },
      padding: state.isFocused ? "0px !important" : "0px",
      border: state.isFocused ? "2px solid #00a0f5" : "1px solid #c4cbd2",
      boxShadow: "none",
      background: state.isFocused ? "#d5effb !important" : "",
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
    closingIndicator: (base) => ({
      ...base,
      color: "#0B9CBC",
      padding: "5px",
      "&:hover": {
        color: "#0B9CBC",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
      fontSize: "12px",
    }),
  };
}

export let gstHSN = "";
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  gstHSN = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2B2D42 !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: 25,
      minHeight: 25,
      borderRadius: "4px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "11px",
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
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1280px)").matches
) {
  gstHSN = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: 32,
      minHeight: 32,
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      color: "#000000",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        background: "#d5effb",
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
    menu: (base) => ({ ...base, zIndex: 91, fontSize: "10px" }),
  };
} else if (
  window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
) {
  gstHSN = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: 32,
      minHeight: 32,
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "17px",
      color: "#000000",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        background: "#d5effb",
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
    menu: (base) => ({ ...base, zIndex: 91, fontSize: "10px" }),
  };
} else if (
  window.matchMedia("(min-width:1369px) and (max-width:1600px)").matches
) {
  gstHSN = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid #2684FF !important"
        : "1px solid #D9D9D9",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: 30,
      minHeight: 30,
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "17px",
      color: "#000000",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        background: "#d5effb",
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
    menu: (base) => ({ ...base, zIndex: 91, fontSize: "10px" }),
  };
} else {
  gstHSN = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      border: state.isFocused
        ? "1px solid transparent !important"
        : "1px solid transparent",
      boxShadow: "none",
      // boxShadow: state.isFocused
      //   ? "0px 3px 3px rgba(0, 0, 0, 0.06)"
      //   : "0px 3px 3px rgba(0, 0, 0, 0.06)",
      height: 32,
      minHeight: 32,
      borderRadius: "3px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "17px",
      color: "#000000",
      textAlign: "center",
      // paddingLeft: "8px",
      // paddingLeft: "5px",
      "&:hover": {
        // border: "1px solid #D9D9D9",
        // background: "#d5effb",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
      padding: state.isFocused ? "0px !important" : "0px",
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
    closingIndicator: (base) => ({
      ...base,
      color: "#0B9CBC",
      padding: "5px",
      "&:hover": {
        color: "#0B9CBC",
        // boxShadow: "0px 0px 6px #ff8b67"
      },
    }),
    menu: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }),
  };
}

// Product Level DropDown style

export const level_A_DD = (data) => {
  let level_A_DD = "";
  if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
    level_A_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "25px",
        minHeight: "25px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "10px",
        lineHeight: "12px",
        width: "100%",
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "10px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1025px) and (max-width:1280px)").matches
  ) {
    level_A_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "28px",
        minHeight: "28px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 268 : data == "AB" ? 225 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
  ) {
    level_A_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "28px",
        minHeight: "28px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 268 : data == "AB" ? 225 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "11px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1369px) and (max-width:1440px)").matches
  ) {
    level_A_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "28px",
        minHeight: "28px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 268 : data == "AB" ? 225 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "11px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1441px) and (max-width:1600px)").matches
  ) {
    level_A_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "32px",
        minHeight: "32px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 268 : data == "AB" ? 225 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "11px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1601px) and (max-width:1680px)").matches
  ) {
    level_A_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "32px",
        minHeight: "32px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 268 : data == "AB" ? 225 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "11px",
      }),
    };
  } else {
    level_A_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        // border: "1px solid transparent",
        // marginTop: 1,
        height: "34px",
        minHeight: "34px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "20px",
        width: "100%",
        // width:
        //   data == "A" ? 520 : data == "AB" ? 225 : data == "ABC" ? 196 : 580, // For A
        //     // width: 167, // For ABC
        //     // width: 259, // For AB
        //     // width: 258, // For AC
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "#d5effb !important",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        // marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  }
  return level_A_DD;
};
export const level_B_DD = (data) => {
  let level_B_DD = "";
  if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
    level_B_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "25px",
        minHeight: "25px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "10px",
        lineHeight: "12px",
        width: "100%",
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "10px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
  ) {
    level_B_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "28px",
        minHeight: "28px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 580 : data == "AB" ? 200 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "11px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1025px) and (max-width:1280px)").matches
  ) {
    level_B_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "28px",
        minHeight: "28px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 580 : data == "AB" ? 200 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1369px) and (max-width:1440px)").matches
  ) {
    level_B_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "30px",
        minHeight: "30px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 580 : data == "AB" ? 200 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1601px) and (max-width:1680px)").matches
  ) {
    level_B_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "32px",
        minHeight: "32px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "12px",
        width: "100%",
        // width:
        //   data == "A" ? 580 : data == "AB" ? 200 : data == "ABC" ? 150 : 580, // For A
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1441px) and (max-width:1600px)").matches
  ) {
    level_B_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        // border: "1px solid transparent",
        // marginTop: 1,
        height: "32px",
        minHeight: "32px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "12px",
        width: "100%",
        // width: data == "AB" ? 225 : data == "ABC" ? 170 : 0, // For A

        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "#d5effb !important",
          border: "1px solid #dcdcdc !important",
        },
        // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        // marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else {
    level_B_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        // border: "1px solid transparent",
        // marginTop: 1,
        height: "34px",
        minHeight: "34px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "20px",
        width: "100%",
        // width: data == "AB" ? 225 : data == "ABC" ? 170 : 0, // For A

        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "#d5effb !important",
          border: "1px solid #dcdcdc !important",
        },
        // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        // marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  }
  return level_B_DD;
};
export const level_C_DD = (data) => {
  let level_C_DD = "";
  if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
    level_C_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "25px",
        minHeight: "25px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "10px",
        lineHeight: "12px",
        width: "100%",
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "10px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1025px) and (max-width:1280px)").matches
  ) {
    level_C_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "28px",
        minHeight: "28px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width: data == "ABC" ? 150 : 0,
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1281px) and (max-width:1368px)").matches
  ) {
    level_C_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "28px",
        minHeight: "28px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width: data == "ABC" ? 150 : 0,
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1369px) and (max-width:1440px)").matches
  ) {
    level_C_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "30px",
        minHeight: "30px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "12px",
        lineHeight: "12px",
        width: "100%",
        // width: data == "ABC" ? 150 : 0,
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1441px) and (max-width:1600px)").matches
  ) {
    level_C_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "32px",
        minHeight: "32px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "12px",
        width: "100%",
        // width: data == "ABC" ? 150 : 0,
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  } else if (
    window.matchMedia("(min-width:1601px) and (max-width:1680px)").matches
  ) {
    level_C_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        border: "1px solid transparent",
        // marginTop: 2,
        height: "32px",
        minHeight: "32px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "12px",
        width: "100%",
        // width: data == "ABC" ? 150 : 0,
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "transparent",
          border: "1px solid #dcdcdc !important",
        },
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "11px",
      }),
    };
  } else {
    level_C_DD = {
      control: (base, state) => ({
        ...base,
        // marginLeft: -25,
        borderRadius: "none",
        // border: "1px solid transparent",
        // marginTop: 1,
        height: "34px",
        minHeight: "34px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "20px",
        width: "100%",
        // width: data == "ABC" ? 170 : 0, // For A
        //     // width: 167, // For ABC
        //     // width: 259, // For AB
        //     // width: 258, // For AC
        // letterSpacing: "-0.02em",
        // textDecorationLine: "underline",
        color: "#000000",

        "&:hover": {
          background: "#d5effb !important",
          border: "1px solid #dcdcdc !important",
        },
        // boxShadow: state.isFocused ? "0 0 0 0.18rem #00A0F5" : "",
        border: state.isFocused ? "2px solid #00a0f5" : "1px solid transparent",
        boxShadow: "none",
        background: state.isFocused ? "#d5effb !important" : "",
      }),
      dropdownIndicator: (base) => ({
        // background: "black",
        color: " #ADADAD",
        // marginRight: "5px",
        // height: "4.5px",
        // width: "9px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 999,
        fontSize: "12px",
      }),
    };
  }
  return level_C_DD;
};

export const taxTypeOpts = [
  { label: "Taxable", value: "taxable" },
  { label: "Tax Paid", value: "taxpaid" },
  { label: "Exempted", value: "exempted" },
];

export const allEqual = (arr) => {
  return arr.every((element) => element === "");
};

export const userDecimalPlace = 2;

export const handlesetFieldValue = (
  setFieldValue,
  key,
  value,
  firstLetterCaps = false
) => {
  value = value.trim();
  if (firstLetterCaps == true) {
    value = value.charAt(0).toUpperCase() + value.slice(1);
  }
  setFieldValue(key, value);
};

export const handleDataCapitalised = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
