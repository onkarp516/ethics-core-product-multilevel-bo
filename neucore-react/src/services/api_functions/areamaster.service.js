import { getHeader } from "@/helpers";
import axios from "axios";
import {
    createAreaMasterURL,
    getAreaMasterbyOutletUrl,
    updateAreaMasterUrl,
    getAreaMasterUrl,
    deleteAreaMasterURL,
    validate_area_masterURL,
    validate_area_master_updateURL,
} from "../api";

export function createAreaMaster(requestData) {
    return axios({
        url: createAreaMasterURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

export function getAreaMasterOutlet(requestData) {
    return axios({
        url: getAreaMasterbyOutletUrl(),
        data: requestData,
        method: "GET",
        headers: getHeader(),
    });
}
export function updateAreaMaster(requestData) {
    return axios({
        url: updateAreaMasterUrl(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}
export function getAreaMaster(requestData) {
    return axios({
        url: getAreaMasterUrl(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}

export function deleteAreaMaster(requestData) {
    return axios({
        url: deleteAreaMasterURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    });
}
export function validate_area_master(requestData) {
    return axios({
      url:validate_area_masterURL(),
      method: "POST",
      headers: getHeader(),
      data: requestData,
    });
  }
  export function validate_area_master_update(requestData) {
    return axios({
      url:validate_area_master_updateURL(),
      method: "POST",
      headers: getHeader(),
      data: requestData,
    });
  }