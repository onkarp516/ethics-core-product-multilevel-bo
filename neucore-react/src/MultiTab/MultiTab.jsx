import React from "react";
import { Tabs, Tab } from "./index";
import Page1 from "@/Pages/Page1";
import Login from "@/Pages/Login/Login";
import { v4 as uuidv4 } from "uuid";
import { MyNotifications, multitabdata, convertToSlug } from "@/helpers";
export default class MultiTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "untitled",
      icon: "*",
      selectedTab: "multitab0",
      tabs: [],
      currentImageIndex: 0,
      prevclosedTab: "",
    };
  }
  next = () => {
    this.setState((state) => {
      return {
        currentImageIndex: state.currentImageIndex + 1,
      };
    });
  };

  prev = () => {
    this.setState((state) => {
      return {
        currentImageIndex: state.currentImageIndex - 1,
      };
    });
  };
  pageChange = (args) => {
    // console.log("arg", args);
    // console.log("props", this.props);
    this.props.history.push("/" + args);
  };

  componentDidMount() {
    // console.log('this.props', this.props);
    this.setState({
      tabs: [
        <Tab
          key={"multitab0"}
          unclosable={true}
          title={"Login"}
          disableDrag={true}
        >
          <Login {...this.props} />
        </Tab>,
      ],
    });
    // window.electron.ipcRenderer.on('page-change', (arg) => {
    //   // eslint-disable-next-line no-console
    //   // console.log('page-change==>', arg);
    //   this.pageChange(arg);
    // });
  }

  handleTabsProp = (props) => {
    let { tabs, selectedTab } = this.state;
    let { selectedPageSlug, data, isCancel } = props;
    // let { selectedPageSlug: prevselectedPageSlug } = this.props;
    // console.log("prevselectedPageSlug", prevselectedPageSlug);
    // console.log("selectedPageSlug", selectedPageSlug);
    let finalTabs = [...tabs];
    let nfinalTabs = tabs;
    // tranx_purchase_invoice_list
    // console.log({ tabs, selectedTab, selectedPageSlug, data, isCancel });

    let isExist = false;
    let findslug = "";

    // let obj = data.find((vi) => vi?.cmpslug == convertToSlug(selectedTab));
    let obj = data.find((vi) => vi?.cmpslug == selectedPageSlug);
    if (obj) {
      tabs.map((v) => {
        if (obj?.cmpsluglst?.includes(convertToSlug(v.props.title))) {
          // console.log("tabs Title", convertToSlug(v.props.title));
          isExist = true;
          findslug = v.props.title;
        }
      });
    }
    if (!isCancel && isExist) {
      // console.log("already tab is opened", findslug);
      MyNotifications.fire({
        show: true,
        icon: "confirm",
        title: "confirm",
        msg: `"${findslug} is already opened do you want to discard it?"`,
        // is_button_show: true,
        handleSuccessFn: () => {
          let nfinalTabs = finalTabs.filter((v) => v.key != selectedPageSlug);
          if (nfinalTabs.length < 8) {
            this.setActualTabValue(nfinalTabs, props);
          } else {
            MyNotifications.fire({
              show: true,
              icon: "warning",
              title: "Warning",
              msg: "Please Check the tabs opened",
              is_button_show: true,
              is_timeout: true,
              delay: 1500,
              handleSuccessFn: () => {},
              handleFailFn: () => {},
            });
          }
        },
        handleFailFn: () => {
          // let nfinalTabs = finalTabs.filter((v) => v.key != selectedPageSlug);
          // this.setActualTabValue(finalTabs, props);
        },
      });
    } else {
      if (props.isNewTab != true) {
        // ! Final Tabs
        // finalTabs = tabs.filter(
        //   (v) => v.key.toLowerCase() != selectedTab.toLowerCase()
        // );
        // ! Final Tabs OLD
        finalTabs = tabs.filter((v) => v.key != selectedTab);
      }

      if (selectedTab === "multitab0") {
        finalTabs = tabs.filter((v) => v.key != selectedTab);
      }
      // let isExistList = finalTabs.filter((v) => v.key == selectedPageSlug);
      // console.log("isExistList", isExistList);
      // if (isExistList.length > 0) {
      //   MyNotifications.fire({
      //     show: true,
      //     icon: "confirm",
      //     title: "confirm",
      //     msg: "Tabs is already opened do you want to redirect?",
      //     // is_button_show: true,
      //     handleSuccessFn: () => {
      //       let nfinalTabs = finalTabs.filter((v) => v.key != selectedPageSlug);
      //       this.setActualTabValue(nfinalTabs, props);
      //     },
      //     handleFailFn: () => {
      //       // let nfinalTabs = finalTabs.filter((v) => v.key != selectedPageSlug);
      //       this.setActualTabValue(finalTabs, props);
      //     },
      //   });
      // } else {
      //   this.setActualTabValue(finalTabs, props);
      // }

      nfinalTabs = finalTabs.filter((v) => v.key != selectedPageSlug);
      if (nfinalTabs.length < 8) {
        this.setActualTabValue(nfinalTabs, props);
      } else {
        // MyNotifications.fire({
        //   show: true,
        //   icon: "warning",
        //   title: "Warning",
        //   msg: "",
        //   is_timeout: true,
        //   delay: 1500,
        // });
        MyNotifications.fire({
          show: true,
          icon: "warning",
          title: "Warning",
          msg: "Please Check the tabs opened",
          is_button_show: true,
          is_timeout: true,
          delay: 1500,
          handleSuccessFn: () => {},
          handleFailFn: () => {},
        });
      }
    }
  };

  handleTabsPropOrg = (props) => {
    // console.log("handleTabsProp props", props);
    let { tabs, selectedTab } = this.state;

    // let { images } = this.props;
    // let { currentImageIndex } = this.state;

    // let findtabs = tabs.find((v) => v.key == selectedTab);
    let finalTabs = tabs;
    if (props.isNewTab != true) {
      finalTabs = tabs.filter((v) => v.key != selectedTab);
    }

    let tabkey = props.isNewTab == true ? uuidv4() : selectedTab;

    let newTab = (
      <Tab key={tabkey} title={props.title}>
        {props.children}
      </Tab>
    );
    let newTabs = finalTabs ? finalTabs.concat([newTab]) : [newTab];
    // console.log("selectedTab", selectedTab);
    if (selectedTab === "multitab0") {
      newTabs = [newTab];
    }
    this.setState({
      tabs: newTabs,
      selectedTab: tabkey,
    });
  };
  setActualTabValue = (finalTabs, props) => {
    let { selectedTab } = this.state;
    let { selectedPageSlug } = props;
    // let nfinalTabs = finalTabs.filter((v) => v.key != selectedPageSlug);
    // console.log("nfinalTabs", nfinalTabs);
    let nfinalTabs = finalTabs;
    let tabkey = props.isNewTab == true ? selectedPageSlug : selectedTab;
    // console.log("props=->", props.children);
    let newTab = (
      <Tab key={tabkey} title={props.title}>
        {/* {props.children.map((v) =>selectedPageSlug
          v ? React.cloneElement(v, { isRefresh: true }) : ""
        )} */}

        {/* {props.children
          ? React.cloneElement(props.children, { isRefresh: true })
          : ""} */}
        {props.children}
      </Tab>
    );
    // console.log("Tabs length =-> ", finalTabs.length);
    // console.log("selectedTab", selectedTab);
    let newTabs = finalTabs
      ? nfinalTabs.length == 0
        ? finalTabs.concat([newTab])
        : nfinalTabs.concat([newTab])
      : [newTab];
    // console.log("newTabs length =-> ", newTabs.length);
    if (selectedTab === "multitab0") {
      newTabs = [newTab];
    }
    if (newTab.length > 7) {
      this.setState(
        {
          tabs: newTabs,
          selectedTab: tabkey,
        },
        () => {
          // console.log(
          //   "8 8 8 8 After set selectedTab =-> ",
          //   this.state.selectedTab
          // );
        }
      );
    } else {
      this.setState(
        {
          tabs: newTabs,
          selectedTab: tabkey,
        },
        () => {
          // console.log("After set tabs =-> ", this.state.tabs);
        }
      );
    }
  };

  handleVerifyTabs = () => {
    let { tabs } = this.state;
    if (tabs.length > 1) {
      // MyNotifications.fire({
      //   show: true,
      //   icon: "warning",
      //   title: "Warning",
      //   msg: "Please close the tabs?",
      //   is_timeout: true,
      //   delay: 1500,
      // });
      MyNotifications.fire({
        show: true,
        icon: "confirm",
        title: "Confirm",
        msg: "Please close the tabs?",
        is_button_show: false,
        is_timeout: false,
        delay: 1500,
        handleSuccessFn: () => {},
        handleFailFn: () => {},
      });
      this.props.setDynamicComponentsStates({ isVerify: false });
    } else {
      this.props.handleLogoutAfterVerifyTabs();
    }
  };

  componentWillReceiveProps(props) {
    // console.log("componentWillReceiveProps props=>", props);
    if (props.isVerify == true) {
      this.handleVerifyTabs();
    } else if (
      props.selectedPageSlug != this.props.selectedPageSlug ||
      this.state.prevclosedTab == this.props.selectedPageSlug
    ) {
      this.handleTabsProp(props);
    }
  }

  handleChangeTitle() {
    // console.info(this.state.title);
    this.setState({ title: "something!!!" }, function () {
      console.info(this.state.title);
    });
  }

  handleTabSelect(e, key, currentTabs) {
    // console.log('handleTabSelect key:', key);
    this.setState({ selectedTab: key, tabs: currentTabs });
  }

  handleTabClose(e, key, currentTabs) {
    e.preventDefault();
    // console.log("tabClosed key:", e, key, currentTabs);
    this.setState({ tabs: currentTabs, prevclosedTab: key });
  }

  handleTabPositionChange(e, key, currentTabs) {
    // console.log("tabPositionChanged key:", e, key);
    this.setState({ tabs: currentTabs });
  }
  shouldTabClose(e, key) {
    // console.log("should tab close=-> ", e, key);
    // if (this.state.tabs.length > 1) {
    //   return window.confirm('Are your sure to close?');
    // } else {
    //   return;
    // }
    // console.log(":tabs", this.state.tabs);
    // return this.state.tabs.length > 1
    //   ? window.confirm("Are your sure to close?")
    //   : false;

    return this.state.tabs.length > 1
      ? MyNotifications.fire(
          {
            show: true,
            icon: "confirm",
            title: "Confirm",
            msg: "Do you want to close",
            is_button_show: false,
            is_timeout: false,
            delay: 0,
            handleSuccessFn: () => {
              let currentTabs = this.state.tabs.filter((v) => v.key != key);
              // console.log("currentTabs", currentTabs);
              this.handleTabClose(e, key, currentTabs);
              // console.log(
              //   "key=-> ",
              //   currentTabs[currentTabs.length - 1]["key"]
              // );
              this.handleTabSelect(
                e,
                currentTabs[currentTabs.length - 1]["key"],
                currentTabs
              );
            },
            handleFailFn: () => {},
          },
          () => {}
        )
      : false;
  }

  handleTabAddButtonClick(e, currentTabs) {
    // key must be unique
    let { tabs, selectedTab } = this.state;
    const key = "newTab_" + Date.now();
    let newTab;
    if (selectedTab != undefined) {
      let findtabs = tabs.find((v) => v.key == selectedTab);
      newTab = (
        <Tab key={key} title={findtabs.props.title}>
          {findtabs.props.children}
        </Tab>
      );
    } else {
      newTab = (
        <Tab key={key} title={"Login"}>
          <Login {...this.props} />
        </Tab>
      );
    }

    let newTabs = currentTabs.concat([newTab]);

    this.setState({
      tabs: newTabs,
      selectedTab: key,
    });
  }

  render() {
    return (
      <div>
        {/* <Tabs
          selectedTab={this.state.selectedTab ? this.state.selectedTab : 'tab2'}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          shouldTabClose={this.shouldTabClose.bind(this)}
          tabs={this.state.tabs}
          shortCutKeys={{
            close: ['alt+command+w', 'ctrl+q'],
            create: ['alt+command+t', 'ctrl+n'],
            moveRight: ['alt+command+tab', 'ctrl+left'],
            moveLeft: ['shift+alt+command+tab', 'ctrl+right'],
          }}
        /> */}
        <Tabs
          selectedTab={this.state.selectedTab ? this.state.selectedTab : "tab2"}
          onTabSelect={this.handleTabSelect.bind(this)}
          onTabClose={this.handleTabClose.bind(this)}
          // onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
          onTabPositionChange={this.handleTabPositionChange.bind(this)}
          shouldTabClose={this.shouldTabClose.bind(this)}
          tabs={this.state.tabs}
          shortCutKeys={{
            close: ["alt+command+w", "ctrl+q"],
            // create: ["alt+command+t", "ctrl+n"],
            moveRight: ["alt+command+tab", "ctrl+left"],
            moveLeft: ["shift+alt+command+tab", "ctrl+tab"],
          }}
          keepSelectedTab={true}
        />
      </div>
    );
  }
}
