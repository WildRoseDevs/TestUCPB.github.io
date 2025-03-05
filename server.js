const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Session config
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve all static files (index.html, dashboard.html, etc.) from the current dir
app.use(express.static(__dirname));

const db = new sqlite3.Database("votes.db", (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to the SQLite database.");
});

// Create the 'votes' table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    vote TEXT,
    timestamp TEXT
  )
`);

// Simple auth middleware
function requireAuth(req, res, next) {
    if (req.session.user) next();
    else res.redirect("/login");
}

// Routes to serve pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/dashboard", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Login route
app.post("/login", (req, res) => {
    const { password } = req.body;
    // Example hashed password for "secret123" – adjust as needed
    const hashedPassword = "$2b$10$oWgeOBuKckEgsbBKIILCxuQgR/6i.2cQUtQhM1OARfPyVW53WfZ4e";

    bcrypt.compare(password, hashedPassword, (err, result) => {
        if (result) {
            req.session.user = true;
            res.redirect("/dashboard");
        } else {
            res.status(401).send("Unauthorized");
        }
    });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

// -------------------------------------------
// 1) Record a vote (public-facing route)
// -------------------------------------------
app.post("/vote", (req, res) => {
    const { question, vote } = req.body;
    const timestamp = new Date().toISOString();

    db.run(
        "INSERT INTO votes (question, vote, timestamp) VALUES (?, ?, ?)",
        [question, vote, timestamp],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }
            res.sendStatus(200);
        }
    );
});

// -------------------------------------------
// 2) Provide a list of questions (for the dashboard dropdown)
// -------------------------------------------
app.get("/api/questions", (req, res) => {
    // Hard-code or fetch from a 'questions' table. Must match how you store question IDs in the DB.
    const questions = [
        { id: "1", text: "Bill 37: Mental Health Services Protection Amendment Act" },
        { id: "2", text: "Bill 33: Protection of Privacy Act" },
        { id: "3", text: "Bill 34: Access to Information Act" },
        { id: "4", text: "Bill 35: All Season Resorts Act" },
        { id: "5", text: "Bill 36: Infrastructure Renewal Act" },
        { id: "6", text: "Bill 38: Education Enhancement Act" }
    ];
    res.json(questions);
});

// -------------------------------------------
// 3) Return votes for a given question/timeframe
// -------------------------------------------
app.get("/api/votes", (req, res) => {
    const { questionId, timeframe } = req.query;

    // Basic query: filter by question
    let sql = "SELECT * FROM votes WHERE question = ?";
    const params = [questionId];

    // Optional timeframe filter
    // We'll do a SQLite datetime check
    // (Requires your timestamps to be in ISO8601, which they are.)
    if (timeframe === "24h") {
        sql += " AND timestamp >= datetime('now', '-1 day')";
    } else if (timeframe === "7d") {
        sql += " AND timestamp >= datetime('now', '-7 day')";
    } else if (timeframe === "30d") {
        sql += " AND timestamp >= datetime('now', '-30 day')";
    }
    // if timeframe === "all", no extra filter

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.json(rows);
    });
});

// -------------------------------------------
// 4) Delete votes for a given question
// -------------------------------------------
app.post("/api/delete-votes", requireAuth, (req, res) => {
    const { questionId } = req.body;
    db.run("DELETE FROM votes WHERE question = ?", [questionId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.json({ success: true });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
