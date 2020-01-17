export const formatPrice = price => {
  if (!price) return;

  const stringPrice = price.toString();
  const priceLength = price.length;
  let formattedPrice;
  if (stringPrice.indexOf(".") === -1) {
    formattedPrice =
      stringPrice.substring(0, priceLength - 2) +
      "." +
      stringPrice.substring(priceLength - 2);
  }
  if (stringPrice.indexOf("$") === -1) {
    formattedPrice = "$" + stringPrice;
  }
  return formattedPrice;
};
