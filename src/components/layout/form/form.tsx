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
                <div className={styles.Form_box_input_grid}>
                    <div className={`${styles.Form_box_input} small_input`}>
                        <label htmlFor="name">Username</label>
                        <div className={styles.Form_box_input_box}>
                            <input
                                type="text"
                                placeholder="Enter your Name"
                                id="username"
                                name="username"
                            />
                        </div>
                    </div>

                    <div className={`${styles.Form_box_input} small_input`}>
                        <label htmlFor="email">Email</label>
                        <div className={styles.Form_box_input_box}>
                            <div className={styles.Form_box_input_box_icon}>
                                <HiOutlineMail />
                            </div>
                            <input type="text" placeholder="Your E-mail" />
                        </div>
                    </div>
                    <div className={styles.Form_box_input}>
                        <label htmlFor="website">Website</label>
                        <div className={styles.Form_box_input_box}>
                            <div className={styles.Form_box_input_box_icon}>
                                <MdOutlineHttp />
                            </div>

                            <input
                                type="text"
                                placeholder="Your Website"
                                id="website"
                                name="website"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.Form_box_input_grid}>

                    <div className={`${styles.Form_box_input} large_input`}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            name=""
                            id=""
                            cols={20}
                            rows={5}
                            placeholder="Write something about yourself in few words"
                        ></textarea>
                    </div>

                    <div className={`${styles.Form_box_input} medium_input`}>
                        <label htmlFor="facebook">Facebook</label>
                        <div className={styles.Form_box_input_box}>
                            <div className={styles.Form_box_input_box_icon}>
                                <TiSocialFacebook />
                            </div>
                            <input
                                type="text"
                                placeholder="Your Facebook Address"
                                id="facebook"
                                name="facebook"
                            />
                        </div>
                    </div>
                    <div className={`${styles.Form_box_input} medium_input`}>
                        <label htmlFor="twitter">Twitter</label>
                        <div className={styles.Form_box_input_box}>
                            <div className={styles.Form_box_input_box_icon}>
                                <TiSocialTwitter />
                            </div>
                            <input
                                type="text"
                                placeholder="Your Twitter Address"
                                id="twitter"
                                name="twitter"
                            />
                        </div>
                    </div>
                    <div className={`${styles.Form_box_input} medium_input`}>
                        <label htmlFor="Instragram">Instragram</label>
                        <div className={styles.Form_box_input_box}>
                            <div className={styles.Form_box_input_box_icon}>
                                <TiSocialInstagram />
                            </div>
                            <input
                                type="text"
                                placeholder="Your Instagram Address"
                                id="instagram"
                                name="instagram"
                            />
                        </div>
                    </div>
                    <div className={styles.Form_box_input}>
                        <label htmlFor="Genre">Genre</label>
                        <select name="genre" id="genre">
                            <option value="none">None</option>
                            <option value="hip-hop">Hip-Hop</option>
                            <option value="reggae">Reggae</option>
                            <option value="'RnB'">RnB</option>
                        </select>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Form;