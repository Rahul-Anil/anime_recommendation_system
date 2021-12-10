import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../store/actions";
let tempData = [];
export const FilterContent = (props) => {
  const dispatch = useDispatch();
  let check = false;
  const handleSelect = (value) => {
    for (const key of tempData) {
      console.log(key);
      if (key === value.target.name) {
        check = true;
      }
    };

    console.log(check);

    if (value.target.checked) {
      console.log(value.target.name);
      if (!check) {
        console.log(value.target.name);
        tempData.push(value.target.name);
        check = false;
      } else {
        check = false;
      }
    } else {
      const index = tempData.indexOf(value.target.name);
      if (index > -1) {
        tempData.splice(index, 1);
      }
      //tempData.pop(value.target.name);
    }
    console.log(tempData);
    console.log("selected=", value.target.checked);
  };
  const handleClick = () => {
    props.handleClose();
    //console.group(tempData);
    if(props.status === 'genre'){
      dispatch(Actions.selectGenre(tempData));
    }else{
      dispatch(Actions.selectStudio(tempData));
    }
    
    tempData = [];
  };
  return (
    <div style={{ padding: "20px" }}>
      <Grid container sx={{ ml: 8 }}>
        {props.const.map((item, index) => (
          <Grid item md={3} key={index}>
            {" "}
            <FormControlLabel
              name={item}
              control={<Checkbox onChange={handleSelect} />}
              label={item}
              value={item}
            />
          </Grid>
        ))}
      </Grid>
      <Divider flexItem />
      <Button
        variant="contained"
        sx={{ float: "right", mt: 3, mb: 3 }}
        color="primary"
        onClick={handleClick}
      >
        Save
      </Button>
    </div>
  );
};
