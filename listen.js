
const app = require("./app/app");

const server = app.listen(9090, () => {
    console.log("Server is listening on port 9090");
});