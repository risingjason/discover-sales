import axios from "axios";
import $ from "cheerio";

export const getHTML = async () => {
  try {
    const response = await axios.get(
      "https://www.amazon.com/Keychron-Wireless-Bluetooth-Mechanical-Keyboard/dp/B07YB32H52",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36"
        }
      }
    );
    if (response.status === 200) {
      const html = response.data;
      return html;
    }
  } catch (err) {
    console.log("An error occurred.");
    console.log(err);
  }
};

export const getProductData = html => {
  const productTitleSelector = "#productTitle";
  const originalPriceSelector = ".priceBlockStrikePriceString";
  const salePriceSelector = "#priceblock_ourprice";

  const productTitle = $(productTitleSelector, html)
    .text()
    .trim();
  const originalPrice = $(originalPriceSelector, html)
    .text()
    .trim();
  const salePrice = $(salePriceSelector, html)
    .text()
    .trim();
  return { productTitle, originalPrice, salePrice };
};

export const validateProductData = product => {
  const { productTitle, originalPrice, salePrice } = product;
  if (!productTitle || !originalPrice || !salePrice) {
    return "There is no product information for this listing, please check the url.";
  }
};
