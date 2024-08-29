import React from "react";
import {
  Button,
  Col,
  Row,
  Form,
  Table,
  InputGroup,
  Collapse,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  ShowNotification,
  AuthenticationCheck,
  eventBus,
  isActionExist,
  MyNotifications,
  LoadingComponent,
} from "@/helpers";
import search from "@/assets/images/search_icon.png";
export default class NewBranchAdminList extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
    this.ref = React.createRef();
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
          isActionExist(
            "Company",
            "edit",
            this.props.userPermissions
          )
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

  render() {
    const { data } = this.state;
    return (
      <div
        className="wrapper_div ledger-group-style"
        style={{ overflow: "hidden" }}
      >
        <div className="cust_table">
          <Row style={{ padding: "8px" }}
          >
            <Col md="">
              <InputGroup className="mb-2  mdl-text">
                <Form.Control
                  type="text"
                  name="Search"
                  id="Search"
                  placeholder="Search"
                  className="mdl-text-box"
                  autoFocus={true}
                />
                <InputGroup.Text className="int-grp" id="basic-addon1">
                  <img className="srch_box" src={search} alt="" />
                </InputGroup.Text>
              </InputGroup>
            </Col>

            <Col md="9" className="btn_align mainbtn_create">
              <div id="example-collapse-text">
                <div className="mb-2">
                  <Button
                    className="create-btn ms-2"
                    type="submit"
                    style={{ borderRadius: "6px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        isActionExist(
                          "ledger",
                          "create",
                          this.props.userPermissions
                        )
                      ) {
                        eventBus.dispatch(
                          "page_change",
                          "newBranchAdminCreate"
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
                  >
                    Create
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <div className="tbl-list-style">
            <Table size="sm" hover className="tbl-font">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th> Company Name</th>
                  <th>Branch Name</th>
                  <th>Branch Code </th>
                  <th>Registered Address</th>
                  <th>Corporate Address</th>
                </tr>
              </thead>
              <tbody className="tabletrcursor prouctTableTr"
                onKeyDown={(e) => {
                  e.preventDefault();
                  if (e.keyCode != 9) {
                    this.handleTableRow(e);
                  }
                }}>
                {data.length > 0 ? (
                  data.map((v, i) => {
                    return (
                      <tr
                        value={JSON.stringify(v)}
                        id={`ledgerTr_` + i}
                        // prId={v.id}
                        tabIndex={i}
                        onDoubleClick={(e) => {
                          if (
                            isActionExist(
                              "Company",
                              "edit",
                              this.props.userPermissions
                            )
                          ) {
                            this.setUpdateValue(v);
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
                        <td>{i + 1}</td>
                        <td>{v.companyName}</td>
                        <td>{v.fullName}</td>
                        <td>{v.companyCode}</td>
                        <td>{v.registeredAddress}</td>
                        <td>{v.corporateAddress}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
