import $ from "cheerio";
import { trimAllText, trimAllPrice } from "../utils/trimAll";

export const getProductData = html => {
  const productTitleSelector = "#productTitle";
  const priceSelector = "#priceblock_ourprice";
  const shippingSelector =
    "#ourprice_shippingmessage > #price-shipping-message";

  const productTitle = trimAllText($(productTitleSelector, html).text());
  const shippingDetail = formatShipping(
    trimAllText($(shippingSelector, html).text())
  );
  let givenPrice = trimAllPrice($(priceSelector, html).text());
  let [salePrice, originalPrice] = separateSaleAndOriginal(givenPrice);

  if (!originalPrice) {
    const origPriceInListing = trimAllPrice(
      $(".priceBlockStrikePriceString", html).text()
    );
    if (!origPriceInListing) {
      originalPrice = salePrice;
    } else {
      originalPrice = origPriceInListing;
    }
  }

  const product = { productTitle, originalPrice, salePrice, shippingDetail };
  return validateProductData(product)
    ? product
    : "There is no product information for this listing, please check the url.";
};

export const validateProductData = product => {
  const { productTitle, originalPrice, salePrice } = product;
  if (!productTitle && !salePrice) {
    return false;
  }
  return true;
};

export const formatPriceDecimal = price => {
  if (!price) return;

  const priceLength = price.length;
  let formattedPrice = price;
  if (price.indexOf(".") === -1) {
    formattedPrice =
      price.substring(0, priceLength - 2) +
      "." +
      price.substring(priceLength - 2);
  }
  if (price.indexOf("$") === -1) {
    formattedPrice = "$" + formattedPrice;
  }
  return formattedPrice;
};

export const formatShipping = shipping => {
  const shippingLower = shipping.toLowerCase();
  console.log(shippingLower);
  if (shippingLower.includes("fast, free shipping with amazon prime")) {
    return "Free Shipping with Prime";
  } else if (shippingLower.includes("free shipping")) {
    return "Free Shipping";
  }

  return "No Free Shipping";
};

export const separateSaleAndOriginal = price => {
  let multiPrice = price.split("Save")[0].split("$");
  if (multiPrice.length === 2) {
    return [formatPriceDecimal(price), ""];
  }

  const [, sale, original] = multiPrice;
  return [formatPriceDecimal(sale), formatPriceDecimal(original)];
};

export const cleanAmazonURL = url => {
  const [urlNoQuery] = url.split("?");
  const urlArray = urlNoQuery.split("/");
  const gp = urlArray.indexOf("gp");
  const dp = urlArray.indexOf("dp");

  let cleanURLArray;
  if (gp !== -1) {
    cleanURLArray = urlArray.slice(0, gp + 3);
    return cleanURLArray.join("/");
  } else if (dp !== -1) {
    cleanURLArray = urlArray.slice(0, dp + 2);
    return cleanURLArray.join("/");
  }

  return "Please link to an Amazon listing.";
};
