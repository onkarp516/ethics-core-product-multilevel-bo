import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  Collapse,
  InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faCalculator,
  faCirclePlus,
  faCircleQuestion,
  faFloppyDisk,
  faGear,
  faHouse,
  faPen,
  faPrint,
  faQuestion,
  faRightFromBracket,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import {
  customStyles,
  ShowNotification,
  getSelectValue,
  AuthenticationCheck,
  isActionExist,
  MyNotifications,
  createPro,
  eventBus,
  ledger_select,
  allEqual,
} from "@/helpers";
import {
  createAssociateGroup,
  updateAssociateGroup,
  getUnderList,
  getAssociateGroups,
  get_associate_group,
  delete_ledger_group,
  validate_associate_groups,
  validate_associate_groups_update,
} from "@/services/api_functions";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import delete_icon from "@/assets/images/delete_icon3.png";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class AssociateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.associatesRef = React.createRef();
    this.ledgerTr_ = React.createRef();

    this.inputRefs = [];
    this.state = {
      show: false,
      hide: false,
      opendiv: false,
      showDiv: true,
      initValue: {
        associates_id: "",
        associates_group_name: "",
        underId: "",
      },
      undervalue: [],
      orgData: [],
      associategroupslst: [],
      companyData: [],
      AssoId: false,
      updateId: false,
      row_id: "",
      edit_id: "",
      listLength: 0,

      errorArrayBorder: "",
    };
    this.open = this.open.bind(this);

    this.selectRef = React.createRef();
  }

  open() {
    const { showDiv } = this.state;
    this.setState({
      showDiv: !showDiv,
    });
  }

  pageReload = () => {
    this.componentDidMount();
  };

  handleKeys = (e, index) => {
    // debugger;
    if (e.keyCode === 13 || e.keyCode === 39) {
      document.getElementById(index).focus();
      // const nextIndex = (index + 1) % this.inputRefs.length;
      // this.inputRefs[nextIndex].focus();
    }
    if (e.keyCode === 37) {
      // const prevIndex = (index - 1) % this.inputRefs.length;
      // if (prevIndex === -1) {
      //   this.inputRefs[index].focus();
      // } else {
      //   this.inputRefs[prevIndex].focus();
      // }
    }
    if (e.altKey && e.keyCode === 83) {
      const index = "submit";
      document.getElementById(index).focus();
      // const index = (38) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    }
    if (e.altKey && e.keyCode === 67) {
      const index = "cancel";
      document.getElementById(index).focus();
      // const index = (39) % this.inputRefs.length;
      // this.inputRefs[index].focus();
    }
  };

  handleKeyDown = (event) => {
    event.stopPropagation();

    const { rowVirtualizer, config, id } = this.tableManager.current;
    const { scrollToOffset, scrollToIndex } = rowVirtualizer;
    const { header } = config.additionalProps;
    const { currentScrollPosition, setcurrentscrollposition } = header;
    let scrollPosition = 0;
    switch (event.key) {
      case "ArrowUp":
        let elem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (elem != undefined && elem != null) {
          let up_row_id = elem.getAttribute("data-row-id");
          let up_id = elem.getAttribute("data-row-index");
          let uprowIndex = parseInt(up_id) - 1;

          if (uprowIndex > 0) {
            document
              .querySelectorAll(`#${id} .rgt-row-focus`)
              .forEach((cell) => cell.classList.remove("rgt-row-focus"));

            document
              .querySelectorAll(`#${id} .rgt-row-${uprowIndex}`)
              .forEach((cell) => cell.classList.add("rgt-row-focus"));
            scrollToIndex(uprowIndex - 3);
          }
        }

        break;

      case "ArrowDown":
        let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
        if (downelem != undefined && downelem != null) {
          let d_id = downelem.getAttribute("data-row-index");
          let rowIndex = parseInt(d_id) + 1;

          document
            .querySelectorAll(`#${id} .rgt-row-focus`)
            .forEach((cell) => cell.classList.remove("rgt-row-focus"));
          document // const customStyles = {
            //   control: (base) => ({
            //     ...base,
            //     height: 31,
            //     minHeight: 31,
            //     border: 'none',
            //     borderBottom: '1px solid #ccc',
            //     fontSize: '13px',
            //     //paddingBottom: "12px",
            //     boxShadow: 'none',
            //     //lineHeight: "20px",
            //   }),
            // };
            .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
            .forEach((cell) => cell.classList.add("rgt-row-focus"));
          scrollToIndex(rowIndex + 2);
        }
        break;
      case "e":
        if (id != undefined && id != null) {
          let downelem = document.querySelectorAll(`#${id} .rgt-row-focus`)[0];
          if (downelem != undefined && downelem != null) {
            let d_index_id = downelem.getAttribute("data-row-index");
            let data_id = downelem.getAttribute("data-row-id");

            let rowIndex = parseInt(d_index_id) + 1;

            this.setUpdateValue(data_id);
          }
        }
        break;

      default:
        break;
    }
  };

  handleRowClick = ({ rowIndex }) => {
    const { id } = this.tableManager.current;

    document
      .querySelectorAll(`#${id} .rgt-row-focus`)
      .forEach((cell) => cell.classList.remove("rgt-row-focus"));

    document
      .querySelectorAll(`#${id} .rgt-row-${rowIndex}`)
      .forEach((cell) => cell.classList.add("rgt-row-focus"));
  };

  handlFetchData = (id) => {
    let reqData = new FormData();
    reqData.append("id", id);
    get_associate_group(reqData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          // this.setState({ undervalue: Opt });
          this.setState({ edit_id: res.responseObject.underId });
          // this.setState({ row_id: res.responseObject.id });
        }
      })
      .catch((error) => {
        this.setState({ undervalue: [] });
      });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  lstUnders = () => {
    getUnderList()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          let data = res.responseObject;
          let Opt = data.map((v, i) => {
            let innerOpt = {};
            if (v.associates_name != "") {
              innerOpt["value"] =
                v.principle_id +
                "_" +
                v.sub_principle_id +
                "_" +
                v.associates_id;
              innerOpt["label"] = v.associates_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            } else if (v.subprinciple_name != "") {
              innerOpt["value"] = v.principle_id + "_" + v.sub_principle_id;
              innerOpt["label"] = v.subprinciple_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            } else {
              innerOpt["value"] = v.principle_id;
              innerOpt["label"] = v.principle_name;
              innerOpt["ledger_form_parameter_id"] = v.ledger_form_parameter_id;
              innerOpt["ledger_form_parameter_slug"] =
                v.ledger_form_parameter_slug;
              innerOpt["principle_id"] = v.principle_id;
              innerOpt["principle_name"] = v.principle_name;
              innerOpt["sub_principle_id"] = v.sub_principle_id;
              innerOpt["subprinciple_name"] = v.subprinciple_name;
              innerOpt["under_prefix"] = v.under_prefix;
              innerOpt["associates_id"] = v.associates_id;
              innerOpt["associates_name"] = v.associates_name;
            }
            return innerOpt;
          });
          this.setState({ undervalue: Opt });
        }
      })
      .catch((error) => {
        this.setState({ undervalue: [] });
      });
  };
  handleModal = (status) => {
    if (status == true) {
      let initValue = {
        associates_id: "",
        associates_group_name: "",
        underId: "",
      };
      this.setState({ initValue: initValue }, () => {
        this.setState({ show: status });
      });
    } else {
      this.setState({ show: status });
    }
  };
  setInitValue = () => {
    let initValue = {
      associates_id: "",
      underId: "",
      associates_group_name: "",
    };

    this.setState({
      initValue: initValue,
      opendiv: false,
      errorArrayBorder: "",
    });
  };

  componentDidMount() {
    if (AuthenticationCheck()) {
      this.setInitValue();
      this.lstUnders();
      this.lstAssociateGroups();

      // alt key button disabled start
      window.addEventListener("keydown", this.handleAltKeyDisable);
      // alt key button disabled end
    }
  }

  // alt key button disabled start
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleAltKeyDisable);
  }
  // alt key button disabled end

  // alt key button disabled start
  handleAltKeyDisable(event) {
    // Check if the "Alt" key is pressed (key code 18)
    if (event.keyCode === 18) {
      event.preventDefault(); // Prevent the default behavior of the "Alt" key
    }
  }
  // alt key button disabled end

  lstAssociateGroups = () => {
    // debugger;
    getAssociateGroups()
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          this.setState({
            associategroupslst: res.responseObject,
            orgData: res.responseObject,
          });
          this.setState({ listLength: res.responseObject.length });

          setTimeout(() => {
            console.warn("this.state->>>>>>>>>", this.state);
            // debugger;
            if (this.state.AssoId) {
              document.getElementById("ledgerGTr_" + 0).focus();
            } else if (this.state.updateId) {
              // alert("row_id", this.state.row_id);
              console.warn("rowId--,.", this.state.row_id);
              document.getElementById(`ledgerGTr_` + this.state.row_id).focus();
            } else {
              document.getElementById("underId").focus();
            }
          }, 1200);
        }
      })
      .catch((error) => { });
  };

  handleSearch = (vi) => {
    this.setState({ search: vi }, () => {
      let { orgData } = this.state;
      // console.log({ orgData });
      let orgData_F = orgData.filter(
        (v) =>
          (v.associates_name != null &&
            v.associates_name.toLowerCase().includes(vi.toLowerCase())) ||
          (v.foundation_name != null &&
            v.foundation_name.toLowerCase().includes(vi.toLowerCase())) ||
          (v.principle_name != null &&
            v.principle_name.toLowerCase().includes(vi.toLowerCase())) ||
          (v.subprinciple_name != null &&
            v.subprinciple_name.toLowerCase().includes(vi.toLowerCase()))

        // (v.associates_name != null &&
        //   v.foundation_name != null &&
        //   v.principle_name != null &&
        //   v.subprinciple_name != null &&
        //   v.associates_name.toLowerCase().includes(vi.toLowerCase())) ||
        // v.foundation_name.toLowerCase().includes(vi.toLowerCase()) ||
        // v.principle_name.toLowerCase().includes(vi.toLowerCase()) ||
        //
      );

      if (vi.length == 0) {
        this.setState({
          associategroupslst: orgData,
        });
      } else {
        this.setState({
          associategroupslst: orgData_F.length > 0 ? orgData_F : [],
        });
      }
    });
  };

  setUpdateValue = (data) => {
    let { undervalue } = this.state;
    let underOptID;
    if (data.under_prefix_separator == "P") {
      underOptID = getSelectValue(undervalue, data.principle_id);
    } else if (data.under_prefix_separator == "PG") {
      underOptID = getSelectValue(
        undervalue,
        data.principle_id + "_" + data.sub_principle_id
      );
    } else if (data.under_prefix_separator == "AG") {
      underOptID = getSelectValue(
        undervalue,
        data.principle_id + "_" + data.sub_principle_id + "_" + data.under_id
      );
    }

    let initValue = {
      associates_id: data.associates_id,
      associates_group_name: data.associates_name,
      underId: underOptID,
    };
    this.setState({ initValue: initValue, opendiv: true });
  };

  resetName = function (e) {
    this.setState({
      underId: "",
      associates_group_name: "",
    });
  };
  deleteledgergroup = (id) => {
    let formData = new FormData();
    formData.append("id", id);
    delete_ledger_group(formData)
      .then((response) => {
        let res = response.data;
        if (res.responseStatus == 200) {
          MyNotifications.fire({
            show: true,
            icon: "success",
            title: "Success",
            msg: res.message,
            is_timeout: true,
            delay: 1000,
          });
          // resetForm();
          // this.initRow();
          this.componentDidMount();
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            is_timeout: true,
            delay: 3000,
          });
        }
      })
      .catch((error) => {
        this.setState({ associategroupslst: [] });
      });
  };

  validateassociategroups = (
    associates_group_name,
    principle_id,
    sub_principle_id
  ) => {
    let requestData = new FormData();
    requestData.append("associates_group_name", associates_group_name);
    requestData.append("principle_id", principle_id);
    requestData.append("sub_principle_id", sub_principle_id);
    validate_associate_groups(requestData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          console.log("res----", res);
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            // is_button_show: true,
            delay: 1000,
            is_timeout: true,
          });
          setTimeout(() => {
            document.getElementById("associates_group_name").focus();
          }, 1200);
          // setFieldValue("associates_group_name", "");
        }
      })
      .catch((error) => { });
  };

  validateassociategroupsUpdate = (
    associates_id,
    associates_group_name,
    principle_id,
    sub_principle_id
  ) => {
    let requestData = new FormData();
    requestData.append("associates_id", associates_id);
    requestData.append("associates_group_name", associates_group_name);
    requestData.append("principle_id", principle_id);
    requestData.append("sub_principle_id", sub_principle_id);
    validate_associate_groups_update(requestData)
      .then((response) => {
        let res = response.data;

        if (res.responseStatus == 409) {
          console.log("res----", res);
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: res.message,
            // is_button_show: true,
            delay: 1000,
            is_timeout: true,
          });
          setTimeout(() => {
            document.getElementById("associates_group_name").focus();
          }, 1200);
          // setFieldValue("associates_group_name", "");
        }
      })
      .catch((error) => { });
  };

  // ! function set border to required fields
  setErrorBorder(index, value) {
    let { errorArrayBorder } = this.state;
    let errorArrayData = [];
    if (errorArrayBorder.length > 0) {
      errorArrayData = errorArrayBorder;
      if (errorArrayBorder.length >= index) {
        errorArrayData.splice(index, 1, value);
      } else {
        Array.from(Array(index), (v) => {
          errorArrayData.push(value);
        });
      }
    } else {
      {
        Array.from(Array(index + 1), (v) => {
          errorArrayData.push(value);
        });
      }
    }

    this.setState({ errorArrayBorder: errorArrayData });
  }
  handleTableRow(event) {
    const t = event.target;
    // console.warn("current ->>>>>>>>>>", t);
    let {
      ledgerModalStateChange,
      transactionType,
      invoice_data,
      ledgerData,
    } = this.props;
    const k = event.keyCode;
    if (k === 40) {
      //right

      const next = t.nextElementSibling;
      if (next) {
        next.focus();

        let val = JSON.parse(next.getAttribute("value"));

        // console.warn("da->>>>>>>>>>>>>>>>>>down", val);

        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else if (k === 38) {
      let prev = t.previousElementSibling;
      if (prev) {
        // console.warn('prev ->>>>>>>>>>', prev)
        // prev = t.previousElementSibling;
        prev.focus();
        let val = JSON.parse(prev.getAttribute("value"));
        // const da = document.getElementById(prev.getAttribute("id"));
        // console.warn('da->>>>>>>>>>>>>>>>>>up', val)
      }
    } else {
      if (k === 13) {
        let cuurentProduct = t;
        let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
        if (
          isActionExist("associate-group", "edit", this.props.userPermissions)
        ) {
          this.setUpdateValue(selectedLedger);
        } else {
          MyNotifications.fire({
            show: true,
            icon: "error",
            title: "Error",
            msg: "Permission is denied!",
            is_button_show: true,
          });
        }

        // console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>> ELSE >>>>>>>>>>>>>>>>>")
      }
    }
  }
  getDataCapitalised = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  render() {
    const columns = [
      {
        id: "associates_name", // database column name
        field: "associatesName", // response parameter name
        label: "Ledger Group",
        resizable: true,
      },
      {
        id: "under",
        field: "under",
        label: "Under",
        resizable: true,
      },
    ];

    const {
      show,
      initValue,
      undervalue,
      associategroupslst,
      opendiv,
      showDiv,
      errorArrayBorder,
      row_id,
      edit_id,
    } = this.state;

    return (
      <div className="ledger-group-style" style={{ overflow: "hidden" }}>
        {/* <Collapse in={opendiv}> */}
        <div className="main-div mb-1 m-0">
          <h4 className="form-header">Ledger Group</h4>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            innerRef={this.associatesRef}
            initialValues={initValue}
            // validationSchema={Yup.object().shape({
            //   associates_group_name: Yup.string()
            //     .trim()
            //     .required("Ledger group name is required"),
            //   underId: Yup.object().nullable().required("Select under type"),
            // })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              //! validation required start
              let errorArray = [];

              if (values.underId == null || values.underId == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }

              if (values.associates_group_name.trim() == "") {
                errorArray.push("Y");
              } else {
                errorArray.push("");
              }
              this.setState({ errorArrayBorder: errorArray }, () => {
                if (allEqual(errorArray)) {
                  let requestData = new FormData();

                  requestData.append(
                    "associates_group_name",
                    values.associates_group_name
                  );

                  if (values.underId != null) {
                    requestData.append(
                      "principle_id",
                      values.underId ? values.underId.principle_id : ""
                    );
                  }

                  if (
                    values.underId != null &&
                    values.underId.sub_principle_id != ""
                  ) {
                    requestData.append(
                      "sub_principle_id",
                      values.underId
                        ? values.underId.sub_principle_id
                          ? values.underId.sub_principle_id
                          : ""
                        : ""
                    );
                  }

                  if (
                    values.underId != null &&
                    values.underId.under_prefix != ""
                  ) {
                    requestData.append(
                      "under_prefix",
                      values.underId ? values.underId.under_prefix : ""
                    );
                  }

                  if (
                    isActionExist(
                      "associate-group",
                      "create",
                      this.props.userPermissions
                    )
                  ) {
                    if (values.associates_id == "") {
                      MyNotifications.fire({
                        show: true,
                        icon: "confirm",
                        title: "Confirm",
                        msg: "Do you want to Submit",
                        is_button_show: false,
                        is_timeout: false,
                        delay: 0,
                        handleSuccessFn: () => {
                          createAssociateGroup(requestData)
                            .then((response) => {
                              let res = response.data;
                              if (res.responseStatus == 200) {
                                //  ShowNotification("Success", res.message);
                                MyNotifications.fire({
                                  show: true,
                                  icon: "success",
                                  title: "Success",
                                  msg: res.message,
                                  is_timeout: true,
                                  delay: 1000,
                                });
                                resetForm();
                                this.pageReload();
                                this.setState({ AssoId: true });
                                this.setState({ updateId: false });
                                // console.log("AssoId", this.state.AssoId)
                                // eventBus.dispatch("page_change", {
                                //   from: "associate_grp",
                                //   to: "user_mgnt_list",
                                //   isNewTab: false,
                                //   isCancel: true,
                                //   prop_data:{
                                //     AssoId:true,
                                //  }
                                // });
                              } else if (res.responseStatus == 409) {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: res.message,
                                  is_timeout: true,
                                  delay: 1000,
                                });
                              } else {
                                ShowNotification("Error", res.message);
                              }
                            })
                            .catch((error) => { });
                        },
                        handleFailFn: () => {
                          setSubmitting(false);
                        },
                      });
                    } else {
                      requestData.append("associates_id", values.associates_id);
                      MyNotifications.fire(
                        {
                          show: true,
                          icon: "confirm",
                          title: "Confirm",
                          msg: "Do you want to Update ?",
                          is_button_show: false,
                          is_timeout: false,
                          delay: 0,
                          handleSuccessFn: () => {
                            updateAssociateGroup(requestData)
                              .then((response) => {
                                let res = response.data;
                                if (res.responseStatus == 200) {
                                  MyNotifications.fire({
                                    show: true,
                                    icon: "success",
                                    title: "Success",
                                    msg: res.message,
                                    is_timeout: true,
                                    delay: 1000,
                                  });
                                  this.setState({ updateId: true });
                                  this.setState({ AssoId: false });
                                  // console.log("update Called");
                                  this.handlFetchData(values.associates_id);

                                  resetForm();
                                  this.pageReload();
                                } else {
                                  ShowNotification("Error", res.message);
                                }
                              })
                              .catch((error) => { });
                          },
                          handleFailFn: () => {
                            setSubmitting(false);
                            // this.setState({ opendiv: false });
                          },
                        },
                        () => {
                          // console.warn("return_data");
                        }
                      );
                    }
                  } else {
                    MyNotifications.fire({
                      show: true,
                      icon: "error",
                      title: "Error",
                      msg: "Permission is denied!",
                      is_button_show: true,
                    });
                  }
                }
              });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
              resetForm,
              setFieldValue,
            }) => (
              <Form
                onSubmit={handleSubmit}
                className="form-style"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    e.preventDefault();
                  }
                }}
              >
                <Row style={{ background: "#CEE7F1" }} className="p-2">
                  <Col lg={3} md={3} sm={3} xs={3}>
                    <Row>
                      <Col lg={3} md={3} sm={3} xs={3}>
                        <Form.Label>
                          Under
                          <span className="pt-1 pl-1 req_validation text-danger">
                            *
                          </span>{" "}
                        </Form.Label>
                      </Col>
                      <Col lg={9} md={9} sm={9} xs={9}>
                        <Form.Group
                          className={`${values.underId == "" && errorArrayBorder[0] == "Y"
                            ? "border border-danger "
                            : ""
                            }`}
                          style={{ borderRadius: "4px" }}
                          id="under"
                          // onBlur={(e) => {
                          //   e.preventDefault();
                          //   if (values.underId && values.underId != null) {
                          //     this.setErrorBorder(0, "");
                          //   } else {
                          //     this.setErrorBorder(0, "Y");
                          //     // this.selectRef.current?.focus();
                          //   }
                          // }}
                          onKeyDown={(e) => {
                            // e.preventDefault();
                            if (e.keyCode == 9 || e.keyCode == 13) {
                              if (values.underId == "") {
                                this.setErrorBorder(0, "Y");
                                setTimeout(() => {
                                  this.selectRef.current?.focus();
                                }, 250);
                              } else if (values.underId != "") {
                                setTimeout(() => {
                                  document
                                    .getElementById("associates_group_name")
                                    .focus();
                                }, 250);

                                // e.preventDefault();
                              }
                            }
                          }}
                        // ref={(input) => (this.inputRefs[0] = input)}
                        >
                          <Select
                            ref={this.selectRef}
                            // ref={(input) => (this.inputRefs[0] = input)}
                            autoFocus={true}
                            isClearable={true}
                            styles={ledger_select}
                            // styles={createPro}
                            className="selectTo"
                            onChange={(v) => {
                              setFieldValue("underId", v);
                            }}
                            name="underId"
                            id="underId"
                            options={undervalue}
                            value={values.underId}
                            invalid={errors.underId ? true : false}
                          // onKeyDown={(e) => {
                          //   this.handleKeys(e, "associates_group_name");
                          // }}
                          />
                          <span className="text-danger errormsg">
                            {errors.underId}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={4} md={4} sm={4} xs={4}>
                    <Row>
                      <Col lg={3} md={3} sm={3} xs={3} className="p-0">
                        <Form.Label>
                          Ledger Group<span className=" text-danger">*</span>
                        </Form.Label>
                      </Col>
                      <Col lg={9} md={9} sm={9} xs={9}>
                        <Form.Group>
                          <Form.Control
                            // onKeyDown={(e) => {
                            //   if (e.key === "Tab" && !e.target.value)
                            //     e.preventDefault();
                            // }}
                            autoComplete="off"
                            type="text"
                            placeholder="Ledger Group"
                            name="associates_group_name"
                            id="associates_group_name"
                            onChange={handleChange}
                            onInput={(e) => {
                              e.target.value = this.getDataCapitalised(
                                e.target.value
                              );
                            }}
                            value={values.associates_group_name}
                            isValid={
                              touched.associates_group_name &&
                              !errors.associates_group_name
                            }
                            isInvalid={!!errors.associates_group_name}
                            className={`${values.associates_group_name == "" &&
                              errorArrayBorder[1] == "Y"
                              ? "border border-danger text-box"
                              : "text-box"
                              }`}
                            onBlur={(e) => {
                              e.preventDefault();
                              if (e.target.value.trim()) {
                                this.setErrorBorder(1, "");
                              } else {
                                this.setErrorBorder(1, "Y");
                                document
                                  .getElementById("associates_group_name")
                                  .focus();
                              }
                            }}
                            // onKeyDown={(e) => {
                            //   if (e.shiftKey && e.key === "Tab") {
                            //   } else if (e.key === "Tab" && !e.target.value)
                            //     e.preventDefault();
                            // }}
                            // ref={(input) => (this.inputRefs[1] = input)}
                            onKeyDown={(e) => {
                              if (e.key === "Tab" || e.keyCode === 13) {
                                // if (e.target.value != null &&e.target.value != "") {
                                if (values.associates_id === "") {
                                  this.validateassociategroups(
                                    values.associates_group_name,
                                    values.underId.principle_id,
                                    values.underId.sub_principle_id,
                                    setFieldValue
                                  );
                                } else if (values.associates_id !== "") {
                                  this.validateassociategroupsUpdate(
                                    values.associates_id,
                                    values.associates_group_name,
                                    values.underId.principle_id,
                                    values.underId.sub_principle_id,
                                    setFieldValue
                                  );
                                }
                                if (e.target.value === "") {
                                  e.preventDefault();
                                } else {
                                  this.handleKeys(e, "submit");
                                }
                              }
                            }}
                          />
                          <span className="text-danger errormsg">
                            {errors.associates_group_name}
                          </span>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={5} md={5} sm={5} xs={5} className="text-end">
                    <Button
                      className="submit-btn"
                      type="submit"
                      id="submit"
                      // ref={(input) => (this.inputRefs[2] = input)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode === 13) {
                          this.associatesRef.current.handleSubmit();
                        }
                        //  else {
                        //   this.handleKeys(e, "cancel");
                        // }
                      }}
                    >
                      {values.associates_id == "" ? "Submit" : "Update"}
                    </Button>
                    <Button
                      variant="secondary cancel-btn ms-2"
                      type="button"
                      id="cancel"
                      className="ms-2"
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   // this.setState({ opendiv: !opendiv }, () => {
                      //   //   this.pageReload();
                      //   // });

                      //   this.pageReload();
                      //   resetForm();
                      //   // this.resetName();
                      // }}
                      onClick={(e) => {
                        e.preventDefault();
                        MyNotifications.fire(
                          {
                            show: true,
                            icon: "confirm",
                            title: "Confirm",
                            msg: "Do you want to Clear",
                            is_button_show: false,
                            is_timeout: false,
                            delay: 0,
                            handleSuccessFn: () => {
                              this.pageReload();
                              resetForm();
                            },
                            handleFailFn: () => {
                              eventBus.dispatch(
                                "page_change",
                                "associategroup"
                              );
                            },
                          },
                          () => {
                            // console.warn("return_data");
                          }
                        );
                      }}
                      // ref={(input) => (this.inputRefs[3] = input)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 32) {
                          e.preventDefault();
                        } else if (e.keyCode == 13) {
                          MyNotifications.fire(
                            {
                              show: true,
                              icon: "confirm",
                              title: "Confirm",
                              msg: "Do you want to Clear",
                              is_button_show: false,
                              is_timeout: false,
                              delay: 0,
                              handleSuccessFn: () => {
                                this.pageReload();
                                resetForm();
                              },
                              handleFailFn: () => {
                                eventBus.dispatch(
                                  "page_change",
                                  "associategroup"
                                );
                              },
                            },
                            () => {
                              // console.warn("return_data");
                            }
                          );
                        } else {
                          this.handleKeys(e, "under");
                        }
                      }}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>

                {/* <Row>
                    <Col md="3">
                      <Form.Group>
                        <Form.Label>
                          Under{" "}
                          <span className="pt-1 pl-1 req_validation">*</span>{" "}
                        </Form.Label>
                        <Select
                          isClearable={true}
                          styles={customStyles}
                          className="selectTo"
                          onChange={(v) => {
                            setFieldValue("underId", v);
                          }}
                          name="underId"
                          id="underId"
                          options={undervalue}
                          value={values.underId}
                          invalid={errors.underId ? true : false}
                        />
                        <span className="text-danger errormsg">
                          {errors.underId}
                        </span>
                      </Form.Group>
                    </Col>
                    <Col md="4">
                      <Form.Group>
                        <Form.Label>
                          Ledger Group{" "}
                          <span className="pt-1 pl-1 req_validation">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ledger Group"
                          name="associates_group_name"
                          id="associates_group_name"
                          onChange={handleChange}
                          onInput={(e) => {
                            e.target.value =
                              e.target.value.charAt(0).toUpperCase() +
                              e.target.value.slice(1);
                          }}
                          value={values.associates_group_name}
                          isValid={
                            touched.associates_group_name &&
                            !errors.associates_group_name
                          }
                          isInvalid={!!errors.associates_group_name}
                        />
                        <span className="text-danger errormsg">
                          {errors.associates_group_name}
                        </span>
                      </Form.Group>
                    </Col>

                    <Col md="5" className="btn_align pt-4 mt-1">
                      <Button className="submit-btn" type="submit">
                        {values.associates_id == "" ? "Submit" : "Update"}
                      </Button>
                      <Button
                        variant="secondary cancel-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ opendiv: !opendiv }, () => {
                            this.pageReload();
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row> */}
              </Form>
            )}
          </Formik>
        </div>
        {/* </Collapse> */}

        <div className="cust_table">
          <Row className=""
            onKeyDown={(e) => {
              if (e.keyCode === 40) {
                document.getElementById("ledgerGTr_0")?.focus();
              }
            }}>
            <Col md="3">
              {/* <Form>
                <Form.Group className="mt-1" controlId="formBasicSearch">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className="search-box"
                  />
                </Form.Group>
              </Form> */}

              <InputGroup className="mb-2  mdl-text">
                <Form.Control
                  type="text"
                  name="Search"
                  id="Search"
                  // autoFocus="true"
                  onChange={(e) => {
                    let v = e.target.value;
                    // console.log({ v });
                    this.handleSearch(v);
                    if (v == "") {
                      document.getElementById("Search").focus();
                    }
                  }}
                  placeholder="Search"
                  className="mdl-text-box"
                  autoComplete="off"
                //
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md="9" className="mt-2 text-end">
              {/* <Button
                className="ml-2 btn-refresh"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  this.pageReload();
                }}
              >
                <img src={refresh} alt="icon" />
              </Button> */}

              {/* {!opendiv && (
                <Button
                  className="create-btn ms-2"
                  onClick={(e) => {
                    e.preventDefault();
                    if (isActionExist("associate-group", "create")) {
                      this.setState({ opendiv: !opendiv });
                    } else {
                      MyNotifications.fire({
                        show: true,
                        icon: "error",
                        title: "Error",
                        msg: "Permission is denied!",
                        is_button_show: true,
                      });
                    }
                  }}
                  aria-controls="example-collapse-text"
                  aria-expanded={opendiv}
                // onClick={this.open}
                >
                  Create
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-plus-square-dotted svg-style"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                  </svg>
                </Button>
              )} */}
            </Col>
          </Row>

          <div className="tbl-list-style">
            {/* {isActionExist("associate-group", "list") && ( */}
            <Table
              // hover
              size="sm"
              className="tbl-font"
            //  responsive
            >
              <thead>
                <tr>
                  {/* {this.state.showDiv && <th style={{ width: "20%" }}>Sr#</th>} */}
                  <th style={{ width: "25%" }}>Ledger Group</th>
                  <th style={{ width: "25%" }}>Foundation</th>
                  <th style={{ width: "25%" }}>Principle</th>
                  <th style={{ width: "25%" }}>Sub Principle</th>
                  {/* <th style={{ width: "25%" }}>Action</th> */}
                </tr>
              </thead>
              <tbody
                className="prouctTableTr"
                style={{ borderTop: "2px solid transparent" }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.shiftKey && e.keyCode == 9) {
                    document.getElementById("Search").focus();
                  } else if (e.keyCode != 9) {
                    this.handleTableRow(e);
                  }
                }}
              >
                {" "}
                {associategroupslst.length > 0 ? (
                  associategroupslst.map((v, i) => {
                    return (
                      <tr
                        value={JSON.stringify(v)}
                        id={`ledgerGTr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          if (
                            isActionExist(
                              "associate-group",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.setUpdateValue(v);
                            this.setState({ row_id: i });
                          } else {
                            MyNotifications.fire({
                              show: true,
                              icon: "error",
                              title: "Error",
                              msg: "Permission is denied!",
                              is_button_show: true,
                            });
                          }
                        }}
                      >
                        {/* <td style={{ width: "20%" }}>{i + 1}</td> */}
                        <td style={{ width: "20%" }}>{v.associates_name}</td>
                        <td style={{ width: "20%" }}>{v.foundation_name}</td>
                        <td style={{ width: "20%" }}>{v.principle_name}</td>
                        <td style={{ width: "20%" }}>{v.subprinciple_name}</td>
                        {/* <td>
                          {" "}
                          <img
                            src={delete_icon}
                            className="del_icon"
                            title="Delete"
                            onClick={(e) => {
                              if (
                                isActionExist(
                                  "associate-group",
                                  "delete",
                                  this.props.userPermissions
                                )
                              ) {
                                MyNotifications.fire(
                                  {
                                    show: true,
                                    icon: "confirm",
                                    title: "Confirm",
                                    msg: "Do you want to Delete",
                                    is_button_show: false,
                                    is_timeout: false,
                                    delay: 0,
                                    handleSuccessFn: () => {
                                      this.deleteledgergroup(v.associates_id);
                                    },
                                    handleFailFn: () => { },
                                  },
                                  () => {
                                    console.warn("return_data");
                                  }
                                );
                              } else {
                                MyNotifications.fire({
                                  show: true,
                                  icon: "error",
                                  title: "Error",
                                  msg: "Permission is denied!",
                                  is_button_show: true,
                                });
                              }
                            }}
                          />
                        </td> */}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
              {/* <thead className="tbl-footer mb-2">
                <tr>
                  <th
                    colSpan={7}
                    className=""
                    style={{ borderTop: " 2px solid transparent" }}
                  >
                    {Array.from(Array(1), (v) => {
                      return (
                        <tr>
                          {/* <th>&nbsp;</th>
                          <th>Total Ledger List :</th>
                          <th>{associategroupslst.length}</th>
                        </tr>
                      );
                    })}
                  </th>
                </tr>
              </thead> */}
            </Table>
            <Row className="style-footr">
              <Col md="10" className="my-auto">
                {/* <Row>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faHouse}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+A</span>
                        </Form.Label>
                      </Col>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faCirclePlus}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">F2</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faPen}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+E</span>
                        </Form.Label>
                      </Col>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faFloppyDisk}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+S</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+D</span>
                        </Form.Label>
                      </Col>

                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faCalculator}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Alt+C</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faGear}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">F11</span>
                        </Form.Label>
                      </Col>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faRightFromBracket}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+Z</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faPrint}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Ctrl+P</span>
                        </Form.Label>
                      </Col>
                      <Col md="6" className="">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faArrowUpFromBracket}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">Export</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                  <Col md="2" className="">
                    <Row>
                      <Col md="6">
                        <Form.Label className="btm-label d-flex">
                          <FontAwesomeIcon
                            icon={faCircleQuestion}
                            className="svg-style icostyle mt-0 mx-2"
                          />
                          <span className="shortkey">F1</span>
                        </Form.Label>
                      </Col>
                    </Row>
                  </Col>
                </Row> */}
              </Col>
              <Col md="2" className="text-end">
                <Row>
                  <Col className="my-auto">
                    {Array.from(Array(1), (v) => {
                      return (
                        <>
                          <span>Ledger:</span>
                          <span>{associategroupslst.length}</span>
                        </>
                      );
                    })}
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* )} */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userPermissions }) => {
  return { userPermissions };
};

const mapActionsToProps = (dispatch) => {
  return bindActionCreators(
    {
      setUserPermissions,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapActionsToProps)(AssociateGroup);
