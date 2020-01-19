import axios from "axios";
import $ from "cheerio";
import { formatPrice } from "../utils/formatPrice";

const TARGET_PRODUCT_ENDPOINT =
  "https://redsky.target.com/web/pdp_location/v1/tcin";

const TARGET_STORE_LOCATION_ENDPOINT =
  "https://redsky.target.com/v3/stores/nearby";

const TARGET_PRODUCT_DESCRIPTION_ENDPOINT =
  "https://redsky.target.com/v3/pdp/tcin";

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

  const productData = await getProductFromAPI(visitorId, productId);
  const productName = getProductName(response.data);

  if (Array.isArray(productData)) {
    return {
      visitorId,
      productId,
      productName,
      variations: productData
    };
  }

  return {
    visitorId,
    productId,
    productName,
    ...productData
  };
};

export const cleanTargetURL = url => {
  let cleanURL;
  const queryIndex = url.indexOf("?");
  cleanURL = url.substring(0, queryIndex);

  return cleanURL;
};

export const getProductName = html => {
  const productNameSelector = `[data-test="product-title"]`;
  const productName = $(productNameSelector, html).text();
  return productName;
};

export const getProductFromAPI = async (
  visitorId,
  productId,
  zipCode = 90031
) => {
  const storeLocationId = await getStoreLocationId(zipCode, visitorId);
  const productData = await getProductPricing(
    productId,
    storeLocationId,
    visitorId
  );

  // get product info
  return productData;
};

export const getStoreLocationId = async (zipCode, visitorId) => {
  let storeLocationId;

  try {
    const { data } = await axios.get(
      TARGET_STORE_LOCATION_ENDPOINT +
        `/${zipCode}?key=${visitorId}&within=15&limit=10`
    );
    const closestLocation = data[0].locations[0];
    storeLocationId = closestLocation.location_id;
  } catch (err) {
    console.error(err);
  }

  return storeLocationId;
};

export const getProductPricing = async (
  productId,
  storeLocationId,
  visitorId
) => {
  let productPricing;

  try {
    const { data } = await axios.get(
      TARGET_PRODUCT_ENDPOINT +
        `/${productId}?pricing_store_id=${storeLocationId}&key=${visitorId}`
    );
    if (data.child_items) {
      const childProductItems = await getProductChildItems(
        data.child_items,
        storeLocationId,
        visitorId
      );
      productPricing = childProductItems;
    } else {
      productPricing = {
        originalPrice: formatPrice(data.price.reg_retail),
        currentPrice: formatPrice(data.price.current_retail)
      };
    }
  } catch (err) {
    console.error(err);
  }

  return productPricing;
};

export const getProductChildItems = async (
  child_items,
  storeLocationId,
  visitorId
) => {
  let productChildItems = [];

  for (let i = 0; i < child_items.length; i++) {
    const childItem = child_items[i];
    let formattedProductDescription = {};

    const childProductDescription = await getProductDescription(childItem.tcin);
    formattedProductDescription = {
      variantName: childProductDescription.product_description.title,
      productId: childProductDescription.tcin
    };

    Object.keys(childProductDescription.variation).forEach(key => {
      if (key !== "flexible_themes") {
        formattedProductDescription[key] =
          childProductDescription.variation[key];
      }
    });

    formattedProductDescription = {
      ...formattedProductDescription,
      originalPrice: formatPrice(childItem.price.reg_retail, false),
      currentPrice: formatPrice(childItem.price.current_retail, false)
    };

    productChildItems.push(formattedProductDescription);
  }

  return productChildItems;
};

export const getProductDescription = async (
  productId,
  storeLocationId,
  visitorId
) => {
  let description;
  const excludesString =
    "?excludes=in_store_location," +
    "bulk_ship," +
    "question_answer_statistics," +
    "rating_and_review_reviews," +
    "available_to_promise_network," +
    "available_to_promise_store," +
    "deep_red_labels," +
    "rating_and_review_statistics";
  const keyAndStore = `&pricing_store_id=${storeLocationId}&key=${visitorId}`;

  try {
    const response = await axios.get(
      TARGET_PRODUCT_DESCRIPTION_ENDPOINT +
        `/${productId}${excludesString}${keyAndStore}`
    );
    const {
      data: {
        product: { item }
      }
    } = response;
    description = item;
  } catch (err) {
    console.error(err);
  }

  return description;
};
