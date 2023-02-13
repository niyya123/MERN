import express from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import accountRouter from "./account.route";
import addressRouter from "./address.route";
import userAdminRouter from "./userAdmin.route";
import eventAdminRouter from "./event";
import bodyRouter from "./body";
import cardRouter from "./card";
import buildingRouter from "./buildingRoute";

const route = (app) => {
  app.use("/api/admin/users", userAdminRouter);
  app.use("/api/admin/event", eventAdminRouter);
  app.use("/api/admin/card", cardRouter);
  app.use("/api/user", userRouter);
  app.use("/api/account", accountRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/body", bodyRouter);
  app.use("/api/building", buildingRouter);
  app.use("/api/address", addressRouter);

  app.get("/api", function (req, res) {
    res.send("GIS 3D - IE403.N11");
  });
};

export default route;
