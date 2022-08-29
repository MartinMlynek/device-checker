import axios from "axios";

const URL = "https://js-test-api.etnetera.cz/api/v1";
const client = axios.create({
  baseURL: URL,
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

export const addToken = (token: string) => {
  client.defaults.headers.common["Auth-Token"] = token;
};

export const removeToken = () => {
  delete client.defaults.headers.common["Auth-Token"];
};

export const isTokenAdded = () => {
  return client.defaults.headers.common["Auth-Token"] !== undefined;
};

export default client;
