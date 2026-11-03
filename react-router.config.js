import { getAppBasename } from "./app-path.config.js";

/** @type {import("@react-router/dev/config").Config} */
export default {
  basename: getAppBasename(),
};
