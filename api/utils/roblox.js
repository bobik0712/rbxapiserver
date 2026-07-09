const CACHE = new Map();

const CACHE_TIME = 60000;

export async function robloxRequest(url, options = {}) {

    const key = url + JSON.stringify(options);

    const cached = CACHE.get(key);

    if (cached && cached.expires > Date.now()) {

        return cached.data;

    }

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    if (!response.ok) {

        throw new Error(
            `Roblox API Error (${response.status})`
        );

    }

    const data = await response.json();

    CACHE.set(key, {

        data,

        expires: Date.now() + CACHE_TIME

    });

    return data;

}

export async function getUser(username) {

    const data = await robloxRequest(
        "https://users.roblox.com/v1/usernames/users",
        {
            method: "POST",
            body: JSON.stringify({
                usernames: [username],
                excludeBannedUsers: false
            })
        }
    );

    if (!data.data.length) {

        throw new Error("User not found");

    }

    return data.data[0];

}

export async function getProfile(userId) {

    return await robloxRequest(
        `https://users.roblox.com/v1/users/${userId}`
    );

}

export async function getAvatar(userId) {

    const data = await robloxRequest(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png&isCircular=false`
    );

    return data.data[0].imageUrl;

}

export async function getFriends(userId) {

    const data = await robloxRequest(
        `https://friends.roblox.com/v1/users/${userId}/friends`
    );

    return data.data;

}

export async function getFollowers(userId) {

    return await robloxRequest(
        `https://friends.roblox.com/v1/users/${userId}/followers/count`
    );

}

export async function getFollowing(userId) {

    return await robloxRequest(
        `https://friends.roblox.com/v1/users/${userId}/followings/count`
    );

}

export async function getPresence(userId) {

    const data = await robloxRequest(
        "https://presence.roblox.com/v1/presence/users",
        {
            method: "POST",
            body: JSON.stringify({
                userIds: [Number(userId)]
            })
        }
    );

    return data.userPresences[0];

}

export async function getAvatars(userIds) {

    const ids = userIds.join(",");

    const data = await robloxRequest(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids}&size=180x180&format=Png&isCircular=false`
    );

    return data.data;

}