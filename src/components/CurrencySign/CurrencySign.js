import React, { Component } from "react";

class CurrencySign extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getCurrencySign = this.getCurrencySign.bind(this);
  }

  componentDidMount() {
    this.getCurrencySign();
  }

  getCurrencySign() {
    switch (this.props.currency) {
      case "USD":
      case "AUD":
        return "$";
      case "JPY":
        return "¥";
      case "GBP":
        return "£";
      case "RUB":
        return "₽";
      default:
        return "$";
    }
  }

  render() {
    return <React.Fragment>{this.getCurrencySign()}</React.Fragment>;
  }
}

export default CurrencySign;
