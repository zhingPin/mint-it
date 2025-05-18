"use client";
import React, { useContext, useState } from "react";
import formStyles from "@/components/layout/form/form.module.css"
import { Button } from "@/components/ui";
import { MediaContext } from "@/providers/mediaProvider";
import { NftContext } from "@/providers/nftProvider";
import { useRouter } from "next/navigation";
import { NftImage } from "../../../../types/media-types";

const UploadForm = () => {
    const router = useRouter();

    const mediaContext = useContext(MediaContext);
    const nftContext = useContext(NftContext);

    if (!mediaContext || !nftContext) {
        throw new Error("UploadForm must be used within MediaProvider and NftProvider");
    }

    const { mediaData, } = mediaContext;
    const { createNFT } = nftContext;

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("none");
    const [price, setPrice] = useState("");
    const [royalties, setRoyalties] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleSubmit = async () => {
        if (!mediaData.image) {
            alert("Please upload a file first.");
            console.log("mediaData", mediaData)
            return;
        }

        if (!title || !price || !quantity) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!createNFT) {
            console.error("createNFT function is not defined.");
            alert("Failed to create NFT. Please try again later.");
            return;
        }

        try {
            await createNFT({
                name: title,
                description,
                price,
                // image: mediaData.image?.fileUrl,
                image: {
                    fileType: mediaData.image.fileType as NftImage["fileType"],
                    fileUrl: mediaData.image.fileUrl,
                    fileSize: mediaData.image.fileSize,

                },
                media: mediaData.media,
                royaltyPercentage: parseFloat(royalties) || 0,
                quantity: parseInt(quantity, 10) || 1,
                genre,
                router: router, // Pass a string value
            });

            // alert("NFT created successfully!");
        } catch (error) {
            console.error("Error creating NFT:", error);
            alert("Failed to create NFT. Please try again.");
        }
    };

    return (
        <div>
            <form className={formStyles.Form_box} onSubmit={(e) => e.preventDefault()}>
                <div className={formStyles.Form_box_input_grid}>
                    <div className={`${formStyles.Form_box_input} small_input`}>
                        <label htmlFor="title">Title</label>
                        <div className={formStyles.Form_box_input_box}>
                            <input
                                type="text"
                                placeholder="Enter the title"
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={`${formStyles.Form_box_input} large_input`}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            cols={20}
                            rows={5}
                            placeholder="Write a description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <div className={formStyles.Form_box_input_grid}>
                    <div className={formStyles.Form_box_input}>
                        <label htmlFor="genre">Genre</label>
                        <select
                            name="genre"
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="hip-hop">Hip-Hop</option>
                            <option value="reggae">Reggae</option>
                            <option value="RnB">RnB</option>
                        </select>
                    </div>
                </div>
                <div className={formStyles.Form_box_input_grid}>
                    <div className={`${formStyles.Form_box_input} small_input`}>
                        <label htmlFor="price">Price</label>
                        <div className={formStyles.Form_box_input_box}>
                            <input
                                type="number"
                                placeholder="Enter the price"
                                id="price"
                                name="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={`${formStyles.Form_box_input} small_input`}>
                        <label htmlFor="royalties">Royalties</label>
                        <div className={formStyles.Form_box_input_box}>
                            <input
                                type="number"
                                placeholder="Enter Royalty %"
                                id="royalties"
                                name="royalties"
                                value={royalties}
                                onChange={(e) => setRoyalties(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={`${formStyles.Form_box_input} small_input`}>
                        <label htmlFor="quantity">Quantity</label>
                        <div className={formStyles.Form_box_input_box}>
                            <input
                                type="number"
                                placeholder="Enter Quantity"
                                id="quantity"
                                name="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <Button btnName="Upload Media" handleClick={handleSubmit} />
            </form>
        </div>
    );
};

export default UploadForm;