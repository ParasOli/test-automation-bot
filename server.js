// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Slack slash command endpoint
app.post("/run-ui-tests", async (req, res) => {
  const { user_name, text } = req.body;

  // Trigger GitHub workflow
  try {
    const response = await fetch(
      "https://api.github.com/repos/ParasOli/saucedemo-ui-automation/actions/workflows/main.yml/dispatches",
      {
        method: "POST",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          ref: "main", // branch to run workflow on
        }),
      }
    );

    if (response.ok) {
      return res.send(`Hey ${user_name}, your UI tests are running! 🚀`);
    } else {
      const text = await response.text();
      return res.send(`Failed to trigger workflow. GitHub responded with: ${text}`);
    }
  } catch (err) {
    return res.send(`Error triggering workflow: ${err.message}`);
  }
});

// Optional health check for Render
app.get("/healthz", (req, res) => res.send("OK"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
