import { REST_BASE_URL } from "@constants/constants";

export const fetchPlaylist = async(author_id:number, token:string | undefined = undefined): Promise<ServerResponse> => {
    try {
        const response = await fetch(
            `${REST_BASE_URL}/authors/${author_id}/playlists`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    ...(token && {"Authorization": `Bearer ${token}`}),
                },
            }
        )

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        const result: ServerResponse = await response.json();
        return result;
    } catch (error) {
        console.error("Playlist request error:", error);
        throw error;
    }
}