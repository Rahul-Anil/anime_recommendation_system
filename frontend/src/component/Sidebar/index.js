/*
This code is the base of the sidebar in admin panel where all the data for 
add anime,update anime is stored.
*/

import React from "react";
import "../../App.css";
import { sideBarData } from "./sideBarData";
import { Switch, Route, withRouter } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Background from "../../assets/image/anime.jpg";
import AddTable from "../AddTable/index";
import UpdateAnime from "../UpdateAnime/index";
import { makeStyles } from "@mui/styles";
import UserSubscription from "../UserSubscription";
import Overview from "../AnimeOverview/index";

const useStyles = makeStyles({
  appMain: {
    paddingLeft: "100px",
    width: "100%",
  },
});

export default function Index() {
  const classes = useStyles();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "inline-flex",
        flexDirection: "row",
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      <BrowserRouter>
        <div className="Sidebar">
          <ul className="SidebarList">
            {sideBarData.map((val, key) => {
              return (
                <li
                  className="SidebarRow"
                  key={key}
                  onClick={() => {
                    window.location.pathname = val.link;
                  }}
                  id={window.location.pathname === val.link ? "active" : ""}
                >
                  <div id="icon">{val.icon}</div>
                  <div id="title">{val.title}</div>
                </li>
              );
            })}
          </ul>
        </div>

        <Switch>
        <Route exact path="/admin/overview">
            <div>
              <Overview />
            </div>
          </Route>
          <Route exact path="/admin/addAnime">
            <div>
              <AddTable />
            </div>
          </Route>
          <Route exact path="/admin/updateAnime">
            <div>
              <UpdateAnime />
            </div>
          </Route>
          <Route exact path="/admin/userSubscription">
            <div>
              <UserSubscription />
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
