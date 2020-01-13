import axios from "axios";
import $ from "cheerio";

export const getProductData = response => {
  const cookie = response.headers;
  console.log(cookie);
};
