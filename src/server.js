const app = require("./app");
const PORT = process.env.PORT || 5000;
if (process.env.VERCEL !== "1") {
    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
    );
}

module.exports = app;

