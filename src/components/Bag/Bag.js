import React, { Component } from "react";
import {
  AddItemToCart,
  RemoveItemFromCart,
  ResizeItemFromCart,
} from "../../actions";
import { connect } from "react-redux";
import CurrencySign from "../CurrencySign/CurrencySign";
import "./Bag.css";

const mapStateToProps = (props) => {
  return {
    currency: props.currency,
    cart: props.cartStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(AddItemToCart(item)),
    removeItemFromCart: (item) => dispatch(RemoveItemFromCart(item)),
    resizeItemFromCart: (item, newSize) =>
      dispatch(ResizeItemFromCart(item, newSize)),
  };
};

class Bag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardPageImageIndexes: {},
    };
    this.renderProductPrice = this.renderProductPrice.bind(this);
    this.selectedSize = this.selectedSize.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.renderBagItems = this.renderBagItems.bind(this);
    this.nextProductImage = this.nextProductImage.bind(this);
    this.prevProductImage = this.prevProductImage.bind(this);
    this.setCardPageImageIndexes = this.setCardPageImageIndexes.bind(this);
    this.getCurrentProductImage = this.getCurrentProductImage.bind(this);
    this.renderProductSizesSwitcher =
      this.renderProductSizesSwitcher.bind(this);
    this.renderProductBagImage = this.renderProductBagImage.bind(this);
    this.renderMainProductData = this.renderMainProductData.bind(this);
  }

  renderProductPrice(product) {
    const price = product.prices.find(
      (price) => price.currency === this.props.currency
    );
    return price.amount;
  }

  componentDidMount() {
    this.setState({
      cardPageImageIndexes: this.setCardPageImageIndexes(),
    });
  }

  setCardPageImageIndexes() {
    return Object.keys(this.props.cart.items).reduce((newImageIndexes, key) => {
      newImageIndexes[key] = {
        currentIndex: 0,
        imageCount: this.props.cart.items[key].gallery.length,
      };
      return newImageIndexes;
    }, {});
  }

  addItem(product) {
    this.props.addItemToCart(product);
    this.forceUpdate();
  }

  removeItem(product) {
    this.props.removeItemFromCart(product);
    this.forceUpdate();
  }

  selectedSize(product, newSize, oldKey) {
    this.props.resizeItemFromCart(product, newSize);
    let newKey = product.id + "-" + newSize.value;
    let temp = { ...this.state.cardPageImageIndexes };
    let newIndex = { ...temp[oldKey] };
    delete temp[oldKey];
    temp[newKey] = newIndex;
    this.setState({
      cardPageImageIndexes: temp,
    });

    this.forceUpdate();
  }

  nextProductImage(key) {
    let temp = { ...this.state.cardPageImageIndexes };
    if (temp[key].imageCount - 1 > temp[key].currentIndex) {
      temp[key].currentIndex++;
      this.setState({
        cardPageImageIndexes: temp,
      });
    }
  }

  prevProductImage(key) {
    let temp = { ...this.state.cardPageImageIndexes };
    if (0 < temp[key].currentIndex) {
      temp[key].currentIndex--;
      this.setState({
        cardPageImageIndexes: temp,
      });
    }
  }

  getCurrentProductImage(key) {
    return this.state.cardPageImageIndexes[key]?.currentIndex;
  }

  renderProductSizesSwitcher(product, key) {
    return (
      <div className="size_section">
        {product.attributes[0]?.items[0].value.includes("#")
          ? product.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSize(product, size, key)}
                key={size.id}
                style={{ backgroundColor: size.value }}
                className={
                  "color_button " +
                  (product.selectedSize.value === size.value
                    ? "active_color_size"
                    : "")
                }
              />
            ))
          : product.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSize(product, size, key)}
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

  renderProductBagImage(product, key) {
    return (
      <div className="product_bag_image">
        <img
          onClick={() => {
            this.prevProductImage(key);
          }}
          style={
            this.state.cardPageImageIndexes[key]?.currentIndex === 0
              ? { display: "none" }
              : {}
          }
          className="bag_image_left_arrow"
          src={process.env.PUBLIC_URL + "/img/left_arrow.png"}
          alt=""
        />
        <img
          onClick={() => {
            this.nextProductImage(key);
          }}
          style={
            this.state.cardPageImageIndexes[key]?.currentIndex ===
            this.state.cardPageImageIndexes[key]?.imageCount - 1
              ? { display: "none" }
              : {}
          }
          className="bag_image_right_arrow"
          src={process.env.PUBLIC_URL + "/img/right_arrow.png"}
          alt=""
        />
        <img
          className="bag_main_product_image"
          src={product.gallery[this.getCurrentProductImage(key)]}
          alt=""
        />
      </div>
    );
  }

  renderBagCounterButtons(product) {
    return (
      <div className="counters__button">
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

  renderMainProductData(product) {
    return (
      <React.Fragment>
        <p className="product_brand">{product.brand}</p>
        <p className="product_name">{product.name}</p>
        <p className="product_price">
          {<CurrencySign currency={this.props.currency} />}
          {this.renderProductPrice(product)}
        </p>
      </React.Fragment>
    );
  }

  renderBagItems() {
    return (
      <div className="bag_container">
        <h3 className="cart_title">
          <p>Cart</p>
        </h3>
        <ul className="bag_list">
          {Object.keys(this.props.cart.items).map((key) => {
            let product = this.props.cart.items[key];
            return (
              <React.Fragment key={key}>
                <hr className="horizontal_line" />
                <li key={key} className="bag_list_item">
                  <div className="left_side">
                    {this.renderMainProductData(product)}
                    {this.renderProductSizesSwitcher(product, key)}
                  </div>
                  <div className="right_side">
                    {this.renderBagCounterButtons(product)}
                    {this.renderProductBagImage(product, key)}
                  </div>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    return this.renderBagItems();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bag);
