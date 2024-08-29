<div className="d-bg i-bg" style={{ height: "auto" }}>
  <div className="institute-head pt-1 pl-2 pr-2 pb-1">
    <Row>
      <Col md="12">
        <div className="supplie-det">
          <ul>
            <li>
              <Form.Group as={Row}>
                <Form.Label column sm="5" className="pt-0">
                  <h6>Journal Sr. #.</h6>:{" "}
                  <span className="pt-1 pl-1 req_validation">*</span>
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    style={{
                      textAlign: "left",
                      paddingRight: "10px",
                      background: "#f5f5f5",
                    }}
                    type="text"
                    name="voucher_journal_sr_no"
                    id="voucher_journal_sr_no"
                    disabled
                    placeholder="Jour1234"
                    className="mb-0 mt-2"
                    value={values.voucher_journal_sr_no}
                  />
                </Col>
              </Form.Group>
            </li>
            <li>
              {/* <h6>Voucher Sr. #.</h6>:{' '} */}
              {/* <span>
              {invoice_data
                ? invoice_data.purchase_sr_no
                : ''}
            </span> */}
              <Form.Group as={Row}>
                <Form.Label column sm="5" className="pt-0">
                  <h6>Journal #.</h6>:{" "}
                  <span className="pt-1 pl-1 req_validation">*</span>
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    style={{
                      textAlign: "left",
                      paddingRight: "10px",
                      background: "#f5f5f5",
                      // /readonly,
                    }}
                    type="text"
                    disabled
                    placeholder="1234"
                    className="mb-0 mt-1"
                    value={values.voucher_journal_no}
                  />
                </Col>
              </Form.Group>
            </li>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <li>
              <Form.Group as={Row}>
                <Form.Label column sm="6" className="pt-0">
                  <b>Transaction Date : </b>
                  <span className="pt-1 pl-1 req_validation">*</span>
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="date"
                    className="mt-2"
                    name="transaction_dt"
                    id="transaction_dt"
                    onChange={handleChange}
                    value={values.transaction_dt}
                    isValid={touched.transaction_dt && !errors.transaction_dt}
                    isInvalid={!!errors.transaction_dt}
                    readOnly={true}
                  />
                </Col>
              </Form.Group>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  </div>
  {/* right side menu start */}
  {/* right side menu end */}
  <div className="institutetbl p-2">
    <Table size="sm" className="key purchacetbl mb-0" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th style={{ width: "5%" }}>Type</th>
          <th style={{ textAlign: "left" }}>Particulars</th>
          <th style={{ width: "13%", textAlign: "right" }}>Debit &nbsp;</th>
          <th style={{ width: "57%", textAlign: "right" }} className="pl-4">
            Credit &nbsp;
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 &&
          rows.map((vi, ii) => {
            return (
              <tr className="entryrow">
                <td>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      if (e.target.value != "") {
                        this.handleChangeArrayElement(
                          "type",
                          e.target.value,
                          ii
                        );
                      } else {
                        this.handleClear(ii);
                      }
                    }}
                    value={this.setElementValue("type", ii)}
                    placeholder="select type"
                  >
                    {ii == 0 ? (
                      <option selected value="dr">
                        Dr
                      </option>
                    ) : (
                      <>
                        <option value=""></option>
                        <option value="dr">Dr</option>
                      </>
                    )}
                    <option value="cr">Cr</option>
                  </Form.Control>
                </td>
                <td
                  style={{
                    width: "75%",
                    background: "#f5f5f5",
                  }}
                >
                  <Select
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    placeholder=""
                    styles={customStyles1}
                    isClearable
                    options={ledgersLst}
                    theme={(theme) => ({
                      ...theme,
                      height: "26px",
                      borderRadius: "5px",
                    })}
                    onChange={(v) => {
                      if (v != null) {
                        this.handleChangeArrayElement("perticulars", v, ii);
                      } else {
                        this.handleClear(ii);
                      }
                    }}
                    value={this.setElementValue("perticulars", ii)}
                  />
                </td>

                <td>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      let v = e.target.value;
                      this.handleChangeArrayElement("debit", v, ii);
                    }}
                    style={{ textAlign: "right" }}
                    value={this.setElementValue("debit", ii)}
                    readOnly={
                      this.setElementValue("type", ii) == "dr" ? false : true
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      let v = e.target.value;
                      this.handleChangeArrayElement("credit", v, ii);
                    }}
                    style={{ textAlign: "right" }}
                    value={this.setElementValue("credit", ii)}
                    readOnly={
                      this.setElementValue("type", ii) == "cr" ? false : true
                    }
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
      <tbody
        style={{
          background: "linear-gradient(44deg, #f1e8e8, #f5f3f3)",
        }}
      >
        <tr>
          <td></td>
          <td
            style={{
              textAlign: "right",
              paddingRight: "10px",
            }}
          >
            TOTAL
          </td>
          <td
            style={{
              textAlign: "right",
              paddingRight: "10px",
            }}
          >
            {this.getTotalDebitAmt()}
          </td>
          <td
            style={{
              textAlign: "right",
              paddingRight: "10px",
            }}
          >
            {this.getTotalCreditAmt()}
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
  <div className="summery p-2">
    <Row>
      <Col md="4">
        <div className="summerytag narrationdiv">
          <fieldset>
            <legend>Narration</legend>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={7}
                cols={25}
                name="narration"
                onChange={handleChange}
                style={{ width: "100%" }}
                className="purchace-text"
                value={values.narration}
                //placeholder="Narration"
              />
            </Form.Group>
          </fieldset>
        </div>
      </Col>
      <Col md="6"></Col>
      <Col md="2">
        <ButtonGroup
          className="pull-right submitbtn pt-5 mt-5"
          aria-label="Basic example"
        >
          {/* <Button variant="secondary">Draft</Button> */}
          <Button className="mt-4" variant="secondary" type="submit">
            Submit
          </Button>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              eventBus.dispatch("page_change", {
                from: "voucher_journal",
                to: "voucher_journal_list",
                isNewTab: false,
              });
            }}
            className="mt-4"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
    <Row>
      <Col md="9"></Col>
    </Row>
  </div>
</div>;
