import axios from "axios";
import $ from "cheerio";
import { getHTML } from "./lib/getHTML";
import {
  cleanAmazonURL,
  getProductData as getAmazonProductData
} from "./lib/scrapeAmazon";
import { getProductData as getTargetProductData } from "./lib/scrapeTarget";

// const start = async () => {
//   try {
//     const { data } = await getHTML(
//       cleanURL(
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
      "https://www.target.com/p/nintendo-switch-with-neon-blue-and-neon-red-joy-con/-/A-77464001"
    );
    // console.log(html);
    console.log(getTargetProductData(html));
  } catch (err) {
    console.log(err);
  }
};

start();
