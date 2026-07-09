import { getAvatar, getAvatars } from "./utils/roblox.js";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {

        if (req.query.ids) {

            const ids = req.query.ids
                .split(",")
                .map(Number);

            return res.json(
                await getAvatars(ids)
            );

        }

        if (!req.query.id) {

            return res.status(400).json({
                error: "Missing id."
            });

        }

        res.json({
            imageUrl: await getAvatar(req.query.id)
        });

    }

    catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

}