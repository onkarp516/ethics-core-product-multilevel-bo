import { getHeader } from "@/helpers";
import axios from "axios";
import {
    createSalesmanURL,
    getSalesmanbyOutletUrl,
    updateSalesmanUrl,
    getSalesmanUrl,
    deleteSalesmanURL,
    validateSalesmanmasterURL,
    validateSalesmanmasterUpdateURL
} from "../api";

export function createSalesmanMaster(requestData) {
    return axios({
        url: createSalesmanURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

export function getSalesmanMasterOutlet(requestData) {
    return axios({
        url: getSalesmanbyOutletUrl(),
        data: requestData,
        method: "GET",
        headers: getHeader(),
    });
}
export function updateSalesmanMaster(requestData) {
    return axios({
        url: updateSalesmanUrl(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}
export function getSalesmanMaster(requestData) {
    return axios({
        url: getSalesmanUrl(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

export function deleteSalesmanMaster(requestData) {
    return axios({
        url: deleteSalesmanURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

export function validateSalesmanmaster(requestData) {
    return axios({
        url: validateSalesmanmasterURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}
export function validateSalesmanmasterUpdate(requestData) {
    return axios({
        url: validateSalesmanmasterUpdateURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}