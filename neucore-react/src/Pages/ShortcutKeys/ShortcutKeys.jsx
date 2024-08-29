import React, { Component } from 'react'
import { eventBus } from '@/helpers'

export class ShortcutKeys extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // OpenLedgerList = (e) => {
  //   eventBus.dispatch("page_change", "ledgerlist");
  // };
  // handleKeyPress = (event) => {
  //   console.log("event", event)
  //   if (event.ctrlKey && (event.key === "l")) {
  //     event.preventDefault();
  //     this.OpenLedgerList()
  //   }
  // }

  // componentDidMount() {
  //   window.addEventListener("keydown", this.handleKeyPress);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("keydown", this.handleKeyPress);
  // }

  render() {
    return (
      <div></div>
    )
  }
}

export default ShortcutKeys