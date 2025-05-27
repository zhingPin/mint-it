"use client";
import React, { useContext, useState } from "react";
import formStyles from "@/components/layout/form/form.module.css";
import Input from "@/components/ui/form_Components/input/input";
import Textarea from "@/components/ui/form_Components/textArea/textArea";
import Select from "@/components/ui/form_Components/select/select";
import { Button } from "@/components/ui"; import { MediaContext } from "@/providers/mediaProvider";
import { NftContext } from "@/providers/nftProvider";
import { useRouter } from "next/navigation";
import { NftImage } from "../../../../types/media-types";
import FormField from "@/components/ui/form_Components/formField/formField";

const UploadForm = () => {
    const router = useRouter();

    const mediaContext = useContext(MediaContext);
    const nftContext = useContext(NftContext);

    if (!mediaContext || !nftContext) {
        throw new Error("UploadForm must be used within MediaProvider and NftProvider");
    }

    const { mediaData } = mediaContext;
    const { createNFT } = nftContext;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("none");
    const [price, setPrice] = useState("");
    const [royalties, setRoyalties] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleSubmit = async () => {
        if (!mediaData.image) {
            alert("Please upload a file first.");
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
                image: {
                    fileType: mediaData.image.fileType as NftImage["fileType"],
                    fileUrl: mediaData.image.fileUrl,
                    fileSize: mediaData.image.fileSize,
                },
                media: mediaData.media,
                royaltyPercentage: parseFloat(royalties) || 0,
                quantity: parseInt(quantity, 10) || 1,
                genre,
                router: router,
            });
        } catch (error) {
            console.error("Error creating NFT:", error);
            alert("Failed to create NFT. Please try again.");
        }
    };

    return (
        <div>
            <form className={formStyles.Form_box} onSubmit={(e) => e.preventDefault()}>
                <div className={formStyles.Form_box_input_grid}>
                    <FormField label="Title" id="title" className="small_input">
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter the title"
                            value={title}
                            onChange={(val) => setTitle(val)}
                        />
                    </FormField>
                </div>
                <div className={formStyles.Form_box_input_grid}>
                    <FormField label="Description" id="description" className="large_input">
                        <Textarea
                            id="description"
                            placeholder="Write a description"
                            value={description}
                            onChange={(val) => setDescription(val)}
                            rows={5}
                        />
                    </FormField>

                    <FormField label="Genre" id="genre">
                        <Select
                            id="genre"
                            name="genre"
                            value={genre}
                            onChange={(val) => setGenre(val)}
                            options={[
                                { value: "none", label: "None" },
                                { value: "hip-hop", label: "Hip-Hop" },
                                { value: "reggae", label: "Reggae" },
                                { value: "RnB", label: "RnB" },
                            ]}
                        />
                    </FormField>

                </div>

                <div className={formStyles.Form_box_input_grid}>
                    <div className={formStyles.Form_box_input_grid_number}>
                        <FormField label="Price" id="price" className="small_input">
                            <Input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Enter the price"
                                value={price}
                                onChange={(val) => setPrice(val)}
                            />
                        </FormField>

                        <FormField label="Royalties" id="royalties" className="small_input">
                            <Input
                                type="number"
                                id="royalties"
                                name="royalties"
                                placeholder="Enter Royalty %"
                                value={royalties}
                                onChange={(val) => setRoyalties(val)}
                            />
                        </FormField>

                        <FormField label="Quantity" id="quantity" className="small_input">
                            <Input
                                type="number"
                                id="quantity"
                                name="quantity"
                                placeholder="Enter Quantity"
                                value={quantity}
                                onChange={(val) => setQuantity(val)}
                            />
                        </FormField>
                    </div>
                </div>


                <Button btnName="Upload Media" handleClick={handleSubmit} />
            </form>
        </div>
    );
};

export default UploadForm;
