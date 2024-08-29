import React, { Component } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Modal,
  CloseButton,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

export default class MdlSerialNo extends Component {
  constructor(props) {
    super(props);
  }

  handleSerialNoChange = (val, inx) => {
    let { serialNoLst, productModalStateChange } = this.props;
    serialNoLst[inx]["serial_no"] = val;
    productModalStateChange({ serialNoLst: serialNoLst });
  };

  render() {
    let {
      selectSerialModal,
      productModalStateChange,
      serialNoLst,
      rowIndex,
      rows,
    } = this.props;

    return (
      <div>
        <Modal
          show={selectSerialModal}
          // size={
          //   window.matchMedia("(min-width:1360px) and (max-width:1919px)")
          //     .matches
          //     ? "lg"
          //     : "xl"
          // }
          size="sm"
          scrollable={true}
          className="tnx-pur-inv-mdl-product"
          centered
          onHide={(e) => {
            productModalStateChange({
              selectSerialModal: false,
              rowIndex: -1,
            });
          }}
        >
          {" "}
          <Modal.Header className="pl-1 pr-1 pt-0 pb-0 mdl">
            <Modal.Title
              id="example-custom-modal-styling-title"
              className="mdl-title p-2"
            >
              Serial
            </Modal.Title>

            <Badge bg="secondary">
              {serialNoLst &&
                serialNoLst.filter((v) => v.serial_no != "").length}
            </Badge>
            <FontAwesomeIcon
              className="ms-auto add_btn_style"
              icon={faPlus}
              onClick={(e) => {
                e.preventDefault();
                serialNoLst = [
                  ...serialNoLst,
                  ...Array(6)
                    .fill("")
                    .map((v) => {
                      return { serial_detail_id: 0, serial_no: v };
                    }),
                ];

                productModalStateChange({
                  serialNoLst: serialNoLst,
                });
              }}
            />
            <CloseButton
              className="pull-right ms-0"
              onClick={(e) => {
                e.preventDefault();
                productModalStateChange({ selectSerialModal: false });
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div className="vh-75 overflow-auto">
              {serialNoLst && serialNoLst.length > 0 && (
                <div className=" align-content-start flex-md-wrap ">
                  {serialNoLst.map((rv, ri) => {
                    return (
                      <div className="p-1 ">
                        <Form.Control
                          id={`serialNo-${ri}`}
                          name={`serialNo-${ri}`}
                          className=""
                          type="text"
                          placeholder="Serial No."
                          value={rv.serial_no}
                          onChange={(e) => {
                            let v = e.target.value;

                            // if (serialNoLst.includes(v)) {
                            //   alert("exist");
                            // } else {
                            this.handleSerialNoChange(v, ri);
                            // }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <Row>
              <Col md="12 p-3" className="btn_align">
                <Button
                  className="submit-btn"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    rows[rowIndex]["serialNo"] = serialNoLst;

                    let qtylst = serialNoLst.filter((v) => v.serial_no != "");
                    rows[rowIndex]["qty"] = qtylst.length;
                    rows[rowIndex]["b_no"] = "#";

                    productModalStateChange(
                      {
                        selectSerialModal: false,
                        rowIndex: -1,
                        rows: rows,
                      },
                      true
                    );
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="secondary cancel-btn ms-2"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // this.setState({ newSerialModal: false });
                    productModalStateChange({
                      selectSerialModal: false,
                      rowIndex: -1,
                    });
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
