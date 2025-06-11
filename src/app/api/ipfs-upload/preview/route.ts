// import { uploadBufferToIpfs } from "../../../../../lib/ipfs-client";
import { NextResponse } from "next/server";


export const runtime = "nodejs"

// export async function POST(req: NextRequest) {
//     const data = await req.formData();
//     const file = data.get("file") as File;

//     if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const tempPath = join(tmpdir(), file.name);
//     const outputPath = join(tmpdir(), `processed-${file.name}`);
//     try {
//         // Save uploaded file temporarily
//         await fs.writeFile(tempPath, buffer);

//         // Use fluent-ffmpeg to process the media
//         const ffmpeg = require("fluent-ffmpeg");
//         const command = ffmpeg(tempPath)
//             .outputOptions("-ss 00:00:01.000")
//             .outputOptions("-vframes 1")
//             .output(outputPath)
//             .on("end", async () => {
//                 try {
//                     const thumbBuffer = await fs.readFile(outputPath);
//                     const previewUrl = await uploadBufferToIpfs(thumbBuffer, "preview.jpg", "image/jpeg");

//                     // Clean up temporary files
//                     await fs.unlink(tempPath);
//                     await fs.unlink(outputPath);

//                     return NextResponse.json({
//                         message: "Processing complete",
//                         previewUrl,
//                     });
//                 } catch (err) {
//                     console.error("Post-processing error:", err);
//                     return NextResponse.json({ error: "Thumbnail upload failed" }, { status: 500 });
//                 }
//             })
//             .on("error", (err: any) => {
//                 console.error("FFmpeg error:", err);
//                 return NextResponse.json({ error: "Processing failed" }, { status: 500 });
//             });

//         command.run();
//     } catch (err: any) {
//         console.error("Media processing error:", err);
//         return NextResponse.json({ error: `Media processing failed: ${err.message}` }, { status: 500 });
//     }
// }

export async function GET() {
    console.log("Hello Get API route called");
    return NextResponse.json({ message: "Hello, world!" });
}
