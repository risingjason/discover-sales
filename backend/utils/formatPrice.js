export const formatPrice = price => {
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
