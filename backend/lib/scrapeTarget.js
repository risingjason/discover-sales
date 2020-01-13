import axios from "axios";
import $ from "cheerio";
import { formatPrice } from "../utils/formatPrice";

const TARGET_PRODUCT_ENDPOINT =
  "https://redsky.target.com/web/pdp_location/v1/tcin";

const TARGET_STORE_LOCATION_ENDPOINT =
  "https://redsky.target.com/v3/stores/nearby";

export const getProductData = async response => {
  const cookie = response.headers["set-cookie"];
  const { path } = response.request;

  // get productId from path
  const pathSplit = path.split("/");
  if (pathSplit.length !== 5) {
    return {
      error: "Please use a working target product path."
    };
  }
  const productString = pathSplit.pop();
  const productId = productString.substring(2);

  // get visitorId from cookie
  const [visitorCookie] = cookie[0].split(";");
  const idIndex = visitorCookie.indexOf("=");
  const visitorId = visitorCookie.substring(idIndex + 1);

  const productData = await getProductPriceFromAPI(visitorId, productId);
  const productName = getProductName(response.data);

  return {
    visitorId,
    productId,
    productName,
    ...productData
  };
};

export const getProductName = html => {
  const productNameSelector = `[data-test="product-title"]`;
  const productName = $(productNameSelector, html).text();
  return productName;
};

export const getProductPriceFromAPI = async (
  visitorId,
  productId,
  zipCode = 90031
) => {
  let storeLocationId;
  let productData;

  // get store location ID
  try {
    const { data } = await axios.get(
      TARGET_STORE_LOCATION_ENDPOINT +
        `/${zipCode}?key=${visitorId}&within=15&limit=10`
    );
    const closestLocation = data[0].locations[0];
    storeLocationId = closestLocation.location_id;
  } catch (err) {
    console.log(err);
  }

  // get product info
  try {
    const { data } = await axios.get(
      TARGET_PRODUCT_ENDPOINT +
        `/${productId}?pricing_store_id=${storeLocationId}&key=${visitorId}`
    );
    productData = {
      currentPrice: data.price.formatted_current_price,
      retailPrice: formatPrice(data.price.reg_retail.toString())
    };
  } catch (err) {
    console.log(err);
  }

  return productData;
};
