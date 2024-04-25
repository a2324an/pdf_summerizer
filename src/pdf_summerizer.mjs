import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import fs from "fs";
import crypto from "crypto";
import ChatGPT from "./chatgpt.mjs";
import path from "path";

const hash = crypto.createHash('md5');


fs.mkdirSync("config", { recursive: true });
const openai_config_file_path = path.join(process.cwd(), "config/chatgpt.json");
const system_prompt_file_path = path.join(process.cwd(), "config/system_prompt.txt");

if (!fs.existsSync(openai_config_file_path)) {
    fs.writeFileSync(openai_config_file_path, JSON.stringify({OPENAI_API_KEY:"<Your API KEY>"}));
}

const chatgpt_config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "config/chatgpt.json"), "utf-8"));
if (chatgpt_config.OPENAI_API_KEY.indexOf("<")>=0) {
    console.error("Please set your OpenAI API KEY in config/chatgpt.json file.");
    process.exit(1);
}
const chatgpt = ChatGPT(chatgpt_config);



if (!fs.existsSync(system_prompt_file_path)) {
    fs.writeFileSync(system_prompt_file_path,
`PDFのサマリを作成するBOT。
PDFからテキスト抽出したデータだが、きちんとしたドキュメントに加工したい。
また要点を

[目的]
[年度]
[使用技術]
[結論]
[使用データセット]
[ジャンル](サビース・マイニング・チューニングなど)

に絞って１項目あたり５０文字以下で短く説明せよ。
`);
}

// const default_system_prompt = fs.readFileSync(system_prompt_file_path, "utf-8");
// if (default_system_prompt == "<Your system prompt>") {
//     console.error("Please set your system prompt in config/system_prompt.txt file.");
//     process.exit(1);
// }


async function readData(file_path) {
    if (file_path instanceof ArrayBuffer) return new Uint8Array(file_path);
    const data = file_path.indexOf("http") >= 0 ? await fetch(file_path).then(res => res.arrayBuffer()) : fs.readFileSync(file_path);
    return data;
}

async function readPdf(pdfFile) {
    const data = await readData(pdfFile);
    const blob = new Blob([data]);
    const loader = new PDFLoader(blob);
    const res_pdf_obj = await loader.load();
    return res_pdf_obj
}

function isFileRecentlyUpdated(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const currentTime = new Date().getTime();
        const fileModifiedTime = stats.mtime.getTime();
        const timeDifference = currentTime - fileModifiedTime;
        return timeDifference <= 300000;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
}


async function readAnyDocument(file_path) {
    const ext = path.extname(file_path);
    const isHTTP = file_path.indexOf("http") == 0;
    const hash = "tmp/" + crypto.createHash('md5').update(file_path).digest('hex') + ext;
    let buffer;
    if (isHTTP) {
        if (fs.existsSync(hash)) {
            buffer = fs.readFileSync(hash);
        } else {
            fs.mkdirSync("tmp", { recursive: true });
            buffer = await readData(file_path);
            fs.writeFileSync(hash, Buffer.from(buffer));
        }
        file_path = hash;
    } else {
        buffer = readData(file_path);
    }

    let text = "";
    const ext2 = ext.toLowerCase();
    if (ext2 == ".pdf") {
        text = (await readPdf(file_path)).map(o => o.pageContent).join("\n\n");
    } else if (ext2 == ".txt") {
        const text_decoder = new TextDecoder();
        text = text_decoder.decode(await readData(file_path));
    } else {
        const text_decoder = new TextDecoder();
        text = text_decoder.decode(await readData(file_path));
    }
    console.log(text);
    console.log("\n\n---------------------------------------\n\n");
    console.log("Analyzing the document...\n\n\n");
    const res = await chatgpt.prompt(
        text,
        null,
        default_system_prompt);

    console.log("\n\n---------------------------------------\n\n");
    console.log(res);
    console.log("\n\n---------------------------------------\n\n");

    console.log("\n\nOutput: ./output.txt\n\n");
    fs.writeFileSync("output.txt", res);


}

if (process.argv.length>2) {
    const target_path = process.argv[2];
    console.log(target_path);
    readAnyDocument(target_path);
} else {
    console.error("Please provide the file path as an argument.");
    console.error(" > <exec> <local file path>");
    console.error(" > <exec> <PDF URL path>");
    console.error(" Available exts are txt, pdf, html, and so on.");
    process.exit(1);
}


// readAnyDocument("https://arxiv.org/pdf/2304.11477.pdf")