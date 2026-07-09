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
                error: "User ID is required."
            });
        }

        const response = await fetch(
            `https://users.roblox.com/v1/users/${id}`
        );

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Failed to load profile."
            });
        }

        const data = await response.json();

        res.status(200).json(data);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Internal Server Error"
        });

    }

}