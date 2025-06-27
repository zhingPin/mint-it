import Web3Modal from "web3modal";

let web3ModalInstance: Web3Modal | null = null;

const getWeb3Modal = () => {
  if (!web3ModalInstance) {
    web3ModalInstance = new Web3Modal({
      cacheProvider: true,
      providerOptions: {
        /* add WalletConnect, Coinbase Wallet, etc. if needed */
      },
    });
  }
  return web3ModalInstance;
};

export default getWeb3Modal;
