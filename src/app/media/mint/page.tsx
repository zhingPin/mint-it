import Dropzone from '@/components/uploadMedia/dropzone/dropzone'
import PreviewCard from '@/components/uploadMedia/previewCard/previewCard'
import UploadForm from '@/components/uploadMedia/uploadForm/uploadForm'
import styles from "./page.module.css"
import UploadFormat from '@/components/uploadMedia/uploadFormat/uploadFormat'
// import { BiUpload } from 'react-icons/bi'


const Page = () => {
    return (
        <div className={styles.upload_page}>
            <div className={styles.upload_container}>

                <div className={styles.dropzone_boxes}>
                    <Dropzone type="image" />
                    <Dropzone type="media" />
                </div>
                <PreviewCard />
            </div>

            <UploadFormat />

            <UploadForm />

        </div >

    )
}

export default Page