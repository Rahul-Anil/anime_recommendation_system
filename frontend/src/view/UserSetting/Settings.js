import { Grid, Typography } from "@mui/material";
import React from "react";

export default function Settings() {
  return (
    <div>
      <Grid container>
        <Grid item md={4}>
          <Typography variant="h3" sx={{ fontWeight: 600, color: "#767676" }}>
            Settings
          </Typography>
        </Grid>
        <Grid item md={7} sx={{ pt: 6, pb: 6, pl: 14 }}>
          <Grid
            container
            direction="column"
            alitnItems="center"
            justifyContent="flex-start"
          >
            <Typography sx={{ fontSize: 16, display: "block" }} color="primary">
              Sign Out of all devices
            </Typography>
            <Typography sx={{ fontSize: 16, mt: 4 }} color="primary">
              Recent Viewing Activity
            </Typography>
            <Typography sx={{ fontSize: 16, mt: 4 }} color="primary">
              Manage Login location
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
