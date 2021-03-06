import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Fetch } from "./services/useFetch";
import Spinner from "./Spinner";
import PageNotFound from "./PageNotFound";
import { ACTION_TYPE } from "./cartReducer";
import { CartContext, useCart } from "./cartContext";

export default function DetailClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <Detail id={id} navigate={navigate} />;
}

class Detail extends React.Component {
  state = {
    sku: "",
  };

  // this.context.dispatch()
  static contextType = CartContext;

  render() {
    const { id, navigate } = this.props;
    const { sku } = this.state;
    return (
      <CartContext.Consumer>
        {({ dispatch }) => {
          return (
            <Fetch url={`products/${id}`}>
              {({ loading, error, data: product }) => {
                if (loading) return <Spinner />;
                if (!product) return <PageNotFound />;
                if (error) throw error;

                return (
                  <div id="detail">
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p id="price">${product.price}</p>
                    <select
                      id="size"
                      value={sku}
                      onChange={(e) => this.setState({ sku: e.target.value })}
                    >
                      <option value="">What Size?</option>
                      {product.skus.map((sku) => (
                        <option value={sku.sku} key={sku.sku}>
                          {sku.size}
                        </option>
                      ))}
                    </select>
                    <p>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          dispatch({
                            type: ACTION_TYPE.ADD_TO_CART,
                            id,
                            sku,
                          });
                          navigate("/cart");
                        }}
                        disabled={!sku}
                      >
                        Add To Cart
                      </button>
                    </p>
                    <img
                      src={`/images/${product.image}`}
                      alt={product.category}
                    />
                  </div>
                );
              }}
            </Fetch>
          );
        }}
      </CartContext.Consumer>
    );
  }
}
