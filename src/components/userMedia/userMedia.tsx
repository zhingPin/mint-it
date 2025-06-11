import type React from "react"
import MediaList from "../mediaComponent/mediaList/mediaList"

interface UserMediaProps {
    query: string
    filter: string
}

const UserMedia: React.FC<UserMediaProps> = ({ query, filter }) => {
    const filterMode = filter === "Listed" ? "listed" : "owned"

    return (
        <MediaList
            query={query}
            filterMode={filterMode}
            emptyMessage={`No ${filter.toLowerCase()} NFTs found.`}
            loadingMessage="Loading your NFTs..."
        />
    )
}

export default UserMedia
