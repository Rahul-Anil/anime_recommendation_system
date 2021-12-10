import { Fab, Grid, Typography } from "@mui/material";
import React from "react";

export default function PhoneDetails() {
  return (
    <div>
      <Grid container>
        <Grid item md={4}>
          <Typography variant="h3" sx={{ fontWeight: 600, color: "#767676" }}>
            Plan Detail
          </Typography>
        </Grid>
        <Grid item md={7} sx={{ pt: 6, pb: 6 }}>
          <Grid container alitnItems="center" justifyContent="space-around">
            <Fab
              color="primary"
              variant="extended"
              sx={{ textTransform: "none", padding: "30px" }}
            >
              <Typography variant="h3">Change to Premium Plan</Typography>
            </Fab>
            {/* <Typography sx={{ fontSize: 16, mt: 2 }} color="primary">
              Change Plan
            </Typography> */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
