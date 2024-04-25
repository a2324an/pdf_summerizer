// @ts-check
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import logger from './logger.mjs';
import OpenAI from 'openai';


let openai = null;

// https://platform.openai.com/docs/models/continuous-model-upgrades
const DefaultModel = "gpt-3.5-turbo";

function GetConversationFilePath(thread_id) {
    const md5Hash = crypto.createHash('md5').update(thread_id + "").digest('hex');
    const file_path = path.join(process.cwd(), 'conversations', DefaultModel, md5Hash.slice(0, 2), `${md5Hash}.json`);
    return file_path;
}

class Conversation {
    constructor(_params = {}) {
        const params = { system_prompt: null, model: DefaultModel };
        if (_params) Object.assign(params, _params);
        this.model = params.model;
        this.messages = [];
        this.thread_id = params.thread_id;
        if (params.system_prompt) {
            this.messages = [
                //"You are a coding tutor bot to help user write and optimize python code."
                { "role": "system", "content": params.system_prompt },
            ]
        }
    }

    restore() {
        if (this.thread_id) {
            const file_path = GetConversationFilePath(this.thread_id);
            if (fs.existsSync(file_path)) {
                logger.log("Restore:", file_path);
                this.messages = JSON.parse(fs.readFileSync(file_path, "utf8"));
            }
        }
    }


    save() {
        if (this.thread_id) {
            const file_path = GetConversationFilePath(this.thread_id);
            const directory = path.dirname(file_path);
            logger.log("Save:", file_path);
            if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
            fs.writeFileSync(file_path, JSON.stringify(this.messages, null, 4));
        }
    }

    async chat(message) {
        this.messages.push({ role: "user", content: message })

        const response = await openai.chat.completions.create({
            messages: this.messages,
            model: this.model,
            temperature: 0.1,
        });

        logger.log(response.choices[0]);
        const res = response.choices[0].message.content;

        this.messages.push({ role: "assistant", content: res });

        this.reorganize();

        return res;
    }

    async * stream(message) {
        this.messages.push({ role: "user", content: message })
        const stream_response = await openai.chat.completions.create({
            messages: this.messages,
            model: this.model,
            temperature: 0.1,
            stream: true,
        });

        let content = "";
        for await (const response of stream_response) {
            //logger.log(response.choices[0]);
            const res = response.choices[0].delta.content; // yield
            yield res;
            content += res;
        }
        this.messages.push({ role: "assistant", content: content });

        this.reorganize();

    }

    reorganize() {
        const mp = {};
        for (const m of this.messages) {
            if (!mp[m.role]) mp[m.role] = 1;
            mp[m.role]++;
        }
        const ms = [];
        for (const m of this.messages) {
            if (mp[m.role] > 10) {
                mp[m.role]--;
                continue;
            }
            ms.push(m);
        }
        this.messages = ms;
    }
}

const conversation_maps = new Map();
function delete_expired_conversations() {
    const now = Date.now();
    for (const [thread_id, { expires }] of conversation_maps.entries()) {
        if (now >= expires) {
            conversation_maps.delete(thread_id);
            logger.log(`Conversation with thread_id ${thread_id} expired and deleted.`);
        }
    }
}

function GetConversation(thread_id, system_prompt = undefined) {
    const _conv_ = conversation_maps.get(thread_id)?.conversation;
    const conversation = _conv_ ?? new Conversation();
    conversation.thread_id = thread_id;
    if (thread_id) {
        logger.log("Hit conversation cache.", thread_id);
        if (!_conv_) {
            conversation.restore();
        }
        conversation_maps.set(thread_id, { conversation, expires: Date.now() + 1000 * 60 * 60 });
    }
    if (system_prompt !== undefined) {
        // console.log(conversation.messages);
        let has_system_prompt = false;
        for (const message of conversation.messages) {
            if (message.role == "system") {
                has_system_prompt = true;
                message.content = system_prompt;
            }
        }
        if (!has_system_prompt) {
            conversation.messages.unshift({role: "system", content: system_prompt});
        }
    }
    return conversation;
}

function HasConversation(thread_id) {
    const file_path = GetConversationFilePath(thread_id);
    return fs.existsSync(file_path);
}


async function Chat(message, thread_id = undefined, system_prompt = undefined) {
    const conversation = GetConversation(thread_id, system_prompt);

    let res = await conversation.chat(message);

    conversation.save();
    delete_expired_conversations();

    return res;
};

async function* Stream(message, thread_id = undefined, system_prompt = undefined) {
    const conversation = GetConversation(thread_id, system_prompt);

    const stream = await conversation.stream(message);

    for await (const message of stream) {
        yield message;
    }

    conversation.save();
    delete_expired_conversations();

    return null;
};



export default (config) => {
    // @ts-ignore
    openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

    return {
        hit_same_conversation: HasConversation,
        prompt: Chat,
        prompt_stream: Stream,
    }
};