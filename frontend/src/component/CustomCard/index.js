import React from "react";
import { makeStyles } from "@mui/styles";
import { Card } from "@mui/material";

const useStyles = makeStyles({
  root: {},
  card: {
    width: "262px",
    height: "375px",
  },
});
const CustomCard = React.forwardRef((props, ref) => {
  const { width, height, ...rest } = props;
  const classes = useStyles();
  return (
    <div>
      <Card
        {...rest}
        ref={ref}
        style={{
          backgroundColor: "#4643D3",
          borderRadius: "14px",
          width: width,
          height: height,
        }}
        className={classes.card}
      ></Card>
    </div>
  );
});
export default CustomCard;
