# 🎪 nftMarketplace — Greatest Show On Earth (GSOE)

A decentralized NFT marketplace focused on fair artist compensation, streamlined media management, and multi-role smart contract architecture. Built with **Next.js**, **TypeScript**, **Solidity**, and a modular UI component system.

## 🚀 Features

- 🎨 Batch NFT minting with media & metadata support
- 💰 Creator royalties with multi-recipient splitting
- 🧠 Role-based delegation for artist managers, producers, etc.
- 📁 Media & image uploads with format preview
- 🛒 Listing, delisting, and buying NFTs
- 🔗 IPFS integration for decentralized storage
- 🧱 Built on smart contracts with access control and custom logic

## 📦 Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, CSS Modules
- **Blockchain**: Solidity (ERC721/1155-style), Hardhat/Foundry
- **Storage**: IPFS via NFT.Storage or Pinata
- **State Management**: React Context API
- **Styling**: CSS Modules + utility components
- **Wallets**: Ethers.js or Wagmi (TBD)

## 📁 Project Structure (WIP)

/components
/ui
/form_Components
/buttons
/layout
/media
/pages
/app
/contracts # Solidity smart contracts
/providers
mediaProvider.tsx
nftProvider.tsx
/styles
/types
/utils

markdown
Copy
Edit

## 🧩 Key Modules

### 📄 `UploadForm`

A user-facing form that allows uploading media and metadata to mint NFTs. Uses:
- `Input`, `Textarea`, `Select` UI components
- `FormField` wrappers for validation and layout
- `mediaProvider` for uploaded file data
- `nftProvider` for triggering smart contract minting

### 🧠 Providers

- **`mediaProvider`**: Manages uploaded media state (file type, size, etc.)
- **`nftProvider`**: Handles NFT creation, interacting with deployed contracts

## 🔐 Smart Contracts

- `NFTMarketplace.sol`: Batch minting, royalty enforcement, listing/delisting, and metadata resolution
- Uses `AccessControl` for role management
- Custom royalty logic supporting multiple recipients

## 📸 UI Components

Reusable input components with form wrappers:
- `Input`, `Textarea`, `Select`
- `FormField` handles layout, validation, and labels
- Modular CSS for layout control (`form.module.css`, `uploadFormat.module.css`)

## 🧪 Testing

- **Unit Tests**: Written in TypeScript for frontend
- **Solidity Tests**: (TBD) using Hardhat or Foundry

## 🛠️ Setup

```bash
git clone https://github.com/yourname/nftMarketplace.git
cd nftMarketplace
npm install
npm run dev
🗺️ Roadmap
 Integrate WalletConnect & MetaMask

 Add multi-network support (Polygon, Base, etc.)

 Smart contract unit & integration tests

 Marketplace UI for browsing, buying

 User profiles & management dashboard

 Upload drag & drop w/ progress indicator

🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss major changes.

📜 License
MIT

Built with ❤️ for artists, by artists.