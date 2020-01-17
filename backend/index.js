import axios from "axios";
import $ from "cheerio";
import {
  cleanAmazonURL,
  getProductData as getAmazonProductData
} from "./lib/scrapeAmazon";
import { getProductData as getTargetProductData } from "./lib/scrapeTarget";
import { getHTML } from "./utils/getHTML";

// const start = async () => {
//   try {
//     const { data } = await getHTML(
//       cleanAmazonURL(
//         "https://www.amazon.com/Legend-Zelda-Breath-Wild-Nintendo-Switch/dp/B01MS6MO77/ref=sr_1_1?keywords=zelda%2Bbreath%2Bof%2Bthe%2Bwild&qid=1578822720&sr=8-1&th=1"
//       )
//     );
//     console.log(getAmazonProductData(data));
//   } catch (err) {
//     console.log(err);
//   }
// };

const start = async () => {
  try {
    const html = await getHTML(
      "https://www.target.com/p/contigo-16oz-snapseal-byron-vacuum-insulated-stainless-steel-travel-mug-monaco/-/A-53220734"
    );
    console.log(await getTargetProductData(html));
  } catch (err) {
    console.log(err);
  }
};

start();
