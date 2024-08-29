import React, { Component } from "react";
import { Modal, CloseButton, Button } from "react-bootstrap";
import success_icon from "@/assets/images/alert/1x/success_icon.png";
import warning_icon from "@/assets/images/alert/1x/warning_icon.png";
import error_icon from "@/assets/images/alert/1x/error_icon.png";
import confirm_icon from "@/assets/images/alert/question_icon.png";
import { eventBus } from "@/helpers";

class ConfirmNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      icon: "success",
      title: "Success",
      msg: "Successfully",
      is_button_show: false,
      is_timeout: false,
      delay: 100,
    };
    this.handleFire = this.handleFire.bind(this);
  }

  handleHide = () => {
    this.setState({ show: false });
  };

  handleFire = ({
    show,
    icon = "success",
    title = "Success",
    msg = "Successfully",
    is_button_show = false,
    is_timeout = false,
    delay = 0,
  }) => {
    this.setState({ show: show, icon: icon, title, msg, is_button_show });
    if (is_timeout == true) {
      setTimeout(() => {
        this.handleHide();
      }, delay);
    }
  };

  static fire({
    show,
    icon = "success",
    title = "Success",
    msg = "Successfully",
    is_button_show = false,
    is_timeout = false,
    delay = 0,
  }) {
    eventBus.dispatch("mynotification", {
      show,
      icon,
      title,
      msg,
      is_button_show,
      is_timeout,
      delay,
    });
  }

  handleImage = () => {
    let { icon } = this.state;
    switch (icon) {
      case "success":
        return <img alt="" src={success_icon} />;
        break;
      case "warning":
        return <img alt="" src={warning_icon} />;
        break;
      case "error":
        return <img alt="" src={error_icon} />;
        break;
      case "confirm":
        return <img alt="" src={confirm_icon} />;
        break;
      default:
        return <img alt="" src={success_icon} />;
        break;
    }
  };

  componentDidMount() {
    eventBus.on("mynotification", this.handleFire);
  }

  componentWillUnmount() {
    eventBus.remove("mynotification");
  }

  render() {
    let { show, icon, title, msg, is_button_show } = this.state;
    return (
      <div>
        {" "}
        <Modal
          show={show}
          size="md"
          className={`${icon}-alert`}
          onHide={() => {
            this.setState({ show: false });
          }}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <CloseButton
              variant="black"
              className="pull-right"
              onClick={(e) => {
                e.preventDefault();
                this.handleHide();
              }}
            />
          </Modal.Header>
          <Modal.Body className="text-center">
            {this.handleImage()}
            <p className="title">{title}</p>
            <p className="msg">{msg}</p>
            {is_button_show == true && (
              <Button
                className="sub-button"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  this.handleHide();
                }}
              >
                Ok
              </Button>
            )}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export { MyNotifications };
