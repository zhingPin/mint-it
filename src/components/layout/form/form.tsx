import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp } from "react-icons/md";
import {
    TiSocialFacebook,
    TiSocialTwitter,
    TiSocialInstagram,
} from "react-icons/ti";

import styles from "./form.module.css";
import FormField from "@/components/ui/form_Components/formField/formField";
import Input from "@/components/ui/form_Components/input/input";
import Textarea from "@/components/ui/form_Components/textArea/textArea";
import Select from "@/components/ui/form_Components/select/select";
import { Button } from "@/components/ui";


const Form = () => {
    return (
        <form className={styles.Form_box}>
            <div> {/* Profile Info */}
                <div className={styles.Form_section}>
                    <h3>Profile Information</h3>
                    <div className={styles.Form_box_input_grid}>
                        <FormField id="username" label="Username">
                            <Input id="username" placeholder="Enter your name" />
                        </FormField>

                        <FormField id="email" label="Email">
                            <Input id="email" placeholder="Your email" icon={<HiOutlineMail />} />
                        </FormField>

                        <FormField id="website" label="Website">
                            <Input id="website" placeholder="Your website" icon={<MdOutlineHttp />} />
                        </FormField>
                    </div>
                </div>

                {/* Bio & Genre */}
                <div className={styles.Form_section}>
                    <h3>About You</h3>
                    <div className={styles.Form_box_input_grid}>
                        <FormField id="description" label="Bio">
                            <Textarea id="description" placeholder="Write something about yourself" rows={4} />
                        </FormField>

                        <FormField id="genre" label="Genre">
                            <Select
                                id="genre"
                                options={[
                                    { label: "Select Genre", value: "" },
                                    { label: "Hip-Hop", value: "hip-hop" },
                                    { label: "Reggae", value: "reggae" },
                                    { label: "RnB", value: "rnb" },
                                ]}
                            />
                        </FormField>
                    </div>
                </div>

                {/* Social Media */}
                <div className={styles.Form_section}>
                    <h3>Social Links</h3>
                    <div className={styles.Form_box_input_grid}>
                        <FormField id="facebook" label="Facebook">
                            <Input id="facebook" placeholder="Your Facebook" icon={<TiSocialFacebook />} />
                        </FormField>

                        <FormField id="twitter" label="Twitter">
                            <Input id="twitter" placeholder="Your Twitter" icon={<TiSocialTwitter />} />
                        </FormField>

                        <FormField id="instagram" label="Instagram">
                            <Input id="instagram" placeholder="Your Instagram" icon={<TiSocialInstagram />} />
                        </FormField>
                    </div>
                </div></div>
            <div>
                <Button btnName="form button" />
            </div>

        </form>
    );
};

export default Form;
