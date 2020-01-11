import axios from "axios";
import $ from "cheerio";
import { getHTML, getProductData } from "./lib/scrapeAmazon";

const start = async () => {
  try {
    const html = await getHTML(
      "https://www.amazon.com/Keychron-Wireless-Bluetooth-Mechanical-Keyboard/dp/B07WZSN4H5/ref=sr_1_3?keywords=keychron&qid=1578727828&sr=8-3"
    );
    console.log(getProductData(html));
  } catch (err) {
    console.log(err);
  }
};

start();
