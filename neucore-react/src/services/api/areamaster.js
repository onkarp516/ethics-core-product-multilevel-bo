import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createAreaMasterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/create_area_master`;
}
export function getAreaMasterbyOutletUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_area_master`;
}
export function updateAreaMasterUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/update_area_master`;
}
export function getAreaMasterUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_area_master_by_id`;
}

// export function validate_TaxURL() {
//     return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_Tax`;
// }

export function deleteAreaMasterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/remove_area_master`;
}
export function validate_area_masterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_area_master`;
}
export function validate_area_master_updateURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_area_master_update`;
}