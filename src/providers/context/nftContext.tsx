"use client";
import React from "react";
import { CreateNftInput, NftData } from "../../../types/media-types";
import { IPFSHTTPClient } from "ipfs-http-client";
export interface NftContextProps {
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  fetchNFTsByOwner: (type: string) => Promise<NftData[] | undefined>;
  fetchMarketsNFTs: () => Promise<NftData[] | undefined>;
  createNFT: (input: CreateNftInput) => Promise<void>
  buyNFT: (tokenId: number, price: string) => Promise<void>; // Updated type
  client?: IPFSHTTPClient; // Replace 'any' with the actual type of your client
}

