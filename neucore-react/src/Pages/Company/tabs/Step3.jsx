import React from "react";

import { Form, Row, Col } from "react-bootstrap";

const level_a_validation = (idx, uclst) => {
    if (uclst[idx]["value"] === "1" && uclst[idx]["label"] !== "")
        return false;
    return true;
}

const level_a_b_validation = (idx_a, idx_b, uclst) => {
    if (uclst[idx_a]["value"] === "1" && uclst[idx_a]["label"] !== "" && uclst[idx_b]["value"] === "1" && uclst[idx_b]["label"] !== "") {
        return false;
    }
    return true;
}
export default function Step3(props) {
    let {
        userControlData,
        values,
        handleChange,
        errors,
        handleSelectionChange,
        SelectionChangeCheck,
        setFieldValue,
        touched, handleLabelChange
    } = props;
    return (
        <>
            {/* {JSON.stringify(userControlData)} */}
            {userControlData.length > 0 ? (
                userControlData.map((v, i) => {
                    return (
                        <Row>
                            <Col lg={7} >
                                <Row>
                                    <Col lg={3} className="mt-4" >
                                        <Form.Label className="mb-0">
                                            {v.display_name}
                                            {/* {JSON.stringify(v)} */}
                                            {/* <span className="text-danger">*</span> */}
                                        </Form.Label>
                                    </Col>

                                    {v.slug !== "is_level_b" && v.slug !== "is_level_c" && (
                                        <Col lg={3} className="mt-4" >
                                            <Form.Group className="gender1 custom-control-inline radiotag d-flex">
                                                <Form.Check
                                                    type="radio"
                                                    label="Yes"
                                                    className="pr-3 pe-4"
                                                    name={v.slug}
                                                    id={`${v.slug}-${i}-yes`}
                                                    onChange={(e) => {
                                                        handleSelectionChange(v.slug, "1");
                                                    }}
                                                    checked={SelectionChangeCheck(v.slug)}
                                                    value="1"
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="No"
                                                    name={v.slug}
                                                    id={`${v.slug}-${i}-no`}
                                                    onChange={(e) => {
                                                        handleSelectionChange(v.slug, "0");
                                                    }}
                                                    checked={!SelectionChangeCheck(v.slug)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    )}

                                    <>
                                        {v.slug === "is_level_b" && (
                                            <Col lg={3} className="mt-4">
                                                <Form.Group className="gender1 custom-control-inline radiotag d-flex">
                                                    <Form.Check
                                                        type="radio"
                                                        label="Yes"
                                                        disabled={level_a_validation(i - 1, userControlData)}
                                                        className="pr-3 pe-4"
                                                        name={v.slug}
                                                        id={`${v.slug}-${i}-yes`}
                                                        onChange={(e) => {
                                                            handleSelectionChange(v.slug, "1");
                                                        }}
                                                        checked={SelectionChangeCheck(v.slug)}
                                                        value="1"
                                                    />
                                                    <Form.Check
                                                        type="radio"
                                                        label="No"
                                                        name={v.slug}
                                                        id={`${v.slug}-${i}-no`}
                                                        onChange={(e) => {
                                                            handleSelectionChange(v.slug, "0");
                                                        }}
                                                        checked={!SelectionChangeCheck(v.slug)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}
                                    </>

                                    <>
                                        {v.slug === "is_level_c" && (
                                            <Col lg={3} className="mt-4">
                                                <Form.Group className="gender1 custom-control-inline radiotag d-flex">
                                                    <Form.Check
                                                        type="radio"
                                                        label="Yes"
                                                        disabled={level_a_b_validation(i - 2, i - 1, userControlData)}
                                                        className="pr-3 pe-4"
                                                        name={v.slug}
                                                        id={`${v.slug}-${i}-yes`}
                                                        onChange={(e) => {
                                                            handleSelectionChange(v.slug, "1");
                                                        }}
                                                        checked={SelectionChangeCheck(v.slug)}
                                                        value="1"
                                                    />
                                                    <Form.Check
                                                        type="radio"
                                                        label="No"
                                                        name={v.slug}
                                                        id={`${v.slug}-${i}-no`}
                                                        onChange={(e) => {
                                                            handleSelectionChange(v.slug, "0");
                                                        }}
                                                        checked={!SelectionChangeCheck(v.slug)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}
                                    </>

                                    {v.is_label && parseInt(v.value) == 1 && (
                                        <>
                                            <Col lg={2} className="mt-4" >
                                                <Form.Label>
                                                    Label Name
                                                </Form.Label>
                                            </Col>
                                            <>
                                                {v.slug === "is_level_a" && (
                                                    <Col lg={3} className="mt-4" >
                                                        <Form.Group>
                                                            <Form.Control
                                                                type="text"
                                                                autoFocus="true"
                                                                placeholder="Label Name"
                                                                className="text-box"
                                                                name={`${v.slug}-label`}
                                                                id={`${v.slug}-label`}
                                                                onChange={(e) => {
                                                                    handleLabelChange(v.slug, e.target.value)
                                                                }}
                                                                value={v.label}

                                                            />
                                                            {/* <span className="text-danger errormsg">
                                                    {errors.companyName}
                                                </span> */}
                                                        </Form.Group>
                                                    </Col>

                                                )}
                                            </>
                                            <>
                                                {v.slug === "is_level_b" && userControlData[i - 1]["value"] === "1" && userControlData[i - 1]["label"] !== "" && (
                                                    <Col lg={3} className="mt-4" >
                                                        <Form.Group>
                                                            <Form.Control
                                                                type="text"
                                                                autoFocus="true"
                                                                placeholder="Label Name"
                                                                className="text-box"
                                                                name={`${v.slug}-label`}
                                                                id={`${v.slug}-label`}
                                                                onChange={(e) => {
                                                                    handleLabelChange(v.slug, e.target.value)
                                                                }}
                                                                value={v.label}

                                                            />
                                                            {/* <span className="text-danger errormsg">
                                                    {errors.companyName}
                                                </span> */}
                                                        </Form.Group>
                                                    </Col>
                                                )}
                                            </>
                                            <>
                                                {v.slug === "is_level_c" && userControlData[i - 2]["value"] === "1" && userControlData[i - 2]["label"] !== "" && userControlData[i - 1]["value"] === "1" && userControlData[i - 1]["label"] !== "" && (
                                                    <Col lg={3} className="mt-4" >
                                                        <Form.Group>
                                                            <Form.Control
                                                                type="text"
                                                                autoFocus="true"
                                                                placeholder="Label Name"
                                                                className="text-box"
                                                                name={`${v.slug}-label`}
                                                                id={`${v.slug}-label`}
                                                                onChange={(e) => {
                                                                    handleLabelChange(v.slug, e.target.value)
                                                                }}
                                                                value={v.label}

                                                            />
                                                            {/* <span className="text-danger errormsg">
                                                    {errors.companyName}
                                                </span> */}
                                                        </Form.Group>
                                                    </Col>
                                                )}
                                            </>
                                        </>
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    );
                })


            ) : (
                <></>
            )}
        </> 

    );
}
