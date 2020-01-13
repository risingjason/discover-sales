import axios from "axios";

export const getHTML = async url => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36"
      }
    });
    if (response.status === 200) {
      const html = response;
      return html;
    }
  } catch (err) {
    console.log(`An error occurred on URL: ${url}.`);
  }
};
