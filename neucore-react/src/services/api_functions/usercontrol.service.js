import { getHeader } from "@/helpers";
import axios from "axios";
import {
    createappConfigURL,
    getappConfigURL,
    getAllMasterAppConfigURL,
    updateAppConfigURL
} from "../api";

export function createappConfig(requestData) {
    return axios({
        url: createappConfigURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

export function getAllMasterAppConfig(requestData) {
    return axios({
        url: getAllMasterAppConfigURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}
export function updateAppConfig(requestData) {
    return axios({
        url: updateAppConfigURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}
export function getappConfig() {
    return axios({
        url: getappConfigURL(),
        method: "GET",
        headers: getHeader(),
    });
}
