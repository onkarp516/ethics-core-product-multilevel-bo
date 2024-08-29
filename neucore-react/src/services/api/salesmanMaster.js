import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createSalesmanURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/create_salesman_master`;
}
export function getSalesmanbyOutletUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_salesman_master`;
}
export function updateSalesmanUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/update_salesman_master`;
}
export function getSalesmanUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_salesman_master_by_id`;
}

// export function validate_TaxURL() {
//     return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_Tax`;
// }

export function deleteSalesmanURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/remove_salesman_master`;
}
export function validateSalesmanmasterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_salesman_master`;
}
export function validateSalesmanmasterUpdateURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/validate_salesman_master_update`;
}