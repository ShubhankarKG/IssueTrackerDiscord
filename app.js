const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.eventNames.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})