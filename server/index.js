const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const policies = [
  {
    id: 1,
    name: "Premium Health Guard",
    type: "Health",
    premium: 150,
    minAge: 18,
    maxAge: 65,
    coverage: 500000,
  },
  {
    id: 2,
    name: "Basic Life Shield",
    type: "Life",
    premium: 50,
    minAge: 20,
    maxAge: 70,
    coverage: 1000000,
  },
  {
    id: 3,
    name: "Safe Home Pro",
    type: "Home",
    premium: 80,
    minAge: 0,
    maxAge: 100,
    coverage: 200000,
  },
  {
    id: 4,
    name: "Auto Expert Plus",
    type: "Auto",
    premium: 120,
    minAge: 18,
    maxAge: 80,
    coverage: 300000,
  },
  {
    id: 5,
    name: "Senior Health Plus",
    type: "Health",
    premium: 300,
    minAge: 60,
    maxAge: 90,
    coverage: 800000,
  },
  {
    id: 6,
    name: "Young Star Health",
    type: "Health",
    premium: 70,
    minAge: 0,
    maxAge: 25,
    coverage: 200000,
  },
  {
    id: 7,
    name: "Ultimate Life Plan",
    type: "Life",
    premium: 200,
    minAge: 18,
    maxAge: 55,
    coverage: 5000000,
  },
  {
    id: 8,
    name: "Compact Auto",
    type: "Auto",
    premium: 45,
    minAge: 18,
    maxAge: 99,
    coverage: 50000,
  },
];

app.get("/api/policies", (req, res) => {
  let filtered = [...policies];
  const { type, maxPremium, age, minCoverage, search, sortBy } = req.query;

  if (type) {
    filtered = filtered.filter(
      (p) => p.type.toLowerCase() === type.toLowerCase(),
    );
  }
  if (maxPremium) {
    filtered = filtered.filter((p) => p.premium <= parseInt(maxPremium));
  }
  if (age) {
    const ageVal = parseInt(age);
    filtered = filtered.filter((p) => ageVal >= p.minAge && ageVal <= p.maxAge);
  }
  if (minCoverage) {
    filtered = filtered.filter((p) => p.coverage >= parseInt(minCoverage));
  }
  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }
  if (sortBy) {
    if (sortBy === "premium_asc")
      filtered.sort((a, b) => a.premium - b.premium);
    if (sortBy === "premium_desc")
      filtered.sort((a, b) => b.premium - a.premium);
    if (sortBy === "coverage_desc")
      filtered.sort((a, b) => b.coverage - a.coverage);
  }

  res.json(filtered);
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();

  // Simple intent detection
  if (
    msg.includes("health") ||
    msg.includes("life") ||
    msg.includes("auto") ||
    msg.includes("home") ||
    msg.includes("premium") ||
    msg.includes("age") ||
    msg.includes("coverage") ||
    msg.includes("search")
  ) {
    const filters = {};
    if (msg.includes("health")) filters.type = "Health";
    if (msg.includes("life")) filters.type = "Life";
    if (msg.includes("auto")) filters.type = "Auto";
    if (msg.includes("home")) filters.type = "Home";

    const premiumMatch = msg.match(/under (\d+)/) || msg.match(/premium (\d+)/);
    if (premiumMatch) filters.maxPremium = premiumMatch[1];

    const ageMatch = msg.match(/age (\d+)/) || msg.match(/(\d+) years old/);
    if (ageMatch) filters.age = ageMatch[1];

    const coverageMatch =
      msg.match(/coverage (\d+)/) || msg.match(/at least (\d+) coverage/);
    if (coverageMatch) filters.minCoverage = coverageMatch[1];

    return res.json({
      type: "guidance",
      filters: filters,
      message: "Updating your view with the requested policies.",
    });
  }

  res.json({
    type: "conversation",
    message:
      "I am your agentic broker! Ask me things like 'find health insurance for age 30 under 200' or just chat with me about your needs.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
