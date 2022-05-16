import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CurrencySign from "../CurrencySign/CurrencySign";
import { AddItemToCart } from "../../actions";

const mapStateToProps = (props) => {
  return {
    currency: props.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(AddItemToCart(item)),
  };
};

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderPrice = this.renderPrice.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
    this.renderProductInfo = this.renderProductInfo.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  renderPrice() {
    let currency = this.props.product.prices.find(
      (price) => price.currency === this.props.currency
    );
    if (currency === undefined) currency = this.props.product.prices[0];
    return (
      <p>
        <CurrencySign currency={currency.currency} />
        {currency.amount}{" "}
      </p>
    );
  }

  addItem() {
    if (!this.props.product) {
      return "";
    }
    let temp = Object.assign({}, this.props.product);

    temp.selectedSize = temp.attributes[0]?.items[0];
    this.props.addItemToCart(temp);
  }

  renderProductInfo() {
    return (
      <React.Fragment>
        <img
          className="product_image"
          src={this.props.product.gallery[0]}
          alt={this.props.product.name}
        />
        <p className="product_card_title">{this.props.product.name}</p>
        <span className="product_card_price">{this.renderPrice()}</span>
      </React.Fragment>
    );
  }

  renderProduct() {
    return (
      <div id="product" className="product_card">
        <img
          onClick={this.props.product.inStock ? this.addItem : () => {}}
          style={
            this.props.product.inStock ? { opacity: "1" } : { opacity: "0" }
          }
          className="product_cart_icon"
          src={process.env.PUBLIC_URL + "/img/cart.png"}
          alt=""
        />
        {this.props.product.inStock ? (
          <Link to={`/product/${this.props.product.id}`}>
            {this.renderProductInfo()}
          </Link>
        ) : (
          <Link to={`/product/${this.props.product.id}`}>
            <div className="inStock_box">
              <p className="inStock">OUT OF STOCK</p>
              {this.renderProductInfo()}
            </div>
          </Link>
        )}
      </div>
    );
  }

  render() {
    return this.renderProduct();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
