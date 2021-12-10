import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function UserEditTable({ userList = [] }) {
  //console.log(userList);

  const [preferences, setPreferences] = React.useState(null);
  function createData(key, value) {
    return { key, value };
  }

  const keyList = [
    "user_id",
    "firstname",
    "lastname",
    "email",
    "user_type",
    "password",
    "preferred_genre",
    "recommended",
  ];
  const keyNames = [
    "ID",
    "First Name",
    "Last Name",
    "Email ID",
    "Subscription Type",
    "Password",
    "Preferences",
    "Recommendations",
  ];

  let rowData = [];
  let preferenceList = [];
  let genre = [];
  Object.entries(userList).forEach(([key, value]) => {
    // console.log(keyList.indexOf(key.toString()));
    let index = keyList.indexOf(key.toString());
    if (index !== -1) {
      //.log(key);
      if (key === "preferred_genre") {
        //genre = [userList['preferred_genre'].substring(2, userList['preferred_genre'].length - 1).split(",")];
        value = userList.preferred_genre
          .substring(1, userList.preferred_genre.length - 1)
          .replace(/"/g, "")
          .split(",");
        console.log(value);
      }
      let row = createData(keyNames[index], value);
      rowData.push(row);
    }
  });

  //console.log(typeof (rowData));
  //console.log(typeof (genre));
  //let genreArr = genre[0].split(',');
  //console.log(genreArr);

  //setRow(userList);
  const [sub, setSub] = React.useState(userList.user_type);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectItem, setSelectItem] = React.useState(null);
  const [selectEditItem, setSelectEditItem] = React.useState(false);
  const open = Boolean(anchorEl);

  //update subscription
  const updateSubscription = async (rowData, e) => {
    e.preventDefault();
    try {
      //let userId = sessionStorage.getItem('data');
      //console.log(rowData);
      const body = {
        user_id: userList.user_id,
        username: userList.username,
        firstname: userList.firstname,
        lastname: userList.lastname,
        email: userList.email,
        dob: userList.dob,
        user_type: sub,
        password: userList.password,
        token: userList.token,
        //preferred_genre: userList.preferred_genre.replace(/"/g,""),
        preferred_genre: userList.preferred_genre
          .substring(1, userList.preferred_genre.length - 1)
          .replace(/"/g, "")
          .split(","),
        recommended: userList.recommended
          .substring(1, userList.recommended.length - 1)
          .replace(/"/g, "")
          .split(",")
          .map((i) => Number(i)),
      };
      const id = userList["user_id"];

      console.log(body);
      console.log(JSON.stringify(body));

      const response = await fetch(
        "http://localhost:8080/user/" + id.toString(),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      ).then((response) => {
        if (response.status === 400) {
          alert("Oops");
        } else if (response.status === 200) {
          response.json().then((data) => {
            console.log(JSON.stringify(data));
          });
        }
      });
      window.location = "/admin/userSubscription";
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleSave = (e) => {
    e.preventDefault();
    setSelectEditItem(false);
    console.log("SAVED");
    updateSubscription(rowData, e);
  };
  const handleEdit = () => {
    setSelectEditItem(true);
  };
  const handleChange = (e) => {
    let tempItem = { key: "Subscription Type", value: e.target.value };
    rowData = rowData.map((item) =>
      item.key === "Subscription Type" ? tempItem : item
    );
    console.log(rowData);
    setSub(e.target.value);
  };
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User Details</StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData?.map((row) => (
              <StyledTableRow key={row.key} whiteSpace="normal">
                <StyledTableCell component="th" scope="row">
                  {/* {row == selectEditItem ? (
                    <TextField value={row} onChange={handleChange(row)} />
                  ) : (
                    row
                  )} */}
                  {row.key}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.key === "Preferences"
                    ? row.value?.map((item) => (
                        <Chip
                          label={item}
                          sx={{ mr: 1 }}
                          color="primary"
                          sx={{ mx: 1 }}
                        />
                      ))
                    : row.value}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.key === "Subscription Type" && selectEditItem ? (
                    <div>
                      <InputLabel id="demo-simple-select-label">
                        Subscription
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sub}
                        label="subscription"
                        onChange={(e) => handleChange(e)}
                        fullWidth
                      >
                        <MenuItem value="free">free</MenuItem>
                        <MenuItem value="premium">premium</MenuItem>
                        <MenuItem value="ultra">ultra</MenuItem>
                      </Select>
                    </div>
                  ) : null}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.key === "Subscription Type" &&
                    (selectEditItem ? (
                      <IconButton onClick={(e) => handleSave(e)}>
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton onClick={handleEdit}>
                        <Edit />
                      </IconButton>
                    ))}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
