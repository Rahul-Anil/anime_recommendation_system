import { Fab, IconButton, Grid, Typography } from "@mui/material";
import { Box, boxSizing } from "@mui/system";
import React from "react";
import bullet from "../../../../assets/image/bullet.svg";

export const ChartElements = (userDetails) => {

  const userDeets = userDetails.userDetails;
  let percentage = userDeets.preferred_genre_percentage;
  percentage = percentage.replace(/'/g, '"');
  const percentageJSON = JSON.parse(percentage);

  let percentageList =[];
  for(const key of Object.keys(percentageJSON)){
    const obj = {};
    obj['key'] = key;
    obj['value'] = percentageJSON[key];
    percentageList.push(obj)
  }
  return (
    <div style={{ marginLeft: "80px" }}>
      <Grid container>
        {percentageList.map((row) => (
          <Grid item md={6}>
            <Box key={row.key} sx={{ my: 2 }}>
              <Grid container spacing={2}>
                <Grid item>
                  <img src={bullet} alt="bullet" />
                </Grid>
                <Grid item>
                  <Typography sx={{ color: "rgba(0, 0, 0, 0.38)" }}>
                    {row.key}
                  </Typography>
                  <br />
                  <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
                    {row.value}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
