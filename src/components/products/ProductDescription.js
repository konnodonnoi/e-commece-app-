import React, { Component } from "react";
import { gql } from "@apollo/client";
import { AddItemToCart } from "../../actions";
import { connect } from "react-redux";
import CurrencySign from "../CurrencySign/CurrencySign";
import "./Product.css";
import parser from "html-react-parser";

const mapStateToProps = (props) => {
  return {
    currency: props.currency,
    cart: props.cartStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (item) => dispatch(AddItemToCart(item)),
  };
};

class ProductDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSize: null,
    };
    this.getProduct = this.getProduct.bind(this);
    this.renderMainImage = this.renderMainImage.bind(this);
    this.renderPrice = this.renderPrice.bind(this);
    this.renderSizeList = this.renderSizeList.bind(this);
    this.addItem = this.addItem.bind(this);
    this.selectedSize = this.selectedSize.bind(this);
    this.renderProductDescription = this.renderProductDescription.bind(this);
    this.renderProductInfo = this.renderProductInfo.bind(this);
  }

  async componentDidMount() {
    await this.getProduct();
  }

  async getProduct() {
    let temp;
    let productId = this.props.match.params.id;
    temp = await this.props.client.query({
      query: gql`
                query {
                  product(id: "${productId}"){
                    id
                    gallery
                    name
                    brand
                    category
                    description
                    inStock
                    prices {
                currency {
                label
                symbol
                }
                amount
              }
                    attributes{
                    name
                    items{
                      displayValue
                      value
                      id
                    }
                  }
                  }
                }
            `,
    });

    this.setState({
      product: temp.data.product,
      selectedImage: temp.data.product.gallery[0],
      selectedSize: temp.data.product?.attributes[0]?.items[0],
    });
  }

  renderMainImage(image) {
    this.setState({
      selectedImage: image,
    });
  }

  renderPrice() {
    if (this.state.product === undefined) return;
    let currency = this.state.product?.prices.find((price) => {
      if (price.currency === this.props.currency) {
        return price;
      }
      return "";
    });

    if (currency === undefined) {
      currency = this.state.product?.prices[0];
    }
    return (
      <p className="price">
        <CurrencySign currency={currency.currency} /> {currency.amount}{" "}
      </p>
    );
  }

  selectedSize(size) {
    this.setState({
      selectedSize: size,
    });
  }

  renderSizeList() {
    if (!this.state.product?.attributes[0]) {
      return "";
    }

    return (
      <div className="size_section">
        <p className="size_title">{this.state.product?.attributes[0]?.name}:</p>
        {this.state.product?.attributes[0]?.items[0].value.includes("#")
          ? this.state.product?.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSize(size)}
                key={size.id}
                style={{ backgroundColor: size.value }}
                className={
                  "color_button " +
                  (this.state.selectedSize.id === size.id
                    ? "active_color_size"
                    : "")
                }
              />
            ))
          : this.state.product?.attributes[0]?.items.map((size) => (
              <button
                onClick={() => this.selectedSize(size)}
                key={size.id}
                className={
                  "size_button " +
                  (this.state.selectedSize.id === size.id
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

  addItem() {
    if (!this.state.product) {
      return "";
    }
    let temp = Object.assign({}, this.state.product);
    temp.selectedSize =
      this.state.selectedSize ?? this.state.product?.attributes[0]?.items[0];
    this.props.addItemToCart(temp);
  }

  renderProductInfo() {
    return (
      <div className="col-3 product_info">
        <p className="product_title">{this.state.product?.brand}</p>
        <p className="product_name">{this.state.product?.name}</p>
        {this.renderSizeList()}
        <div className="price_section">
          <p className="price_title">PRICE:</p>
          {this.renderPrice()}
        </div>
        <button
          className={
            this.state.product?.inStock
              ? "add_cart_button"
              : "add_cart_button_disabled"
          }
          onClick={this.state.product?.inStock ? this.addItem : () => {}}
        >
          ADD TO CART
        </button>
        <div className="desc_li">
          <div className="desc_ul">
            <div className="product_desc">
              {this.state.product?.description
                ? parser(this.state.product?.description)
                : ""}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderProductDescription() {
    return (
      <div id="PDP">
        <div className="row">
          <div className="md">
            {this.state.product?.gallery.map((image) => (
              <img
                key={image}
                onClick={() => this.renderMainImage(image)}
                className="img-slider"
                src={image}
                alt="thumbnail"
              />
            ))}
          </div>
          <div className="col-6">
            {!this.state.product?.inStock ? (
              <div className="inStock_box">
                <p className="inStock">OUT OF STOCK</p>

                <img
                  id="mainImage"
                  className="main_img "
                  src={this.state.selectedImage}
                  alt="Active product"
                />
              </div>
            ) : (
              <img
                id="mainImage"
                className="main_img "
                src={this.state.selectedImage}
                alt="Active product"
              />
            )}
          </div>
          <div className="col-1 sm">
            {this.state.product?.gallery.map((image) => (
              <img
                key={image}
                onClick={() => this.renderMainImage(image)}
                className="img-slider"
                src={image}
                alt="Product Thumbnail mobile"
              />
            ))}
          </div>
          {this.renderProductInfo()}
        </div>
      </div>
    );
  }

  render() {
    return this.renderProductDescription();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDescription);
