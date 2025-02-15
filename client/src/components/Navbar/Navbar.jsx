import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Rooms from "../Rooms/Rooms";
import { styled } from "@mui/system";
import { grey } from "@mui/material/colors";
import "../../index.css";

const Navbar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const BlackButton = styled(Button)(() => ({
    color: grey.A100,
    borderRadius: "25px",
    margin: "2px",
    backgroundColor: grey[900],
    padding: "8px 16px",
    "&:hover": {
      backgroundColor: grey[800],
    },
  }));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  // Extract the full name from the user's full name
  const fullName = user.name;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={6}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton disableRipple onClick={() => setOpen(!open)}>
            {!open ? (
              <MenuRoundedIcon fontSize="large" />
            ) : (
              <CloseIcon fontSize="large" />
            )}
          </IconButton>
          <Typography
            component="p"
            variant="h4"
            sx={{ flexGrow: 1, fontFamily: "cursive" }}
          >
            IA
            <Box
              component="span"
              sx={{ display: { xs: "none", md: "inline" }, fontSize: "20px" }}
            >
              {" "}
              Interaction Application
            </Box>
          </Typography>
          <Tooltip title={fullName} arrow>
            <BlackButton
              variant="contained"
              startIcon={<ExitToAppIcon />}
              onClick={logout}
            >
              Logout
            </BlackButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{ flexShrink: 0 }}
        variant="persistent"
        transitionDuration={2}
        anchor={"left"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Rooms setOpen={setOpen} />
      </Drawer>
    </>
  );
};

export default Navbar;
