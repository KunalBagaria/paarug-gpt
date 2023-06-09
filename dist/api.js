"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const context_1 = require("./context");
async function makeRequest(messages) {
    const data = [
        { role: "user", content: context_1.DefaultContext },
        { role: "assistant", content: "Affirmed." },
        ...messages
    ];
    const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: data
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config_1.OPENAI_API_KEY}`
        }
    });
    return response.data.choices[0].message;
}
exports.makeRequest = makeRequest;
