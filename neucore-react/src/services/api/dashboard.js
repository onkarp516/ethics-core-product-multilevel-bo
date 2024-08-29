import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function getDashboardDataURL(){
    return `http://${getCurrentIpaddress()}:${getPortNo()}/get_dashboard_data1`;
}