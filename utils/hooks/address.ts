export const shortenAddress = (address: string): string =>
    address && address.length > 0
        ? `${address.slice(0, 5)}...${address.slice(-4)}`
        : ""; // Return an empty string if the address is invalid or empty
export const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}