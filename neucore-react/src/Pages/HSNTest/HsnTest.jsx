import React from "react";
import {
    Button,
    Col,
    Row,
    Form,
    Table,
    Modal,
    CloseButton,
    Collapse,
    InputGroup,
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import {
    createHSN,
    getAllHSN,
    updateHSN,
    getHsnListTest,
    get_hsn,
    validate_HSN,
    delete_product_hsn,
} from "@/services/api_functions";
import { getHsnListTestURL } from "@/services/api";
import {
    getHeader,
    ShowNotification,
    AuthenticationCheck,
    customStyles,
    getValue,
    eventBus,
    isActionExist,
    MyNotifications,
    createPro,
    Accepts_numeric_regex,
    HSNno,
    LoadingComponent,
    OnlyEnterNumbers,
    ledger_select,
    allEqual,
} from "@/helpers";
import axios from "axios";
import Select from "react-select";
import refresh from "@/assets/images/refresh.png";
import search from "@/assets/images/search_icon@3x.png";
import mousetrap, { reset } from "mousetrap";
import { setUserPermissions } from "@/redux/userPermissions/Action";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "mousetrap-global-bind";
import delete_icon from "@/assets/images/delete_icon3.png";

import { only_alphabets } from "../../helpers/constants";
const typeoption = [
    { label: "Services", value: "Services" },
    { label: "Goods", value: "Goods" },
];


class HSN extends React.Component {
    constructor(props) {
        super(props);
        this.hsnRef = React.createRef();
        this.invoiceDateRef = React.createRef();
        this.ref = React.createRef();

        this.state = {
            divHeight: 0,
            tableHeight: 0,

            show: false,
            opendiv: false,
            showDiv: false,
            totalRows: 0,
            pages: 0,
            currentPage: 1,
            pageLimit: 20,
            data: [],
            divPosition: 0,
            gethsntable: [],
            orgData: [],
            initVal: {
                id: "",
                hsnNumber: "",
                igst: "",
                cgst: "",
                sgst: "",
                description: "",
                type: "",
            },
            showloader: true,
            errorArrayBorder: "",
        };

        // this.divRef = React.createRef();
        // this.tableRef = React.createRef();
    }

    // handleDivScroll = () => {
    //     // Get the height of the scrolling div
    //     const divHeight = this.divRef.current.offsetHeight;
    //     this.setState({ divHeight });
    // };

    // handleTableScroll = () => {
    //     // Get the height of the scrolling table
    //     const tableHeight = this.tableRef.current.offsetHeight;
    //     this.setState({ tableHeight });
    // };

    handleClose = () => {
        this.setState({ show: false });
    };
    handleModalStatus = (status) => {
        if (status == true) {
            this.setInitValue();
        }
        this.setState({ show: status }, () => {
            this.pageReload();
        });
    };

    pageReload = () => {
        this.setInitValue();
        this.componentDidMount();
        // this.hsnRef.current.resetForm();
    };

    validateHSN = (hsnNumber, setFieldValue) => {
        let requestData = new FormData();
        requestData.append("hsnNumber", hsnNumber);
        if (hsnNumber.length > 8) {
            MyNotifications.fire({
                show: true,
                icon: "warning",
                title: "Warning",
                msg: "Invalid HSN ,Please Enter 8 digit HSN No",
                is_button_show: true,
            });
            console.log("Invaid HSN No Please input 8 digit HSN");
        } else {
            validate_HSN(requestData)
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
                            delay: 1500,
                            is_timeout: true,
                        });
                        setTimeout(() => {
                            this.invoiceDateRef.current.focus();
                        }, 1000);
                        // setFieldValue("hsnNumber", "");
                    }
                })
                .catch((error) => { });
        }
    };

    letHsnlst = () => {
        this.setState({ showloader: true });
        getAllHSN()
            .then((response) => {
                console.log("testtt", response.data)
                let res = response.data;
                if (res.responseStatus == 200) {
                    this.setState(
                        {
                            gethsntable: res.responseObject,
                            orgData: res.responseObject,
                            showloader: false,
                        },
                        () => {
                            this.hsnRef.current.setFieldValue("search", "");
                        }
                    );
                }
            })
            .catch((error) => {
                this.setState({ gethsntable: [] });
            });
    };

    goToNextPage = () => {
        // not yet implemented
        let page = parseInt(this.state.currentPage);
        this.setState({ currentPage: page + 1 }, () => {
            this.onRowsRequest();
        });
    }

    goToPreviousPage = () => {
        // not yet implemented
        let page = parseInt(this.state.currentPage);
        this.setState({ currentPage: page - 1 }, () => {
            this.onRowsRequest();
        });
    }


    onRowsRequest = () => {
        let { currentPage, pageLimit } = this.state;

        let req = {
            "pageNo": currentPage,
            "pageSize": pageLimit,
            "searchText": "",
            "sort": "{\"colId\":null,\"isAsc\":true}",
        };

        getHsnListTest(req).then((response) => {
            console.log({ response });

            let res = response.data;
            if (res.responseStatus === 200) {
                this.setState({
                    gethsntable: res.responseObject.data != null ? res.responseObject.data : [],
                    totalRows:
                        res.responseObject != null
                            ? res.responseObject.total
                            : 0,
                    pages:
                        res.responseObject != null
                            ? res.responseObject.total_pages
                            : 0,
                })
            }

        }).catch((err) => { console.log({ err }); });

    };

    movetoNext = (current, nextFieldID) => {
        if (current.value.length >= current.maxLength) {
            document.getElementById(nextFieldID).focus();
        }
    };
    deleteproducthsn = (id) => {
        let formData = new FormData();
        formData.append("id", id);
        delete_product_hsn(formData)
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
                this.setState({ lstLedger: [] });
            });
    };

    componentDidMount() {
        // window.addEventListener("scroll", this.myFunction());

        if (AuthenticationCheck()) {
            this.setInitValue();
            // this.letHsnlst();
            this.setInitValue();

            this.onRowsRequest()
        }
    }

    componentWillUnmount() {
        // mousetrap.unbindGlobal("esc", this.backtomainpage);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.isRefresh == true) {
            this.pageReload();
            prevProps.handleRefresh(false);
        }
    }

    backtomainpage = () => {
        let { edit_data } = this.state;
        console.log("ESC:2", edit_data);
        eventBus.dispatch("page_change", {
            from: "hsn",
            to: "dashboard",
            // prop_data: {
            //   hsnNumber: edit_data.hsnNumber,
            //   id: edit_data.id,
            // },
            isNewTab: false,
        });
    };

    setInitValue = () => {
        let initVal = {
            id: "",
            hsnNumber: "",
            igst: "",
            cgst: "",
            sgst: "",
            description: "",
            type: getValue(typeoption, "Goods"),
        };
        this.setState({ initVal: initVal, errorArrayBorder: "" }, () => {
            setTimeout(() => {
                document.getElementById("hsnNumber").focus();
            }, 1000);
        });
    };

    handleGstChange = (value, element, setFieldValue) => {
        let flag = false;
        if (element == "igst") {
            if (value != "") {
                let igst = parseFloat(value);
                let hgst = parseFloat(igst / 2);
                setFieldValue("igst", igst);
                setFieldValue("cgst", hgst);
                setFieldValue("sgst", hgst);
            } else {
                flag = true;
            }
        } else {
            if (value != "") {
                let hgst = parseFloat(value);
                let igst = hgst + hgst;
                setFieldValue("igst", igst);
                setFieldValue("cgst", hgst);
                setFieldValue("sgst", hgst);
            } else {
                flag = true;
            }
        }

        if (flag == true) {
            setFieldValue("igst", "");
            setFieldValue("cgst", "");
            setFieldValue("sgst", "");
        }
    };

    handleClose = () => {
        this.setState({ show: false }, () => {
            this.pageReload();
        });
    };

    handleSearch = (vi) => {
        let { orgData } = this.state;
        console.log({ orgData });
        let orgData_F = orgData.filter(
            (v) =>
                (v.hsnno.toString().includes(vi)) ||
                (v.hsndesc != null && v.hsndesc.toLowerCase().includes(vi.toLowerCase())) ||
                (v.type != null && v.type.toLowerCase().includes(vi.toLowerCase()))
        );
        if (vi.length == 0) {
            this.setState({
                gethsntable: orgData,
            });
        } else {
            this.setState({
                gethsntable: orgData_F.length > 0 ? orgData_F : [],
            });
        }
    };
    handleFetchData = (id) => {
        let reqData = new FormData();
        reqData.append("id", id);
        get_hsn(reqData)
            .then((response) => {
                let result = response.data;
                if (result.responseStatus == 200) {
                    let res = result.responseObject;

                    let initVal = {
                        id: res.id,
                        hsnNumber: res.hsnno,
                        description: res.hsndesc,
                        type: res.type ? getValue(typeoption, res.type) : "",
                        igst: "",
                        cgst: "",
                        sgst: "",
                    };
                    this.setState({ initVal: initVal, opendiv: true });
                } else {
                    ShowNotification("Error", result.message);
                }
            })
            .catch((error) => { });
    };

    // validation start
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
    // validation end
    handleTableRow(event) {
        const t = event.target;
        // console.warn("current ->>>>>>>>>>", t);
        let { ledgerModalStateChange, transactionType, invoice_data, ledgerData } =
            this.props;
        const k = event.keyCode;
        if (k === 40) {
            //right

            const next = t.nextElementSibling;
            if (next) {
                next.focus();

                let val = JSON.parse(next.getAttribute("value"));

            }
        } else if (k === 38) {
            let prev = t.previousElementSibling;
            if (prev) {

                prev.focus();
                let val = JSON.parse(prev.getAttribute("value"));

            }
        } else {
            if (k === 13) {
                let cuurentProduct = t;
                let selectedLedger = JSON.parse(cuurentProduct.getAttribute("value"));
                if (isActionExist("hsn", "edit", this.props.userPermissions)) {
                    this.handleFetchData(selectedLedger.id);
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
        }
    }
    getDataCapitalised = (str) => {
        return str
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };
    // myFunction() {

    //     if (
    //         window.innerHeight + document.documentElement.scrollTop !==
    //         document.documentElement.offsetHeight
    //     ) {
    //         alert("scrolled up/down");
    //     }
    // }
    render() {
        const {
            show,
            data,
            initVal,
            opendiv,
            gethsntable,
            showDiv,
            showloader,
            errorArrayBorder,
            currentPage,
            pages
        } = this.state;
        return (
            <div className="ledger-group-style" >
                <div className="main-div mb-2 m-0">
                    <h4 className="form-header">Create HSN</h4>
                    <Formik
                        validateOnChange={false}
                        validateOnBlur={false}
                        enableReinitialize={true}
                        initialValues={initVal}
                        innerRef={this.ref}
                        validationSchema={Yup.object().shape({

                        })}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            // validation start

                            let errorArray = [];
                            if (values.hsnNumber == "") {
                                errorArray.push("Y");
                            } else {
                                errorArray.push("");
                            }
                            // validation end

                            this.setState({ errorArrayBorder: errorArray }, () => {
                                if (allEqual(errorArray)) {
                                    let keys = Object.keys(values);
                                    let requestData = new FormData();

                                    keys.map((v) => {
                                        if (v != "type") {
                                            requestData.append(v, values[v] ? values[v] : "");
                                        } else if (v == "type") {
                                            requestData.append("type", values.type.value);
                                        }
                                    });
                                    if (
                                        isActionExist("hsn", "create", this.props.userPermissions)
                                    ) {
                                        if (values.id == "") {
                                            MyNotifications.fire(
                                                {
                                                    show: true,
                                                    icon: "confirm",
                                                    title: "Confirm",
                                                    msg: "Do you want to Submit",
                                                    is_button_show: false,
                                                    is_timeout: false,
                                                    delay: 0,
                                                    handleSuccessFn: () => {
                                                        createHSN(requestData)
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
                                                                    this.pageReload();
                                                                    resetForm();
                                                                } else {
                                                                    MyNotifications.fire({
                                                                        show: true,
                                                                        icon: "error",
                                                                        title: "Error",
                                                                        msg: res.message,
                                                                        is_button_show: true,
                                                                    });
                                                                }
                                                            })
                                                            .catch((error) => {
                                                                MyNotifications.fire({
                                                                    show: true,
                                                                    icon: "error",
                                                                    title: "Error",

                                                                    is_button_show: true,
                                                                });
                                                            });
                                                    },
                                                    handleFailFn: () => { },
                                                },
                                                () => {
                                                    console.warn("return_data");
                                                }
                                            );
                                        } else {
                                            requestData.append("id", values.id);
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
                                                        updateHSN(requestData)
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
                                                                    // this.handleModal(false);
                                                                    this.pageReload();
                                                                    resetForm();
                                                                    // this.props.handleRefresh(true);
                                                                } else {
                                                                    MyNotifications.fire({
                                                                        show: true,
                                                                        icon: "error",
                                                                        title: "Error",
                                                                        msg: res.message,
                                                                        is_button_show: true,
                                                                    });
                                                                }
                                                            })

                                                            .catch((error) => {
                                                                MyNotifications.fire({
                                                                    show: true,
                                                                    icon: "error",
                                                                    title: "Error",

                                                                    is_button_show: true,
                                                                });
                                                            });
                                                    },
                                                    handleFailFn: () => { },
                                                },
                                                () => {
                                                    console.warn("return_data");
                                                }
                                            );
                                        }
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
                                noValidate
                                autoComplete="off"
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <Row
                                    style={{ background: "#CEE7F1" }}
                                    className="row_padding pb-2"
                                >
                                    <Col lg={2} md={2} sm={2} xs={2}>
                                        <Row>
                                            <Col lg={4} md={4} sm={4} xs={4}>
                                                <Form.Label>
                                                    HSN<span className="text-danger">*</span>
                                                </Form.Label>
                                            </Col>
                                            <Col lg={8} md={8} sm={8} xs={8}>
                                                <Form.Group>
                                                    <Form.Control
                                                        innerRef={(input) => {
                                                            this.invoiceDateRef.current = input;
                                                        }}
                                                        ref={this.invoiceDateRef}
                                                        autoComplete="nope"
                                                        autoFocus={true}
                                                        type="text"
                                                        placeholder="HSN No"
                                                        name="hsnNumber"
                                                        // className="text-box"
                                                        className={`${values.hsnNumber == "" &&
                                                            errorArrayBorder[0] == "Y"
                                                            ? "border border-danger text-box"
                                                            : "text-box"
                                                            }`}
                                                        id="hsnNumber"
                                                        onKeyPress={(e) => {
                                                            OnlyEnterNumbers(e);
                                                        }}
                                                        onBlur={(e) => {
                                                            e.preventDefault();
                                                            if (
                                                                e.target.value != null &&
                                                                e.target.value != ""
                                                            ) {
                                                                this.validateHSN(
                                                                    values.hsnNumber,
                                                                    setFieldValue
                                                                );
                                                            } else {
                                                            }
                                                            if (values.hsnNumber) {
                                                                this.setErrorBorder(0, "");
                                                            } else {
                                                                this.setErrorBorder(0, "Y");
                                                                // document
                                                                // .getElementById("hsnNumber")
                                                                // .focus();
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            // if (e.shiftKey && e.key === "Tab") {
                                                            // } else
                                                            if (e.key === "Tab" && !e.target.value)
                                                                e.preventDefault();
                                                        }}
                                                        maxLength={8}
                                                        onChange={handleChange}
                                                        onkeyup={(e) => {
                                                            e.preventDefault();
                                                            this.movetoNext("hsnNumber", "description");
                                                        }}
                                                        // onKeyDown={(e) => {
                                                        //   if (e.key === 'Tab' && !e.target.value && e.target.required) {
                                                        //     e.preventDefault();
                                                        //   }
                                                        // }}
                                                        // onKeyDown={(e) => {
                                                        //   if (e.key === "Tab" && !e.target.value)
                                                        //     e.preventDefault();
                                                        // }}
                                                        //onkeyup="movetoNext(this, 'description')"
                                                        value={values.hsnNumber}
                                                        isValid={touched.hsnNumber && !errors.hsnNumber}
                                                        isInvalid={!!errors.hsnNumber}
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid"> */}
                                                    {/* <span className="text-danger errormsg">
                            {errors.hsnNumber}
                          </span> */}
                                                    {/* </Form.Control.Feedback> */}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col lg={3} md={3} sm={3} xs={3}>
                                        <Row>
                                            <Col lg={4} md={4} sm={4} xs={4} className="p-0">
                                                <Form.Label>HSN Description</Form.Label>
                                            </Col>
                                            <Col lg={8} md={8} sm={8} xs={8}>
                                                <Form.Group>
                                                    <Form.Control
                                                        autoComplete="nope"
                                                        type="text"
                                                        placeholder="HSN Description"
                                                        name="description"
                                                        className="text-box"
                                                        id="description"
                                                        onChange={handleChange}
                                                        value={values.description}
                                                        isValid={touched.description && !errors.description}
                                                        isInvalid={!!errors.description}
                                                        onInput={(e) => {
                                                            e.target.value = this.getDataCapitalised(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                    {/* <Form.Control.Feedback type="invalid"> */}
                                                    <span className="text-danger errormsg">
                                                        {errors.description}
                                                    </span>
                                                    {/* </Form.Control.Feedback> */}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col lg={2} md={2} sm={2} xs={2}>
                                        <Row>
                                            <Col lg={3} md={3} sm={3} xs={3}>
                                                <Form.Label>Type</Form.Label>
                                            </Col>
                                            <Col lg={9} md={9} sm={9} xs={9}>
                                                <Form.Group className="">
                                                    <Select
                                                        className="selectTo"
                                                        id="type"
                                                        placeholder="Select Type"
                                                        styles={ledger_select}
                                                        // styles={createPro}
                                                        isClearable
                                                        options={typeoption}
                                                        name="type"
                                                        onChange={(value) => {
                                                            setFieldValue("type", value);
                                                        }}
                                                        value={values.type}
                                                    />
                                                    <span className="text-danger errormsg">
                                                        {errors.type}
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col lg={5} md={5} sm={5} xs={5} className="text-end">
                                        <Button
                                            className="submit-btn"
                                            type="submit"
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 32) {
                                                    e.preventDefault();
                                                } else if (e.keyCode === 13) {
                                                    this.ref.current.handleSubmit();
                                                }
                                            }}
                                        >
                                            {values.id == "" ? "Submit" : "Update"}
                                        </Button>
                                        <Button
                                            variant="secondary cancel-btn ms-2"
                                            // onClick={(e) => {
                                            //   e.preventDefault();
                                            //   this.setState({ opendiv: !opendiv }, () => {
                                            //     this.pageReload();
                                            //   });
                                            // }}
                                            // onClick={(e) => {
                                            //   e.preventDefault();
                                            //   this.pageReload();
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
                                                            // eventBus.dispatch(
                                                            //   "page_change",
                                                            //   "tranx_sales_invoice_list"
                                                            // );
                                                        },
                                                    },
                                                    () => {
                                                        console.warn("return_data");
                                                    }
                                                );
                                            }}
                                            type="button"
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 32) {
                                                    e.preventDefault();
                                                } else if (e.keyCode === 13) {
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
                                                                // eventBus.dispatch(
                                                                //   "page_change",
                                                                //   "tranx_sales_invoice_list"
                                                                // );
                                                            },
                                                        },
                                                        () => {
                                                            console.warn("return_data");
                                                        }
                                                    );
                                                }
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </div>
                {/* </Collapse> */}

                <div className="cust_table">
                    <Formik
                        validateOnChange={false}
                        validateOnBlur={false}
                        innerRef={this.hsnRef}
                        initialValues={{ search: "" }}
                        enableReinitialize={true}
                        validationSchema={Yup.object().shape({

                        })}
                        onSubmit={(values, { setSubmitting, resetForm }) => { }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                            resetForm,
                        }) => (
                            // {!opendiv && (
                            <Form>
                                <Row className="">
                                    <Col md="3">
                                        <InputGroup className="mb-2 mdl-text">
                                            <Form.Control
                                                placeholder="Search"
                                                className="mdl-text-box"
                                                autoComplete="off"
                                                // autoFocus={true}
                                                onChange={(e) => {
                                                    this.handleSearch(e.target.value);
                                                }}
                                            />
                                            <InputGroup.Text className="int-grp" id="basic-addon1">
                                                <img className="srch_box" src={search} alt="" />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Col> &nbsp; &nbsp; &nbsp; &nbsp;
                                    <Col md="6">
                                        <Button
                                            type="button"
                                            onClick={this.goToPreviousPage.bind(this)}
                                            disabled={this.state.currentPage <= 1}
                                        >
                                            <span>| &nbsp;&nbsp; </span> Prev
                                        </Button>
                                        &nbsp;&nbsp; <span>{this.state.currentPage}</span>&nbsp;&nbsp;
                                        <Button
                                            type="button"
                                            onClick={this.goToNextPage.bind(this)}
                                        >
                                            Next <span> &nbsp;&nbsp;| </span>
                                        </Button></Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                    {/* {JSON.stringify((window.scrollY === 0) ? "ifff" : "elseee")} */}
                    {/* <p>Div Height on Scroll: {this.state.divHeight}</p> */}

                    <div className="hsn-tbl-list-style tbl-list-style">
                        {isActionExist("hsn", "list", this.props.userPermissions) && (
                            <Table
                                // ref={this.divRef}
                                // onScroll={this.handleDivScroll}
                                // style={{ height: '300px', overflow: 'auto' }}
                                // hover
                                size="sm"
                            // onWheel={(e) => {
                            //     e.preventDefault();
                            //     console.log("e.nativeEvent.wheelDelta >>>>>>", e.nativeEvent.wheelDelta)
                            //     //start working condition
                            //     if (e.nativeEvent.wheelDelta > 0) {
                            //         console.warn("scrolling up ")
                            //         if (currentPage > 1) {
                            //             this.goToPreviousPage();

                            //         } else {
                            //             console.warn(" scrolling restricted up ")
                            //         }
                            //     } else {
                            //         console.warn("scrolling down ")
                            //         if (currentPage === pages) {
                            //             console.warn(" scrolling restricted down ")
                            //         } else {
                            //             this.goToNextPage();

                            //         }
                            //     }
                            //     //end workn condition
                            // }}
                            >
                                <thead >
                                    <tr>
                                        <th style={{ width: "25%" }}>HSN No.</th>
                                        <th style={{ width: "25%" }}>HSN Description</th>
                                        <th style={{ width: "25%" }}>Type</th>
                                        {/* <th style={{ width: "25%" }}>Action</th> */}
                                    </tr>

                                </thead>
                                <tbody
                                    style={{ borderTop: "2px solid transparent" }}
                                    className="prouctTableTr"
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                        if (e.keyCode != 9) {
                                            this.handleTableRow(e);
                                        }
                                    }}
                                >
                                    {gethsntable.length > 0 ? (
                                        gethsntable.map((v, i) => {
                                            return (
                                                <tr
                                                    value={JSON.stringify(v)}
                                                    id={`ledgerTr_` + i}
                                                    tabIndex={i}
                                                    onDoubleClick={(e) => {
                                                        if (
                                                            isActionExist(
                                                                "hsn",
                                                                "edit",
                                                                this.props.userPermissions
                                                            )
                                                        ) {
                                                            this.handleFetchData(v.id);
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
                                                    {/* <td style={{ width: "25%" }}>{i + 1}</td> */}
                                                    <td style={{ width: "25%" }}>{v.hsnNumber}</td>
                                                    <td style={{ width: "25%" }}>{v.description}</td>
                                                    <td style={{ width: "25%" }}>{v.type}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                    {/* </div> */}
                                </tbody>
                                <thead
                                    className="tbl-footer"
                                    style={{ borderTop: "2px solid transparent" }}
                                >
                                    <tr>
                                        <th colSpan={3}>
                                            {Array.from(Array(1), (v) => {
                                                return (
                                                    <tr>
                                                        {/* <th>&nbsp;</th> */}
                                                        <th>Total HSN :</th>
                                                        <th>{gethsntable.length}</th>
                                                    </tr>
                                                );
                                            })}
                                        </th>
                                    </tr>
                                </thead>
                            </Table>
                        )}

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

export default connect(mapStateToProps, mapActionsToProps)(HSN);
