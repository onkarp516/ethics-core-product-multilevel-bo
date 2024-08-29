import React, { useRef, Component } from "react";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";
import { Row, Col } from "react-bootstrap";

class BarcodeDesign extends Component {
  render() {
    return (
      <>
        {/* <div className="d-flex" style={{ width: "398px" }}>
                <h5>₹ 15.00</h5>
                <h5 className="my-auto ms-auto">107815</h5>
              </div> */}
        {/* <div style={{ width: "398px" }}>
              </div> */}
        <div style={{ marginLeft: "40px", marginTop: "11px", width: "125px" }}>
          <p
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "0px",
              fontWeight: "bold",
              padding: "0px 0px 0px 0px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                lineHeight: "10px",
                margin: "0px",
                fontWeight: "bold",
                padding: "0px 0px 0px 0px",
              }}
            >
              ₹15.00
            </p>
            <p
              style={{
                fontSize: "10px",
                lineHeight: "10px",
                margin: "0px",
                fontWeight: "bold",
                textAlign: "end",
                padding: "0px 0px 0px 0px",
              }}
            >
              12345678
            </p>
          </p>
          <p
            style={{
              fontSize: "9px",
              lineHeight: "10px",
              margin: "0px",
              fontWeight: "bold",
              padding: "0px 0px 0px 0px",
            }}
          >
            product Name
          </p>
          <Barcode
            value="abcd240823"
            width={1}
            fontSize={12}
            // textAlign="start"
            height={10}
            format="CODE128"
            margin={0}
            // marginLeft={60}
            // marginTop={60}
          />
        </div>
      </>
    );
  }
}
const Example = () => {
  const componentRef = useRef();
  return (
    <div>
      <ReactToPrint
        trigger={() => <button className="btn btn-primary">Print!</button>}
        content={() => componentRef.current}
      />
      <BarcodeDesign ref={componentRef} />
    </div>
  );
};
export default Example;
