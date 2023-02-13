import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_SERVER_PATH}/api/`;

export const hostServer = process.env.REACT_APP_SERVER_PATH;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = () => {
  let user = JSON.parse(localStorage.getItem("persist:root"))
    ? JSON.parse(localStorage.getItem("persist:root")).user
    : undefined;
  let current = user !== undefined ? JSON.parse(user).current : undefined;
  
  let TOKEN = (current === undefined || current === null) ? "" : current.token;
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};

export const eventRequest = () => {
  let event = JSON.parse(localStorage.getItem("persist:root"))
    ? JSON.parse(localStorage.getItem("persist:root")).event
    : undefined;
  let current = event !== undefined ? JSON.parse(event).current : undefined;
  let TOKEN = (current === undefined || current === null) ? "" : current.token;

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};

export const buildingRequest = () => {
  let building = JSON.parse(localStorage.getItem("persist:root"))
    ? JSON.parse(localStorage.getItem("persist:root")).building
    : undefined;

  let current = building !== undefined ? JSON.parse(building).current : undefined;
  let TOKEN = (current === undefined || current === null) ? "" : current.token;

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};