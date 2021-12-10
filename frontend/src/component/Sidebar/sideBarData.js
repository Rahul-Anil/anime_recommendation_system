/*
The code is used for the data needed inside the sidebar (index.js) they work as clickable buttons and store
data
*/

import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const sideBarData = [
  {
    title: "Overview",
    icon: <HomeIcon />,
    link: "/admin/overview",
  },
  {
    title: "Add Animes",
    icon: <AddIcon />,
    link: "/admin/addAnime",
  },
  {
    title: "Update Animes",
    icon: <SystemUpdateAltIcon />,
    link: "/admin/updateAnime",
  },
  {
    title: "User Subscriptions",
    icon: <CardMembershipIcon />,
    link: "/admin/userSubscription",
  },
  {
    title: "Anime Page",
    icon: <AccountCircleIcon />,
    link: "/main",
  },
  {
    title: "Log Out",
    icon: <LogoutIcon />,
    link: "/",
  },
];
