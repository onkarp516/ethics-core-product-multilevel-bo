let frow_new = addCharges.map((v, i) => {
  if (v["productId"] != "") {
    let i_total_igst = 0;
    let i_total_cgst = 0;
    let i_total_sgst = 0;
    let i_final_amt = 0;
    let i_total_purchase_discount_amt = 0;
    let i_total_discount_proportional_amt = 0;
    let i_total_additional_charges_proportional_amt = 0;
    let i_base_amt = 0;
    let i_total_amt = 0;
    v["productDetails"] = v.productDetails.map((vi) => {
      vi["igst"] = v["productId"]["igst"];
      vi["gst"] = v["productId"]["igst"];
      vi["cgst"] = v["productId"]["cgst"];
      vi["sgst"] = v["productId"]["sgst"];
      i_total_amt = i_total_amt + parseFloat(vi["total_amt"]);
      vi["total_igst"] = parseFloat(
        calculatePercentage(vi["total_amt"], v["productId"]["igst"])
      ).toFixed(2);
      vi["total_cgst"] = parseFloat(
        calculatePercentage(vi["total_amt"], v["productId"]["cgst"])
      ).toFixed(2);
      vi["total_sgst"] = parseFloat(
        calculatePercentage(vi["total_amt"], v["productId"]["sgst"])
      ).toFixed(2);

      vi["final_amt"] = parseFloat(
        parseFloat(vi["total_amt"]) + parseFloat(vi["total_igst"])
      ).toFixed(2);
      i_total_igst = parseFloat(i_total_igst) + parseFloat(vi["total_igst"]);
      i_total_cgst = parseFloat(i_total_cgst) + parseFloat(vi["total_cgst"]);
      i_total_sgst = parseFloat(i_total_sgst) + parseFloat(vi["total_sgst"]);
      i_final_amt = parseFloat(i_final_amt) + parseFloat(vi["final_amt"]);
      i_total_purchase_discount_amt =
        parseFloat(i_total_purchase_discount_amt) +
        parseFloat(vi["discount_proportional_cal"]);
      i_total_discount_proportional_amt =
        parseFloat(i_total_discount_proportional_amt) +
        parseFloat(vi["discount_proportional_cal"]);
      i_total_additional_charges_proportional_amt =
        parseFloat(i_total_additional_charges_proportional_amt) +
        parseFloat(vi["additional_charges_proportional_cal"]);

      let baseamt = parseFloat(vi["base_amt"]);
      if (vi["dis_amt"] != "" && vi["dis_amt"] > 0) {
        baseamt = baseamt - parseFloat(vi["dis_amt_cal"]);
      }
      if (vi["dis_per"] != "" && vi["dis_per"] > 0) {
        baseamt = baseamt - parseFloat(vi["dis_per_cal"]);
      }
      i_base_amt = i_base_amt + parseFloat(baseamt);
    });
    v["total_igst"] = parseFloat(i_total_igst).toFixed(2);
    v["total_cgst"] = parseFloat(i_total_cgst).toFixed(2);
    v["total_sgst"] = parseFloat(i_total_sgst).toFixed(2);

    v["final_amt"] = parseFloat(i_final_amt).toFixed(2);
    totalqtyH += parseInt(v["qtyH"] != "" ? v["qtyH"] : 0);
    totalqtyM += parseInt(v["qtyM"] != "" ? v["qtyM"] : 0);
    totalqtyL += parseInt(v["qtyL"] != "" ? v["qtyL"] : 0);
    totaligstamt += parseFloat(v["total_igst"]).toFixed(2);
    totalcgstamt += parseFloat(v["total_cgst"]).toFixed(2);
    totalsgstamt += parseFloat(v["total_sgst"]).toFixed(2);
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      parseFloat(i_total_purchase_discount_amt);
    total_discount_proportional_amt =
      parseFloat(total_discount_proportional_amt) +
      parseFloat(i_total_discount_proportional_amt);
    total_additional_charges_proportional_amt =
      parseFloat(total_additional_charges_proportional_amt) +
      parseFloat(i_total_additional_charges_proportional_amt);
    // additional_charges_proportional_cal
    famt = parseFloat(parseFloat(famt) + parseFloat(v["final_amt"])).toFixed(2);
    totalbaseamt = parseFloat(parseFloat(totalbaseamt) + i_base_amt).toFixed(2);

    totaltaxableamt = parseFloat(
      parseFloat(totaltaxableamt) + parseFloat(i_total_amt)
    ).toFixed(2);
    totaltaxamt = parseFloat(
      parseFloat(totaltaxamt) + parseFloat(v["total_igst"])
    ).toFixed(2);

    // ! Tax Indidual gst % calculation
    if (v.productId != "") {
      if (v.productId.igst > 0) {
        if (taxIgst.length > 0) {
          let innerIgstTax = taxIgst.find((vi) => vi.gst == v.productId.igst);
          if (innerIgstTax != undefined) {
            let innerIgstCal = taxIgst.filter((vi) => {
              if (vi.gst == v.productId.igst) {
                vi["amt"] = parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
              }
              return vi;
            });
            taxIgst = [...innerIgstCal];
          } else {
            let innerIgstCal = {
              gst: v.productId.igst,
              amt: parseFloat(v.total_igst),
            };
            taxIgst = [...taxIgst, innerIgstCal];
          }
        } else {
          let innerIgstCal = {
            gst: v.productId.igst,
            amt: parseFloat(v.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      }
      if (v.productId.cgst > 0) {
        if (taxCgst.length > 0) {
          let innerCgstTax = taxCgst.find((vi) => vi.gst == v.productId.cgst);
          // console.log("innerTax", innerTax);
          if (innerCgstTax != undefined) {
            let innerCgstCal = taxCgst.filter((vi) => {
              if (vi.gst == v.productId.cgst) {
                vi["amt"] = parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
              }
              return vi;
            });
            taxCgst = [...innerCgstCal];
          } else {
            let innerCgstCal = {
              gst: v.productId.cgst,
              amt: parseFloat(v.total_cgst),
            };
            taxCgst = [...taxCgst, innerCgstCal];
          }
        } else {
          let innerCgstCal = {
            gst: v.productId.cgst,
            amt: parseFloat(v.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      }
      if (v.productId.sgst > 0) {
        if (taxSgst.length > 0) {
          let innerCgstTax = taxSgst.find((vi) => vi.gst == v.productId.sgst);
          if (innerCgstTax != undefined) {
            let innerCgstCal = taxSgst.filter((vi) => {
              if (vi.gst == v.productId.sgst) {
                vi["amt"] = parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
              }
              return vi;
            });
            taxSgst = [...innerCgstCal];
          } else {
            let innerCgstCal = {
              gst: v.productId.sgst,
              amt: parseFloat(v.total_sgst),
            };
            taxSgst = [...taxSgst, innerCgstCal];
          }
        } else {
          let innerCgstCal = {
            gst: v.productId.sgst,
            amt: parseFloat(v.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      }
    }
  }
  return v;
});

///*** old frow*/

let frow = addCharges.map((v, i) => {
  if (v["productId"] != "") {
    let i_total_purchase_discount_amt = 0;
    let i_total_discount_proportional_amt = 0;
    let i_totalbaseamt = 0;
    let i_total_additional_charges_proportional_amt = 0;
    let i_totaltaxableamt = 0;
    let i_totaltaxamt = 0;
    let i_totaligst = 0;
    let i_totalcgst = 0;
    let i_totalsgst = 0;

    v["productDetails"] = v.productDetails.map((vi) => {
      vi["igst"] = v["productId"]["igst"];
      vi["gst"] = v["productId"]["igst"];
      vi["cgst"] = v["productId"]["cgst"];
      vi["sgst"] = v["productId"]["sgst"];
      vi["total_igst"] = parseFloat(
        calculatePercentage(vi["total_amt"], v["productId"]["igst"])
      ).toFixed(2);
      vi["total_cgst"] = parseFloat(
        calculatePercentage(vi["total_amt"], v["productId"]["cgst"])
      ).toFixed(2);
      vi["total_sgst"] = parseFloat(
        calculatePercentage(vi["total_amt"], v["productId"]["sgst"])
      ).toFixed(2);
      vi["final_amt"] = parseFloat(
        parseFloat(vi["total_amt"]) + parseFloat(vi["total_igst"])
      ).toFixed(2);
      i_totaligst = i_totaligst + parseFloat(vi["total_igst"]);
      i_totalcgst = i_totaligst + parseFloat(vi["total_cgst"]);
      i_totalsgst = i_totaligst + parseFloat(vi["total_sgst"]);
      i_total_purchase_discount_amt =
        parseFloat(i_total_purchase_discount_amt) +
        parseFloat(vi["discount_proportional_cal"]);
      i_total_discount_proportional_amt =
        parseFloat(i_total_discount_proportional_amt) +
        parseFloat(vi["discount_proportional_cal"]);
      i_total_additional_charges_proportional_amt =
        parseFloat(i_total_additional_charges_proportional_amt) +
        parseFloat(vi["additional_charges_proportional_cal"]);

      i_totalbaseamt = parseFloat(
        parseFloat(i_totalbaseamt) + vi["baseamt"]
      ).toFixed(2);

      i_totaltaxableamt = parseFloat(
        parseFloat(i_totaltaxableamt) + parseFloat(vi["total_amt"])
      ).toFixed(2);
      i_totaltaxamt = parseFloat(
        parseFloat(i_totaltaxamt) + parseFloat(vi["total_igst"])
      ).toFixed(2);

      return vi;
    });
    v["total_igst"] = parseFloat(i_totaligst).toFixed(2);
    v["total_cgst"] = parseFloat(i_totalcgst).toFixed(2);
    v["total_sgst"] = parseFloat(i_totalsgst).toFixed(2);
    v["final_amt"] = parseFloat(i_totaligst).toFixed(2);
    totalqtyH += parseInt(v["qtyH"] != "" ? v["qtyH"] : 0);
    totalqtyM += parseInt(v["qtyM"] != "" ? v["qtyM"] : 0);
    totalqtyL += parseInt(v["qtyL"] != "" ? v["qtyL"] : 0);
    totaligstamt += parseFloat(v["total_igst"]).toFixed(2);
    totalcgstamt += parseFloat(v["total_cgst"]).toFixed(2);
    totalsgstamt += parseFloat(v["total_sgst"]).toFixed(2);
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      parseFloat(i_total_purchase_discount_amt);
    total_discount_proportional_amt =
      parseFloat(total_discount_proportional_amt) +
      parseFloat(i_total_discount_proportional_amt);
    total_additional_charges_proportional_amt =
      parseFloat(total_additional_charges_proportional_amt) +
      parseFloat(i_total_additional_charges_proportional_amt);
    // additional_charges_proportional_cal
    famt = parseFloat(parseFloat(famt) + parseFloat(v["final_amt"])).toFixed(2);

    totalbaseamt = parseFloat(
      parseFloat(totalbaseamt) + i_totalbaseamt
    ).toFixed(2);

    // totaltaxableamt = parseFloat(
    //   parseFloat(totaltaxableamt) + parseFloat(v["total_amt"])
    // ).toFixed(2);
    // totaltaxamt = parseFloat(
    //   parseFloat(totaltaxamt) + parseFloat(v["total_igst"])
    // ).toFixed(2);

    // ! Tax Indidual gst % calculation
    if (v.productId != "") {
      if (v.productId.igst > 0) {
        if (taxIgst.length > 0) {
          let innerIgstTax = taxIgst.find((vi) => vi.gst == v.productId.igst);
          if (innerIgstTax != undefined) {
            let innerIgstCal = taxIgst.filter((vi) => {
              if (vi.gst == v.productId.igst) {
                vi["amt"] = parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
              }
              return vi;
            });
            taxIgst = [...innerIgstCal];
          } else {
            let innerIgstCal = {
              gst: v.productId.igst,
              amt: parseFloat(v.total_igst),
            };
            taxIgst = [...taxIgst, innerIgstCal];
          }
        } else {
          let innerIgstCal = {
            gst: v.productId.igst,
            amt: parseFloat(v.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      }
      if (v.productId.cgst > 0) {
        if (taxCgst.length > 0) {
          let innerCgstTax = taxCgst.find((vi) => vi.gst == v.productId.cgst);
          // console.log("innerTax", innerTax);
          if (innerCgstTax != undefined) {
            let innerCgstCal = taxCgst.filter((vi) => {
              if (vi.gst == v.productId.cgst) {
                vi["amt"] = parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
              }
              return vi;
            });
            taxCgst = [...innerCgstCal];
          } else {
            let innerCgstCal = {
              gst: v.productId.cgst,
              amt: parseFloat(v.total_cgst),
            };
            taxCgst = [...taxCgst, innerCgstCal];
          }
        } else {
          let innerCgstCal = {
            gst: v.productId.cgst,
            amt: parseFloat(v.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      }
      if (v.productId.sgst > 0) {
        if (taxSgst.length > 0) {
          let innerCgstTax = taxSgst.find((vi) => vi.gst == v.productId.sgst);
          if (innerCgstTax != undefined) {
            let innerCgstCal = taxSgst.filter((vi) => {
              if (vi.gst == v.productId.sgst) {
                vi["amt"] = parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
              }
              return vi;
            });
            taxSgst = [...innerCgstCal];
          } else {
            let innerCgstCal = {
              gst: v.productId.sgst,
              amt: parseFloat(v.total_sgst),
            };
            taxSgst = [...taxSgst, innerCgstCal];
          }
        } else {
          let innerCgstCal = {
            gst: v.productId.sgst,
            amt: parseFloat(v.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      }
    }
  }
  return v;
});
