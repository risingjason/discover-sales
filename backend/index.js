import axios from "axios";
import $ from "cheerio";
import { getHTML, getProductData } from "./lib/scrapeAmazon";

const start = async () => {
  try {
    const html = await getHTML();
    console.log(getProductData(html));
  } catch (err) {
    console.log(err);
  }
};

start();
