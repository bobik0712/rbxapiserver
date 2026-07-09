import { getFriends, getAvatars } from "./utils/roblox.js";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                error: "Missing user id."
            });
        }

        const friends = await getFriends(id);

        const ids = friends.map(friend => friend.id);

        const avatars = ids.length > 0
            ? await getAvatars(ids)
            : [];

        const avatarMap = {};

        for (const avatar of avatars) {

            avatarMap[avatar.targetId] = avatar.imageUrl;

        }

        const result = friends.map(friend => ({

            id: friend.id,
            name: friend.name,
            displayName: friend.displayName,
            avatar: avatarMap[friend.id] || ""

        }));

        res.status(200).json({

            count: result.length,
            friends: result

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }

}