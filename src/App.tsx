// @ts-nocheck
import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@mui/material";

const DATA_URL = "https://www.terriblytinytales.com/test.txt"; // data url

type entryType = {
  // Two type of data are required one is word second is its count
  word: string;
  count: number;
};

export default function App() {
  // use useState for store the histogram data from the data url
  const [histogramdata, setHistogramdata] = useState<Array<entryType> | null>(
    null
  );

  // fetching data from the url
  const fetchData = async () => {
    const response = await axios.get(DATA_URL); // stroe the response from the data url

    const words: string[] = response.data.split(" "); // store the response data after spliting data
    const wordFrequencies = {};

    const allowedWordRegex = /^[a-zA-Z]+$/;

    words.forEach((word) => {
      if (allowedWordRegex.test(word)) {
        if (wordFrequencies[word]) {
          wordFrequencies[word] += 1;
        } else {
          wordFrequencies[word] = 1;
        }
      }
    });

    const data: Array<entryType> = [];

    //converting the object data into array of object with two field one is word and second is count field
    Object.entries(wordFrequencies).map((obj) => {
      data.push({ word: obj[0], count: obj[1] });
    });
    const sortedData = data.sort((a, b) => b.count - a.count);

    const top20Data = sortedData.slice(0, 20);
    return top20Data;
  };
  const handleChange = async () => {
    const top20Data = await fetchData();
    setHistogramdata(top20Data);
  };

  return (
    <div>
      <h1>Hello Terribly Tiny Tales - TTT</h1>
      <h2>Histogram of the 20 most Occurring words</h2>
      <div>
        <Button type="submit" onClick={handleChange} variant="contained">
          Submit
        </Button>
        <br />
        {histogramdata && (
          <BarChart
            width={800}
            height={400}
            data={histogramdata}
            style={{ marginTop: "10px" }}
          >
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        )}
      </div>
    </div>
  );
}
