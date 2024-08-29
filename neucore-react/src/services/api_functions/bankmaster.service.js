import { getHeader } from "@/helpers";
import axios from "axios";
import {
    createBankMasterURL,
    getBankMasterbyOutletUrl,
    updateBankMasterUrl,
    getBankMasterUrl,
    deleteBankMasterURL,
} from "../api";

export function createBankMaster(requestData) {
    return axios({
        url: createBankMasterURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

export function getBankMasterOutlet(requestData) {
    return axios({
        url: getBankMasterbyOutletUrl(),
        data: requestData,
        method: "GET",
        headers: getHeader(),
    });
}
export function updateBankMaster(requestData) {
    return axios({
        url: updateBankMasterUrl(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}
export function getBankMaster(requestData) {
    return axios({
        url: getBankMasterUrl(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

export function deleteBankMaster(requestData) {
    return axios({
        url: deleteBankMasterURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}
