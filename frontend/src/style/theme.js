import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4643D3",
    },
    secondary: {
      main: "#E3E8E6",
    },
  },
  typography: {
    h3: {
      fontSize: 36,
      lineHeight: "45.18px",
      letterSpacing: "0.4px",
      fontWeight: 700,
    },
    h6: {
      fontSize: 24,
      lineHeight: "29.26px",
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      fontWeight: 600,
    },
  },
  //   typography: {
  //     fontFamily: "Cinzel",
  //     h1: { fontSize: 33, fontWeight: 700, letterSpacing: "0.06em" },
  //     h5: {
  //       fontSize: 26,
  //       fontFamily: "Source Sans Pro",
  //       fontWeight: 400,
  //       lineHeight: "33.8px",
  //     },
  //     h6: { fontSize: 24, lineHeight: "28.8px", fontWeight: 400 },
  //     caption: { fontSize: 61, textTransform: "uppercase", lineHeight: "80px" },
  //     body2: {
  //       fontSize: 40,
  //       textTransform: "uppercase",
  //       fontWeight: 400,
  //       lineHeight: "52px",
  //     },
  //     subtitle1: { fontSize: 26, fontFamily: "Source Sans Pro" },
  //     subtitle2: { fontSize: 20, fontFamily: "Open Sans" },
  //   },
});
