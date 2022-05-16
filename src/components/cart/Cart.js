import React, { Component } from "react";
import { connect } from "react-redux";
import CurrencySign from "../CurrencySign/CurrencySign";
import {
  AddItemToCart,
  CartSwitcherAction,
  CurrencySwitcherAction,
  RemoveItemFromCart,
  ResizeItemFromCart,
} from "../../actions";
import { Link } from "react-router-dom";
import "./Cart.css";

const mapStateToProps = (props) => {
  return {
    currency: props.currency,
    cart: props.cartStore,
    cartSwitcherReducer: props.cartSwitcherReducer,
    currencySwitcherState: props.currencySwitcherReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(AddItemToCart(item)),
    removeItemFromCart: (item) => dispatch(RemoveItemFromCart(item)),
    resizeItemFromCart: (item, newSize) =>
      dispatch(ResizeItemFromCart(item, newSize)),
    cartSwitcherAction: () => dispatch(CartSwitcherAction()),
    currencySwitcherAction: () => dispatch(CurrencySwitcherAction()),
  };
};

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      inMouseOver: false,
    };
    this.renderCartContent = this.renderCartContent.bind(this);
    this.setActiveContextMenu = this.setActiveContextMenu.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.getTotal = this.getTotal.bind(this);
    this.selectedSize = this.selectedSize.bind(this);
    this.setMouseOver = this.setMouseOver.bind(this);
    this.hideActiveContextMenu = this.hideActiveContextMenu.bind(this);
    this.renderProductCartPrice = this.renderProductCartPrice.bind(this);
    this.renderProductCounterButton =
      this.renderProductCounterButton.bind(this);
    this.renderTotalProductsPrice = this.renderTotalProductsPrice.bind(this);
    this.renderBagCheckoutButtons = this.renderBagCheckoutButtons.bind(this);
    this.renderProductBox = this.renderProductBox.bind(this);
    this.renderBagCheckoutButtons = this.renderBagCheckoutButtons.bind(this);
    this.renderCartItems = this.renderCartItems.bind(this);
  }

  addItem(product) {
    this.props.addItemToCart(product);
    this.forceUpdate();
  }

  removeItem(product) {
    this.props.removeItemFromCart(product);
    this.forceUpdate();
  }

  getTotal() {
    let total = 0;
    Object.keys(this.props.cart.items).filter((key) => {
      let product = this.props.cart.items[key];
      let price = product.prices.find(
        (price) => price.currency === this.props.currency
      );
      total += price.amount * product.counter;
      return total;
    });
    return total.toFixed(2);
  }

  selectedSize(product, newSize) {
    this.props.resizeItemFromCart(product, newSize);
    this.forceUpdate();
  }

  setMouseOver() {
    this.setState((state) => ({
      inMouseOver: !state.inMouseOver,
    }));
  }

  hideActiveContextMenu() {
    if (!this.state.inMouseOver) {
      this.setState({
        active: false,
      });
    }
  }

  setActiveContextMenu(event) {
    event.stopPropagation();
    this.props.cartSwitcherAction();
    if (this.props.currencySwitcherState) {
      this.props.currencySwitcherAction();
    }
  }

  renderProductCartPrice(product) {
    return (
      <p className="product_cart_price">
        {product.prices.map((price) => {
          if (price.currency === this.props.currency) {
            return (
              <React.Fragment key={price.currency}>
                <CurrencySign currency={price.currency} />
                {price.amount}
              </React.Fragment>
            );
          }
          return "";
        })}
      </p>
    );
  }

  renderProductSizesButtons(product) {
    return (
      <div className="size_section ">
        {product.attributes[0]?.items[0].value.includes("#")
          ? product.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSize(product, size)}
                key={size.id}
                style={{ backgroundColor: size.value }}
                className={
                  "color_button " +
                  (product.selectedSize.value === size.value
                    ? "active_color_size"
                    : "")
                }
              />
            )) // Else
          : product.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSize(product, size)}
                key={size.id}
                className={
                  "size_button " +
                  (product.selectedSize.value === size.value
                    ? "active_button_size"
                    : "")
                }
              >
                {size.value}
              </button>
            ))}
      </div>
    );
  }

  renderProductCounterButton(product) {
    return (
      <div className="counter">
        <button
          onClick={() => {
            this.addItem(product);
          }}
          className="counter_increment"
        >
          +
        </button>
        {product.counter}
        <button
          onClick={() => {
            this.removeItem(product);
          }}
          className="counter_decrement"
        >
          -
        </button>
      </div>
    );
  }

  renderTotalProductsPrice() {
    return (
      <div className="total_box">
        <div className="total_title">Total</div>
        <div className="total_amount">
          <CurrencySign currency={this.props.currency} />
          {this.getTotal()}
        </div>
      </div>
    );
  }

  renderBagCheckoutButtons() {
    return (
      <div className="checkout_view_bag_button">
        <Link to={`/view/bag`}>
          <button onClick={this.props.cartSwitcherAction} className="viewBag">
            VIEW BAG
          </button>
        </Link>
        <Link to={`/view/Checkout`}>
          <button className="checkout" onClick={this.props.cartSwitcherAction}>
            CHECKOUT
          </button>
        </Link>
      </div>
    );
  }

  renderProductBox(product) {
    return (
      <div className="row product_box">
        <div className="col-6">
          <p className="product_cart_brand">{product.brand}</p>
          <p className="product_cart_name">{product.name}</p>
          {this.renderProductCartPrice(product)}
          {this.renderProductSizesButtons(product)}
        </div>
        <div className="col-6 cart_product">
          {this.renderProductCounterButton(product)}
          <div className="product_cart_image">
            <img src={product.gallery[0]} alt="" />
          </div>
        </div>
      </div>
    );
  }

  renderCartItems() {
    return (
      <ul className="cart_items_list">
        <li className="cart_items_list_title">
          <b>My Bag.</b> {this.props.cart.itemsCount} items
        </li>
        {Object.keys(this.props.cart.items).map((key) => {
          let product = this.props.cart.items[key];
          return (
            <li
              className="cart_list_item"
              key={product.id + product.selectedSize?.value}
            >
              {this.renderProductBox(product)}
            </li>
          );
        })}
      </ul>
    );
  }

  preventClose(event) {
    event.stopPropagation();
  }

  renderCartContent() {
    if (!this.props.cartSwitcherReducer) {
      return null;
    }
    if (Object.keys(this.props.cart).length) {
      return (
        <div className="cart_items">
          <div className="cart_items_container" onClick={this.preventClose}>
            {this.renderCartItems()}
            {this.renderTotalProductsPrice()}
            {this.renderBagCheckoutButtons()}
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="cart_box_navbar">
        <div className="cart_items_count">
          <span>{this.props.cart.itemsCount}</span>
        </div>
        <img
          onClick={this.setActiveContextMenu}
          className="navbar_cart_icon"
          src={process.env.PUBLIC_URL + "/img/cart_navbar.png"}
          alt=""
        />
        {this.renderCartContent()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
