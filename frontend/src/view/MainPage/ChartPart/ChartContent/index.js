import React from "react";
import { Doughnut } from "react-chartjs-2";

export default function Index(userDetails) {

  const userDeets = userDetails.userDetails;

  let percentage = userDeets.preferred_genre_percentage;
  percentage = percentage.replace(/'/g, '"');
  const percentageJSON = JSON.parse(percentage);

  function random_rgba() {
    // var o = Math.round, r = Math.random, s = 255;
    // return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(1, 254);
    const g = randomBetween(1, 254);
    const b = randomBetween(1, 254);
    return `rgb(${r},${g},${b})`;
  }

  let backgroundColor = [];

  for (const key of Object.keys(percentageJSON)) {
    var color = random_rgba();
    backgroundColor.push(color);
  }

  const data = {
    labels: Object.keys(percentageJSON),
    datasets: [
      {
        label: "Your Most Preferred Genres",
        data: Object.values(percentageJSON),
        backgroundColor: backgroundColor,

        borderWidth: 1,
      },
    ],
  };


  return (
    <>
      <div style={{ paddingTop: "80px" }}>
        <Doughnut data={data} />
      </div>
    </>
  )
}
