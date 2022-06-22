import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";

const MainListItems = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };
  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate("/dashboard")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary={"Dashboard"} />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/dashboard/categories")}>
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary={"Categories"} />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/dashboard/subCategories")}>
        <ListItemIcon>
          <CategoryOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary={"SubCategories"} />
      </ListItemButton>
      <ListItemButton onClick={() => navigate("/dashboard/flashCards")}>
        <ListItemIcon>
          <StickyNote2Icon />
        </ListItemIcon>
        <ListItemText primary={"Flashcards"} />
      </ListItemButton>
      <ListItemButton onClick={logout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
};
export default MainListItems;
