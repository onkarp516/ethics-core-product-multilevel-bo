import { authenticationService } from "@/services/api_functions";

export function authHeader() {
  const token = localStorage.getItem("authenticationService");
  return {
    // "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function authLogin() {
  return {
    "Content-Type": "application/json",
  };
}

export function getHeader() {
  const token = localStorage.getItem("authenticationService");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function isParentExist(parent_slug, permissionJson = "") {
  // console.log("parent_slug =->", parent_slug);
  // console.log("per -> ", permissionJson);
  // console.log("permissions", permissions);
  let res = false;
  // let permissions = JSON.parse(
  //   authenticationService.currentUserValue.permissionJson
  // );
  let permissions = permissionJson;
  if (
    authenticationService.currentUserValue.userRole == "SADMIN" ||
    authenticationService.currentUserValue.userRole == "CADMIN" ||
    authenticationService.currentUserValue.userRole == "BADMIN"
  ) {
    return true;
  }
  let userPermissions = permissions;
  if (userPermissions) {
    // console.log("userpermission in Parent function->", userPermissions);
    userPermissions.map((v) => {
      let parents = v.parent_modules;
      parents.map((vi) => {
        if (vi.slug == parent_slug) {
          res = true;
        }
      });
    });
  }
  return res;
  // return true;
}

export function isActionExist(module_slug, action_slug, permissionJson) {
  let res = false;
  let permissions = permissionJson;
  // console.log("permissions", permissions);
  if (
    authenticationService.currentUserValue &&
    (authenticationService.currentUserValue.userRole == "SADMIN" ||
      authenticationService.currentUserValue.userRole == "CADMIN" ||
      authenticationService.currentUserValue.userRole == "BADMIN")
  ) {
    return true;
  }
  let userPermissions = permissions;
  if (permissions) {
    // console.log("userPermission in is action->", userPermissions);
    // console.log("model slug,Action slug", module_slug, action_slug);
    let obj = userPermissions.find((v) => v.action_mapping_slug == module_slug);
    // console.log("userPermissions", userPermissions);
    // console.log("obj>>>", obj);
    if (obj) {
      let actions = obj.actions;
      if (action_slug == "list") {
        actions.map((vi) => {
          if (vi.slug != action_slug) {
            res = true;
          }
        });
      } else {
        actions.map((vi) => {
          if (vi.slug == action_slug) {
            res = true;
          }
        });
      }
    }
  }
  return res;
  // return true;
}

export function CheckIsRegisterdCompany() {
  if (
    authenticationService.currentUserValue &&
    authenticationService.currentUserValue.gstType &&
    authenticationService.currentUserValue.gstType.toLowerCase() ===
      "registered"
  ) {
    return true;
  }
  return false;
}

export function isUserControl(action_slug, userControl) {
  if (userControl) {
    // console.log("userControl in is action->", action_slug, userControl);
    let obj = userControl.find((v) => v.value == 1 && v.slug == action_slug);
    if (obj) {
      return true;
    }
  }
  return false;
}

export function getUserControlData(action_slug, userControl) {
  if (userControl) {
    // console.log("userControl in is action->", action_slug, userControl);
    let obj = userControl.find((v) => v.value == 1 && v.slug == action_slug);
    if (obj) {
      return obj;
    }
  }
  return false;
}

export function getUserControlLevel(userControl) {
  let level = "";
  let obj;
  if (userControl) {
    obj = userControl.find((v) => v.value == 1 && v.slug == "is_level_c");
    if (obj) {
      level = "ABC";
      return level;
    } else {
      obj = userControl.find((v) => v.value == 1 && v.slug == "is_level_b");
      if (obj) {
        level = "AB";
        return level;
      } else {
        obj = userControl.find((v) => v.value == 1 && v.slug == "is_level_a");
        if (obj) {
          level = "A";
          return level;
        }
      }
    }
  }
  return level;
}

export function isFreeQtyExist(action_slug, userControl) {
  if (userControl) {
    let flag = userControl.find((v) => v.value === 1 && v.slug === action_slug);
    if (flag) {
      return true;
    }
  }
  return false;
}

export function isUserControlExist(action_slug, userControl) {
  if (userControl) {
    let flag = userControl.find((v) => v.value === 1 && v.slug === action_slug);
    if (flag) {
      return true;
    }
  }
  return false;
}

export function isMultiDiscountExist(action_slug, userControl) {
  if (userControl) {
    let flag = userControl.find((v) => v.value === 1 && v.slug === action_slug);
    if (flag) {
      return true;
    }
  }
  return false;
}

export function isMultiRateExist(action_slug, userControl) {
  if (userControl.length > 0) {
    let flag = userControl.find((v) => v.value === 1 && v.slug === action_slug);
    if (flag) {
      return true;
    }
  }
  return false;
}
