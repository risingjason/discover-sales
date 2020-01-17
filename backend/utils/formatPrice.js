export const formatPrice = (price, notDigit = true) => {
  if (!price) return;

  const stringPrice = price.toString();
  const priceLength = stringPrice.length;
  let formattedPrice = stringPrice;
  if (stringPrice.indexOf(".") === -1) {
    if (notDigit) {
      formattedPrice =
        stringPrice.substring(0, priceLength - 2) +
        "." +
        stringPrice.substring(priceLength - 2);
    } else {
      formattedPrice = stringPrice + ".00";
    }
  } else {
    if (priceLength === 3) {
      formattedPrice = stringPrice + "0";
    }
  }
  if (stringPrice.indexOf("$") === -1) {
    formattedPrice = "$" + formattedPrice;
  }
  return formattedPrice;
};
