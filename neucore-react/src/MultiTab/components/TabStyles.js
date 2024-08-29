/* Inspired from Atom
  https://github.com/atom/tabs
  https://github.com/atom/atom-dark-ui
*/

const TabStyles = {
  tabWrapper: {
    height: "100%",
    width: "100%",
    position: "relative",
  },

  tabBar: {
    // @TODO safari needs prefix. Style should be define in CSS.
    // Can't use duprecated key's for inline-style.
    // See https://github.com/facebook/react/issues/2020
    // display: '-webkit-flex',
    // display: '-ms-flexbox',
    display: "flex",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    margin: 0,
    listStyle: "none",
    outline: "0px",
    overflowY: "hidden",
    overflowX: "hidden",
    minWidth: "100%",
    maxWidth: "100%",
    paddingRight: "35px",
    borderTop: "1px solid transparent",
    paddingLeft: "0",
    background: "#0a223f",
    borderBottom: "1px solid #D9F0FB",
    // marginLeft: '-32px',
    // overflowX: 'scroll',
    // overflowY: 'hidden',
  },
  /* width */
  // tabBar::{-webkit-scrollbar}{
  //   width: '2px',
  // },

  // tabBar::{-webkit-scrollbar-track} :{
  //   background: '#f1f1f1',
  // },

  // /* Handle */
  // tabBar::{-webkit-scrollbar-thumb}: {
  //   background: '#888',
  // },

  // /* Handle on hover */
  // tabBar::{-webkit-scrollbar-thumb}:hover: {
  //   background: '#555',
  // },
  tabBarAfter: {
    content: "",
    position: "absolute",
    top: "26px",
    height: "2px",
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "var(--main-color)",
    borderBottom: "1px solid #1e3989",
    pointerEvents: "none",
  },

  tab: {
    fontFamily: "'heebo', sans-sari",
    // backgroundImage: "linear-gradient(#7192aa, #7192aa)",
    // background: "#C2CEDF",
    background: "#0a223f",
    // background: "#0170d3",
    // backgroundImage: 'linear-gradient(#454545, #333333)',
    height: "36px",
    fontSize: "14px",
    position: "relative",
    marginLeft: "5px",
    // marginLeft: "14px",
    // paddingLeft: "11px",
    // paddingRight: "24px",

    paddingLeft: "15px",
    paddingTop: "7px",
    paddingRight: "30px",
    marginRight: "10px",
    // marginTop: "5px",
    WebkutBoxFlex: 1,
    // WebkitFlex: 1,
    // MozFlex: 1,
    // msFlex: 1,
    // flex: 1,
    display: "inline-block",
    // maxWidth: '175px',
    minWidth: "0px",
    fontWeight: "100",
    transform: "translate(0px, 0px)",
    // borderTop: '1px solid #d8d7d7',
    cursor: "pointer",
    // borderTopRightRadius: "8px",
    // borderTopLeftRadius: "8px",
  },

  tabBefore: {
    cursor: "pointer",
    content: "",
    position: "absolute",
    top: "0px",
    width: "10px",
    height: "36px",
    // borderRadius: "4px",

    left: "-14px",
    // borderTopLeftRadius: "8px",
    // boxShadow: 'inset 1px 1px 0 #484848, -4px 0px 4px rgba(0, 0, 0, 0.1)',
    // WebkitTransform: 'skewX(-30deg)',
    // MozTransform: 'skewX(-30deg)',
    // msTransform: 'skewX(-30deg)',
    // transform: 'skewX(-30deg)',
    // backgroundImage: "linear-gradient(#7192aa, #7192aa)",
    // background: "#C2CEDF",
    background: "#0a223f",
    // background: "#0170d3",
    // backgroundImage: 'linear-gradient(#454545, #333333)',
    // borderRadius: '7.5px 0 0 0',
    // borderLeft: "1px solid #d8d7d7",
    marginLeft: "10px",
  },

  tabAfter: {
    cursor: "pointer",
    content: "",
    position: "absolute",
    top: "0px",
    width: "25px",
    height: "36px",
    right: "-25px",
    // borderRadius: "4px",

    // right: "-17px",
    // borderTopRightRadius: "8px",
    // boxShadow: 'inset -1px 1px 0 #484848, 4px 0px 4px rgba(0, 0, 0, 0.1)',
    // WebkitTransform: 'skewX(30deg)',
    // MozTransform: 'skewX(30deg)',
    // msTransform: 'skewX(30deg)',
    // transform: 'skewX(30deg)', 0170d3
    // backgroundImage: "linear-gradient(#7192aa, #7192aa)",
    // background: "#C2CEDF",
    background: "#0a223f",

    // background: "#0170d3",
    // backgroundImage: 'linear-gradient(#454545, #333333)',
    // borderRadius: '0 7.5px 0 0',
    // borderRight: "1px solid #d8d7d7",
    marginRight: "16px",
  },
  // tabAfterOnHover{
  //   background:'red',
  // }
  tabTitle: {
    // cursor: "default",
    cursor: "pointer",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginTop: "0px",
    float: "left",
    textAlign: "left",
    postion: "relative",
    // width: '90%',
    // color: "#ffffff",
    // color: "#000000",
    // opacity: 0.5,
    // fontWeight: "600",
    // fontSize: "15px",
    // fontFamily: "'heebo', sans-sari",
    // color: 'rgb(170, 170, 170)',

    fontFamily: "Inter",
    // fontStyle: "normal",
    fontWeight: "400",
    fontSize: "15px",
    lineHeight: "18px",
    // display: flex;
    alignItems: "center",
    letterSpacing: "-0.02em",

    color: "#FFFFFF",
  },

  tabActive: {
    // WebkutBoxFlex: 2,
    // WebkitFlex: 2,
    // MozFlex: 2,
    // msFlex: 2,
    // flex: 2,
    marginLeft: "6px",
    display: "inline-block",
    zIndex: 1,
    color: "#1e3989",
    background: "#D9F0FB",
    fontWeight: "400",
    fontSize: "13px",
    // backgroundImage: "linear-gradient(#f5f5f5, #f5f5f5)",
    // background: "white",
    borderTop: "2px solid #00A0F5",
    // backgroundColor: "aqua",
  },

  tabBeforeActive: {
    // // backgroundImage: "linear-gradient(#f5f5f5, #f5f5f5)",
    // background: "white",
    borderLeft: "2px solid #00A0F5",
    borderTop: "2px solid #00A0F5",
    background: "#D9F0FB",
    top: "-2px",
  },

  tabAfterActive: {
    // // backgroundImage: "linear-gradient(#f5f5f5, #f5f5f5)",
    // background: "white",
    borderRight: "2px solid #00A0F5",
    borderTop: "2px solid #00A0F5",
    background: "#D9F0FB",
    top: "-2px",
    // background: "#b3c8ff",
  },

  tabTitleActive: {
    lineHeight: "1.5em",
    color: "#4c5866",
    // borderBottom: "4px solid red",
    // color: "#1e3989",
    marginTop: "0px",
    fontWeight: "400",
    // backgroundColor: "aqua",
  },

  tabOnHover: {
    // backgroundColor: "black",
    // backgroundImage: "linear-gradient(#97C9F5, #97C9F5)",
    background: "#0E3151",
  },

  tabBeforeOnHover: {
    // backgroundImage: "linear-gradient(#97C9F5, #97C9F5)",
    background: "#0E3151",
  },

  tabAfterOnHover: {
    // backgroundImage: "linear-gradient(#97C9F5, #97C9F5)",
    background: "#0E3151",
  },

  tabTitleOnHover: {
    filter: "alpha(opacity=20)",
    // color: "black",
  },

  tabCloseIcon: {
    position: "absolute",
    cursor: "pointer",
    fontFamily: "'heebo', sans-sari",
    fontSize: "20px",
    // font: "18px arial, sans-serif",
    right: "3px",
    marginTop: "2px",
    textDecoration: "none",
    textShadow: "rgb(255, 255, 255) 0px 1px 0px",
    lineHeight: "1em",
    filter: "alpha(opacity=20)",
    opacity: "10px",
    width: "20px",
    height: "20px",
    textAlign: "center",
    WebkitBorderRadius: "8px",
    MozBorderRadius: "8px",
    // borderRadius: "8px",
    zIndex: 999,
    color: "#6C787D",
  },

  tabCloseIconOnHover: {
    filter: "none",
    // backgroundColor: "red",
    // border: "1px solid red",
    color: "#6C787D",
  },

  tabAddButton: {
    cursor: "pointer",
    fontFamily: "'heebo', sans-sari",
    fontSize: "20px",
    textShadow: "rgb(255, 255, 255) 0px 1px 0px",
    position: "relative",
    width: "5px",
    height: "20px",
    marginLeft: "20px",
    marginTop: "10px",
    zIndex: 2,
    lineHeight: "18px",
    fontWeight: "100",
  },

  beforeTitle: {
    position: "absolute",
    top: "8px",
    left: "-8px",
    zIndex: 2,
  },

  afterTitle: {
    position: "absolute",
    top: "8px",
    right: "16px",
    zIndex: 2,
  },
};

export default TabStyles;
