import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddTable from "../AddTable/index";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Menu,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

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

const useStyles = makeStyles(() => ({
  paper: { minWidth: "80vw" },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];

export default function EditTable({ animeList = [] }) {
  sessionStorage.setItem("currentPath", '/admin/updateAnime');
  const classes = useStyles();
  console.log(animeList);
  const [rows, setRows] = React.useState([]);
  const [animeListDefault, setAnimeListDefault] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectItem, setSelectItem] = React.useState(null);
  const [selectEditItem, setSelectEditItem] = React.useState(null);
  const [status, setStatus] = React.useState(false);
  const [eitem, setEitem] = React.useState(null);
  const [tempValue, setTempValue] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const open = Boolean(anchorEl);



  const fetchData = async () => {
    return await fetch('http://localhost:8080/show?page=1&page_size=1000')
      .then(response => response.json())
      .then(data => {
        setAnimeListDefault(data['results'])
      });
  }
  React.useEffect(() => { fetchData() }, []);

  const handleDelete = (item) => (event) => {
    setSelectItem(item);
    setAnchorEl(event.currentTarget);
  };
  const handleEdit = (item) => (e) => {
    //console.log(item);
    sessionStorage.setItem('anime',item.anime_id);
    setOpenModal(true);
    setStatus(true);
    setEitem(item);
  };
  const handleSave = (item) => (e) => {
    setSelectEditItem(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setStatus(false);
  };
  const handleChange = (value) => (e) => {
    setRows(() => {
      return rows.map((item) => (item == value ? e.target.value : item));
    });
    setSelectEditItem(e.target.value);
  };
  // const handleDeleteItem = () => {
  //   console.log("anchor==", anchorEl);
  //   console.log(selectItem);

  //   setRows(() => {
  //     return rows.filter((item, index) => item !== selectItem);
  //   });
  //   setAnchorEl(null);
  // };

  async function handleDeleteItem() {
    console.log(selectItem['anime_id']);
    try {
      const id = selectItem['anime_id'];
      const deleteAnime = await fetch(`http://localhost:8080/show/${id}`, {
        method: "DELETE"
      });
      console.log(animeListDefault);
      setRows(animeListDefault.filter((item, index) => item !== selectItem));
      window.location = "/admin/updateAnime";
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    sessionStorage.removeItem('anime');
  };

  return (
    <div>
      <br /><br />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>name</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
              {/* <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
            <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
            <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {animeList?.map((row) => (
              <StyledTableRow key={row.anime_id}>
                <StyledTableCell component="th" scope="row">
                  {row.anime_id == selectEditItem ? (
                    <TextField value={row.name} onChange={handleChange(row.name)} />
                  ) : (
                    row.name
                  )}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row == selectEditItem ? (
                    <IconButton onClick={handleSave(row)}>
                      <Save />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleEdit(row)}>
                      <Edit />
                    </IconButton>
                  )}

                  <IconButton onClick={handleDelete(row)}>
                    <Delete />
                  </IconButton>
                </StyledTableCell>
                {/* <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ padding: "2px" }}>
          <Typography>Are you sure?</Typography>
          <Button onClick={handleDeleteItem}>yes</Button>
          <Button onClick={handleClose}>no</Button>
        </Box>
      </Menu>
      <Dialog
        open={openModal}
        classes={{ paper: classes.paper }}
        onClose={handleModalClose}
      >
        <AddTable />
      </Dialog>
    </div>
  );
}
