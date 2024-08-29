import {
  calculatePercentage,
  calculatePrValue,
  calculateAddChgValue,
  calculateInvoiceDisValue,
  calculatePercentageReverse,
  roundDigit,
} from "@/helpers";

export const fnTranxCalculation = ({
  elementFrom,
  rows,
  ledger_disc_per,
  ledger_disc_amt,
  additionalChargesTotal,

  additionalChgLedgerAmt1,
  additionalChgLedgerAmt2,
  additionalChgLedgerAmt3,

  takeDiscountAmountInLumpsum,
  isFirstDiscountPerCalculate,
}) => {
  additionalChgLedgerAmt3 =
    additionalChgLedgerAmt3 !== "" ? parseFloat(additionalChgLedgerAmt3) : 0;

  let newAdditionalChargesTotal = 0;
  let purchase_discount_amt = 0;
  let purchase_discount = 0;
  if (
    parseFloat(additionalChgLedgerAmt1) > 0 ||
    parseFloat(additionalChgLedgerAmt1) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt1);

  if (
    parseFloat(additionalChgLedgerAmt2) > 0 ||
    parseFloat(additionalChgLedgerAmt2) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt2);
  // console.warn(
  //   "newAdditionalChargesTotal <<<<<<<<<<<<<< " + newAdditionalChargesTotal,
  //   takeDiscountAmountInLumpsum,
  //   isFirstDiscountPerCalculate
  // );

  let total_row_dis_amt = 0;
  let total_row_gross_amt = 0;
  let total_row_gross_amt1 = 0;
  let row_disc_total_amt = 0;
  let totalbaseamt = 0;
  // ! Row level Discount Calculation
  let baserowcal = rows.map((uv, i) => {
    let row_dis_amt = 0;
    let base_amt = parseInt(uv.qty) * parseFloat(uv.rate);
    uv.base_amt = isNaN(base_amt) ? 0 : base_amt;
    uv["gross_amt"] = uv["base_amt"];
    uv["total_amt"] = uv["base_amt"];
    uv["total_base_amt"] = uv["base_amt"];
    if (
      takeDiscountAmountInLumpsum == false &&
      isFirstDiscountPerCalculate == false
    ) {
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }
        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
    } else if (
      isFirstDiscountPerCalculate == true &&
      takeDiscountAmountInLumpsum == false
    ) {
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }
        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
    } else if (
      isFirstDiscountPerCalculate == false &&
      takeDiscountAmountInLumpsum == true
    ) {
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        if (takeDiscountAmountInLumpsum === true) {
          total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        }
        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
    } else if (
      isFirstDiscountPerCalculate == true &&
      takeDiscountAmountInLumpsum == true
    ) {
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }

      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        if (takeDiscountAmountInLumpsum === true) {
          total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
    }

    uv["row_dis_amt"] = row_dis_amt;
    uv["add_chg_amt"] = 0;
    uv["gross_amt1"] = uv["gross_amt"];
    uv["total_amt"] = uv["gross_amt1"];

    row_disc_total_amt =
      parseFloat(row_disc_total_amt) + parseFloat(uv["total_amt"]);
    // ! New code
    total_row_gross_amt =
      parseFloat(total_row_gross_amt) + parseFloat(uv["gross_amt"]);
    total_row_dis_amt =
      parseFloat(total_row_dis_amt) + parseFloat(uv["gross_amt"]);
    totalbaseamt = base_amt;
    return uv;
  });

  // console.log("baserowcal::: <<<<<<<<<<<<<< ", baserowcal);

  // ! Additional charges calculation
  let add_total_amt = 0;
  let add_prop_cal = 0;
  let add_charges_row = baserowcal.map((uv, vi) => {
    if (
      parseFloat(uv.total_amt) > 0 &&
      (parseFloat(additionalChargesTotal) > 0 ||
        parseFloat(additionalChargesTotal) < 0) &&
      uv.qty != ""
    ) {
      // !New code
      uv["add_chg_amt"] = calculateAddChgValue(
        total_row_gross_amt,
        additionalChargesTotal,
        uv["gross_amt"]
      );
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    } else if (uv.qty == "") {
      // !New code
      uv["add_chg_amt"] = 0;
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    }
    add_prop_cal =
      parseFloat(add_prop_cal) +
      parseFloat(uv["additional_charges_proportional_cal"]);
    add_total_amt = parseFloat(add_total_amt) + parseFloat(uv["total_amt"]);

    // ! New code
    total_row_gross_amt1 =
      parseFloat(total_row_gross_amt1) + parseFloat(uv["gross_amt1"]);

    return uv;
  });

  // console.log("add_charges_row ><<<<<<<<<<< ", add_charges_row);

  // ! Discount Ledger Amount discount calculation
  if (elementFrom === "") {
    ledger_disc_amt = ledger_disc_amt;
    ledger_disc_per =
      (parseFloat(ledger_disc_amt) * 100) / parseFloat(total_row_gross_amt1);
  }
  let ledger_disc_base_amt_total = 0;
  let ledger_disc_amt_row = add_charges_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      if (parseFloat(ledger_disc_amt) > 0) {
        purchase_discount_amt = ledger_disc_amt;
        purchase_discount = ledger_disc_per;
        // ! New code
        uv["invoice_dis_amt"] = calculateInvoiceDisValue(
          total_row_gross_amt1,
          parseFloat(ledger_disc_amt),
          uv["gross_amt1"]
        );
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      } else {
        purchase_discount_amt = 0;
        purchase_discount = 0;
        // ! New code
        uv["invoice_dis_amt"] = 0;
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      }
    } else if (uv.qty == "") {
      // ! New code
      uv["invoice_dis_amt"] = 0;
      uv["total_amt"] =
        parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
    }
    ledger_disc_base_amt_total =
      parseFloat(ledger_disc_base_amt_total) + parseFloat(uv["total_amt"]);

    // console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
    return uv;
  });

  let total_final_amt = 0;
  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  let base_amt = 0;
  let total_purchase_discount_amt = 0;
  let total_taxable_amt = 0;
  let total_tax_amt = 0;
  let total_invoice_dis_amt = 0;
  let total_qty = 0;
  let total_free_qty = 0;

  // console.log("ledger_disc_amt_row <<<<<<<<<<<<< ", ledger_disc_amt_row);
  let gst_row = ledger_disc_amt_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      uv["gst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["igst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["cgst"] = uv["unit_id"] ? uv["unit_id"]["cgst"] : 0;
      uv["sgst"] = uv["unit_id"] ? uv["unit_id"]["sgst"] : 0;
      uv["total_igst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["igst"])
      ).toFixed(2);
      uv["total_cgst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["cgst"])
      ).toFixed(2);
      uv["total_sgst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["sgst"])
      ).toFixed(2);
      uv["final_amt"] = parseFloat(
        parseFloat(uv["total_amt"]) + parseFloat(uv["total_igst"])
      ).toFixed(2);
    } else if (uv.qty == "" || uv.rate == 0 || uv.qty == 0) {
      uv["gst"] = 0;
      uv["igst"] = 0;
      uv["cgst"] = 0;
      uv["sgst"] = 0;
      uv["total_igst"] = 0;
      uv["total_cgst"] = 0;
      uv["total_sgst"] = 0;
      uv["final_amt"] = 0;
    }
    // !IGST Calculation
    if (uv.igst > 0) {
      if (taxIgst.length > 0) {
        let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
        if (innerIgstTax != undefined) {
          let innerIgstCal = taxIgst.filter((vi) => {
            if (vi.gst == uv.igst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]);
            }
            return vi;
          });
          taxIgst = [...innerIgstCal];
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,

            gst: uv.igst,
            amt: parseFloat(uv.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      } else {
        let innerIgstCal = {
          d_gst: uv.igst,

          gst: uv.igst,
          amt: parseFloat(uv.total_igst),
        };
        taxIgst = [...taxIgst, innerIgstCal];
      }
    }

    // !CGST Calculation
    if (uv.cgst > 0) {
      if (taxCgst.length > 0) {
        let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxCgst.filter((vi) => {
            if (vi.gst == uv.cgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]);
            }
            return vi;
          });
          taxCgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: parseFloat(uv.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.cgst,
          amt: parseFloat(uv.total_cgst),
        };
        taxCgst = [...taxCgst, innerCgstCal];
      }
    }

    // !SGST Calculation
    if (uv.sgst > 0) {
      if (taxSgst.length > 0) {
        let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxSgst.filter((vi) => {
            if (vi.gst == uv.sgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]);
            }
            return vi;
          });
          taxSgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: parseFloat(uv.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.sgst,
          amt: parseFloat(uv.total_sgst),
        };
        taxSgst = [...taxSgst, innerCgstCal];
      }
    }
    // console.warn("rahul:: uv[final_amt]", uv["final_amt"]);
    total_final_amt = parseFloat(total_final_amt) + parseFloat(uv["final_amt"]);

    // !new code
    base_amt = parseFloat(base_amt) + parseFloat(uv["base_amt"]);
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal"]));
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal_per"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal_per"]));
    total_taxable_amt =
      parseFloat(total_taxable_amt) + parseFloat(uv["total_amt"]);
    total_tax_amt = parseFloat(total_tax_amt) + parseFloat(uv["total_igst"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["row_dis_amt"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["invoice_dis_amt"]);

    total_qty = parseInt(total_qty) + parseInt(uv["qty"]);

    total_free_qty =
      parseInt(total_free_qty) +
      (uv["free_qty"] === "" ? 0 : parseInt(uv["free_qty"]));

    // console.log("gst inner row ", uv);
    return uv;
  });
  // !GST Calculation

  // console.log(
  //   "gst_row >>>>>>>>>>>> ",
  //   gst_row,
  //   base_amt,
  //   newAdditionalChargesTotal
  // );
  base_amt = parseFloat(base_amt) + parseFloat(newAdditionalChargesTotal);

  let additionalChgLedgerAmt3_ = isNaN(parseFloat(additionalChgLedgerAmt3))
    ? 0
    : parseFloat(additionalChgLedgerAmt3);

  let bill_amount = parseFloat(total_final_amt) + additionalChgLedgerAmt3_;

  // console.log("bill_amount>>>>", bill_amount, additionalChgLedgerAmt3_);

  total_free_qty = isNaN(total_free_qty) === true ? 0 : total_free_qty;
  let costing_row = gst_row.map((cv, ci) => {
    // let is_batch = cv["selectedProduct"]["is_batch"];
    // console.log("is_batch", is_batch);
    let totalqty =
      (isNaN(parseInt(cv["qty"])) ? 0 : parseInt(cv["qty"])) +
      (isNaN(parseInt(cv["free_qty"])) ? 0 : parseInt(cv["free_qty"]));

    let costingcal = parseFloat(cv["total_amt"]) / totalqty;

    let costingwithtaxcal =
      parseFloat(costingcal) + parseFloat(cv["total_igst"]) / totalqty;

    cv["costing"] = parseFloat(costingcal).toFixed(3);
    cv["costing_with_tax"] = parseFloat(costingwithtaxcal).toFixed(3);

    return cv;
  });

  return {
    base_amt,
    total_purchase_discount_amt,
    total_taxable_amt,
    total_tax_amt,
    gst_row: costing_row,
    total_final_amt,
    taxIgst,
    taxCgst,
    taxSgst,
    total_invoice_dis_amt,
    total_qty,
    total_free_qty,
    bill_amount,
    purchase_discount,
    purchase_discount_amt,
    total_row_gross_amt,
    total_row_gross_amt1,
  };
};

//Inclusive GST calculation
export const fnTranxCalculationGST = ({
  elementFrom,
  rows,
  ledger_disc_per,
  ledger_disc_amt,
  additionalChargesTotal,

  additionalChgLedgerAmt1,
  additionalChgLedgerAmt2,
  additionalChgLedgerAmt3,

  takeDiscountAmountInLumpsum,
  isFirstDiscountPerCalculate,
}) => {
  additionalChgLedgerAmt3 =
    additionalChgLedgerAmt3 !== "" ? parseFloat(additionalChgLedgerAmt3) : 0;

  let newAdditionalChargesTotal = 0;
  let purchase_discount_amt = 0;
  let purchase_discount = 0;
  if (
    parseFloat(additionalChgLedgerAmt1) > 0 ||
    parseFloat(additionalChgLedgerAmt1) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt1);

  if (
    parseFloat(additionalChgLedgerAmt2) > 0 ||
    parseFloat(additionalChgLedgerAmt2) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt2);
  // console.warn(
  //   "newAdditionalChargesTotal <<<<<<<<<<<<<< " + newAdditionalChargesTotal,
  //   takeDiscountAmountInLumpsum,
  //   isFirstDiscountPerCalculate
  // );

  let total_row_dis_amt = 0;
  let total_row_gross_amt = 0;
  let total_row_gross_amt1 = 0;
  let row_disc_total_amt = 0;
  let totalbaseamt = 0;
  // ! Row level Discount Calculation
  let baserowcal = rows.map((uv, i) => {
    console.log("rows---->", rows);
    let row_dis_amt = 0;
    let base_amt = parseInt(uv.qty) * parseFloat(uv.rate);
    let org_base_amt = parseInt(uv.qty) * parseFloat(uv.org_rate);

    uv.base_amt = isNaN(base_amt) ? 0 : base_amt;
    uv.org_base_amt = isNaN(org_base_amt) ? 0 : org_base_amt;

    let disAmt = (parseFloat(uv.org_rate) * parseFloat(uv.dis_per)) / 100;
    console.log("disAmtPerQty", disAmt);

    let perTotal = parseFloat(uv.org_rate) - disAmt;
    console.log("perTotal", perTotal);

    let disAmtTotal = parseFloat(uv.qty) * disAmt;
    console.log("disAmtTotal", disAmtTotal);
    let disPerRate = parseFloat(uv.org_rate) - disAmt;
    console.log("disPerRate", disPerRate);
    let disRatePerTotal = disPerRate * parseInt(uv.qty);
    console.log("disRatePerTotal", disRatePerTotal);
    let gstPerqty =
      (disPerRate * parseFloat(uv["unit_id"]["igst"])) /
      (100 + parseFloat(uv["unit_id"]["igst"]));
    console.log("gstPerqty", gstPerqty);
    let taxableAmt = parseFloat(disRatePerTotal) - parseFloat(gstPerqty);
    console.log("taxableAmt", taxableAmt);
    let gstAmt = gstPerqty * parseInt(uv.qty);
    console.log("gstAmt", gstAmt);

    let netAmt = taxableAmt + gstAmt;
    console.log("netAmt", netAmt);
    uv["disPerRate"] = disPerRate;
    uv["rate"] = disRatePerTotal.toFixed(2);
    uv["dis_amt_cal"] = 0;
    uv["dis_per_cal"] = disAmtTotal;
    uv["invoice_dis_amt"] = disAmtTotal;
    uv["netAmt"] = netAmt;
    uv["taxableAmt"] = parseFloat(taxableAmt).toFixed(2);

    // uv["net_amt"]=netAmt.toFixed(2);

    uv["gross_amt"] = uv["base_amt"];
    uv["total_amt"] = uv["base_amt"];
    uv["total_base_amt"] = uv["base_amt"];
    uv["org_total_base_amt"] = uv["org_base_amt"];

    uv["row_dis_amt"] = row_dis_amt;
    uv["add_chg_amt"] = 0;
    uv["gross_amt1"] = uv["gross_amt"];

    row_disc_total_amt =
      parseFloat(row_disc_total_amt) + parseFloat(uv["total_amt"]);
    // ! New code
    total_row_gross_amt =
      parseFloat(total_row_gross_amt) + parseFloat(uv["gross_amt"]);
    total_row_dis_amt =
      parseFloat(total_row_dis_amt) + parseFloat(uv["gross_amt"]);
    totalbaseamt = base_amt;
    return uv;
  });

  // console.log("baserowcal::: <<<<<<<<<<<<<< ", baserowcal);

  // ! Additional charges calculation
  let add_total_amt = 0;
  let add_prop_cal = 0;
  let add_charges_row = baserowcal.map((uv, vi) => {
    if (
      parseFloat(uv.total_amt) > 0 &&
      (parseFloat(additionalChargesTotal) > 0 ||
        parseFloat(additionalChargesTotal) < 0) &&
      uv.qty != ""
    ) {
      // !New code
      uv["add_chg_amt"] = calculateAddChgValue(
        total_row_gross_amt,
        additionalChargesTotal,
        uv["gross_amt"]
      );
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    } else if (uv.qty == "") {
      // !New code
      uv["add_chg_amt"] = 0;
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    }
    add_prop_cal =
      parseFloat(add_prop_cal) +
      parseFloat(uv["additional_charges_proportional_cal"]);
    add_total_amt = parseFloat(add_total_amt) + parseFloat(uv["total_amt"]);

    // ! New code
    total_row_gross_amt1 =
      parseFloat(total_row_gross_amt1) + parseFloat(uv["gross_amt1"]);

    return uv;
  });

  // console.log("add_charges_row ><<<<<<<<<<< ", add_charges_row);

  // ! Discount Ledger Amount discount calculation
  if (elementFrom === "") {
    ledger_disc_amt = ledger_disc_amt;
    ledger_disc_per =
      (parseFloat(ledger_disc_amt) * 100) / parseFloat(total_row_gross_amt1);
  }
  let ledger_disc_base_amt_total = 0;
  let ledger_disc_amt_row = add_charges_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      if (parseFloat(ledger_disc_amt) > 0) {
        purchase_discount_amt = ledger_disc_amt;
        purchase_discount = ledger_disc_per;
        // ! New code
        uv["invoice_dis_amt"] = calculateInvoiceDisValue(
          total_row_gross_amt1,
          parseFloat(ledger_disc_amt),
          uv["gross_amt1"]
        );
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      } else {
        purchase_discount_amt = 0;
        purchase_discount = 0;
        // ! New code
        // uv["invoice_dis_amt"] = 0;
        // uv["total_amt"] =
        //   parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      }
    } else if (uv.qty == "") {
      // ! New code
      uv["invoice_dis_amt"] = 0;
      uv["total_amt"] =
        parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
    }
    ledger_disc_base_amt_total =
      parseFloat(ledger_disc_base_amt_total) + parseFloat(uv["total_amt"]);

    // console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
    return uv;
  });

  let total_final_amt = 0;
  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  let base_amt = 0;
  let total_purchase_discount_amt = 0;
  let total_taxable_amt = 0;
  let total_tax_amt = 0;
  let total_invoice_dis_amt = 0;
  let total_qty = 0;
  let total_free_qty = 0;

  console.log("ledger_disc_amt_row <<<<<<<<<<<<< ", ledger_disc_amt_row);
  let gst_row = ledger_disc_amt_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      uv["gst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["igst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["cgst"] = uv["unit_id"] ? uv["unit_id"]["cgst"] : 0;
      uv["sgst"] = uv["unit_id"] ? uv["unit_id"]["sgst"] : 0;
      uv["total_igst"] = parseFloat(
        calculatePercentageReverse(uv["disPerRate"], uv["igst"])
      ).toFixed(2);
      uv["total_cgst"] = parseFloat(
        calculatePercentageReverse(uv["disPerRate"], uv["cgst"])
      ).toFixed(2);
      uv["total_sgst"] = parseFloat(
        calculatePercentageReverse(uv["disPerRate"], uv["sgst"])
      ).toFixed(2);
      uv["final_amt"] = parseFloat(uv["netAmt"]).toFixed(2);
    } else if (uv.qty == "" || uv.rate == 0 || uv.qty == 0) {
      uv["gst"] = 0;
      uv["igst"] = 0;
      uv["cgst"] = 0;
      uv["sgst"] = 0;
      uv["total_igst"] = 0;
      uv["total_cgst"] = 0;
      uv["total_sgst"] = 0;
      uv["final_amt"] = 0;
    }

    // !IGST Calculation
    if (uv.igst > 0) {
      if (taxIgst.length > 0) {
        let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
        if (innerIgstTax != undefined) {
          let innerIgstCal = taxIgst.filter((vi) => {
            if (vi.gst == uv.igst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]);
            }
            return vi;
          });
          taxIgst = [...innerIgstCal];
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,

            gst: uv.igst,
            amt: parseFloat(uv.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      } else {
        let innerIgstCal = {
          d_gst: uv.igst,

          gst: uv.igst,
          amt: parseFloat(uv.total_igst),
        };
        taxIgst = [...taxIgst, innerIgstCal];
      }
    }

    // !CGST Calculation
    if (uv.cgst > 0) {
      if (taxCgst.length > 0) {
        let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxCgst.filter((vi) => {
            if (vi.gst == uv.cgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]);
            }
            return vi;
          });
          taxCgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: parseFloat(uv.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.cgst,
          amt: parseFloat(uv.total_cgst),
        };
        taxCgst = [...taxCgst, innerCgstCal];
      }
    }

    // !SGST Calculation
    if (uv.sgst > 0) {
      if (taxSgst.length > 0) {
        let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxSgst.filter((vi) => {
            if (vi.gst == uv.sgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]);
            }
            return vi;
          });
          taxSgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: parseFloat(uv.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.sgst,
          amt: parseFloat(uv.total_sgst),
        };
        taxSgst = [...taxSgst, innerCgstCal];
      }
    }
    console.warn("rahul:: uv[final_amt]", uv["final_amt"]);
    total_final_amt = parseFloat(total_final_amt) + parseFloat(uv["final_amt"]);

    // !new code
    base_amt = parseFloat(base_amt) + parseFloat(uv["org_total_base_amt"]);
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal"]));
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal_per"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal_per"]));
    total_taxable_amt =
      parseFloat(total_taxable_amt) + parseFloat(uv["taxableAmt"]);
    total_tax_amt = parseFloat(total_tax_amt) + parseFloat(uv["total_igst"]);

    // total_invoice_dis_amt =
    //   parseFloat(total_invoice_dis_amt) + parseFloat(uv["row_dis_amt"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["invoice_dis_amt"]);

    total_qty = parseInt(total_qty) + parseInt(uv["qty"]);

    total_free_qty =
      parseInt(total_free_qty) +
      (uv["free_qty"] === "" ? 0 : parseInt(uv["free_qty"]));

    console.log("gst inner row ", uv);
    return uv;
  });
  // !GST Calculation

  // console.log(
  //   "gst_row >>>>>>>>>>>> ",
  //   gst_row,
  //   base_amt,
  //   newAdditionalChargesTotal
  // );
  base_amt = parseFloat(base_amt) + parseFloat(newAdditionalChargesTotal);

  let additionalChgLedgerAmt3_ = isNaN(parseFloat(additionalChgLedgerAmt3))
    ? 0
    : parseFloat(additionalChgLedgerAmt3);

  let bill_amount = parseFloat(total_final_amt) + additionalChgLedgerAmt3_;

  // console.log("bill_amount>>>>", bill_amount, additionalChgLedgerAmt3_);

  total_free_qty = isNaN(total_free_qty) === true ? 0 : total_free_qty;
  let costing_row = gst_row.map((cv, ci) => {
    // let is_batch = cv["selectedProduct"]["is_batch"];
    // console.log("is_batch", is_batch);
    let totalqty =
      (isNaN(parseInt(cv["qty"])) ? 0 : parseInt(cv["qty"])) +
      (isNaN(parseInt(cv["free_qty"])) ? 0 : parseInt(cv["free_qty"]));

    let costingcal = parseFloat(cv["total_amt"]) / totalqty;

    let costingwithtaxcal =
      costingcal + parseFloat(cv["total_igst"]) / totalqty;

    cv["costing"] = parseFloat(costingcal).toFixed(3);
    cv["costing_with_tax"] = parseFloat(costingwithtaxcal).toFixed(3);

    return cv;
  });

  return {
    base_amt,
    total_purchase_discount_amt,
    total_taxable_amt,
    total_tax_amt,
    gst_row: costing_row,
    total_final_amt,
    taxIgst,
    taxCgst,
    taxSgst,
    total_invoice_dis_amt,
    total_qty,
    total_free_qty,
    bill_amount,
    purchase_discount,
    purchase_discount_amt,
    total_row_gross_amt,
    total_row_gross_amt1,
  };
};

//Composition calculation
//Inclusive GST calculation
export const fnTranxCalculationInComposition = ({
  elementFrom,
  rows,
  ledger_disc_per,
  ledger_disc_amt,
  additionalChargesTotal,

  additionalChgLedgerAmt1,
  additionalChgLedgerAmt2,
  additionalChgLedgerAmt3,

  takeDiscountAmountInLumpsum,
  isFirstDiscountPerCalculate,
}) => {
  additionalChgLedgerAmt3 =
    additionalChgLedgerAmt3 !== "" ? parseFloat(additionalChgLedgerAmt3) : 0;

  let newAdditionalChargesTotal = 0;
  let purchase_discount_amt = 0;
  let purchase_discount = 0;
  if (
    parseFloat(additionalChgLedgerAmt1) > 0 ||
    parseFloat(additionalChgLedgerAmt1) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt1);

  if (
    parseFloat(additionalChgLedgerAmt2) > 0 ||
    parseFloat(additionalChgLedgerAmt2) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt2);
  // console.warn(
  //   "newAdditionalChargesTotal <<<<<<<<<<<<<< " + newAdditionalChargesTotal,
  //   takeDiscountAmountInLumpsum,
  //   isFirstDiscountPerCalculate
  // );

  let total_row_dis_amt = 0;
  let total_row_gross_amt = 0;
  let total_row_gross_amt1 = 0;
  let row_disc_total_amt = 0;
  let totalbaseamt = 0;
  // ! Row level Discount Calculation
  let baserowcal = rows.map((uv, i) => {
    console.log("rows---->", rows);
    let row_dis_amt = 0;
    let base_amt = parseInt(uv.qty) * parseFloat(uv.rate);
    let org_base_amt = parseInt(uv.qty) * parseFloat(uv.org_rate);
    console.log("org_base_amt", org_base_amt, uv.org_rate);

    uv.base_amt = isNaN(base_amt) ? 0 : base_amt;
    uv.org_base_amt = isNaN(org_base_amt) ? 0 : org_base_amt;

    let disAmt = (parseFloat(uv.org_rate) * parseFloat(uv.dis_per)) / 100;
    console.log("disAmtPerQty", disAmt);

    let perTotal = parseFloat(uv.org_rate) - disAmt;
    console.log("perTotal", perTotal);

    let disAmtTotal = parseFloat(uv.qty) * disAmt;
    console.log("disAmtTotal", disAmtTotal);
    let disPerRate = parseFloat(uv.org_rate) - disAmt;
    console.log("disPerRate", disPerRate);
    let disRatePerTotal = disPerRate * parseInt(uv.qty);
    console.log("disRatePerTotal", disRatePerTotal);
    let gstPerqty =
      (disPerRate * parseFloat(uv["unit_id"]["igst"])) /
      (100 + parseFloat(uv["unit_id"]["igst"]));
    console.log("gstPerqty", gstPerqty);
    let taxableAmt = parseFloat(disRatePerTotal) - parseFloat(gstPerqty);
    console.log("taxableAmt", taxableAmt);
    let gstAmt = gstPerqty * parseInt(uv.qty);
    console.log("gstAmt", gstAmt);

    let netAmt = taxableAmt + gstAmt;
    console.log("netAmt", netAmt);
    uv["disPerRate"] = disPerRate;
    uv["rate"] = disRatePerTotal.toFixed(2);
    uv["dis_amt_cal"] = 0;
    uv["dis_per_cal"] = disAmtTotal;
    uv["invoice_dis_amt"] = disAmtTotal;
    uv["netAmt"] = netAmt;
    uv["taxableAmt"] = parseFloat(taxableAmt).toFixed(2);

    // uv["net_amt"]=netAmt.toFixed(2);

    uv["gross_amt"] = uv["base_amt"];
    uv["total_amt"] = uv["base_amt"];
    uv["total_base_amt"] = uv["base_amt"];
    uv["org_total_base_amt"] = uv["org_base_amt"];

    uv["row_dis_amt"] = row_dis_amt;
    uv["add_chg_amt"] = 0;
    uv["gross_amt1"] = uv["gross_amt"];

    row_disc_total_amt =
      parseFloat(row_disc_total_amt) + parseFloat(uv["total_amt"]);
    // ! New code
    total_row_gross_amt =
      parseFloat(total_row_gross_amt) + parseFloat(uv["gross_amt"]);
    total_row_dis_amt =
      parseFloat(total_row_dis_amt) + parseFloat(uv["gross_amt"]);
    totalbaseamt = base_amt;
    return uv;
  });

  // console.log("baserowcal::: <<<<<<<<<<<<<< ", baserowcal);

  // ! Additional charges calculation
  let add_total_amt = 0;
  let add_prop_cal = 0;
  let add_charges_row = baserowcal.map((uv, vi) => {
    if (
      parseFloat(uv.total_amt) > 0 &&
      (parseFloat(additionalChargesTotal) > 0 ||
        parseFloat(additionalChargesTotal) < 0) &&
      uv.qty != ""
    ) {
      // !New code
      uv["add_chg_amt"] = calculateAddChgValue(
        total_row_gross_amt,
        additionalChargesTotal,
        uv["gross_amt"]
      );
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    } else if (uv.qty == "") {
      // !New code
      uv["add_chg_amt"] = 0;
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    }
    add_prop_cal =
      parseFloat(add_prop_cal) +
      parseFloat(uv["additional_charges_proportional_cal"]);
    add_total_amt = parseFloat(add_total_amt) + parseFloat(uv["total_amt"]);

    // ! New code
    total_row_gross_amt1 =
      parseFloat(total_row_gross_amt1) + parseFloat(uv["gross_amt1"]);

    return uv;
  });

  // console.log("add_charges_row ><<<<<<<<<<< ", add_charges_row);

  // ! Discount Ledger Amount discount calculation
  if (elementFrom === "") {
    ledger_disc_amt = ledger_disc_amt;
    ledger_disc_per =
      (parseFloat(ledger_disc_amt) * 100) / parseFloat(total_row_gross_amt1);
  }
  let ledger_disc_base_amt_total = 0;
  let ledger_disc_amt_row = add_charges_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      if (parseFloat(ledger_disc_amt) > 0) {
        purchase_discount_amt = ledger_disc_amt;
        purchase_discount = ledger_disc_per;
        // ! New code
        uv["invoice_dis_amt"] = calculateInvoiceDisValue(
          total_row_gross_amt1,
          parseFloat(ledger_disc_amt),
          uv["gross_amt1"]
        );
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      } else {
        purchase_discount_amt = 0;
        purchase_discount = 0;
        // ! New code
        // uv["invoice_dis_amt"] = 0;
        // uv["total_amt"] =
        //   parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      }
    } else if (uv.qty == "") {
      // ! New code
      uv["invoice_dis_amt"] = 0;
      uv["total_amt"] =
        parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
    }
    ledger_disc_base_amt_total =
      parseFloat(ledger_disc_base_amt_total) + parseFloat(uv["total_amt"]);

    // console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
    return uv;
  });

  let total_final_amt = 0;
  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  let base_amt = 0;
  let total_purchase_discount_amt = 0;
  let total_taxable_amt = 0;
  let total_tax_amt = 0;
  let total_invoice_dis_amt = 0;
  let total_qty = 0;
  let total_free_qty = 0;

  console.log("ledger_disc_amt_row <<<<<<<<<<<<< ", ledger_disc_amt_row);
  let gst_row = ledger_disc_amt_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      uv["gst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["igst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["cgst"] = uv["unit_id"] ? uv["unit_id"]["cgst"] : 0;
      uv["sgst"] = uv["unit_id"] ? uv["unit_id"]["sgst"] : 0;
      // uv["gst"] = 0;
      // uv["igst"] = 0;
      // uv["cgst"] = 0;
      // uv["sgst"] = 0;
      uv["total_igst"] = parseFloat(
        calculatePercentageReverse(uv["disPerRate"], uv["igst"])
      ).toFixed(2);
      uv["total_cgst"] = parseFloat(
        calculatePercentageReverse(uv["disPerRate"], uv["cgst"])
      ).toFixed(2);
      uv["total_sgst"] = parseFloat(
        calculatePercentageReverse(uv["disPerRate"], uv["sgst"])
      ).toFixed(2);
      uv["final_amt"] = parseFloat(uv["netAmt"]).toFixed(2);
    } else if (uv.qty == "" || uv.rate == 0 || uv.qty == 0) {
      uv["gst"] = 0;
      uv["igst"] = 0;
      uv["cgst"] = 0;
      uv["sgst"] = 0;
      uv["total_igst"] = 0;
      uv["total_cgst"] = 0;
      uv["total_sgst"] = 0;
      uv["final_amt"] = 0;
    }

    // !IGST Calculation
    if (uv.igst > 0) {
      if (taxIgst.length > 0) {
        let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
        if (innerIgstTax != undefined) {
          let innerIgstCal = taxIgst.filter((vi) => {
            if (vi.gst == uv.igst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]);
            }
            return vi;
          });
          taxIgst = [...innerIgstCal];
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,

            gst: uv.igst,
            amt: parseFloat(uv.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      } else {
        let innerIgstCal = {
          d_gst: uv.igst,

          gst: uv.igst,
          amt: parseFloat(uv.total_igst),
        };
        taxIgst = [...taxIgst, innerIgstCal];
      }
    }

    // !CGST Calculation
    if (uv.cgst > 0) {
      if (taxCgst.length > 0) {
        let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxCgst.filter((vi) => {
            if (vi.gst == uv.cgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]);
            }
            return vi;
          });
          taxCgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: parseFloat(uv.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.cgst,
          amt: parseFloat(uv.total_cgst),
        };
        taxCgst = [...taxCgst, innerCgstCal];
      }
    }

    // !SGST Calculation
    if (uv.sgst > 0) {
      if (taxSgst.length > 0) {
        let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxSgst.filter((vi) => {
            if (vi.gst == uv.sgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]);
            }
            return vi;
          });
          taxSgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: parseFloat(uv.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.sgst,
          amt: parseFloat(uv.total_sgst),
        };
        taxSgst = [...taxSgst, innerCgstCal];
      }
    }
    console.warn("rahul:: uv[final_amt]", uv["final_amt"]);
    total_final_amt = parseFloat(total_final_amt) + parseFloat(uv["final_amt"]);

    // !new code
    base_amt = parseFloat(base_amt) + parseFloat(uv["org_total_base_amt"]);
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal"]));
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal_per"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal_per"]));
    total_taxable_amt =
      parseFloat(total_taxable_amt) + parseFloat(uv["taxableAmt"]);
    total_tax_amt = parseFloat(total_tax_amt) + parseFloat(uv["total_igst"]);

    // total_invoice_dis_amt =
    //   parseFloat(total_invoice_dis_amt) + parseFloat(uv["row_dis_amt"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["invoice_dis_amt"]);

    total_qty = parseInt(total_qty) + parseInt(uv["qty"]);

    total_free_qty =
      parseInt(total_free_qty) +
      (uv["free_qty"] === "" ? 0 : parseInt(uv["free_qty"]));

    console.log("gst inner row ", uv);
    return uv;
  });
  // !GST Calculation

  // console.log(
  //   "gst_row >>>>>>>>>>>> ",
  //   gst_row,
  //   base_amt,
  //   newAdditionalChargesTotal
  // );
  base_amt = parseFloat(base_amt) + parseFloat(newAdditionalChargesTotal);

  let additionalChgLedgerAmt3_ = isNaN(parseFloat(additionalChgLedgerAmt3))
    ? 0
    : parseFloat(additionalChgLedgerAmt3);

  let bill_amount = parseFloat(total_final_amt) + additionalChgLedgerAmt3_;

  // console.log("bill_amount>>>>", bill_amount, additionalChgLedgerAmt3_);

  total_free_qty = isNaN(total_free_qty) === true ? 0 : total_free_qty;
  let costing_row = gst_row.map((cv, ci) => {
    // let is_batch = cv["selectedProduct"]["is_batch"];
    // console.log("is_batch", is_batch);
    let totalqty =
      (isNaN(parseInt(cv["qty"])) ? 0 : parseInt(cv["qty"])) +
      (isNaN(parseInt(cv["free_qty"])) ? 0 : parseInt(cv["free_qty"]));

    let costingcal = parseFloat(cv["total_amt"]) / totalqty;

    let costingwithtaxcal =
      costingcal + parseFloat(cv["total_igst"]) / totalqty;

    cv["costing"] = parseFloat(costingcal).toFixed(3);
    cv["costing_with_tax"] = parseFloat(costingwithtaxcal).toFixed(3);

    return cv;
  });

  return {
    base_amt,
    total_purchase_discount_amt,
    total_taxable_amt,
    total_tax_amt,
    gst_row: costing_row,
    total_final_amt,
    taxIgst,
    taxCgst,
    taxSgst,
    total_invoice_dis_amt,
    total_qty,
    total_free_qty,
    bill_amount,
    purchase_discount,
    purchase_discount_amt,
    total_row_gross_amt,
    total_row_gross_amt1,
  };
};

export const fnTranxCalculationForCS = ({
  elementFrom,
  rows,
  ledger_disc_per,
  ledger_disc_amt,
  additionalChargesTotal,
  additionalChgLedgerAmt1,
  additionalChgLedgerAmt2,
  additionalChgLedgerAmt3,
  takeDiscountAmountInLumpsum,
  isFirstDiscountPerCalculate,
}) => {
  additionalChgLedgerAmt3 =
    additionalChgLedgerAmt3 !== "" ? parseFloat(additionalChgLedgerAmt3) : 0;

  let newAdditionalChargesTotal = 0;
  let purchase_discount_amt = 0;
  let purchase_discount = 0;
  if (
    parseFloat(additionalChgLedgerAmt1) > 0 ||
    parseFloat(additionalChgLedgerAmt1) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt1);

  if (
    parseFloat(additionalChgLedgerAmt2) > 0 ||
    parseFloat(additionalChgLedgerAmt2) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt2);
  // console.warn(
  //   "newAdditionalChargesTotal <<<<<<<<<<<<<< " + newAdditionalChargesTotal,
  //   takeDiscountAmountInLumpsum,
  //   isFirstDiscountPerCalculate
  // );

  let total_row_dis_amt = 0;
  let total_row_gross_amt = 0;
  let total_row_gross_amt1 = 0;
  let row_disc_total_amt = 0;
  let totalbaseamt = 0;
  // ! Row level Discount Calculation
  let baserowcal = rows.map((uv, i) => {
    console.log("rows---sneha", rows);
    let row_dis_amt = 0;
    let base_amt = parseInt(uv.qty) * parseFloat(uv.rate);
    uv.base_amt = isNaN(base_amt) ? 0 : base_amt;
    uv["gross_amt"] = uv["base_amt"];
    uv["total_amt"] = uv["base_amt"];
    uv["total_base_amt"] = uv["base_amt"];

    if (isFirstDiscountPerCalculate === false) {
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        if (takeDiscountAmountInLumpsum === false) {
          total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        }
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
      // console.log("dis_amt ------>>>>> uv[gross_amt] ", uv["gross_amt"]);
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        // ! New
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);
        // console.log("dis_per ------>>>>> uv[per_amt] ", per_amt);

        uv["dis_per_cal"] = per_amt;
        // ! New groos_amt updated in row
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      // console.log("dis_per ------>>>>> uv[gross_amt] ", uv["gross_amt"]);

      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);
        // console.log("dis_per2 ------>>>>> uv[per_amt] ", per_amt);

        uv["dis_per_cal"] = per_amt;
        // ! New groos_amt updated in row
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
    } else {
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }

      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }

      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        if (takeDiscountAmountInLumpsum === false) {
          total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
    }

    uv["row_dis_amt"] = row_dis_amt;
    uv["add_chg_amt"] = 0;
    uv["gross_amt1"] = uv["gross_amt"];
    uv["total_amt"] = uv["gross_amt1"];

    row_disc_total_amt =
      parseFloat(row_disc_total_amt) + parseFloat(uv["total_amt"]);
    // ! New code
    total_row_gross_amt =
      parseFloat(total_row_gross_amt) + parseFloat(uv["gross_amt"]);
    total_row_dis_amt =
      parseFloat(total_row_dis_amt) + parseFloat(uv["gross_amt"]);
    totalbaseamt = base_amt;
    return uv;
  });

  // console.log("baserowcal::: <<<<<<<<<<<<<< ", baserowcal);

  // ! Additional charges calculation
  let add_total_amt = 0;
  let add_prop_cal = 0;
  let add_charges_row = baserowcal.map((uv, vi) => {
    if (
      parseFloat(uv.total_amt) > 0 &&
      (parseFloat(newAdditionalChargesTotal) > 0 ||
        parseFloat(newAdditionalChargesTotal) < 0) &&
      uv.qty != ""
    ) {
      // !New code
      uv["add_chg_amt"] = calculateAddChgValue(
        total_row_gross_amt,
        newAdditionalChargesTotal,
        uv["gross_amt"]
      );
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    } else if (uv.qty == "") {
      // !New code
      uv["add_chg_amt"] = 0;
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    }
    add_prop_cal =
      parseFloat(add_prop_cal) +
      parseFloat(uv["additional_charges_proportional_cal"]);
    add_total_amt = parseFloat(add_total_amt) + parseFloat(uv["total_amt"]);

    // ! New code
    total_row_gross_amt1 =
      parseFloat(total_row_gross_amt1) + parseFloat(uv["gross_amt1"]);

    return uv;
  });

  // console.log("add_charges_row ><<<<<<<<<<< ", add_charges_row);

  // ! Discount Ledger Amount discount calculation
  if (elementFrom === "") {
    ledger_disc_amt = ledger_disc_amt;
    ledger_disc_per =
      (parseFloat(ledger_disc_amt) * 100) / parseFloat(total_row_gross_amt1);
  }
  let ledger_disc_base_amt_total = 0;
  let ledger_disc_amt_row = add_charges_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      if (parseFloat(ledger_disc_amt) > 0) {
        purchase_discount_amt = ledger_disc_amt;
        purchase_discount = ledger_disc_per;
        // ! New code
        uv["invoice_dis_amt"] = calculateInvoiceDisValue(
          total_row_gross_amt1,
          parseFloat(ledger_disc_amt),
          uv["gross_amt1"]
        );
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      } else {
        purchase_discount_amt = 0;
        purchase_discount = 0;
        // ! New code
        uv["invoice_dis_amt"] = 0;
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      }
    } else if (uv.qty == "") {
      // ! New code
      uv["invoice_dis_amt"] = 0;
      uv["total_amt"] =
        parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
    }
    ledger_disc_base_amt_total =
      parseFloat(ledger_disc_base_amt_total) + parseFloat(uv["total_amt"]);

    // console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
    return uv;
  });

  let total_final_amt = 0;
  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  let base_amt = 0;
  let total_purchase_discount_amt = 0;
  let total_taxable_amt = 0;
  let total_tax_amt = 0;
  let total_invoice_dis_amt = 0;
  let total_qty = 0;
  let total_free_qty = 0;

  let gst_row = ledger_disc_amt_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      uv["gst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["igst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["cgst"] = uv["unit_id"] ? uv["unit_id"]["cgst"] : 0;
      uv["sgst"] = uv["unit_id"] ? uv["unit_id"]["sgst"] : 0;

      uv["total_igst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["igst"])
      ).toFixed(2);
      uv["total_cgst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["cgst"])
      ).toFixed(2);
      uv["total_sgst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["sgst"])
      ).toFixed(2);
      uv["final_amt"] = parseFloat(uv["total_amt"]).toFixed(2);
    } else if (uv.qty == "" || uv.qty == 0 || uv.rate == 0) {
      uv["gst"] = 0;
      uv["igst"] = 0;
      uv["cgst"] = 0;
      uv["sgst"] = 0;
      uv["total_igst"] = 0;
      uv["total_cgst"] = 0;
      uv["total_sgst"] = 0;
      uv["final_amt"] = 0;
    }
    // !IGST Calculation
    if (uv.igst > 0) {
      if (taxIgst.length > 0) {
        let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
        if (innerIgstTax != undefined) {
          let innerIgstCal = taxIgst.filter((vi) => {
            if (vi.gst == uv.igst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]);
            }
            return vi;
          });
          taxIgst = [...innerIgstCal];
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,

            gst: uv.igst,
            amt: parseFloat(uv.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      } else {
        let innerIgstCal = {
          d_gst: uv.igst,

          gst: uv.igst,
          amt: parseFloat(uv.total_igst),
        };
        taxIgst = [...taxIgst, innerIgstCal];
      }
    }

    // !CGST Calculation
    if (uv.cgst > 0) {
      if (taxCgst.length > 0) {
        let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxCgst.filter((vi) => {
            if (vi.gst == uv.cgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]);
            }
            return vi;
          });
          taxCgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: parseFloat(uv.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.cgst,
          amt: parseFloat(uv.total_cgst),
        };
        taxCgst = [...taxCgst, innerCgstCal];
      }
    }

    // !SGST Calculation
    if (uv.sgst > 0) {
      if (taxSgst.length > 0) {
        let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxSgst.filter((vi) => {
            if (vi.gst == uv.sgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]);
            }
            return vi;
          });
          taxSgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: parseFloat(uv.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.sgst,
          amt: parseFloat(uv.total_sgst),
        };
        taxSgst = [...taxSgst, innerCgstCal];
      }
    }
    // console.warn("rahul:: uv[final_amt]", uv["final_amt"]);
    total_final_amt = parseFloat(total_final_amt) + parseFloat(uv["final_amt"]);

    // !new code
    base_amt = parseFloat(base_amt) + parseFloat(uv["base_amt"]);
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal"]));
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal_per"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal_per"]));
    total_taxable_amt =
      parseFloat(total_taxable_amt) + parseFloat(uv["total_amt"]);
    total_tax_amt = parseFloat(total_tax_amt) + parseFloat(uv["total_igst"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["row_dis_amt"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["invoice_dis_amt"]);

    total_qty = parseInt(total_qty) + parseInt(uv["qty"]);

    total_free_qty =
      parseInt(total_free_qty) +
      (uv["free_qty"] === "" ? 0 : parseInt(uv["free_qty"]));

    // console.log("gst inner row ", uv);
    return uv;
  });
  // !GST Calculation

  // console.log(
  //   "gst_row >>>>>>>>>>>> ",
  //   gst_row,
  //   base_amt,
  //   newAdditionalChargesTotal
  // );
  base_amt = parseFloat(base_amt) + parseFloat(newAdditionalChargesTotal);

  let additionalChgLedgerAmt3_ = isNaN(parseFloat(additionalChgLedgerAmt3))
    ? 0
    : parseFloat(additionalChgLedgerAmt3);

  let bill_amount = parseFloat(total_final_amt) + additionalChgLedgerAmt3_;

  // console.log("bill_amount>>>>", bill_amount, additionalChgLedgerAmt3_);

  total_free_qty = isNaN(total_free_qty) === true ? 0 : total_free_qty;

  return {
    base_amt,
    total_purchase_discount_amt,
    total_taxable_amt,
    total_tax_amt,
    gst_row,
    total_final_amt,
    taxIgst,
    taxCgst,
    taxSgst,
    total_invoice_dis_amt,
    total_qty,
    total_free_qty,
    bill_amount,
    purchase_discount,
    purchase_discount_amt,
    total_row_gross_amt,
    total_row_gross_amt1,
  };
};

export const fnTranxCalculation_bkp = ({
  rows,
  ledger_disc_per,
  ledger_disc_amt,
  additionalChargesTotal,
}) => {
  console.warn(
    "{ sales_discount, sales_discount_amt } >>>>>>>>>>>>>>>>",
    parseFloat(ledger_disc_per),
    parseFloat(ledger_disc_amt),
    isNaN(parseFloat(ledger_disc_amt))
  );
  let row_disc_total_amt = 0;
  let totalbaseamt = 0;
  // ! Row level Discount Calculation
  let baserowcal = rows.map((v, i) => {
    v.brandDetails = v.brandDetails.map((vi, ii) => {
      vi.groupDetails = vi.groupDetails.map((gv, gi) => {
        gv.categoryDetails = gv.categoryDetails.map((cv, ci) => {
          cv.subcategoryDetails = cv.subcategoryDetails.map((sbv, sbi) => {
            sbv.packageDetails = sbv.packageDetails.map((pkv, pki) => {
              pkv.unitDetails = pkv.unitDetails.map((uv, ui) => {
                let base_amt = parseInt(uv.qty) * parseFloat(uv.rate);
                uv.base_amt = isNaN(base_amt) ? 0 : base_amt;
                uv["total_amt"] = uv["base_amt"];
                uv["total_base_amt"] = uv["base_amt"];

                if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
                  uv["total_amt"] =
                    parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
                  uv["total_base_amt"] = uv["total_amt"];
                  uv["dis_amt_cal"] = uv["dis_amt"];
                }

                if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
                  let per_amt = calculatePercentage(
                    uv["total_amt"],
                    uv["dis_per"]
                  );

                  uv["dis_per_cal"] = per_amt;
                  uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
                  uv["total_amt"] = uv["total_amt"] - per_amt;
                }

                if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
                  let per_amt = calculatePercentage(
                    uv["total_amt"],
                    uv["dis_per2"]
                  );

                  uv["dis_per_cal"] = per_amt;
                  uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
                  uv["total_amt"] = uv["total_amt"] - per_amt;
                }

                row_disc_total_amt =
                  parseFloat(row_disc_total_amt) + parseFloat(uv["total_amt"]);
                totalbaseamt = base_amt;

                console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
                return uv;
              });

              return pkv;
            });
            return sbv;
          });
          return cv;
        });
        return gv;
      });
      return vi;
    });
    return v;
  });

  console.log("baserowcal::: <<<<<<<<<<<<<< ", baserowcal);
  // ! Discount Ledger Amount discount calculation
  let ledger_disc_base_amt_total = 0;
  let ledger_disc_amt_row = baserowcal.map((v, i) => {
    v.brandDetails = v.brandDetails.map((vi, ii) => {
      vi.groupDetails = vi.groupDetails.map((gv, gi) => {
        gv.categoryDetails = gv.categoryDetails.map((cv, ci) => {
          cv.subcategoryDetails = cv.subcategoryDetails.map((sbv, sbi) => {
            sbv.packageDetails = sbv.packageDetails.map((pkv, pki) => {
              pkv.unitDetails = pkv.unitDetails.map((uv, ui) => {
                console.warn(
                  "rahul::parseFloat(uv.total_amt) ",
                  parseFloat(uv.total_amt)
                );

                if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
                  // debugger;
                  if (parseFloat(ledger_disc_amt) > 0) {
                    uv["discount_proportional_cal"] = calculatePrValue(
                      row_disc_total_amt,
                      parseFloat(ledger_disc_amt),
                      uv["total_amt"]
                    );
                    uv["total_amt"] =
                      uv["total_amt"] -
                      calculatePrValue(
                        row_disc_total_amt,
                        parseFloat(ledger_disc_amt),
                        uv["total_amt"]
                      );
                  } else {
                    console.log("executed ------------------");
                    uv["discount_proportional_cal"] = calculatePrValue(
                      row_disc_total_amt,
                      0,
                      uv["total_amt"]
                    );
                    uv["total_amt"] =
                      uv["total_amt"] -
                      calculatePrValue(row_disc_total_amt, 0, uv["total_amt"]);
                  }
                } else if (uv.qty == "") {
                  uv["discount_proportional_cal"] = 0;
                  uv["total_amt"] = 0;
                }
                ledger_disc_base_amt_total =
                  parseFloat(ledger_disc_base_amt_total) +
                  parseFloat(uv["total_amt"]);

                console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
                return uv;
              });

              return pkv;
            });
            return sbv;
          });
          return cv;
        });
        return gv;
      });
      return vi;
    });
    return v;
  });

  // ! Discount Ledger Percentage discount calculation
  let ledger_disc_base_per_amt_total = 0;
  let ledger_disc_per_amt_row = ledger_disc_amt_row.map((v, i) => {
    v.brandDetails = v.brandDetails.map((vi, ii) => {
      vi.groupDetails = vi.groupDetails.map((gv, gi) => {
        gv.categoryDetails = gv.categoryDetails.map((cv, ci) => {
          cv.subcategoryDetails = cv.subcategoryDetails.map((sbv, sbi) => {
            sbv.packageDetails = sbv.packageDetails.map((pkv, pki) => {
              pkv.unitDetails = pkv.unitDetails.map((uv, ui) => {
                if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
                  // console.log("uv total_amt =-> ", uv.total_amt);
                  if (parseFloat(ledger_disc_per) > 0) {
                    let peramt = calculatePercentage(
                      ledger_disc_base_amt_total,
                      parseFloat(ledger_disc_per),
                      uv["total_amt"]
                    );
                    uv["discount_proportional_cal_per"] = calculatePrValue(
                      ledger_disc_base_amt_total,
                      parseFloat(peramt),
                      uv["total_amt"]
                    );
                    uv["total_amt"] =
                      uv["total_amt"] -
                      calculatePrValue(
                        ledger_disc_base_amt_total,
                        parseFloat(peramt),
                        uv["total_amt"]
                      );
                  } else {
                    console.log("executed ------------------");
                    let peramt = calculatePercentage(
                      ledger_disc_base_amt_total,
                      0.0,
                      uv["total_amt"]
                    );
                    uv["discount_proportional_cal_per"] = calculatePrValue(
                      ledger_disc_base_amt_total,
                      parseFloat(peramt),
                      uv["total_amt"]
                    );
                    uv["total_amt"] =
                      uv["total_amt"] -
                      calculatePrValue(
                        ledger_disc_base_amt_total,
                        parseFloat(peramt),
                        uv["total_amt"]
                      );
                  }
                } else if (uv.qty == "") {
                  uv["discount_proportional_cal_per"] = 0;
                  uv["total_amt"] = 0;
                }
                ledger_disc_base_per_amt_total =
                  parseFloat(ledger_disc_base_per_amt_total) +
                  parseFloat(uv["total_amt"]);
                return uv;
              });
              return pkv;
            });

            return sbv;
          });
          return cv;
        });
        return gv;
      });
      return vi;
    });
    return v;
  });

  // ! Additional charges calculation

  console.log("ledger_disc_per_amt_row::: ", ledger_disc_per_amt_row);
  let add_total_amt = 0;
  let add_prop_cal = 0;
  let add_charges_row = ledger_disc_per_amt_row.map((v, i) => {
    v.brandDetails = v.brandDetails.map((vi, ii) => {
      vi.groupDetails = vi.groupDetails.map((gv, gi) => {
        gv.categoryDetails = gv.categoryDetails.map((cv, ci) => {
          cv.subcategoryDetails = cv.subcategoryDetails.map((sbv, sbi) => {
            sbv.packageDetails = sbv.packageDetails.map((pkv, pki) => {
              pkv.unitDetails = pkv.unitDetails.map((uv, ui) => {
                if (
                  parseFloat(uv.total_amt) > 0 &&
                  parseFloat(additionalChargesTotal) > 0 &&
                  uv.qty != ""
                ) {
                  uv["additional_charges_proportional_cal"] = calculatePrValue(
                    ledger_disc_base_per_amt_total,
                    additionalChargesTotal,
                    uv["total_amt"]
                  );
                  uv["total_amt"] = parseFloat(
                    uv["total_amt"] +
                      calculatePrValue(
                        ledger_disc_base_per_amt_total,
                        additionalChargesTotal,
                        uv["total_amt"]
                      )
                  ).toFixed(2);
                } else if (uv.qty == "") {
                  uv["additional_charges_proportional_cal"] = 0;
                  uv["total_amt"] = 0;
                }
                add_prop_cal =
                  parseFloat(add_prop_cal) +
                  parseFloat(uv["additional_charges_proportional_cal"]);
                add_total_amt =
                  parseFloat(add_total_amt) + parseFloat(uv["total_amt"]);
                return uv;
              });

              return pkv;
            });
            return sbv;
          });
          return cv;
        });
        return gv;
      });
      return vi;
    });
    return v;
  });

  let gst_total_amt = 0;
  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  //     base_amt
  // total_purchase_discount_amt
  // total_taxable_amt
  // total_tax_amt
  // roundoff
  // totalamt
  let base_amt = 0;
  let total_purchase_discount_amt = 0;
  let total_taxable_amt = 0;
  let total_tax_amt = 0;

  console.log("add_charges_row::: ", add_charges_row);
  let gst_row = add_charges_row.map((v, i) => {
    v.brandDetails = v.brandDetails.map((vi, ii) => {
      vi.groupDetails = vi.groupDetails.map((gv, gi) => {
        gv.categoryDetails = gv.categoryDetails.map((cv, ci) => {
          cv.subcategoryDetails = cv.subcategoryDetails.map((sbv, sbi) => {
            sbv.packageDetails = sbv.packageDetails.map((pkv, pki) => {
              pkv.unitDetails = pkv.unitDetails.map((uv, ui) => {
                // debugger
                console.warn("rahul:: total_amt", uv.total_amt);

                if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
                  uv["gst"] = uv["unitId"] ? uv["unitId"]["igst"] : 0;
                  uv["igst"] = uv["unitId"] ? uv["unitId"]["igst"] : 0;
                  uv["cgst"] = uv["unitId"] ? uv["unitId"]["cgst"] : 0;
                  uv["sgst"] = uv["unitId"] ? uv["unitId"]["sgst"] : 0;
                  uv["total_igst"] = parseFloat(
                    calculatePercentage(uv["total_amt"], uv["unitId"]["igst"])
                  ).toFixed(2);
                  uv["total_cgst"] = parseFloat(
                    calculatePercentage(uv["total_amt"], uv["unitId"]["cgst"])
                  ).toFixed(2);
                  uv["total_sgst"] = parseFloat(
                    calculatePercentage(uv["total_amt"], uv["unitId"]["sgst"])
                  ).toFixed(2);
                  uv["final_amt"] = parseFloat(
                    parseFloat(uv["total_amt"]) + parseFloat(uv["total_igst"])
                  ).toFixed(2);
                } else if (uv.qty == "") {
                  uv["gst"] = 0;
                  uv["igst"] = 0;
                  uv["cgst"] = 0;
                  uv["sgst"] = 0;
                  uv["total_igst"] = 0;
                  uv["total_cgst"] = 0;
                  uv["total_sgst"] = 0;
                  uv["final_amt"] = 0;
                }
                // !IGST Calculation
                if (uv.igst > 0) {
                  if (taxIgst.length > 0) {
                    let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
                    if (innerIgstTax != undefined) {
                      let innerIgstCal = taxIgst.filter((vi) => {
                        if (vi.gst == uv.igst) {
                          vi["amt"] =
                            parseFloat(vi["amt"]) +
                            parseFloat(uv["total_igst"]);
                        }
                        return vi;
                      });
                      taxIgst = [...innerIgstCal];
                    } else {
                      let innerIgstCal = {
                        d_gst: uv.igst,

                        gst: uv.igst,
                        amt: parseFloat(uv.total_igst),
                      };
                      taxIgst = [...taxIgst, innerIgstCal];
                    }
                  } else {
                    let innerIgstCal = {
                      d_gst: uv.igst,

                      gst: uv.igst,
                      amt: parseFloat(uv.total_igst),
                    };
                    taxIgst = [...taxIgst, innerIgstCal];
                  }
                }
                // !CGST Calculation
                if (uv.cgst > 0) {
                  if (taxCgst.length > 0) {
                    let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
                    if (innerCgstTax != undefined) {
                      let innerCgstCal = taxCgst.filter((vi) => {
                        if (vi.gst == uv.cgst) {
                          vi["amt"] =
                            parseFloat(vi["amt"]) +
                            parseFloat(uv["total_cgst"]);
                        }
                        return vi;
                      });
                      taxCgst = [...innerCgstCal];
                    } else {
                      let innerCgstCal = {
                        d_gst: uv.igst,

                        gst: uv.cgst,
                        amt: parseFloat(uv.total_cgst),
                      };
                      taxCgst = [...taxCgst, innerCgstCal];
                    }
                  } else {
                    let innerCgstCal = {
                      d_gst: uv.igst,

                      gst: uv.cgst,
                      amt: parseFloat(uv.total_cgst),
                    };
                    taxCgst = [...taxCgst, innerCgstCal];
                  }
                }

                // !SGST Calculation
                if (uv.sgst > 0) {
                  if (taxSgst.length > 0) {
                    let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
                    if (innerCgstTax != undefined) {
                      let innerCgstCal = taxSgst.filter((vi) => {
                        if (vi.gst == uv.sgst) {
                          vi["amt"] =
                            parseFloat(vi["amt"]) +
                            parseFloat(uv["total_sgst"]);
                        }
                        return vi;
                      });
                      taxSgst = [...innerCgstCal];
                    } else {
                      let innerCgstCal = {
                        d_gst: uv.igst,

                        gst: uv.sgst,
                        amt: parseFloat(uv.total_sgst),
                      };
                      taxSgst = [...taxSgst, innerCgstCal];
                    }
                  } else {
                    let innerCgstCal = {
                      d_gst: uv.igst,

                      gst: uv.sgst,
                      amt: parseFloat(uv.total_sgst),
                    };
                    taxSgst = [...taxSgst, innerCgstCal];
                  }
                }
                console.warn("rahul:: uv[final_amt]", uv["final_amt"]);
                gst_total_amt =
                  parseFloat(gst_total_amt) + parseFloat(uv["final_amt"]);

                base_amt =
                  parseFloat(base_amt) + parseFloat(uv["total_base_amt"]);
                total_purchase_discount_amt =
                  parseFloat(total_purchase_discount_amt) +
                  (isNaN(parseFloat(uv["discount_proportional_cal"]))
                    ? 0
                    : parseFloat(uv["discount_proportional_cal"]));
                total_purchase_discount_amt =
                  parseFloat(total_purchase_discount_amt) +
                  (isNaN(parseFloat(uv["discount_proportional_cal_per"]))
                    ? 0
                    : parseFloat(uv["discount_proportional_cal_per"]));
                total_taxable_amt =
                  parseFloat(total_taxable_amt) +
                  parseFloat(uv["final_amt"] - parseFloat(uv["total_igst"]));
                total_tax_amt =
                  parseFloat(total_tax_amt) + parseFloat(uv["total_igst"]);

                return uv;
              });

              return pkv;
            });
            return sbv;
          });
          return cv;
        });
        return gv;
      });
      return vi;
    });
    return v;
  });
  // !GST Calculation

  return {
    base_amt,
    total_purchase_discount_amt,
    total_taxable_amt,
    total_tax_amt,
    gst_row,
    gst_total_amt,
    taxIgst,
    taxCgst,
    taxSgst,
  };
};
///FOr Tax transaction calculation for round off

export const fnTranxCalculationTaxRoundOff = ({
  elementFrom,
  rows,
  ledger_disc_per,
  ledger_disc_amt,
  additionalChargesTotal,

  additionalChgLedgerAmt1,
  additionalChgLedgerAmt2,
  additionalChgLedgerAmt3,

  takeDiscountAmountInLumpsum,
  isFirstDiscountPerCalculate,
}) => {
  additionalChgLedgerAmt3 =
    additionalChgLedgerAmt3 !== "" ? parseFloat(additionalChgLedgerAmt3) : 0;

  let newAdditionalChargesTotal = 0;
  let purchase_discount_amt = 0;
  let purchase_discount = 0;
  if (
    parseFloat(additionalChgLedgerAmt1) > 0 ||
    parseFloat(additionalChgLedgerAmt1) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt1);

  if (
    parseFloat(additionalChgLedgerAmt2) > 0 ||
    parseFloat(additionalChgLedgerAmt2) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt2);
  console.warn(
    "newAdditionalChargesTotal <<<<<<<<<<<<<< " + newAdditionalChargesTotal,
    takeDiscountAmountInLumpsum,
    isFirstDiscountPerCalculate
  );

  let total_row_dis_amt = 0;
  let total_row_gross_amt = 0;
  let total_row_gross_amt1 = 0;
  let row_disc_total_amt = 0;
  let totalbaseamt = 0;
  // ! Row level Discount Calculation
  let baserowcal = rows.map((uv, i) => {
    let row_dis_amt = 0;
    let base_amt = parseInt(uv.qty) * parseFloat(uv.rate);
    uv.base_amt = isNaN(base_amt) ? 0 : base_amt;
    uv["gross_amt"] = uv["base_amt"];
    uv["total_amt"] = uv["base_amt"];
    uv["total_base_amt"] = uv["base_amt"];

    if (isFirstDiscountPerCalculate === false) {
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        if (takeDiscountAmountInLumpsum === false) {
          total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        }
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
      console.log("dis_amt ------>>>>> uv[gross_amt] ", uv["gross_amt"]);
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        // ! New
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);
        console.log("dis_per ------>>>>> uv[per_amt] ", per_amt);

        uv["dis_per_cal"] = per_amt;
        // ! New groos_amt updated in row
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      console.log("dis_per ------>>>>> uv[gross_amt] ", uv["gross_amt"]);

      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);
        console.log("dis_per2 ------>>>>> uv[per_amt] ", per_amt);

        uv["dis_per_cal"] = per_amt;
        // ! New groos_amt updated in row
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
    } else {
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }

      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }

      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        if (takeDiscountAmountInLumpsum === false) {
          total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
    }

    uv["row_dis_amt"] = row_dis_amt;
    uv["add_chg_amt"] = 0;
    uv["gross_amt1"] = uv["gross_amt"];
    uv["total_amt"] = uv["gross_amt1"];

    row_disc_total_amt =
      parseFloat(row_disc_total_amt) + parseFloat(uv["total_amt"]);
    // ! New code
    total_row_gross_amt =
      parseFloat(total_row_gross_amt) + parseFloat(uv["gross_amt"]);
    total_row_dis_amt =
      parseFloat(total_row_dis_amt) + parseFloat(uv["gross_amt"]);
    totalbaseamt = base_amt;
    return uv;
  });

  console.log("baserowcal::: <<<<<<<<<<<<<< ", baserowcal);

  // ! Additional charges calculation
  let add_total_amt = 0;
  let add_prop_cal = 0;
  let add_charges_row = baserowcal.map((uv, vi) => {
    if (
      parseFloat(uv.total_amt) > 0 &&
      (parseFloat(newAdditionalChargesTotal) > 0 ||
        parseFloat(newAdditionalChargesTotal) < 0) &&
      uv.qty != ""
    ) {
      // !New code
      uv["add_chg_amt"] = calculateAddChgValue(
        total_row_gross_amt,
        newAdditionalChargesTotal,
        uv["gross_amt"]
      );
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    } else if (uv.qty == "") {
      // !New code
      uv["add_chg_amt"] = 0;
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    }
    add_prop_cal =
      parseFloat(add_prop_cal) +
      parseFloat(uv["additional_charges_proportional_cal"]);
    add_total_amt = parseFloat(add_total_amt) + parseFloat(uv["total_amt"]);

    // ! New code
    total_row_gross_amt1 =
      parseFloat(total_row_gross_amt1) + parseFloat(uv["gross_amt1"]);

    return uv;
  });

  console.log("add_charges_row ><<<<<<<<<<< ", add_charges_row);

  // ! Discount Ledger Amount discount calculation
  if (elementFrom === "") {
    ledger_disc_amt = ledger_disc_amt;
    ledger_disc_per =
      (parseFloat(ledger_disc_amt) * 100) / parseFloat(total_row_gross_amt1);
  }
  let ledger_disc_base_amt_total = 0;
  let ledger_disc_amt_row = add_charges_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      if (parseFloat(ledger_disc_amt) > 0) {
        purchase_discount_amt = ledger_disc_amt;
        purchase_discount = ledger_disc_per;
        // ! New code
        uv["invoice_dis_amt"] = calculateInvoiceDisValue(
          total_row_gross_amt1,
          parseFloat(ledger_disc_amt),
          uv["gross_amt1"]
        );
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      } else {
        purchase_discount_amt = 0;
        purchase_discount = 0;
        // ! New code
        uv["invoice_dis_amt"] = 0;
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      }
    } else if (uv.qty == "") {
      // ! New code
      uv["invoice_dis_amt"] = 0;
      uv["total_amt"] =
        parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
    }
    ledger_disc_base_amt_total =
      parseFloat(ledger_disc_base_amt_total) + parseFloat(uv["total_amt"]);

    console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
    return uv;
  });

  let total_final_amt = 0;
  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  let base_amt = 0;
  let total_purchase_discount_amt = 0;
  let total_taxable_amt = 0;
  let total_tax_amt = 0;
  let total_invoice_dis_amt = 0;
  let total_qty = 0;
  let total_free_qty = 0;

  console.log("ledger_disc_amt_row <<<<<<<<<<<<< ", ledger_disc_amt_row);
  let gst_row = ledger_disc_amt_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      uv["gst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["igst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["cgst"] = uv["unit_id"] ? uv["unit_id"]["cgst"] : 0;
      uv["sgst"] = uv["unit_id"] ? uv["unit_id"]["sgst"] : 0;
      uv["total_igst"] = Math.floor(
        parseFloat(calculatePercentage(uv["total_amt"], uv["igst"]))
      );
      uv["total_cgst"] = Math.floor(
        parseFloat(calculatePercentage(uv["total_amt"], uv["cgst"]))
      );
      uv["total_sgst"] = Math.floor(
        parseFloat(calculatePercentage(uv["total_amt"], uv["sgst"]))
      );
      uv["final_amt"] = parseFloat(
        parseFloat(uv["total_amt"]) + parseFloat(uv["total_igst"])
      ).toFixed(2);
    } else if (uv.qty == "") {
      uv["gst"] = 0;
      uv["igst"] = 0;
      uv["cgst"] = 0;
      uv["sgst"] = 0;
      uv["total_igst"] = 0;
      uv["total_cgst"] = 0;
      uv["total_sgst"] = 0;
      uv["final_amt"] = 0;
    }
    // !IGST Calculation
    if (uv.igst > 0) {
      if (taxIgst.length > 0) {
        let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
        if (innerIgstTax != undefined) {
          let innerIgstCal = taxIgst.filter((vi) => {
            if (vi.gst == uv.igst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]);
            }
            return vi;
          });
          taxIgst = [...innerIgstCal];
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,

            gst: uv.igst,
            amt: parseFloat(uv.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      } else {
        let innerIgstCal = {
          d_gst: uv.igst,

          gst: uv.igst,
          amt: parseFloat(uv.total_igst),
        };
        taxIgst = [...taxIgst, innerIgstCal];
      }
    }

    // !CGST Calculation
    if (uv.cgst > 0) {
      if (taxCgst.length > 0) {
        let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxCgst.filter((vi) => {
            if (vi.gst == uv.cgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]);
            }
            return vi;
          });
          taxCgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: parseFloat(uv.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.cgst,
          amt: parseFloat(uv.total_cgst),
        };
        taxCgst = [...taxCgst, innerCgstCal];
      }
    }

    // !SGST Calculation
    if (uv.sgst > 0) {
      if (taxSgst.length > 0) {
        let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxSgst.filter((vi) => {
            if (vi.gst == uv.sgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]);
            }
            return vi;
          });
          taxSgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: parseFloat(uv.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.sgst,
          amt: parseFloat(uv.total_sgst),
        };
        taxSgst = [...taxSgst, innerCgstCal];
      }
    }
    console.warn("rahul:: uv[final_amt]", uv["final_amt"]);
    total_final_amt = parseFloat(total_final_amt) + parseFloat(uv["final_amt"]);

    // !new code
    base_amt = parseFloat(base_amt) + parseFloat(uv["base_amt"]);
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal"]));
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal_per"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal_per"]));
    total_taxable_amt =
      parseFloat(total_taxable_amt) + parseFloat(uv["total_amt"]);
    total_tax_amt = parseFloat(total_tax_amt) + parseFloat(uv["total_igst"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["row_dis_amt"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["invoice_dis_amt"]);

    total_qty = parseInt(total_qty) + parseInt(uv["qty"]);

    total_free_qty =
      parseInt(total_free_qty) +
      (uv["free_qty"] === "" ? 0 : parseInt(uv["free_qty"]));

    // console.log("gst inner row ", uv);
    return uv;
  });
  // !GST Calculation

  console.log(
    "gst_row >>>>>>>>>>>> ",
    gst_row,
    base_amt,
    newAdditionalChargesTotal
  );
  base_amt = parseFloat(base_amt) + parseFloat(newAdditionalChargesTotal);

  let additionalChgLedgerAmt3_ = isNaN(parseFloat(additionalChgLedgerAmt3))
    ? 0
    : parseFloat(additionalChgLedgerAmt3);

  let bill_amount = parseFloat(total_final_amt) + additionalChgLedgerAmt3_;

  console.log("bill_amount>>>>", bill_amount, additionalChgLedgerAmt3_);

  total_free_qty = isNaN(total_free_qty) === true ? 0 : total_free_qty;

  return {
    base_amt,
    total_purchase_discount_amt,
    total_taxable_amt,
    total_tax_amt,
    gst_row,
    total_final_amt,
    taxIgst,
    taxCgst,
    taxSgst,
    total_invoice_dis_amt,
    total_qty,
    total_free_qty,
    bill_amount,
    purchase_discount,
    purchase_discount_amt,
    total_row_gross_amt,
    total_row_gross_amt1,
  };
};

export const fnTranxCalculationTCSTDS = ({
  elementFrom,
  rows,
  ledger_disc_per,
  ledger_disc_amt,
  additionalChargesTotal,

  additionalChgLedgerAmt1,
  additionalChgLedgerAmt2,
  additionalChgLedgerAmt3,

  takeDiscountAmountInLumpsum,
  isFirstDiscountPerCalculate,
  tcs_per,
  tcs_amt,
}) => {
  additionalChgLedgerAmt3 =
    additionalChgLedgerAmt3 !== "" ? parseFloat(additionalChgLedgerAmt3) : 0;

  let newAdditionalChargesTotal = 0;
  let purchase_discount_amt = 0;
  let purchase_discount = 0;
  if (
    parseFloat(additionalChgLedgerAmt1) > 0 ||
    parseFloat(additionalChgLedgerAmt1) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt1);

  if (
    parseFloat(additionalChgLedgerAmt2) > 0 ||
    parseFloat(additionalChgLedgerAmt2) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt2);
  // console.warn(
  //   "newAdditionalChargesTotal <<<<<<<<<<<<<< " + newAdditionalChargesTotal,
  //   takeDiscountAmountInLumpsum,
  //   isFirstDiscountPerCalculate
  // );

  let total_row_dis_amt = 0;
  let total_row_gross_amt = 0;
  let total_row_gross_amt1 = 0;
  let row_disc_total_amt = 0;
  let totalbaseamt = 0;
  // ! Row level Discount Calculation
  let baserowcal = rows.map((uv, i) => {
    let row_dis_amt = 0;
    let base_amt = parseInt(uv.qty) * parseFloat(uv.rate);
    uv.base_amt = isNaN(base_amt) ? 0 : base_amt;
    uv["gross_amt"] = uv["base_amt"];
    uv["total_amt"] = uv["base_amt"];
    uv["total_base_amt"] = uv["base_amt"];
    if (
      takeDiscountAmountInLumpsum == false &&
      isFirstDiscountPerCalculate == false
    ) {
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }
        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
    } else if (
      isFirstDiscountPerCalculate == true &&
      takeDiscountAmountInLumpsum == false
    ) {
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }
        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
    } else if (
      isFirstDiscountPerCalculate == false &&
      takeDiscountAmountInLumpsum == true
    ) {
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        if (takeDiscountAmountInLumpsum === true) {
          total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        }
        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
    } else if (
      isFirstDiscountPerCalculate == true &&
      takeDiscountAmountInLumpsum == true
    ) {
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = calculatePercentage(uv["gross_amt"], uv["dis_per2"]);

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = uv["gross_amt"] - per_amt;
        uv["total_base_amt"] = uv["total_base_amt"] - per_amt;
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }

      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = parseFloat(uv["dis_amt"]);
        if (takeDiscountAmountInLumpsum === true) {
          total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] =
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt);
        uv["total_amt"] =
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt);

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = row_dis_amt + total_dis_amt;
      }
    }

    uv["row_dis_amt"] = row_dis_amt;
    uv["add_chg_amt"] = 0;
    uv["gross_amt1"] = uv["gross_amt"];
    uv["total_amt"] = uv["gross_amt1"];

    row_disc_total_amt =
      parseFloat(row_disc_total_amt) + parseFloat(uv["total_amt"]);
    // ! New code
    total_row_gross_amt =
      parseFloat(total_row_gross_amt) + parseFloat(uv["gross_amt"]);
    total_row_dis_amt =
      parseFloat(total_row_dis_amt) + parseFloat(uv["gross_amt"]);
    totalbaseamt = base_amt;
    return uv;
  });

  // console.log("baserowcal::: <<<<<<<<<<<<<< ", baserowcal);

  // ! Additional charges calculation
  let add_total_amt = 0;
  let add_prop_cal = 0;
  let add_charges_row = baserowcal.map((uv, vi) => {
    if (
      parseFloat(uv.total_amt) > 0 &&
      (parseFloat(additionalChargesTotal) > 0 ||
        parseFloat(additionalChargesTotal) < 0) &&
      uv.qty != ""
    ) {
      // !New code
      uv["add_chg_amt"] = calculateAddChgValue(
        total_row_gross_amt,
        additionalChargesTotal,
        uv["gross_amt"]
      );
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    } else if (uv.qty == "") {
      // !New code
      uv["add_chg_amt"] = 0;
      uv["gross_amt1"] =
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]);
    }
    add_prop_cal =
      parseFloat(add_prop_cal) +
      parseFloat(uv["additional_charges_proportional_cal"]);
    add_total_amt = parseFloat(add_total_amt) + parseFloat(uv["total_amt"]);

    // ! New code
    total_row_gross_amt1 =
      parseFloat(total_row_gross_amt1) + parseFloat(uv["gross_amt1"]);

    return uv;
  });

  // console.log("add_charges_row ><<<<<<<<<<< ", add_charges_row);

  // ! Discount Ledger Amount discount calculation
  if (elementFrom === "") {
    ledger_disc_amt = ledger_disc_amt;
    ledger_disc_per =
      (parseFloat(ledger_disc_amt) * 100) / parseFloat(total_row_gross_amt1);
  }
  let ledger_disc_base_amt_total = 0;
  let ledger_disc_amt_row = add_charges_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      if (parseFloat(ledger_disc_amt) > 0) {
        purchase_discount_amt = ledger_disc_amt;
        purchase_discount = ledger_disc_per;
        // ! New code
        uv["invoice_dis_amt"] = calculateInvoiceDisValue(
          total_row_gross_amt1,
          parseFloat(ledger_disc_amt),
          uv["gross_amt1"]
        );
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      } else {
        purchase_discount_amt = 0;
        purchase_discount = 0;
        // ! New code
        uv["invoice_dis_amt"] = 0;
        uv["total_amt"] =
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
      }
    } else if (uv.qty == "") {
      // ! New code
      uv["invoice_dis_amt"] = 0;
      uv["total_amt"] =
        parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]);
    }
    ledger_disc_base_amt_total =
      parseFloat(ledger_disc_base_amt_total) + parseFloat(uv["total_amt"]);

    // console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
    return uv;
  });

  let total_final_amt = 0;
  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  let base_amt = 0;
  let total_purchase_discount_amt = 0;
  let total_taxable_amt = 0;
  let total_tax_amt = 0;
  let total_invoice_dis_amt = 0;
  let total_qty = 0;
  let total_free_qty = 0;

  // console.log("ledger_disc_amt_row <<<<<<<<<<<<< ", ledger_disc_amt_row);
  let gst_row = ledger_disc_amt_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      uv["gst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["igst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["cgst"] = uv["unit_id"] ? uv["unit_id"]["cgst"] : 0;
      uv["sgst"] = uv["unit_id"] ? uv["unit_id"]["sgst"] : 0;
      uv["total_igst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["igst"])
      ).toFixed(2);
      uv["total_cgst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["cgst"])
      ).toFixed(2);
      uv["total_sgst"] = parseFloat(
        calculatePercentage(uv["total_amt"], uv["sgst"])
      ).toFixed(2);
      uv["final_amt"] = parseFloat(
        parseFloat(uv["total_amt"]) + parseFloat(uv["total_igst"])
      );
    } else if (uv.qty == "" || uv.rate == 0 || uv.qty == 0) {
      uv["gst"] = 0;
      uv["igst"] = 0;
      uv["cgst"] = 0;
      uv["sgst"] = 0;
      uv["total_igst"] = 0;
      uv["total_cgst"] = 0;
      uv["total_sgst"] = 0;
      uv["final_amt"] = 0;
    }
    // !IGST Calculation
    if (uv.igst > 0) {
      if (taxIgst.length > 0) {
        let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
        if (innerIgstTax != undefined) {
          let innerIgstCal = taxIgst.filter((vi) => {
            if (vi.gst == uv.igst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]);
            }
            return vi;
          });
          taxIgst = [...innerIgstCal];
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,

            gst: uv.igst,
            amt: parseFloat(uv.total_igst),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      } else {
        let innerIgstCal = {
          d_gst: uv.igst,

          gst: uv.igst,
          amt: parseFloat(uv.total_igst),
        };
        taxIgst = [...taxIgst, innerIgstCal];
      }
    }

    // !CGST Calculation
    if (uv.cgst > 0) {
      if (taxCgst.length > 0) {
        let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxCgst.filter((vi) => {
            if (vi.gst == uv.cgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]);
            }
            return vi;
          });
          taxCgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: parseFloat(uv.total_cgst),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.cgst,
          amt: parseFloat(uv.total_cgst),
        };
        taxCgst = [...taxCgst, innerCgstCal];
      }
    }

    // !SGST Calculation
    if (uv.sgst > 0) {
      if (taxSgst.length > 0) {
        let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxSgst.filter((vi) => {
            if (vi.gst == uv.sgst) {
              vi["amt"] = parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]);
            }
            return vi;
          });
          taxSgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: parseFloat(uv.total_sgst),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.sgst,
          amt: parseFloat(uv.total_sgst),
        };
        taxSgst = [...taxSgst, innerCgstCal];
      }
    }
    // console.warn("rahul:: uv[final_amt]", uv["final_amt"]);
    total_final_amt = parseFloat(total_final_amt) + parseFloat(uv["final_amt"]);

    // !new code
    base_amt = parseFloat(base_amt) + parseFloat(uv["base_amt"]);
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal"]));
    total_purchase_discount_amt =
      parseFloat(total_purchase_discount_amt) +
      (isNaN(parseFloat(uv["discount_proportional_cal_per"]))
        ? 0
        : parseFloat(uv["discount_proportional_cal_per"]));
    total_taxable_amt =
      parseFloat(total_taxable_amt) + parseFloat(uv["total_amt"]);
    total_tax_amt = parseFloat(total_tax_amt) + parseFloat(uv["total_igst"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["row_dis_amt"]);

    total_invoice_dis_amt =
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["invoice_dis_amt"]);

    total_qty = parseInt(total_qty) + parseInt(uv["qty"]);

    total_free_qty =
      parseInt(total_free_qty) +
      (uv["free_qty"] === "" ? 0 : parseInt(uv["free_qty"]));

    // console.log("gst inner row ", uv);
    return uv;
  });
  // !GST Calculation

  base_amt = parseFloat(base_amt) + parseFloat(newAdditionalChargesTotal);

  let additionalChgLedgerAmt3_ = isNaN(parseFloat(additionalChgLedgerAmt3))
    ? 0
    : parseFloat(additionalChgLedgerAmt3);

  let bill_amount = parseFloat(total_final_amt) + additionalChgLedgerAmt3_;
  // console.log("bill_amount", bill_amount);
  // ! Costing Calculation
  total_free_qty = isNaN(total_free_qty) === true ? 0 : total_free_qty;
  let costing_row = gst_row.map((cv, ci) => {
    // let is_batch = cv["selectedProduct"]["is_batch"];
    // console.log("is_batch", is_batch);
    let totalqty =
      (isNaN(parseInt(cv["qty"])) ? 0 : parseInt(cv["qty"])) +
      (isNaN(parseInt(cv["free_qty"])) ? 0 : parseInt(cv["free_qty"])) +
      isNaN(
        parseFloat(cv["additional_charges_proportional_cal"])
          ? 0
          : parseFloat(cv["additional_charges_proportional_cal"])
      );

    let costingcal = parseFloat(cv["total_amt"]) / totalqty;

    let costingwithtaxcal =
      costingcal + parseFloat(cv["total_igst"]) / totalqty;

    cv["costing"] = parseFloat(costingcal).toFixed(3);
    cv["costing_with_tax"] = parseFloat(costingwithtaxcal).toFixed(3);

    return cv;
  });

  // !TCS TDS Calculation
  let tcs_amt_cal = 0;
  let tcs_per_cal = 0;
  if (elementFrom.trim().toLowerCase() == "tcs_amt") {
    tcs_amt_cal = tcs_amt;
    //! Reverse calculation
    tcs_per_cal = (parseFloat(tcs_amt_cal) * 100) / parseFloat(bill_amount);
    // tcs_per_cal
  } else if (elementFrom.trim().toLowerCase() == "tcs_per") {
    tcs_per_cal = tcs_per;
    tcs_amt_cal = calculatePercentage(
      parseFloat(bill_amount),
      parseFloat(tcs_per)
    );
  } else {
    tcs_per_cal = tcs_per;
    tcs_amt_cal = tcs_amt;
  }
  // console.log("tcs_amt_cal =-> ", tcs_amt_cal, tcs_per_cal);
  bill_amount += tcs_amt_cal;

  return {
    base_amt,
    total_purchase_discount_amt,
    total_taxable_amt,
    total_tax_amt,
    gst_row: costing_row,
    total_final_amt,
    taxIgst,
    taxCgst,
    taxSgst,
    total_invoice_dis_amt,
    total_qty,
    total_free_qty,
    bill_amount,
    purchase_discount,
    purchase_discount_amt,
    total_row_gross_amt,
    total_row_gross_amt1,
    tcs_per_cal,
    tcs_amt_cal,
  };
};

export const fnTranxCalculationRoundDecimalPlaces = ({
  elementFrom,
  rows,
  ledger_disc_per,
  ledger_disc_amt,
  additionalChargesTotal,

  additionalChgLedgerAmt1,
  additionalChgLedgerAmt2,
  additionalChgLedgerAmt3,

  takeDiscountAmountInLumpsum,
  isFirstDiscountPerCalculate,
  tcs_per,
  tcs_amt,
  configDecimalPlaces,
}) => {
  additionalChgLedgerAmt3 =
    additionalChgLedgerAmt3 !== "" ? parseFloat(additionalChgLedgerAmt3) : 0;

  let newAdditionalChargesTotal = 0;
  let purchase_discount_amt = 0;
  let purchase_discount = 0;
  if (
    parseFloat(additionalChgLedgerAmt1) > 0 ||
    parseFloat(additionalChgLedgerAmt1) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt1);

  if (
    parseFloat(additionalChgLedgerAmt2) > 0 ||
    parseFloat(additionalChgLedgerAmt2) < 0
  )
    newAdditionalChargesTotal =
      parseFloat(newAdditionalChargesTotal) +
      parseFloat(additionalChgLedgerAmt2);
  // console.warn(
  //   "newAdditionalChargesTotal <<<<<<<<<<<<<< " + newAdditionalChargesTotal,
  //   takeDiscountAmountInLumpsum,
  //   isFirstDiscountPerCalculate
  // );

  let total_row_dis_amt = 0;
  let total_row_gross_amt = 0;
  let total_row_gross_amt1 = 0;
  let row_disc_total_amt = 0;
  let totalbaseamt = 0;
  // ! Row level Discount Calculation
  let baserowcal = rows.map((uv, i) => {
    let row_dis_amt = 0;
    // uv["qty"] = roundDigit(uv.qty, configDecimalPlaces);
    // uv["rate"] = roundDigit(uv.rate, configDecimalPlaces);
    let base_amt = parseInt(uv.qty) * parseFloat(uv.rate);
    uv["base_amt"] = isNaN(base_amt)
      ? 0
      : roundDigit(base_amt, configDecimalPlaces);

    uv["gross_amt"] = uv["base_amt"];
    uv["total_amt"] = uv["base_amt"];
    uv["total_base_amt"] = uv["base_amt"];
    if (
      takeDiscountAmountInLumpsum == false &&
      isFirstDiscountPerCalculate == false
    ) {
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = roundDigit(uv["dis_amt"], configDecimalPlaces);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] = roundDigit(
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt),
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt),
          configDecimalPlaces
        );

        uv["total_base_amt"] = roundDigit(uv["total_amt"], configDecimalPlaces);

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = roundDigit(total_dis_amt, configDecimalPlaces);
        row_dis_amt = roundDigit(
          row_dis_amt + total_dis_amt,
          configDecimalPlaces
        );
      }
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = roundDigit(
          calculatePercentage(uv["gross_amt"], uv["dis_per"]),
          configDecimalPlaces
        );
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }
        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = roundDigit(
          uv["gross_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_base_amt"] = roundDigit(
          uv["total_base_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          uv["total_amt"] - per_amt,
          configDecimalPlaces
        );
        row_dis_amt = roundDigit(row_dis_amt + per_amt, configDecimalPlaces);
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = roundDigit(
          calculatePercentage(uv["gross_amt"], uv["dis_per2"]),
          configDecimalPlaces
        );

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = roundDigit(
          uv["gross_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_base_amt"] = roundDigit(
          uv["total_base_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          uv["total_amt"] - per_amt,
          configDecimalPlaces
        );
        row_dis_amt = roundDigit(row_dis_amt + per_amt, configDecimalPlaces);
      }
    } else if (
      isFirstDiscountPerCalculate == true &&
      takeDiscountAmountInLumpsum == false
    ) {
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = roundDigit(
          calculatePercentage(uv["gross_amt"], uv["dis_per"]),
          configDecimalPlaces
        );
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }
        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = roundDigit(
          uv["gross_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_base_amt"] = roundDigit(
          uv["total_base_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_amt"] = uv["total_amt"] - per_amt;
        row_dis_amt = row_dis_amt + per_amt;
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = roundDigit(
          calculatePercentage(uv["gross_amt"], uv["dis_per2"]),
          configDecimalPlaces
        );

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = roundDigit(
          uv["gross_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_base_amt"] = roundDigit(
          uv["total_base_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          uv["total_amt"] - per_amt,
          configDecimalPlaces
        );
        row_dis_amt = roundDigit(row_dis_amt + per_amt, configDecimalPlaces);
      }
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = roundDigit(uv["dis_amt"], configDecimalPlaces);
        // if (takeDiscountAmountInLumpsum === true) {
        //   total_dis_amt = parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]);
        // }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] = roundDigit(
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt),
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt),
          configDecimalPlaces
        );

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = roundDigit(
          row_dis_amt + total_dis_amt,
          configDecimalPlaces
        );
      }
    } else if (
      isFirstDiscountPerCalculate == false &&
      takeDiscountAmountInLumpsum == true
    ) {
      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = roundDigit(uv["dis_amt"], configDecimalPlaces);
        if (takeDiscountAmountInLumpsum === true) {
          total_dis_amt = roundDigit(
            parseFloat(uv["dis_amt"]) * parseInt(uv["qty"])
          );
        }
        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] = roundDigit(
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt),
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt),
          configDecimalPlaces
        );

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = roundDigit(
          row_dis_amt + total_dis_amt,
          configDecimalPlaces
        );
      }
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = roundDigit(
          calculatePercentage(uv["gross_amt"], uv["dis_per"]),
          configDecimalPlaces
        );

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = roundDigit(
          uv["gross_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_base_amt"] = roundDigit(
          uv["total_base_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          uv["total_amt"] - per_amt,
          configDecimalPlaces
        );
        row_dis_amt = roundDigit(row_dis_amt + per_amt, configDecimalPlaces);
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = roundDigit(
          calculatePercentage(uv["gross_amt"], uv["dis_per2"]),
          configDecimalPlaces
        );

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = roundDigit(
          uv["gross_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_base_amt"] = roundDigit(
          uv["total_base_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          uv["total_amt"] - per_amt,
          configDecimalPlaces
        );
        row_dis_amt = roundDigit(row_dis_amt + per_amt, configDecimalPlaces);
      }
    } else if (
      isFirstDiscountPerCalculate == true &&
      takeDiscountAmountInLumpsum == true
    ) {
      if (uv["dis_per"] != "" && uv["dis_per"] > 0) {
        let per_amt = roundDigit(
          calculatePercentage(uv["gross_amt"], uv["dis_per"]),
          configDecimalPlaces
        );

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = roundDigit(
          uv["gross_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_base_amt"] = roundDigit(
          uv["total_base_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          uv["total_amt"] - per_amt,
          configDecimalPlaces
        );
        row_dis_amt = roundDigit(row_dis_amt + per_amt, configDecimalPlaces);
      }
      if (uv["dis_per2"] != "" && uv["dis_per2"] > 0) {
        let per_amt = roundDigit(
          calculatePercentage(uv["gross_amt"], uv["dis_per2"]),
          configDecimalPlaces
        );

        uv["dis_per_cal"] = per_amt;
        // ! New Code
        uv["gross_amt"] = roundDigit(
          uv["gross_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_base_amt"] = roundDigit(
          uv["total_base_amt"] - per_amt,
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          uv["total_amt"] - per_amt,
          configDecimalPlaces
        );
        row_dis_amt = roundDigit(row_dis_amt + per_amt, configDecimalPlaces);
      }

      if (uv["dis_amt"] != "" && uv["dis_amt"] > 0) {
        let total_dis_amt = roundDigit(uv["dis_amt"], configDecimalPlaces);
        if (takeDiscountAmountInLumpsum === true) {
          total_dis_amt = roundDigit(
            parseFloat(uv["dis_amt"]) * parseInt(uv["qty"]),
            configDecimalPlaces
          );
        }

        // !old code uv["total_amt"] = parseFloat(uv["total_amt"]) - parseFloat(uv["dis_amt"]);
        // !below new code
        uv["gross_amt"] = roundDigit(
          parseFloat(uv["gross_amt"]) - parseFloat(total_dis_amt),
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          parseFloat(uv["total_amt"]) - parseFloat(total_dis_amt),
          configDecimalPlaces
        );

        uv["total_base_amt"] = uv["total_amt"];

        // !old code uv["dis_amt_cal"] = uv["dis_amt"];
        // !below new code
        uv["dis_amt_cal"] = total_dis_amt;
        row_dis_amt = roundDigit(
          row_dis_amt + total_dis_amt,
          configDecimalPlaces
        );
      }
    }

    uv["row_dis_amt"] = row_dis_amt;
    uv["add_chg_amt"] = 0;
    uv["gross_amt1"] = uv["gross_amt"];
    uv["total_amt"] = uv["gross_amt1"];

    row_disc_total_amt = roundDigit(
      parseFloat(row_disc_total_amt) + parseFloat(uv["total_amt"]),
      configDecimalPlaces
    );
    // ! New code
    total_row_gross_amt = roundDigit(
      parseFloat(total_row_gross_amt) + parseFloat(uv["gross_amt"]),
      configDecimalPlaces
    );
    total_row_dis_amt = roundDigit(
      parseFloat(total_row_dis_amt) + parseFloat(uv["gross_amt"]),
      configDecimalPlaces
    );
    totalbaseamt = roundDigit(base_amt, configDecimalPlaces);
    return uv;
  });

  // console.log("baserowcal::: <<<<<<<<<<<<<< ", baserowcal);

  // ! Additional charges calculation
  let add_total_amt = 0;
  let add_prop_cal = 0;
  let add_charges_row = baserowcal.map((uv, vi) => {
    if (
      parseFloat(uv.total_amt) > 0 &&
      (parseFloat(additionalChargesTotal) > 0 ||
        parseFloat(additionalChargesTotal) < 0) &&
      uv.qty != ""
    ) {
      // !New code
      uv["add_chg_amt"] = roundDigit(
        calculateAddChgValue(
          total_row_gross_amt,
          additionalChargesTotal,
          uv["gross_amt"]
        ),
        configDecimalPlaces
      );
      uv["gross_amt1"] = roundDigit(
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]),
        configDecimalPlaces
      );
    } else if (uv.qty == "") {
      // !New code
      uv["add_chg_amt"] = 0;
      uv["gross_amt1"] = roundDigit(
        parseFloat(uv["gross_amt"]) + parseFloat(uv["add_chg_amt"]),
        configDecimalPlaces
      );
    }
    add_prop_cal = roundDigit(
      parseFloat(add_prop_cal) +
        parseFloat(uv["additional_charges_proportional_cal"]),
      configDecimalPlaces
    );
    add_total_amt = roundDigit(
      parseFloat(add_total_amt) + parseFloat(uv["total_amt"]),
      configDecimalPlaces
    );

    // ! New code
    total_row_gross_amt1 = roundDigit(
      parseFloat(total_row_gross_amt1) + parseFloat(uv["gross_amt1"]),
      configDecimalPlaces
    );

    return uv;
  });

  // console.log("add_charges_row ><<<<<<<<<<< ", add_charges_row);

  // ! Discount Ledger Amount discount calculation
  if (elementFrom === "") {
    ledger_disc_amt = roundDigit(ledger_disc_amt, configDecimalPlaces);
    ledger_disc_per = roundDigit(
      (parseFloat(ledger_disc_amt) * 100) / parseFloat(total_row_gross_amt1),
      configDecimalPlaces
    );
  }
  let ledger_disc_base_amt_total = 0;
  let ledger_disc_amt_row = add_charges_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      if (parseFloat(ledger_disc_amt) > 0) {
        purchase_discount_amt = ledger_disc_amt;
        purchase_discount = ledger_disc_per;
        // ! New code
        uv["invoice_dis_amt"] = roundDigit(
          calculateInvoiceDisValue(
            total_row_gross_amt1,
            parseFloat(ledger_disc_amt),
            uv["gross_amt1"]
          ),
          configDecimalPlaces
        );
        uv["total_amt"] = roundDigit(
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]),
          configDecimalPlaces
        );
      } else {
        purchase_discount_amt = 0;
        purchase_discount = 0;
        // ! New code
        uv["invoice_dis_amt"] = 0;
        uv["total_amt"] = roundDigit(
          parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]),
          configDecimalPlaces
        );
      }
    } else if (uv.qty == "") {
      // ! New code
      uv["invoice_dis_amt"] = 0;
      uv["total_amt"] = roundDigit(
        parseFloat(uv["gross_amt1"]) - parseFloat(uv["invoice_dis_amt"]),
        configDecimalPlaces
      );
    }
    ledger_disc_base_amt_total = roundDigit(
      parseFloat(ledger_disc_base_amt_total) + parseFloat(uv["total_amt"]),
      configDecimalPlaces
    );

    // console.log("baserowcal after::::uv ><<<<<<<<<<<<< ", uv);
    return uv;
  });

  let total_final_amt = 0;
  let taxIgst = [];
  let taxCgst = [];
  let taxSgst = [];
  let base_amt = 0;
  let total_purchase_discount_amt = 0;
  let total_taxable_amt = 0;
  let total_tax_amt = 0;
  let total_invoice_dis_amt = 0;
  let total_qty = 0;
  let total_free_qty = 0;

  // console.log("ledger_disc_amt_row <<<<<<<<<<<<< ", ledger_disc_amt_row);
  let gst_row = ledger_disc_amt_row.map((uv, i) => {
    if (parseFloat(uv.total_amt) > 0 && uv.qty != "") {
      uv["gst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["igst"] = uv["unit_id"] ? uv["unit_id"]["igst"] : 0;
      uv["cgst"] = uv["unit_id"] ? uv["unit_id"]["cgst"] : 0;
      uv["sgst"] = uv["unit_id"] ? uv["unit_id"]["sgst"] : 0;
      uv["total_cgst"] = roundDigit(
        calculatePercentage(uv["total_amt"], uv["cgst"]),
        configDecimalPlaces
      );
      uv["total_sgst"] = roundDigit(
        calculatePercentage(uv["total_amt"], uv["sgst"]),
        configDecimalPlaces
      );
      //! OLD IGST Calculation
      // uv["total_igst"] = roundDigit(
      //   calculatePercentage(uv["total_amt"], uv["igst"]),
      //   configDecimalPlaces
      // );
      uv["total_igst"] = roundDigit(
        parseFloat(uv["total_cgst"]) + parseFloat(uv["total_sgst"]),
        configDecimalPlaces
      );
      uv["final_amt"] = roundDigit(
        parseFloat(uv["total_amt"]) + parseFloat(uv["total_igst"]),
        configDecimalPlaces
      );
    } else if (uv.qty == "" || uv.rate == 0 || uv.qty == 0) {
      uv["gst"] = 0;
      uv["igst"] = 0;
      uv["cgst"] = 0;
      uv["sgst"] = 0;
      uv["total_igst"] = 0;
      uv["total_cgst"] = 0;
      uv["total_sgst"] = 0;
      uv["final_amt"] = 0;
    }
    // !IGST Calculation
    if (uv.igst > 0) {
      if (taxIgst.length > 0) {
        let innerIgstTax = taxIgst.find((vi) => vi.gst == uv.igst);
        if (innerIgstTax != undefined) {
          let innerIgstCal = taxIgst.filter((vi) => {
            if (vi.gst == uv.igst) {
              vi["amt"] = roundDigit(
                parseFloat(vi["amt"]) + parseFloat(uv["total_igst"]),
                configDecimalPlaces
              );
            }
            return vi;
          });
          taxIgst = [...innerIgstCal];
        } else {
          let innerIgstCal = {
            d_gst: uv.igst,

            gst: uv.igst,
            amt: roundDigit(uv.total_igst, configDecimalPlaces),
          };
          taxIgst = [...taxIgst, innerIgstCal];
        }
      } else {
        let innerIgstCal = {
          d_gst: uv.igst,

          gst: uv.igst,
          amt: roundDigit(uv.total_igst, configDecimalPlaces),
        };
        taxIgst = [...taxIgst, innerIgstCal];
      }
    }

    // !CGST Calculation
    if (uv.cgst > 0) {
      if (taxCgst.length > 0) {
        let innerCgstTax = taxCgst.find((vi) => vi.gst == uv.cgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxCgst.filter((vi) => {
            if (vi.gst == uv.cgst) {
              vi["amt"] = roundDigit(
                parseFloat(vi["amt"]) + parseFloat(uv["total_cgst"]),
                configDecimalPlaces
              );
            }
            return vi;
          });
          taxCgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.cgst,
            amt: roundDigit(uv.total_cgst, configDecimalPlaces),
          };
          taxCgst = [...taxCgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.cgst,
          amt: roundDigit(uv.total_cgst, configDecimalPlaces),
        };
        taxCgst = [...taxCgst, innerCgstCal];
      }
    }

    // !SGST Calculation
    if (uv.sgst > 0) {
      if (taxSgst.length > 0) {
        let innerCgstTax = taxSgst.find((vi) => vi.gst == uv.sgst);
        if (innerCgstTax != undefined) {
          let innerCgstCal = taxSgst.filter((vi) => {
            if (vi.gst == uv.sgst) {
              vi["amt"] = roundDigit(
                parseFloat(vi["amt"]) + parseFloat(uv["total_sgst"]),
                configDecimalPlaces
              );
            }
            return vi;
          });
          taxSgst = [...innerCgstCal];
        } else {
          let innerCgstCal = {
            d_gst: uv.igst,

            gst: uv.sgst,
            amt: roundDigit(uv.total_sgst, configDecimalPlaces),
          };
          taxSgst = [...taxSgst, innerCgstCal];
        }
      } else {
        let innerCgstCal = {
          d_gst: uv.igst,

          gst: uv.sgst,
          amt: roundDigit(uv.total_sgst, configDecimalPlaces),
        };
        taxSgst = [...taxSgst, innerCgstCal];
      }
    }
    // console.warn("rahul:: uv[final_amt]", uv["final_amt"]);
    total_final_amt = roundDigit(
      parseFloat(total_final_amt) + parseFloat(uv["final_amt"]),
      configDecimalPlaces
    );

    // !new code
    base_amt = roundDigit(
      parseFloat(base_amt) + parseFloat(uv["base_amt"]),
      configDecimalPlaces
    );
    total_purchase_discount_amt =
      roundDigit(total_purchase_discount_amt, configDecimalPlaces) +
      (isNaN(parseFloat(uv["discount_proportional_cal"]))
        ? 0
        : roundDigit(uv["discount_proportional_cal"]),
      configDecimalPlaces);
    total_purchase_discount_amt =
      roundDigit(total_purchase_discount_amt, configDecimalPlaces) +
      (isNaN(parseFloat(uv["discount_proportional_cal_per"]))
        ? 0
        : roundDigit(uv["discount_proportional_cal_per"]),
      configDecimalPlaces);
    total_taxable_amt = roundDigit(
      parseFloat(total_taxable_amt) + parseFloat(uv["total_amt"]),
      configDecimalPlaces
    );
    total_tax_amt = roundDigit(
      parseFloat(total_tax_amt) + parseFloat(uv["total_igst"]),
      configDecimalPlaces
    );

    total_invoice_dis_amt = roundDigit(
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["row_dis_amt"]),
      configDecimalPlaces
    );

    total_invoice_dis_amt = roundDigit(
      parseFloat(total_invoice_dis_amt) + parseFloat(uv["invoice_dis_amt"]),
      configDecimalPlaces
    );

    total_qty = roundDigit(
      parseInt(total_qty) + parseInt(uv["qty"]),
      configDecimalPlaces
    );

    total_free_qty =
      parseInt(total_free_qty) +
      (uv["free_qty"] === "" ? 0 : parseInt(uv["free_qty"]));

    // console.log("gst inner row ", uv);
    return uv;
  });
  // !GST Calculation

  base_amt =
    roundDigit(base_amt, configDecimalPlaces) +
    roundDigit(newAdditionalChargesTotal, configDecimalPlaces);

  let additionalChgLedgerAmt3_ = isNaN(parseFloat(additionalChgLedgerAmt3))
    ? 0
    : roundDigit(additionalChgLedgerAmt3, configDecimalPlaces);

  let bill_amount =
    roundDigit(total_final_amt, configDecimalPlaces) + additionalChgLedgerAmt3_;
  // console.log("bill_amount", bill_amount);
  // ! Costing Calculation
  total_free_qty = isNaN(total_free_qty) === true ? 0 : total_free_qty;
  let costing_row = gst_row.map((cv, ci) => {
    // let is_batch = cv["selectedProduct"]["is_batch"];
    // console.log("is_batch", is_batch);
    let totalqty =
      (isNaN(parseInt(cv["qty"])) ? 0 : parseInt(cv["qty"])) +
      (isNaN(parseInt(cv["free_qty"])) ? 0 : parseInt(cv["free_qty"])) +
      isNaN(
        parseFloat(cv["additional_charges_proportional_cal"])
          ? 0
          : parseFloat(cv["additional_charges_proportional_cal"])
      );

    let costingcal = roundDigit(
      parseFloat(cv["total_amt"]) / totalqty,
      configDecimalPlaces
    );

    let costingwithtaxcal = roundDigit(
      parseFloat(costingcal) + parseFloat(cv["total_igst"]) / totalqty,
      configDecimalPlaces
    );

    cv["costing"] = costingcal;
    cv["costing_with_tax"] = costingwithtaxcal;

    return cv;
  });

  // !TCS TDS Calculation
  let tcs_amt_cal = 0;
  let tcs_per_cal = 0;
  if (elementFrom.trim().toLowerCase() == "tcs_amt") {
    tcs_amt_cal = tcs_amt;
    //! Reverse calculation
    tcs_per_cal = roundDigit(
      (parseFloat(tcs_amt_cal) * 100) / parseFloat(bill_amount),
      configDecimalPlaces
    );
    // tcs_per_cal
  } else if (elementFrom.trim().toLowerCase() == "tcs_per") {
    tcs_per_cal = tcs_per;
    tcs_amt_cal = roundDigit(
      calculatePercentage(parseFloat(bill_amount), parseFloat(tcs_per)),
      configDecimalPlaces
    );
  } else {
    tcs_per_cal = tcs_per;
    tcs_amt_cal = tcs_amt;
  }
  // console.log("tcs_amt_cal =-> ", tcs_amt_cal, tcs_per_cal);
  bill_amount += tcs_amt_cal;

  return {
    base_amt,
    total_purchase_discount_amt,
    total_taxable_amt,
    total_tax_amt,
    gst_row: costing_row,
    total_final_amt,
    taxIgst,
    taxCgst,
    taxSgst,
    total_invoice_dis_amt,
    total_qty,
    total_free_qty,
    bill_amount,
    purchase_discount,
    purchase_discount_amt,
    total_row_gross_amt,
    total_row_gross_amt1,
    tcs_per_cal,
    tcs_amt_cal,
  };
};
