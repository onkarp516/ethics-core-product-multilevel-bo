import {
    getDashboardDataURL,
} from "../api";
import { getHeader } from "@/helpers";
import axios from "axios";

export function getDashboardData(requestData){
    return axios({
        url: getDashboardDataURL(),
        data: requestData,
        method: "POST",
        headers: getHeader(),
    })

}