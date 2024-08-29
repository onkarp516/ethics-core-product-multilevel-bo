import { authenticationService } from "@/services/api_functions";
export const OTPTimeoutMinutes = 5;
export const OTPTimeoutSeconds = 0;
// Mobile Regex
export const MobileRegx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
//Only character allowed regex
export const alphaRegExp = /^(([a-zA-Z\s]))+$/;
//Only letter accept
export const onlyletterPattern = /^[A-Za-z][A-Za-z\s]*$/;
// Alphanumeric Regex
export const alphaNumericRex = /^[a-zA-Z0-9]*$/;
export const drivingLicenseNewRex = /^(?![0-9]*$)(?![a-zA-Z]*$)[a-zA-Z0-9]+$/;

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

export const ifsc_code_regex = "^[A-Z]{4}0[A-Z0-9]{6}$";

export const pan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

export const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const SUPPORTED_FORMATS_PDF = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const pincodeReg = /^[1-9][0-9]{5}$/;

export const postalCode = /(^\d{6}$)|(^\d{5}-\d{4}$)/;

export const bankAccountNumber = /^\d{6,18}$/;

export const characterRegEx = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

export const Accepts_numeric_regex = /^(0|[1-9][0-9]*)$/;

export const only_alphabets = /^[a-zA-Z\s]+$/;

export const alphanumericRegEx = /^[\w\s]*$/;

export const alphanumericWithCommaRegEx = /^[\w\s,_@./!@#$%^&*()-_+]*$/;

export const doubleNumRegEx = /^[0-9]+(\.[0-9]+)?$/;

export const autoCapitalize = (input) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const getSelectValue = (opts, val) => {
  return opts.find((o) => o.value === val);
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

export const calculatePrValue = (final_amt, discount_amt, total_amt) => {
  let res = parseFloat(
    (parseFloat(discount_amt) * parseFloat(total_amt)) / parseFloat(final_amt)
  );

  return res;
};

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

export const OnlyEnterAlphaNumbers = (e) => {
  var regex = new RegExp("^[a-zA-Z0-9]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);

  if (regex.test(str)) {
    return true;
  }
  e.preventDefault();
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

export const getValue = (opts, val) => opts.find((o) => o.value === val);

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
      height: 24,
      minHeight: 24,
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
      height: 24,
      minHeight: 24,
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
      height: 24,
      minHeight: 24,
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
      height: 26,
      minHeight: 26,
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
      height: 24,
      minHeight: 24,
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
      height: 26,
      minHeight: 26,
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
      fontSize: "11px",
      lineHeight: "normal",
      // zIndex: 5,
      borderRadius: "0px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
    menu: (base) => ({ ...base, zIndex: 9, fontSize: "11px" }),
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
    menu: (base) => ({ ...base, zIndex: 9, fontSize: "12px" }),
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
    menu: (base) => ({ ...base, zIndex: 9, fontSize: "14px" }),
  };
}

export let invoiceSelectTo = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  invoiceSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 0,
      height: 22,
      minHeight: 22,
      fontSize: "11px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
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
      marginTop: 0,
      height: 25,
      minHeight: 25,
      fontSize: "13px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "12px",
    }),
  };
} else if (window.matchMedia("(min-width:1369px)").matches) {
  invoiceSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 0,
      height: 28,
      minHeight: 28,
      fontSize: "14px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "13px",
    }),
  };
}

// export const PackageSelectTo = {
//   control: (base) => ({
//     ...base,
//     marginTop: "3px",
//     height: 25,
//     minHeight: 25,
//     fontSize: "13px",
//     width: "92px",
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
//     width: "92px",
//     // marginLeft: "10px",
//   }),
// };

export let PackageSelectTo = "";
// Check if the media query is true
if (window.matchMedia("(min-width:700px) and (max-width:1024px)").matches) {
  PackageSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 0,
      height: 24,
      minHeight: 24,
      fontSize: "11px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "10px",
    }),
  };
} else if (
  window.matchMedia("(min-width:1025px) and (max-width:1368px)").matches
) {
  PackageSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 0,
      height: 28,
      minHeight: 28,
      fontSize: "13px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "12px",
    }),
  };
} else if (window.matchMedia("(min-width:1369px)").matches) {
  PackageSelectTo = {
    control: (base) => ({
      ...base,
      // marginLeft: -25,
      marginTop: 0,
      height: 32,
      minHeight: 32,
      fontSize: "14px",
      width: "100%",
      marginBottom: 0,
      marginRight: -10,
    }),
    dropdownIndicator: (base) => ({
      // background: "black",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 5,
      fontSize: "13px",
    }),
  };
}
