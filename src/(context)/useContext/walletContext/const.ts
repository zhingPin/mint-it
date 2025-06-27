// Default network
export const DEFAULT_NETWORK =
    process.env.NODE_ENV !== "production"
        ? process.env.DEFAULT_NETWORK || "polygon_amoy"
        : (process.env.DEFAULT_NETWORK ?? "base");

