import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineHttp } from "react-icons/md";
import {
    TiSocialFacebook,
    TiSocialTwitter,
    TiSocialInstagram,
} from "react-icons/ti";

//INTERNAL IMPORT
import styles from "./form.module.css";
// import { Button } from "../../components/componentsIndex";

const Form = () => {
    return (
        <>
            <form className={styles.Form_box}>
                {/* Profile Info */}
                <div className={styles.Form_section}>
                    <h3>Profile Information</h3>
                    <div className={styles.Form_box_input_grid}>
                        <div className={styles.Form_box_input}>
                            <label htmlFor="username">Username</label>
                            <input type="text" placeholder="Enter your name" id="username" />
                        </div>

                        <div className={styles.Form_box_input}>
                            <label htmlFor="email">Email</label>
                            <div className={styles.Form_box_input_box}>
                                <HiOutlineMail />
                                <input type="text" placeholder="Your email" id="email" />
                            </div>
                        </div>

                        <div className={styles.Form_box_input}>
                            <label htmlFor="website">Website</label>
                            <div className={styles.Form_box_input_box}>
                                <MdOutlineHttp />
                                <input type="text" placeholder="Your website" id="website" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio & Genre */}
                <div className={styles.Form_section}>
                    <h3>About You</h3>
                    <div className={styles.Form_box_input_grid}>
                        <div className={styles.Form_box_input}>
                            <label htmlFor="description">Bio</label>
                            <textarea
                                id="description"
                                rows={4}
                                placeholder="Write something about yourself"
                            ></textarea>
                        </div>

                        <div className={styles.Form_box_input}>
                            <label htmlFor="genre">Genre</label>
                            <select id="genre">
                                <option value="">Select Genre</option>
                                <option value="hip-hop">Hip-Hop</option>
                                <option value="reggae">Reggae</option>
                                <option value="rnb">RnB</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className={styles.Form_section}>
                    <h3>Social Links</h3>
                    <div className={styles.Form_box_input_grid}>
                        <div className={styles.Form_box_input}>
                            <label htmlFor="facebook">Facebook</label>
                            <div className={styles.Form_box_input_box}>
                                <TiSocialFacebook />
                                <input type="text" id="facebook" placeholder="Your Facebook" />
                            </div>
                        </div>

                        <div className={styles.Form_box_input}>
                            <label htmlFor="twitter">Twitter</label>
                            <div className={styles.Form_box_input_box}>
                                <TiSocialTwitter />
                                <input type="text" id="twitter" placeholder="Your Twitter" />
                            </div>
                        </div>

                        <div className={styles.Form_box_input}>
                            <label htmlFor="instagram">Instagram</label>
                            <div className={styles.Form_box_input_box}>
                                <TiSocialInstagram />
                                <input type="text" id="instagram" placeholder="Your Instagram" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Form;