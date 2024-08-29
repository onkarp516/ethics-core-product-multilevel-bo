import React from "react";
import Select, { components } from "react-select";
import { OnlyEnterAlphaNumbers } from "@/helpers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const CustomClearText = () => <>x</>;

const ClearIndicator = (props) => {
    const {
        children = <CustomClearText />,
        getStyles,
        innerProps: { ref, ...restInnerProps },
    } = props;
    return (
        <div
            {...restInnerProps}
            ref={ref}
            style={getStyles("clearIndicator", props)}
        >
            <div style={{ padding: "0px 0px" }}>{children}</div>
        </div>
    );
};

const controlStyles = {
    // border: "1px solid black",
    padding: "0px",
    // background: colourOptions[2].color,
    color: "white",
};

const ControlComponent = (props) => (
    <div style={controlStyles}>
        <components.Control {...props} />
    </div>
);

const indicatorSeparatorStyle = {
    alignSelf: "stretch",
    backgroundColor: "#333",
    marginBottom: 8,
    marginTop: 8,
    width: 1,
};

const IndicatorSeparator = ({ innerProps }) => {
    return <span style={indicatorSeparatorStyle} {...innerProps} />;
};

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            {/* <EmojiIcon label="Emoji" primaryColor={colourOptions[2].color} /> */}
            {/* <i className="fa fa-angle-down" style={{ color: "#333" }}></i> */}
            <FontAwesomeIcon icon={faAngleDown} style={{ color: "#333" }} />
        </components.DropdownIndicator>
    );
};
const CustomOption = (props) => {
    return (
        <div
            {...props.innerProps}
            className={`"p-2"}`}
        >
            {props.label}
        </div>
    );
};

const CustomInput = (props) => {
    // console.log("props", props);
    return (
        <components.Input
            {...props}
            maxLength={15}
            onKeyPress={(e) => {
                OnlyEnterAlphaNumbers(e);
            }}
        />
    );
};

const CustomSelectInput = (props) => {
    // console.log("props", props);
    return (
        <components.Input
            {...props}
            maxLength={4}
            onKeyPress={(e) => {
                OnlyEnterAlphaNumbers(e);
            }}
        />
    );
};

const Menu = (props) => {
    return <components.Menu {...props}>

    </components.Menu>
}
export {
    DropdownIndicator,
    IndicatorSeparator,
    ControlComponent,
    ClearIndicator,
    CustomOption,
    CustomInput,
    CustomSelectInput,
    Menu
};