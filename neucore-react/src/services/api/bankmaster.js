import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createBankMasterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/create_bank_master`;
}
export function getBankMasterbyOutletUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_bank_master`;
}
export function updateBankMasterUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/update_bank_master`;
}
export function getBankMasterUrl() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_bank_master_by_id`;
}

export function deleteBankMasterURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/remove_bank_master`;
}
