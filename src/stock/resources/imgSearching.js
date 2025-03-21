import axios from "axios";
import { API_PATH } from "../common/config.js";
import { Cheerio } from "cheerio";

const express = require("express");
const app = express;
async function imgSearching(url) {
  const { data } = await axios.get(url);
  const $ = Cheerio.load(data);
  const images = [];

  $("img").each((i, img) => {
    const src = $(img).attr("src");
    if (src) {
      const fullURL = src.startWith("http") ? src : `${url}${src}`;
      images.push(fullURL);
    }
  });
  return images;
}

app.get("/getimages", async (req, res) => {
  const newsData = {
    url: req.query.url,
  };
  const images = await imgSearching(newsData.url);

  newsData.images = images;

  res.json(newsData);
});
