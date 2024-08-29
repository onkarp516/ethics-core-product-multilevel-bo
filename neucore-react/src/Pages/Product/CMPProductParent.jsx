import React, { Component } from "react";

import Select from "react-select";

import { Form } from "react-bootstrap";

const CMPUnit = ({ index, level, extra }) => {
  // console.log("CMPUnit", { obj, index, level, extra });
  let { unitOpts } = extra;

  const handleLevelUnitChangeRec = (
    value,
    level,
    index,
    curr_level,
    arr,
    ele
  ) => {
    return arr.map((v, i) => {
      if (curr_level == level - 1) {
        v.level[index][ele] = value;
      } else if (v.level) {
        v.level = handleLevelUnitChangeRec(
          value,
          level,
          index,
          curr_level + 1,
          v.level
        );
      }

      return v;
    });
  };
  const handleLevelUnitChange = (value, level, index, ele) => {
    let { mstFinalFilterLevel, handleMstFilterState } = extra;

    let fmstFinalFilterLevel = [];
    if (level == 0) {
      mstFinalFilterLevel[0]["unit_arr"][index][ele] = value;
      fmstFinalFilterLevel = mstFinalFilterLevel;
    } else {
      fmstFinalFilterLevel = handleLevelUnitChangeRec(
        value,
        level,
        index,
        0,
        mstFinalFilterLevel,
        ele
      );
    }
    // console.log("fmstFinalFilterLevel", fmstFinalFilterLevel);
    handleMstFilterState(
      fmstFinalFilterLevel.length > 0
        ? fmstFinalFilterLevel
        : mstFinalFilterLevel
    );
  };
  const getUnitValueRec = (level, index, curr_level, arr, ele) => {
    arr.map((v, i) => {
      if (curr_level == level - 1) {
        return v.level[index][ele];
      } else if (v.level) {
        return getUnitValueRec(level, index, curr_level + 1, v.level);
      }
    });
  };

  const getUnitValue = (level, index, ele) => {
    // console.log("getUnitValue", { level, index, ele });
    let { mstFinalFilterLevel } = extra;

    if (level == 0) {
      return mstFinalFilterLevel[0]["unit_arr"][index][ele]
        ? mstFinalFilterLevel[0]["unit_arr"][index][ele]
        : "";
    } else {
      return getUnitValueRec(level, index, 0, mstFinalFilterLevel, ele);
    }
  };

  return (
    <>
      <td>
        <Select
          menuPlacement="auto"
          components={{
            // DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          isClearable={false}
          // styles={newRowDropdown}
          name={`level${level}${index}`}
          id={`level${level}${index}`}
          placeholder={`level${level}${index}`}
          options={unitOpts}
          onChange={(v, action) => {
            if (action.action == "clear") {
              handleLevelUnitChange("", level, index, "unit_id");
            } else {
              handleLevelUnitChange(v, level, index, "unit_id");
            }
          }}
          value={getUnitValue(level, index, "unit_id")}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder="Unit Conv"
          onChange={(e) => {
            handleLevelUnitChange(e.target.value, level, index, "unit_conv");
          }}
          style={{ background: "transparent" }}
          value={getUnitValue(level, index, "unit_conv")}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          placeholder="Unit marg"
          onChange={(e) => {
            handleLevelUnitChange(e.target.value, level, index, "unit_marg");
          }}
          style={{ background: "transparent" }}
          value={getUnitValue(level, index, "unit_marg")}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="min_qty"
          placeholder="min qty"
          onChange={(e) => {
            handleLevelUnitChange(e.target.value, level, index, "min_qty");
          }}
          style={{ background: "transparent" }}
          value={getUnitValue(level, index, "min_qty")}
        />
      </td>
    </>
  );
};

const CMPProductChild = ({ obj, index, level, extra }) => {
  const getSelectioOpt = (id) => {
    // console.log("extra", extra);
    // console.log("id", id);
    let { subFilterOpts } = extra;
    let fOpt = subFilterOpts.find((v) => v.filter_id == id);
    if (fOpt) {
      return fOpt.opts;
    }
    return [];
  };

  const handleLevelChangeRec = (value, level, index, curr_level, arr) => {
    // debugger;
    return arr.map((v, i) => {
      if (curr_level == level - 1) {
        v.level[index]["selected_filter"] = value;
      } else if (v.level) {
        v.level = handleLevelChangeRec(
          value,
          level,
          index,
          curr_level + 1,
          v.level
        );
      }

      return v;
    });
  };
  const handleLevelChange = (value, level, index) => {
    let { mstFinalFilterLevel, handleMstFilterState } = extra;

    let fmstFinalFilterLevel = [];
    if (level == 0) {
      mstFinalFilterLevel[index]["selected_filter"] = value;
      fmstFinalFilterLevel = mstFinalFilterLevel;
    } else {
      fmstFinalFilterLevel = handleLevelChangeRec(
        value,
        level,
        index,
        0,
        mstFinalFilterLevel
      );
    }

    handleMstFilterState(
      fmstFinalFilterLevel.length > 0
        ? fmstFinalFilterLevel
        : mstFinalFilterLevel
    );
  };
  return (
    <>
      {obj.id && (
        <>
          <td colSpan={5}>
            <Select
              menuPlacement="auto"
              components={{
                // DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
              isClearable={false}
              // styles={newRowDropdown}
              name={`level${level}${index}`}
              id={`level${level}${index}`}
              placeholder={`level${level}${index}`}
              options={getSelectioOpt(obj.id)}
              onChange={(v, action) => {
                if (action.action == "clear") {
                  handleLevelChange("", level, index);
                } else {
                  handleLevelChange(v, level, index);
                }
              }}
              value={obj.selected_filter}
            />
          </td>
        </>
      )}
      <td colSpan={30}>
        {obj.level &&
          obj.level.map((v, i) => {
            return (
              <CMPProductChild
                obj={v}
                index={i}
                level={level + 1}
                extra={extra}
              />
            );
          })}
      </td>
      {obj.unit_arr &&
        obj.unit_arr.map((v, i) => {
          return (
            <>
              <CMPUnit index={i} level={level} extra={extra} />
            </>
          );
        })}
    </>
  );
};

export default class CMPProductParent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { mstFinalFilterLevel } = this.props;
    return (
      <>
        {mstFinalFilterLevel &&
          mstFinalFilterLevel.length > 0 &&
          mstFinalFilterLevel.map((v, i) => {
            return (
              <tr>
                <CMPProductChild
                  extra={this.props}
                  obj={v}
                  index={i}
                  level={0}
                />{" "}
              </tr>
            );
          })}
      </>
    );
  }
}
