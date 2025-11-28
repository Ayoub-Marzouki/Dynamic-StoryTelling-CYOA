import createServer from "./src/server.js";
import connectDB from "./src/db.js";
import seedDatabase from "./src/seeder.js";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    await connectDB();
    await seedDatabase();
    const server = createServer();
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}.\n`);
    });
}

main();