import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createappConfigURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/create_app_config`;
}

export function getappConfigURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_outlet_appConfig`;
}
export function getAllMasterAppConfigURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_all_master_system_config`;
}

export function updateAppConfigURL() {
    return `http://${getCurrentIpaddress()}:${getPortNo()}/update_app_config`;
}
