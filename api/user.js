import { getUser } from "../utils/roblox.js";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {

        const { username } = req.query;

        if (!username) {
            return res.status(400).json({
                error: "Missing username."
            });
        }

        const user = await getUser(username);

        res.status(200).json({
            id: user.id,
            name: user.name,
            displayName: user.displayName
        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

}