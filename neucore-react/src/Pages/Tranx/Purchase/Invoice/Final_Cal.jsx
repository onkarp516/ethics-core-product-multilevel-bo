handleAdditionalChargesSubmit = (discamtval = -1, type = "") => {
  const { rows, additionalChargesTotal } = this.state;
  // console.log({ discamtval, type });

  if (discamtval == "") {
    discamtval = 0;
  }
  if (type != "" && discamtval >= 0) {
    if (type == "purchase_discount") {
      this.myRef.current.setFieldValue(
        "purchase_discount",
        discamtval != "" ? discamtval : 0
      );
    } else {
      this.myRef.current.setFieldValue(
        "purchase_discount_amt",
        discamtval != "" ? discamtval : 0
      );
    }
  }
  let totalamt = 0;
  /**
   * @description calculate indivisual row discount and total amt
   */
  let row_disc = rows.map((v) => {
    if (v["productId"] != "") {
      let baseamt = 0;
      let i_totalamt = 0;
      v["productDetails"] = v.productDetails.map((vi) => {
        if (vi["qty"] != "" && vi["rate"] != "") {
          vi["base_amt"] = parseInt(vi["qty"]) * parseFloat(vi["rate"]);
        } else {
          vi["base_amt"] = 0;
        }
        vi["total_amt"] = vi["base_amt"];
        vi["unit_conv"] = vi["unitId"] ? vi["unitId"]["unit_conversion"] : "";
        baseamt = parseFloat(baseamt) + parseFloat(vi["base_amt"]);
        if (vi["dis_amt"] != "" && vi["dis_amt"] > 0) {
          vi["total_amt"] =
            parseFloat(vi["total_amt"]) - parseFloat(vi["dis_amt"]);
          vi["dis_amt_cal"] = vi["dis_amt"];
        }
        if (vi["dis_per"] != "" && vi["dis_per"] > 0) {
          let per_amt = calculatePercentage(vi["total_amt"], vi["dis_per"]);
          vi["dis_per_cal"] = per_amt;
          vi["total_amt"] = vi["total_amt"] - per_amt;
        }
        i_totalamt = parseFloat(i_totalamt) + parseFloat(vi["total_amt"]);

        return vi;
      });
      v["base_amt"] = baseamt;
      v["total_amt"] = i_totalamt;
      totalamt = parseFloat(totalamt) + i_totalamt;
    }
    return v;
  });

  // console.log("row_disc", { row_disc });
  // console.log("totalamt", totalamt);
  let ntotalamt = 0;
  /**
   *purchase Discount ledger selected
   */
  let bdisc = row_disc.map((v, i) => {
    if (v["productId"] != "") {
      if (type != "" && discamtval >= 0) {
        if (type == "purchase_discount") {
          let disc_total_amt = 0;
          let disc_prop_cal = 0;
          v["productDetails"] = v.productDetails.map((vi) => {
            let peramt = calculatePercentage(
              totalamt,
              parseFloat(discamtval),
              vi["total_amt"]
            );
            vi["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              peramt,
              vi["total_amt"]
            );
            vi["total_amt"] =
              vi["total_amt"] -
              calculatePrValue(totalamt, peramt, vi["total_amt"]);

            disc_prop_cal =
              parseFloat(disc_prop_cal) +
              parseFloat(vi["discount_proportional_cal"]);
            disc_total_amt =
              parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
            return vi;
          });

          v["total_amt"] = disc_total_amt;
          v["discount_proportional_cal"] = disc_prop_cal;
        } else {
          let disc_total_amt = 0;
          let disc_prop_cal = 0;
          v["productDetails"] = v.productDetails.map((vi) => {
            vi["total_amt"] =
              vi["total_amt"] -
              calculatePrValue(
                totalamt,
                parseFloat(discamtval),
                vi["total_amt"]
              );
            vi["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              parseFloat(discamtval),
              vi["total_amt"]
            );
            disc_prop_cal =
              parseFloat(disc_prop_cal) +
              parseFloat(vi["discount_proportional_cal"]);
            disc_total_amt =
              parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
            return vi;
          });

          v["total_amt"] = disc_total_amt;
          v["discount_proportional_cal"] = disc_prop_cal;
        }
      } else {
        if (
          this.myRef.current.values.purchase_discount > 0 &&
          this.myRef.current.values.purchase_discount != ""
        ) {
          let disc_total_amt = 0;
          let disc_prop_cal = 0;
          v["productDetails"] = v.productDetails.map((vi) => {
            let peramt = calculatePercentage(
              totalamt,
              parseFloat(this.myRef.current.values.purchase_discount),
              vi["total_amt"]
            );
            vi["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              peramt,
              vi["total_amt"]
            );
            vi["total_amt"] =
              vi["total_amt"] -
              calculatePrValue(totalamt, peramt, vi["total_amt"]);

            disc_prop_cal =
              parseFloat(disc_prop_cal) +
              parseFloat(vi["discount_proportional_cal"]);
            disc_total_amt =
              parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
            return vi;
          });

          v["total_amt"] = disc_total_amt;
          v["discount_proportional_cal"] = disc_prop_cal;
        }
        if (
          this.myRef.current.values.purchase_discount_amt > 0 &&
          this.myRef.current.values.purchase_discount_amt != ""
        ) {
          let disc_total_amt = 0;
          let disc_prop_cal = 0;
          v["productDetails"] = v.productDetails.map((vi) => {
            vi["total_amt"] =
              vi["total_amt"] -
              calculatePrValue(
                totalamt,
                parseFloat(this.myRef.current.values.purchase_discount_amt),
                vi["total_amt"]
              );
            vi["discount_proportional_cal"] = calculatePrValue(
              totalamt,
              parseFloat(discamtval),
              vi["total_amt"]
            );
            disc_prop_cal =
              parseFloat(disc_prop_cal) +
              parseFloat(vi["discount_proportional_cal"]);
            disc_total_amt =
              parseFloat(disc_total_amt) + parseFloat(vi["total_amt"]);
            return vi;
          });

          v["total_amt"] = disc_total_amt;
          v["discount_proportional_cal"] = disc_prop_cal;
        }
      }
      ntotalamt = parseFloat(ntotalamt) + parseFloat(v["total_amt"]);
    }
    return v;
  });

  // console.log("ntotalamt", { ntotalamt });
  /**
   * Additional Charges
   */
  let addCharges = [];

  addCharges = bdisc.map((v, i) => {
    let add_total_amt = 0;
    let add_prop_cal = 0;
    if (v["productId"] != "") {
      v["productDetails"] = v.productDetails.map((vi) => {
        vi["total_amt"] = parseFloat(
          vi["total_amt"] +
            calculatePrValue(ntotalamt, additionalChargesTotal, vi["total_amt"])
        ).toFixed(2);
        vi["additional_charges_proportional_cal"] = calculatePrValue(
          ntotalamt,
          additionalChargesTotal,
          vi["total_amt"]
        );
        add_total_amt = parseFloat(add_total_amt) + parseFloat(vi["total_amt"]);
        add_prop_cal =
          parseFloat(add_prop_cal) +
          parseFloat(vi["additional_charges_proportional_cal"]);
        return vi;
      });
      v["total_amt"] = parseFloat(add_total_amt).toFixed(2);
      v["additional_charges_proportional_cal"] =
        parseFloat(add_prop_cal).toFixed(2);
    }
    return v;
  });

  let famt = 0;
  let totalbaseamt = 0;
  let totaltaxableamt = 0;
  let totaltaxamt = 0;
  let totalcgstamt = 0;
  let totalsgstamt = 0;
  let totaligstamt = 0;
  let total_discount_proportional_amt = 0;
  let total_additional_charges_proportional_amt = 0;
  let total_purchase_discount_amt = 0;

  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  let totalqtyH = 0;
  let totalqtyM = 0;
  let totalqtyL = 0;
  /**
   * GST Calculation
   * **/

  let frow = addCharges.map((v, i) => {
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

        return vi;
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
      famt = parseFloat(parseFloat(famt) + parseFloat(v["final_amt"])).toFixed(
        2
      );
      totalbaseamt = parseFloat(parseFloat(totalbaseamt) + i_base_amt).toFixed(
        2
      );

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
                  vi["amt"] =
                    parseFloat(vi["amt"]) + parseFloat(v["total_igst"]);
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
                  vi["amt"] =
                    parseFloat(vi["amt"]) + parseFloat(v["total_cgst"]);
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
                  vi["amt"] =
                    parseFloat(vi["amt"]) + parseFloat(v["total_sgst"]);
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

  let roundoffamt = Math.round(famt);

  let roffamt = parseFloat(roundoffamt - famt).toFixed(2);

  this.myRef.current.setFieldValue("totalqtyH", totalqtyH);
  this.myRef.current.setFieldValue("totalqtyM", totalqtyM);
  this.myRef.current.setFieldValue("totalqtyL", totalqtyL);

  // this.myRef.current.setFieldValue("totalqty", totalqty);
  this.myRef.current.setFieldValue(
    "total_purchase_discount_amt",
    parseFloat(total_purchase_discount_amt).toFixed(2)
  );
  // ``;
  this.myRef.current.setFieldValue(
    "total_discount_proportional_amt",
    parseFloat(total_discount_proportional_amt).toFixed(2)
  );
  this.myRef.current.setFieldValue(
    "total_additional_charges_proportional_amt",
    parseFloat(total_additional_charges_proportional_amt).toFixed(2)
  );

  this.myRef.current.setFieldValue("roundoff", roffamt);
  this.myRef.current.setFieldValue(
    "total_base_amt",
    parseFloat(totalbaseamt).toFixed(2)
  );
  this.myRef.current.setFieldValue(
    "total_taxable_amt",
    parseFloat(totaltaxableamt).toFixed(2)
  );

  this.myRef.current.setFieldValue(
    "totalcgst",
    parseFloat(totalcgstamt).toFixed(2)
  );
  this.myRef.current.setFieldValue(
    "totalsgst",
    parseFloat(totalsgstamt).toFixed(2)
  );
  this.myRef.current.setFieldValue(
    "totaligst",
    parseFloat(totaligstamt).toFixed(2)
  );

  this.myRef.current.setFieldValue(
    "total_tax_amt",
    parseFloat(totaltaxamt).toFixed(2)
  );
  this.myRef.current.setFieldValue(
    "totalamt",
    parseFloat(roundoffamt).toFixed(2)
  );

  let taxState = { cgst: taxCgst, sgst: taxSgst, igst: taxIgst };
  this.setState({ rows: frow, additionchargesyes: false, taxcal: taxState });
};
