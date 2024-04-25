# PDF Summerizer 



Requirements

1. NodeJS18: [https://nodejs.org/en/download](https://nodejs.org/en/download)
2. OpenAI API KEY: [https://openai.com/blog/openai-api](https://openai.com/blog/openai-api)
3. Setup API key and system prompt



## Installation

```bash
git clone https://github.com/a2324an/pdf_summerizer.git
cd pdf_summerizer
npm install


node src/pdf_summerizer.mjs 

#Please provide the file path as an argument.
# > <exec> <local file path>
# > <exec> <PDF URL path>
# Available exts are txt, pdf, html, and so on.
```


## Configuration

You need setup OpenAI API key and system prompt text.

```
config/chatgpt.json
config/system_prompt.txt
```

## Run

From URL

```bash
node src/pdf_summerizer.mjs https://www.example.com/hogehoge.pdf
```


Local PDF file

```bash
node src/pdf_summerizer.mjs ./hogehoge.pdf
```


Local text file

```bash
node src/pdf_summerizer.mjs ./hogehoge.txt
```
