import axios from "axios";
import $ from "cheerio";
import { getHTML, getProductData } from "./lib/scrapeAmazon";

const start = async () => {
  try {
    const html = await getHTML(
      "https://www.amazon.com/Legend-Zelda-Breath-Wild-Nintendo-Switch/dp/B01MS6MO77/ref=sr_1_1?keywords=zelda%2Bbreath%2Bof%2Bthe%2Bwild&qid=1578822720&sr=8-1&th=1"
    );
    console.log(getProductData(html));
  } catch (err) {
    console.log(err);
  }
};

// const start = async () => {
//   try {

//   } catch (err) {
//     console.log(err);
//   }
// };

start();
