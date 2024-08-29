import React, { Component } from 'react'
import {
    Button,
    Col,
    Row,
    Form,
    InputGroup,
    ButtonGroup,
    FormControl,
    CloseButton,
    Modal,
    Table,
    Tabs,
    Tab,
    Nav, Accordion, FormLabel
} from "react-bootstrap";
import {
    faArrowDown, faArrowUp, faCalculator, faCirclePlus, faCircleQuestion, faFloppyDisk, faGear, faHouse, faPen, faPrint, faArrowUpFromBracket, faRightFromBracket, faTrash, faXmark, faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import search_icon from "@/assets/images/search_icon@3x.png";
import Select from "react-select";
export default class DispatchManagement extends Component {
    render() {
        return (
            <>
                <div className="dispatch-management">
                    <div className='p-2 pt-0'>
                        <Row>
                            <Col md="9" className='p-2'>
                                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                                    <Row>
                                        <Col sm={12}>
                                            <Nav variant="pills" className="flex-row">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="first">All(149)</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="second">Pick-up(46)</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="third">Packing(0)</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="fourth">Ready For Deliver(0)</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="fifth">Out For Deliver(0)</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="sixth">Delivered(0)</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="seventh">Returned/Cancelled(0)</Nav.Link>
                                                </Nav.Item>

                                            </Nav>
                                        </Col>
                                        <Col sm={12}>
                                            <Tab.Content className='tabcontent'>
                                                <Tab.Pane eventKey="first" className='mt-2'>
                                                    <Row className='p-2'>
                                                        <Col
                                                            lg={1}
                                                            md={1}
                                                            sm={1}
                                                            xs={1}
                                                            className=" paddingtop"
                                                        >
                                                            <Form.Label>
                                                                Invoice

                                                            </Form.Label>
                                                        </Col>
                                                        <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={3}
                                                            xs={3}
                                                            className="paddingtop"
                                                        >
                                                            <Form.Group
                                                                style={{ width: "fit-content" }}

                                                                className="d-flex label_style"
                                                            // className={`${values.mode == "" &&
                                                            //     errorArrayBorder[3] == "Y"
                                                            //     ? "border border-danger d-flex label_style"
                                                            //     : "d-flex label_style"
                                                            //     }`}

                                                            >
                                                                <Form.Check
                                                                    type="radio"
                                                                    id="mode1"
                                                                    name="mode"
                                                                    label="Pickup"
                                                                    value="Pickup"

                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    className="mx-2"
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode2"
                                                                    label="Delivery"
                                                                    value="Delivery"
                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode3"
                                                                    label="Sales"
                                                                    value="Sales"
                                                                    autoComplete="true"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md="2">
                                                            <InputGroup className="mdl-text">
                                                                <Form.Control
                                                                    type="text"
                                                                    name="Search"
                                                                    id="SearchL"
                                                                    placeholder="Search"
                                                                    className="mdl-text-box"
                                                                    autoFocus={true}
                                                                    autoComplete="off"
                                                                />
                                                                <InputGroup.Text className="int-grp" id="basic-addon1">
                                                                    <img className="srch_box" src={search_icon} alt="" />
                                                                    {/* <img src={search} alt="" /> */}
                                                                </InputGroup.Text>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <div className="dispatch_tbl">
                                                        <Table className="">
                                                            <thead
                                                                style={{
                                                                    border: "1px solid #A8ADB3",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th style={{ width: "5%", textAlign: "center" }}>

                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>

                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="py-1"
                                                                    >
                                                                        Invoice No.
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            // width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="qty py-1"
                                                                    >
                                                                        Invoice Date
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            width: "394px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="purticular-width"
                                                                    >
                                                                        Customer
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "305px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="package_width"
                                                                    >
                                                                        Narration
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                    // className="qty_width"

                                                                    >
                                                                        Status
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "140px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Bill Amount
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "5%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Item
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td style={{ background: "#FFDF8B" }}>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Pickup"

                                                                            tabIndex={-1}

                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0 text-end"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td style={{ background: "#AEE8AD" }}>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Ready For Delivery"

                                                                            tabIndex={-1}

                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0 text-end"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td style={{ background: "#FFACAC" }}>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Cancelled"

                                                                            tabIndex={-1}

                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0 text-end"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td style={{ background: "#D9BBFF" }}>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Packing"
                                                                            tabIndex={-1}

                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0 text-end"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className='tabcontent'>
                                                        <div className="style-footr ">
                                                            <Row>
                                                                <Col lg={12} >
                                                                    {Array.from(Array(1), (v) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col md="7" className="my-auto">
                                                                                    {/* <Row>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+A</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F2</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                    </Row>

                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+E</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+S</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+D</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Alt+C</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F11</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+Z</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+P</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Export</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F1</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                            </Row> */}
                                                                                </Col>

                                                                                <Col lg={5} className="text-end my-auto ps-0">
                                                                                    <Row>
                                                                                        <Col lg="4" className="">Ledger :1</Col>
                                                                                        <Col lg={4} className="text-center">
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToPreviousPage.bind(this)}
                                                                                                // disabled={currentPage <= 1}
                                                                                                className="nextbtn"
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronLeft}
                                                                                                    className="plus-color"
                                                                                                />{" "}

                                                                                            </Button>
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToNextPage.bind(this)}
                                                                                                className="nextbtn"
                                                                                            // disabled={currentPage === pages ? true : false}
                                                                                            >

                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronRight}
                                                                                                    className="plus-color"
                                                                                                />
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col lg="4" className="ps-0">
                                                                                            Page No.
                                                                                            {/* {currentPage}  */}
                                                                                            Out of 10

                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="second">   <Row className='p-2'>
                                                    <Col
                                                        lg={1}
                                                        md={1}
                                                        sm={1}
                                                        xs={1}
                                                        className=" paddingtop"
                                                    >
                                                        <Form.Label>
                                                            Invoice

                                                        </Form.Label>
                                                    </Col>
                                                    <Col
                                                        lg={3}
                                                        md={3}
                                                        sm={3}
                                                        xs={3}
                                                        className="paddingtop"
                                                    >
                                                        <Form.Group
                                                            style={{ width: "fit-content" }}

                                                            className="d-flex label_style"
                                                        // className={`${values.mode == "" &&
                                                        //     errorArrayBorder[3] == "Y"
                                                        //     ? "border border-danger d-flex label_style"
                                                        //     : "d-flex label_style"
                                                        //     }`}

                                                        >
                                                            <Form.Check
                                                                type="radio"
                                                                id="mode1"
                                                                name="mode"
                                                                label="Pickup"
                                                                value="Pickup"

                                                                autoComplete="true"
                                                            />
                                                            <Form.Check
                                                                className="mx-2"
                                                                type="radio"
                                                                name="mode"
                                                                id="mode2"
                                                                label="Delivery"
                                                                value="Delivery"
                                                                autoComplete="true"
                                                            />
                                                            <Form.Check
                                                                type="radio"
                                                                name="mode"
                                                                id="mode3"
                                                                label="Sales"
                                                                value="Sales"
                                                                autoComplete="true"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="2">
                                                        <InputGroup className="mb-2  mdl-text">
                                                            <Form.Control
                                                                type="text"

                                                                name="Search"
                                                                id="SearchL"

                                                                placeholder="Search"
                                                                className="mdl-text-box"
                                                                autoFocus={true}
                                                                autoComplete="off"
                                                            />
                                                            <InputGroup.Text className="int-grp" id="basic-addon1">
                                                                <img className="srch_box" src={search_icon} alt="" />
                                                                {/* <img src={search} alt="" /> */}
                                                            </InputGroup.Text>
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                    <div className="dispatch_tbl">
                                                        <Table className="">
                                                            <thead
                                                                style={{
                                                                    border: "1px solid #A8ADB3",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th style={{ width: "5%", textAlign: "center" }}>

                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>

                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="py-1"
                                                                    >
                                                                        Invoice No.
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            // width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="qty py-1"
                                                                    >
                                                                        Invoice Date
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            width: "394px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="purticular-width"
                                                                    >
                                                                        Customer
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "305px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="package_width"
                                                                    >
                                                                        Narration
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                    // className="qty_width"

                                                                    >
                                                                        Status
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "140px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Bill Amount
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "5%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Item
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Pickup"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className='tabcontent'>
                                                        <div className="style-footr ">
                                                            <Row>
                                                                <Col lg={12} >
                                                                    {Array.from(Array(1), (v) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col md="8" className="my-auto">
                                                                                    {/* <Row>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+A</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F2</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                    </Row>

                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+E</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+S</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+D</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Alt+C</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F11</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+Z</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+P</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Export</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F1</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                            </Row> */}
                                                                                </Col>

                                                                                <Col lg={4} className="text-end">
                                                                                    <Row>
                                                                                        <Col lg="4" className="my-auto">Ledger :1</Col>
                                                                                        <Col lg={4} className="text-center">
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToPreviousPage.bind(this)}
                                                                                                // disabled={currentPage <= 1}
                                                                                                className="nextbtn"
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronLeft}
                                                                                                    className="plus-color"
                                                                                                />{" "}

                                                                                            </Button>
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToNextPage.bind(this)}
                                                                                                className="nextbtn"
                                                                                            // disabled={currentPage === pages ? true : false}
                                                                                            >

                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronRight}
                                                                                                    className="plus-color"
                                                                                                />
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col lg="4" className="my-auto">
                                                                                            Page No.
                                                                                            {/* {currentPage}  */}
                                                                                            Out of 10

                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div></Tab.Pane>
                                                <Tab.Pane eventKey="third">   <Row className='p-2'>
                                                    <Col
                                                        lg={1}
                                                        md={1}
                                                        sm={1}
                                                        xs={1}
                                                        className=" paddingtop"
                                                    >
                                                        <Form.Label>
                                                            Invoice

                                                        </Form.Label>
                                                    </Col>
                                                    <Col
                                                        lg={3}
                                                        md={3}
                                                        sm={3}
                                                        xs={3}
                                                        className="paddingtop"
                                                    >
                                                        <Form.Group
                                                            style={{ width: "fit-content" }}

                                                            className="d-flex label_style"
                                                        // className={`${values.mode == "" &&
                                                        //     errorArrayBorder[3] == "Y"
                                                        //     ? "border border-danger d-flex label_style"
                                                        //     : "d-flex label_style"
                                                        //     }`}

                                                        >
                                                            <Form.Check
                                                                type="radio"
                                                                id="mode1"
                                                                name="mode"
                                                                label="Pickup"
                                                                value="Pickup"

                                                                autoComplete="true"
                                                            />
                                                            <Form.Check
                                                                className="mx-2"
                                                                type="radio"
                                                                name="mode"
                                                                id="mode2"
                                                                label="Delivery"
                                                                value="Delivery"
                                                                autoComplete="true"
                                                            />
                                                            <Form.Check
                                                                type="radio"
                                                                name="mode"
                                                                id="mode3"
                                                                label="Sales"
                                                                value="Sales"
                                                                autoComplete="true"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md="2">
                                                        <InputGroup className="mb-2  mdl-text">
                                                            <Form.Control
                                                                type="text"

                                                                name="Search"
                                                                id="SearchL"

                                                                placeholder="Search"
                                                                className="mdl-text-box"
                                                                autoFocus={true}
                                                                autoComplete="off"
                                                            />
                                                            <InputGroup.Text className="int-grp" id="basic-addon1">
                                                                <img className="srch_box" src={search_icon} alt="" />
                                                                {/* <img src={search} alt="" /> */}
                                                            </InputGroup.Text>
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                    <div className="dispatch_tbl">
                                                        <Table className="">
                                                            <thead
                                                                style={{
                                                                    border: "1px solid #A8ADB3",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th style={{ width: "5%", textAlign: "center" }}>

                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>

                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="py-1"
                                                                    >
                                                                        Invoice No.
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            // width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="qty py-1"
                                                                    >
                                                                        Invoice Date
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            width: "394px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="purticular-width"
                                                                    >
                                                                        Customer
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "305px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="package_width"
                                                                    >
                                                                        Narration
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                    // className="qty_width"

                                                                    >
                                                                        Status
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "140px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Bill Amount
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "5%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Item
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Pickup"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className='tabcontent'>
                                                        <div className="style-footr ">
                                                            <Row>
                                                                <Col lg={12} >
                                                                    {Array.from(Array(1), (v) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col md="8" className="my-auto">
                                                                                    {/* <Row>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+A</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F2</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                    </Row>

                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+E</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+S</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+D</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Alt+C</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F11</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+Z</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+P</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Export</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F1</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                            </Row> */}
                                                                                </Col>

                                                                                <Col lg={4} className="text-end">
                                                                                    <Row>
                                                                                        <Col lg="4" className="my-auto">Ledger :1</Col>
                                                                                        <Col lg={4} className="text-center">
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToPreviousPage.bind(this)}
                                                                                                // disabled={currentPage <= 1}
                                                                                                className="nextbtn"
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronLeft}
                                                                                                    className="plus-color"
                                                                                                />{" "}

                                                                                            </Button>
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToNextPage.bind(this)}
                                                                                                className="nextbtn"
                                                                                            // disabled={currentPage === pages ? true : false}
                                                                                            >

                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronRight}
                                                                                                    className="plus-color"
                                                                                                />
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col lg="4" className="my-auto">
                                                                                            Page No.
                                                                                            {/* {currentPage}  */}
                                                                                            Out of 10

                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div></Tab.Pane>
                                                <Tab.Pane eventKey="fourth">
                                                    <Row className='p-2'>
                                                        <Col
                                                            lg={1}
                                                            md={1}
                                                            sm={1}
                                                            xs={1}
                                                            className=" paddingtop"
                                                        >
                                                            <Form.Label>
                                                                Invoice

                                                            </Form.Label>
                                                        </Col>
                                                        <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={3}
                                                            xs={3}
                                                            className="paddingtop"
                                                        >
                                                            <Form.Group
                                                                style={{ width: "fit-content" }}

                                                                className="d-flex label_style"
                                                            // className={`${values.mode == "" &&
                                                            //     errorArrayBorder[3] == "Y"
                                                            //     ? "border border-danger d-flex label_style"
                                                            //     : "d-flex label_style"
                                                            //     }`}

                                                            >
                                                                <Form.Check
                                                                    type="radio"
                                                                    id="mode1"
                                                                    name="mode"
                                                                    label="Pickup"
                                                                    value="Pickup"

                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    className="mx-2"
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode2"
                                                                    label="Delivery"
                                                                    value="Delivery"
                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode3"
                                                                    label="Sales"
                                                                    value="Sales"
                                                                    autoComplete="true"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md="2">
                                                            <InputGroup className="mb-2  mdl-text">
                                                                <Form.Control
                                                                    type="text"

                                                                    name="Search"
                                                                    id="SearchL"

                                                                    placeholder="Search"
                                                                    className="mdl-text-box"
                                                                    autoFocus={true}
                                                                    autoComplete="off"
                                                                />
                                                                <InputGroup.Text className="int-grp" id="basic-addon1">
                                                                    <img className="srch_box" src={search_icon} alt="" />
                                                                    {/* <img src={search} alt="" /> */}
                                                                </InputGroup.Text>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <div className="dispatch_tbl">
                                                        <Table className="">
                                                            <thead
                                                                style={{
                                                                    border: "1px solid #A8ADB3",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th style={{ width: "5%", textAlign: "center" }}>

                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>

                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="py-1"
                                                                    >
                                                                        Invoice No.
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            // width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="qty py-1"
                                                                    >
                                                                        Invoice Date
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            width: "394px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="purticular-width"
                                                                    >
                                                                        Customer
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "305px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="package_width"
                                                                    >
                                                                        Narration
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                    // className="qty_width"

                                                                    >
                                                                        Status
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "140px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Bill Amount
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "5%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Item
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Pickup"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className='tabcontent'>
                                                        <div className="style-footr ">
                                                            <Row>
                                                                <Col lg={12} >
                                                                    {Array.from(Array(1), (v) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col md="8" className="my-auto">
                                                                                    {/* <Row>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+A</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F2</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                    </Row>

                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+E</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+S</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+D</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Alt+C</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F11</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+Z</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+P</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Export</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F1</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                            </Row> */}
                                                                                </Col>

                                                                                <Col lg={4} className="text-end">
                                                                                    <Row>
                                                                                        <Col lg="4" className="my-auto">Ledger :1</Col>
                                                                                        <Col lg={4} className="text-center">
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToPreviousPage.bind(this)}
                                                                                                // disabled={currentPage <= 1}
                                                                                                className="nextbtn"
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronLeft}
                                                                                                    className="plus-color"
                                                                                                />{" "}

                                                                                            </Button>
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToNextPage.bind(this)}
                                                                                                className="nextbtn"
                                                                                            // disabled={currentPage === pages ? true : false}
                                                                                            >

                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronRight}
                                                                                                    className="plus-color"
                                                                                                />
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col lg="4" className="my-auto">
                                                                                            Page No.
                                                                                            {/* {currentPage}  */}
                                                                                            Out of 10

                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="fifth">
                                                    <Row className='p-2'>
                                                        <Col
                                                            lg={1}
                                                            md={1}
                                                            sm={1}
                                                            xs={1}
                                                            className=" paddingtop"
                                                        >
                                                            <Form.Label>
                                                                Invoice

                                                            </Form.Label>
                                                        </Col>
                                                        <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={3}
                                                            xs={3}
                                                            className="paddingtop"
                                                        >
                                                            <Form.Group
                                                                style={{ width: "fit-content" }}

                                                                className="d-flex label_style"
                                                            // className={`${values.mode == "" &&
                                                            //     errorArrayBorder[3] == "Y"
                                                            //     ? "border border-danger d-flex label_style"
                                                            //     : "d-flex label_style"
                                                            //     }`}

                                                            >
                                                                <Form.Check
                                                                    type="radio"
                                                                    id="mode1"
                                                                    name="mode"
                                                                    label="Pickup"
                                                                    value="Pickup"

                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    className="mx-2"
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode2"
                                                                    label="Delivery"
                                                                    value="Delivery"
                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode3"
                                                                    label="Sales"
                                                                    value="Sales"
                                                                    autoComplete="true"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md="2">
                                                            <InputGroup className="mb-2  mdl-text">
                                                                <Form.Control
                                                                    type="text"

                                                                    name="Search"
                                                                    id="SearchL"

                                                                    placeholder="Search"
                                                                    className="mdl-text-box"
                                                                    autoFocus={true}
                                                                    autoComplete="off"
                                                                />
                                                                <InputGroup.Text className="int-grp" id="basic-addon1">
                                                                    <img className="srch_box" src={search_icon} alt="" />
                                                                    {/* <img src={search} alt="" /> */}
                                                                </InputGroup.Text>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <div className="dispatch_tbl">
                                                        <Table className="">
                                                            <thead
                                                                style={{
                                                                    border: "1px solid #A8ADB3",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th style={{ width: "5%", textAlign: "center" }}>

                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>

                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="py-1"
                                                                    >
                                                                        Invoice No.
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            // width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="qty py-1"
                                                                    >
                                                                        Invoice Date
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            width: "394px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="purticular-width"
                                                                    >
                                                                        Customer
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "305px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="package_width"
                                                                    >
                                                                        Narration
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                    // className="qty_width"

                                                                    >
                                                                        Status
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "140px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Bill Amount
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "5%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Item
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Pickup"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className='tabcontent'>
                                                        <div className="style-footr ">
                                                            <Row>
                                                                <Col lg={12} >
                                                                    {Array.from(Array(1), (v) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col md="8" className="my-auto">
                                                                                    {/* <Row>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+A</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F2</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                    </Row>

                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+E</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+S</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+D</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Alt+C</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F11</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+Z</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+P</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Export</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F1</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                            </Row> */}
                                                                                </Col>

                                                                                <Col lg={4} className="text-end">
                                                                                    <Row>
                                                                                        <Col lg="4" className="my-auto">Ledger :1</Col>
                                                                                        <Col lg={4} className="text-center">
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToPreviousPage.bind(this)}
                                                                                                // disabled={currentPage <= 1}
                                                                                                className="nextbtn"
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronLeft}
                                                                                                    className="plus-color"
                                                                                                />{" "}

                                                                                            </Button>
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToNextPage.bind(this)}
                                                                                                className="nextbtn"
                                                                                            // disabled={currentPage === pages ? true : false}
                                                                                            >

                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronRight}
                                                                                                    className="plus-color"
                                                                                                />
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col lg="4" className="my-auto">
                                                                                            Page No.
                                                                                            {/* {currentPage}  */}
                                                                                            Out of 10

                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="sixth">
                                                    <Row className='p-2'>
                                                        <Col
                                                            lg={1}
                                                            md={1}
                                                            sm={1}
                                                            xs={1}
                                                            className=" paddingtop"
                                                        >
                                                            <Form.Label>
                                                                Invoice

                                                            </Form.Label>
                                                        </Col>
                                                        <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={3}
                                                            xs={3}
                                                            className="paddingtop"
                                                        >
                                                            <Form.Group
                                                                style={{ width: "fit-content" }}

                                                                className="d-flex label_style"
                                                            // className={`${values.mode == "" &&
                                                            //     errorArrayBorder[3] == "Y"
                                                            //     ? "border border-danger d-flex label_style"
                                                            //     : "d-flex label_style"
                                                            //     }`}

                                                            >
                                                                <Form.Check
                                                                    type="radio"
                                                                    id="mode1"
                                                                    name="mode"
                                                                    label="Pickup"
                                                                    value="Pickup"

                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    className="mx-2"
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode2"
                                                                    label="Delivery"
                                                                    value="Delivery"
                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode3"
                                                                    label="Sales"
                                                                    value="Sales"
                                                                    autoComplete="true"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md="2">
                                                            <InputGroup className="mb-2  mdl-text">
                                                                <Form.Control
                                                                    type="text"

                                                                    name="Search"
                                                                    id="SearchL"

                                                                    placeholder="Search"
                                                                    className="mdl-text-box"
                                                                    autoFocus={true}
                                                                    autoComplete="off"
                                                                />
                                                                <InputGroup.Text className="int-grp" id="basic-addon1">
                                                                    <img className="srch_box" src={search_icon} alt="" />
                                                                    {/* <img src={search} alt="" /> */}
                                                                </InputGroup.Text>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <div className="dispatch_tbl">
                                                        <Table className="">
                                                            <thead
                                                                style={{
                                                                    border: "1px solid #A8ADB3",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th style={{ width: "5%", textAlign: "center" }}>

                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>

                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="py-1"
                                                                    >
                                                                        Invoice No.
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            // width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="qty py-1"
                                                                    >
                                                                        Invoice Date
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            width: "394px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="purticular-width"
                                                                    >
                                                                        Customer
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "305px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="package_width"
                                                                    >
                                                                        Narration
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                    // className="qty_width"

                                                                    >
                                                                        Status
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "140px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Bill Amount
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "5%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Item
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Pickup"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className='tabcontent'>
                                                        <div className="style-footr ">
                                                            <Row>
                                                                <Col lg={12} >
                                                                    {Array.from(Array(1), (v) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col md="8" className="my-auto">
                                                                                    {/* <Row>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+A</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F2</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                    </Row>

                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+E</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+S</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+D</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Alt+C</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F11</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+Z</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+P</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Export</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F1</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                            </Row> */}
                                                                                </Col>

                                                                                <Col lg={4} className="text-end">
                                                                                    <Row>
                                                                                        <Col lg="4" className="my-auto">Ledger :1</Col>
                                                                                        <Col lg={4} className="text-center">
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToPreviousPage.bind(this)}
                                                                                                // disabled={currentPage <= 1}
                                                                                                className="nextbtn"
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronLeft}
                                                                                                    className="plus-color"
                                                                                                />{" "}

                                                                                            </Button>
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToNextPage.bind(this)}
                                                                                                className="nextbtn"
                                                                                            // disabled={currentPage === pages ? true : false}
                                                                                            >

                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronRight}
                                                                                                    className="plus-color"
                                                                                                />
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col lg="4" className="my-auto">
                                                                                            Page No.
                                                                                            {/* {currentPage}  */}
                                                                                            Out of 10

                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="seventh">
                                                    <Row className='p-2'>
                                                        <Col
                                                            lg={1}
                                                            md={1}
                                                            sm={1}
                                                            xs={1}
                                                            className=" paddingtop"
                                                        >
                                                            <Form.Label>
                                                                Invoice

                                                            </Form.Label>
                                                        </Col>
                                                        <Col
                                                            lg={3}
                                                            md={3}
                                                            sm={3}
                                                            xs={3}
                                                            className="paddingtop"
                                                        >
                                                            <Form.Group
                                                                style={{ width: "fit-content" }}

                                                                className="d-flex label_style"
                                                            // className={`${values.mode == "" &&
                                                            //     errorArrayBorder[3] == "Y"
                                                            //     ? "border border-danger d-flex label_style"
                                                            //     : "d-flex label_style"
                                                            //     }`}

                                                            >
                                                                <Form.Check
                                                                    type="radio"
                                                                    id="mode1"
                                                                    name="mode"
                                                                    label="Pickup"
                                                                    value="Pickup"

                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    className="mx-2"
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode2"
                                                                    label="Delivery"
                                                                    value="Delivery"
                                                                    autoComplete="true"
                                                                />
                                                                <Form.Check
                                                                    type="radio"
                                                                    name="mode"
                                                                    id="mode3"
                                                                    label="Sales"
                                                                    value="Sales"
                                                                    autoComplete="true"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md="2">
                                                            <InputGroup className="mb-2  mdl-text">
                                                                <Form.Control
                                                                    type="text"

                                                                    name="Search"
                                                                    id="SearchL"

                                                                    placeholder="Search"
                                                                    className="mdl-text-box"
                                                                    autoFocus={true}
                                                                    autoComplete="off"
                                                                />
                                                                <InputGroup.Text className="int-grp" id="basic-addon1">
                                                                    <img className="srch_box" src={search_icon} alt="" />
                                                                    {/* <img src={search} alt="" /> */}
                                                                </InputGroup.Text>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                    <div className="dispatch_tbl">
                                                        <Table className="">
                                                            <thead
                                                                style={{
                                                                    border: "1px solid #A8ADB3",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th style={{ width: "5%", textAlign: "center" }}>

                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>

                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="py-1"
                                                                    >
                                                                        Invoice No.
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            // width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="qty py-1"
                                                                    >
                                                                        Invoice Date
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            width: "394px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="purticular-width"
                                                                    >
                                                                        Customer
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "305px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="package_width"
                                                                    >
                                                                        Narration
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "135px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                    // className="qty_width"

                                                                    >
                                                                        Status
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "140px",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Bill Amount
                                                                    </th>


                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "5%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}

                                                                    >
                                                                        Item
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                <tr style={{ borderbottom: "1px solid #D9D9D9" }}>

                                                                    <td style={{ width: "5%", textAlign: "center" }}>
                                                                        <Form.Group
                                                                            controlId="formBasicCheckbox"
                                                                        // className="ml-1 pmt-allbtn"
                                                                        >
                                                                            <Form.Check
                                                                                type="checkbox"

                                                                            />
                                                                        </Form.Group>
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="Pickup"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className='tabcontent'>
                                                        <div className="style-footr ">
                                                            <Row>
                                                                <Col lg={12} >
                                                                    {Array.from(Array(1), (v) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col md="8" className="my-auto">
                                                                                    {/* <Row>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+A</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F2</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                    </Row>

                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+E</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+S</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+D</span>
                                                                                            </Form.Label>
                                                                                        </Col>

                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Alt+C</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F11</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+Z</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Ctrl+P</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                        <Col md="6" className="">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">Export</span>
                                                                                            </Form.Label>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col md="2" className="">
                                                                                    <Row>
                                                                                        <Col md="6">
                                                                                            <Form.Label className="btm-label d-flex">
                                                                                                <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
                                                                                                <span className="shortkey">F1</span>
                                                                                            </Form.Label>
                                                                                        </Col>


                                                                                    </Row>
                                                                                </Col>
                                                                            </Row> */}
                                                                                </Col>

                                                                                <Col lg={4} className="text-end">
                                                                                    <Row>
                                                                                        <Col lg="4" className="my-auto">Ledger :1</Col>
                                                                                        <Col lg={4} className="text-center">
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToPreviousPage.bind(this)}
                                                                                                // disabled={currentPage <= 1}
                                                                                                className="nextbtn"
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronLeft}
                                                                                                    className="plus-color"
                                                                                                />{" "}

                                                                                            </Button>
                                                                                            <Button
                                                                                                type="button"
                                                                                                // onClick={this.goToNextPage.bind(this)}
                                                                                                className="nextbtn"
                                                                                            // disabled={currentPage === pages ? true : false}
                                                                                            >

                                                                                                <FontAwesomeIcon
                                                                                                    icon={faChevronRight}
                                                                                                    className="plus-color"
                                                                                                />
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col lg="4" className="my-auto">
                                                                                            Page No.
                                                                                            {/* {currentPage}  */}
                                                                                            Out of 10

                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Tab.Pane>

                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Col>
                            <Col md="3" className='accodiondata'>
                                <Row>
                                    <Col className='p-0'>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header style={{
                                                    background: "linear-gradient(0deg, #E8F8E7 0%, #E8F8E7 100%), #EBF8FF"
                                                }}>T80250006</Accordion.Header>
                                                <Accordion.Body className='p-0'>
                                                    <div className="dispatch_acctbl">
                                                        <Table className="mb-2">
                                                            <thead
                                                                style={{
                                                                    border: "1px solid #A8ADB3",
                                                                }}
                                                            >
                                                                <tr>
                                                                    <th style={{ width: "5%", textAlign: "center" }}>#
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="py-1"
                                                                    >
                                                                        Description
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "15%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="qty py-1"
                                                                    >
                                                                        Batch
                                                                    </th>

                                                                    <th
                                                                        style={{
                                                                            width: "5%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="purticular-width"
                                                                    >
                                                                        Qty
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign: "center",
                                                                            width: "20%",
                                                                            borderRight: "1px solid #A8ADB2",
                                                                        }}
                                                                        className="package_width"
                                                                    >
                                                                        Price
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr style={{ borderbottom: "1px solid #D9D9D9", background: "linear-gradient(0deg, #E8F8E7 0%, #E8F8E7 100%), #EBF8FF" }} >

                                                                    <td style={{ width: "5%", textAlign: "center", }}>
                                                                        1
                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control
                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            name="counterNo"
                                                                            id="counterNo"
                                                                            placeholder=""

                                                                        // disabled
                                                                        />

                                                                    </td>
                                                                    <td className="sr-no-style">
                                                                        <Form.Control

                                                                            className="table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"

                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0 text-center"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Form.Control
                                                                            className=" table-text-box border-0"
                                                                            type="text"
                                                                            placeholder="0"
                                                                            tabIndex={-1}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>

                                                            <tfoot className="dispatch_btm_part">
                                                                <tr style={{ background: "#DDE2ED" }}>
                                                                    <td colSpan={3}>Order Total</td>
                                                                    <td className='text-center'>9</td>
                                                                    <td className='text-end'>1314.00</td>
                                                                </tr>
                                                            </tfoot>
                                                        </Table>

                                                    </div>

                                                </Accordion.Body>
                                            </Accordion.Item>

                                        </Accordion>
                                    </Col>
                                </Row>
                                <Row className='acc-btm-part'>
                                    <Col>
                                        <Row>
                                            <Col className="my-auto"><Form.Label>1 Invoice Selected</Form.Label></Col>

                                        </Row>
                                        <Row className="py-1">
                                            <Col md="4">
                                                <Button className="cancel-btn">
                                                    Cancel
                                                </Button>
                                            </Col>
                                            <Col md="8">
                                                <Button
                                                    className="successbtn-style"
                                                    type="submit"
                                                >
                                                    Send To Packing
                                                </Button>


                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="style-footr">
                            <Col md="10" className="my-auto">
                                <Row>
                                    <Col md="2" className="">
                                        <Row>
                                            <Col md="6">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faHouse} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Ctrl+A</span>
                                                </Form.Label>
                                            </Col>
                                            <Col md="6">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faCirclePlus} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">F2</span>
                                                </Form.Label>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="2" className="">
                                        <Row>
                                            <Col md="6" className="">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faPen} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Ctrl+E</span>
                                                </Form.Label>
                                            </Col>
                                            <Col md="6">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faFloppyDisk} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Ctrl+S</span>
                                                </Form.Label>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="2" className="">
                                        <Row>
                                            <Col md="6">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faTrash} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Ctrl+D</span>
                                                </Form.Label>
                                            </Col>
                                            <Col md="6" className="">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faXmark} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Ctrl+C</span>
                                                </Form.Label>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="2" className="">
                                        <Row>
                                            <Col md="6">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faCalculator} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Alt+C</span>
                                                </Form.Label>
                                            </Col>
                                            <Col md="6">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faGear} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">F11</span>
                                                </Form.Label>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="2" className="">
                                        <Row>
                                            <Col md="6">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faRightFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Ctrl+Z</span>
                                                </Form.Label>
                                            </Col>
                                            <Col md="6" className="">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faPrint} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Ctrl+P</span>
                                                </Form.Label>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="2" className="">
                                        <Row>
                                            <Col md="6" className="">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">Export</span>
                                                </Form.Label>
                                            </Col>
                                            <Col md="6">
                                                <Form.Label className="btm-label d-flex">
                                                    <FontAwesomeIcon icon={faCircleQuestion} className="svg-style icostyle mt-0 mx-2" />
                                                    <span className="shortkey">F1</span>
                                                </Form.Label>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="2" className="text-end">

                            </Col>
                        </Row>
                    </div >

                </div >
            </>
        )
    }
}
