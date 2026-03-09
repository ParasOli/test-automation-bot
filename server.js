// server.js
require('dotenv').config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Slack slash command endpoint
app.post("/run-tests", async (req, res) => {
  const { user_name } = req.body;

  try {
    // Trigger GitHub Actions workflow
    await axios.post(
      `https://api.github.com/repos/ParasOli/saucedemo-ui-automation/actions/workflows/main.yml/dispatches`,
      { ref: "main" },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    res.send(`🚀 @${user_name} triggered the UI tests successfully!`);

  } catch (error) {
    console.error(error.message);
    res.send(`❌ Failed to trigger tests. Check server logs.`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Slack QA Bot running on port ${PORT}`));