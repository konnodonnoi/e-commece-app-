import React, { Component } from "react";
import { gql } from "@apollo/client";
import Product from "./Product";
import "./Product.css";
import { CurrencySwitcherAction } from "../../actions";
import { connect } from "react-redux";

const mapStateToProps = (props) => {
  return {
    currency: props.currency,
    currencySwitcherState: props.currencySwitcherReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currencySwitcherAction: () => dispatch(CurrencySwitcherAction()),
  };
};

class ProductsContainer extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      currency: "USD",
    };
    this.getProducts = this.getProducts.bind(this);
    this.renderAllProducts = this.renderAllProducts.bind(this);
    this.setCurrencySwitcherState = this.setCurrencySwitcherState.bind(this);
  }

  componentDidMount() {
    this.getProducts();
  }

  async getProducts() {
    let temp;
    temp = await this.props.client.query({
      query: gql`
        query {
          category {
            products {
              id
              gallery
              name
              category
              inStock
              attributes {
                id
                type
                name
                items {
                  id
                  displayValue
                  value
                }
              }
              prices {
                currency
                amount
              }
            }
          }
        }
      `,
    });

    this.setState({
      products: temp.data,
    });
  }

  renderAllProducts() {
    const products = [];
    if (this.props.match !== undefined) {
      this.state.products?.category.products.map((product) => {
        if (
          product.category === this.props.match.params.category ||
          this.props.match.params.category === "home"
        ) {
          products.push(product);
        }
        return "";
      });
    } else {
      this.state.products?.category.products.map((product) =>
        products.push(product)
      );
    }
    return products.map((product) => (
      <div key={product.id} className="col-3">
        <Product product={product} />
      </div>
    ));
  }

  setCurrencySwitcherState() {
    if (this.props.currencySwitcherState) {
      this.props.currencySwitcherAction();
    }
  }

  render() {
    return (
      <div className="products_container">
        <p className="category_name">
          {this.props.match
            ? this.props.match?.params.category
            : "All Products"}
        </p>
        <div className="row">{this.renderAllProducts()}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsContainer);
