import Dropzone from '@/components/uploadMedia/dropzone/dropzone'
import PreviewCard from '@/components/uploadMedia/previewCard/previewCard'
import UploadForm from '@/components/uploadMedia/uploadForm/uploadForm'
import styles from "./page.module.css"
import UploadFormat from '@/components/uploadMedia/uploadFormat/uploadFormat'


const Page = () => {
    return (
        <div className={styles.upload_page}>
            <div className="flex">
                <div className={styles.upload_container}>
                    <Dropzone type="image" />
                    <Dropzone type="media" />
                </div>
                <div className={styles.upload_container}>
                    <PreviewCard />
                </div>

            </div>
            <UploadFormat />
            <UploadForm />

        </div>

    )
}

export default Page