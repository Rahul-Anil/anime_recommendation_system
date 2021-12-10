import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import UserEditTable from "./UserEditTable";
import NotAllowed from "./NotAllowed";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px 80px",
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 14,
      border: "none",
      color: "black",
    },
  },
  input: {
    background: "#EFF0F6",
  },
}));



const UserSubscription = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userDefaultList, setUserDefaultList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [check, setCheck] = useState(false);
  //let check = false;

  const fetchData = async () => {
    return await fetch('http://localhost:8080/user?order_by=user_id&page=1&page_size=1000')
      .then(response => response.json())
      .then(data => {
        setUserList(data['results'])
        setUserDefaultList(data['results'])
      });
  }

  const updateInput = async (input) => {
    //http://localhost:8080/user/3
    //console.log(userDefaultList);
    // fetchData();

    // const filtered = userDefaultList.filter(user => user.user_id == input);
    // //console.log(filtered);
    // setUserList(filtered[0]);

    try {
      //let userId = sessionStorage.getItem('data');
      const user = await fetch("http://localhost:8080/user/" + input.toString());
      const userDetails = await user.json();
      console.log(userDetails);
      if (userDetails['user_type'] !== 'admin' || !sessionStorage.getItem('Admin')) {
        setCheck(false);
        //check = false;
        sessionStorage.setItem('Admin', false);
        setUserList(userDetails);
      } else {
        setCheck(true);
        //check = true;
        sessionStorage.setItem('Admin', true);
        setUserList([]);
        //setCheck(true);
        
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  //useEffect(() => { fetchData() }, []);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box>
        <Paper
          sx={{ width: 980, height: 600, overflowY: "scroll", padding: "20px" }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 3, mb: 2 }}
          >
            <Grid item md={8}>
              <TextField
                variant="outlined"
                className={classes.textFiled}
                style={{ width: "100%" }}
                placeholder="Search User Id"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{ zIndex: 1000 }}>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  className: classes.input,
                }}
                onChange={(e) => updateInput(e.target.value)}
              ></TextField>
            </Grid>
          </Grid>
          {/* {userList.length!==0?<UserEditTable userList={userList} />:<NotAllowed/>} */}
          {check ? <NotAllowed /> : <UserEditTable userList={userList} />}
        </Paper>
      </Box>
    </div>
  );
};

export default UserSubscription;
