import React, { useState } from "react";

import InputMask from "react-input-mask";

// import DatePicker, { getYear, getMonth, range } from 'react-datepicker';
import DatePicker from "react-datepicker";
// import getYear from 'date-fns/getYear';
// import getMonth from 'date-fns/getMonth';
import "react-datepicker/dist/react-datepicker.css";
import MaskedTextInput from "react-text-mask";

function MyDatePicker(props) {
  return (
    <div>
      <DatePicker
        customInput={
          <MaskedTextInput
            mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
          />
        }
        ref={props.innerRef}
        {...props}
        //  / showMonthDropdown
        // showYearDropdown
      />
    </div>
  );
}

function MyTextDatePickerOLD(props) {
  // let mask = "dD/mM/yYYY";
  let mask = "dd/mm/YYYY";
  let formatChars = {
    d: "[0-3]",
    D: "[1-9]",
    m: "[0-1]",
    M: "[1-9]",
    y: "[1-9]",
    Y: "[0-9]",
  };

  let beforeMaskedValueChange = (newState, oldState, userInput) => {
    let { value } = newState;

    let dateParts = value.split("/");
    // console.warn({ dateParts });
    let dayPart = dateParts[0];
    let monthPart = dateParts[1];

    console.warn("dayPart ", dayPart);
    // Conditional mask for the 2nd digit of day based on the first digit
    if (dayPart.startsWith("3")) formatChars["D"] = "[0-1]";
    // To block 39, 32, etc.
    else if (dayPart.startsWith("0")) formatChars["D"] = "[1-9]";
    // To block 00.
    else formatChars["D"] = "[0-9]"; // To allow 05, 15, 25  etc.

    // Conditional mask for the 2nd digit of month based on the first digit
    if (monthPart != null && monthPart.startsWith("1"))
      formatChars["M"] = "[0-2]";
    // To block 15, 16, etc.
    else formatChars["M"] = "[1-9]"; // To allow 05, 06  etc - but blocking 00.

    return { value, selection: newState.selection };
  };
  console.log("props ", props);
  return (
    <InputMask
      inputRef={props.innerRef}
      mask={mask}
      // maskChar=" "
      value={props.value}
      onChange={props.onChange}
      formatChars={formatChars}
      beforeMaskedValueChange={beforeMaskedValueChange}
      {...props}
    ></InputMask>
  );
}

function MyTextDatePicker(props) {
  let mask = "dD/mM/YYYY";
  let formatChars = {
    Y: "[0-9]",
    d: "[0-3]",
    D: "[0-9]",
    m: "[0-1]",
    M: "[0-9]",
  };

  let beforeMaskedValueChange = (newState, oldState, userInput) => {
    let { value } = newState;

    // console.warn("value ", value);

    if (value != "") {
      let dateParts = value.split("/");
      let dayPart = dateParts[0];
      let monthPart = dateParts[1];

      // Conditional mask for the 2nd digit of day based on the first digit
      if (dayPart.startsWith("3")) formatChars["D"] = "[0-1]";
      // To block 39, 32, etc.
      else if (dayPart.startsWith("0")) formatChars["D"] = "[1-9]";
      // To block 00.
      else formatChars["D"] = "[0-9]"; // To allow 05, 15, 25  etc.

      // Conditional mask for the 2nd digit of month based on the first digit
      if (monthPart.startsWith("1")) formatChars["M"] = "[0-2]";
      // To block 15, 16, etc.
      else formatChars["M"] = "[1-9]"; // To allow 05, 06  etc - but blocking 00.
    }
    return { value, selection: newState.selection };
  };
  return (
    <InputMask
      inputRef={props.innerRef}
      mask={mask}
      value={props.value}
      onChange={props.onChange}
      formatChars={formatChars}
      beforeMaskedValueChange={beforeMaskedValueChange}
      {...props}
    ></InputMask>
  );
}

function MyAadharMask(props) {
  let mask = "9999 9999 9999 9999";

  return (
    <InputMask
      inputRef={props.innerRef}
      mask={mask}
      value={props.value}
      onChange={props.onChange}
      {...props}
    ></InputMask>
  );
}

export { MyDatePicker, MyTextDatePicker, MyAadharMask };
