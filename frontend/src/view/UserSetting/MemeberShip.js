import React, {  useEffect, useState } from "react";
import { Dialog, Divider, Fab, Grid, Typography } from "@mui/material";
import visa from "../../assets/image/visa.png";
import { CustomModal } from "../../component/CustomModal";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  paper: {
    background: "#EBEBEB",
    borderRadius: "16px",
  },
});
const port = 'http://localhost:8080';

export default function MemeberShip() {
  const hist = useHistory();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [userDetails, setUserdetails] = useState({});

  const getUserById = async () => {
    try {
      let userId = sessionStorage.getItem('data');
      const user = await fetch("http://localhost:8080/user/" + userId.toString());
      //const userDetails = await user.json();
      setUserdetails(await user.json());
      console.log(userDetails);
      
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getUserById();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const changeClick = (item) => {
    setOpen(true);
    setItem(item);
  };

  const cancelMembership = (event) => {
    event.preventDefault();
    const data = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    fetch(`${port}/user/${userDetails.user_id}`,data).then(res => res.json())
    .then(res => 
      console.log(res),
      hist.push("/login"),)
    .catch(err => console.log(err));
  }
  const classes = useStyles();
  return (
    <div>
      <Grid container>
        <Grid item md={5}>
          <Typography variant="h3" sx={{ fontWeight: 600, color: "#767676" }}>
            Membership & Billing
          </Typography>
          <Fab
            variant="extended"
            onClick={() => changeClick("cancel")}
            sx={{
              mt: 6,
              background: "#FF404B",
              color: "white",
              border: "1px solid #3751FF",
            }}
          >
            cancel membership
          </Fab>
        </Grid>
        <Grid item md={7}>
          <Grid container justifyContent=" space-between">
            <Grid item m={4} alignItems="flex-start">
              <Typography>akhilkumar@email.com</Typography>
              <Typography sx={{ color: "#767676", mt: 2 }}>
                Password : ******
              </Typography>
            </Grid>
            {/* <Grid item m={4}>
              <Typography
                sx={{ color: "#0021FF", cursor: "pointer" }}
                onClick={() => changeClick("Email")}
              >
                Change email
              </Typography>
              <Typography
                sx={{ color: "#0021FF", mt: 2, cursor: "pointer" }}
                onClick={() => changeClick("Password")}
              >
                Change password
              </Typography>
            </Grid> */}
          </Grid>
          <Divider sx={{ border: "0.5px solid #000000" }} />
          <Grid container justifyContent=" space-between">
            <Grid item m={4} alignItems="flex-start">
              <Typography variant="h6">Payment Method</Typography>
              <Grid container alignItems="center" sx={{ mt: 2 }}>
                <img
                  src={visa}
                  alt="visa"
                  style={{ display: "inline-block" }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontSize: "16px", display: "inline-block" }}
                >
                  4477-4693-2598-4006
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid item m={4}>
              <Typography sx={{ fontSize: "16px", color: "#0021FF", mt: 6 }}>
                Manage Payment Information
              </Typography>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "#EBEBEB",
            borderRadius: "16px",
          },
        }}
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.paper }}
      >
        <CustomModal item={item} handleClose={cancelMembership} />
      </Dialog>
    </div>
  );
}
