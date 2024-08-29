import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function createBarcodeUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/create_barcode`;
}

export function getBarcodeUrl() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_barcode`;
}
