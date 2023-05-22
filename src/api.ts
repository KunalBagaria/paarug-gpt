import axios from 'axios';

import { OPENAI_API_KEY } from './config';
import { DefaultContext } from './context';

interface Message {
  role: "user" | "assistant",
  content: string
}

async function makeRequest(messages: Message[]) {
  const data = [
    { role: "user", content: DefaultContext },
    { role: "assistant", content: "Affirmed."},
    ...messages
  ]
  const response = await axios.post('https://api.openai.com/v1/chat/completions',
    {
      model: "gpt-3.5-turbo",
      messages: data
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    }
  );

  return response.data.choices[0].message;
}

export { Message, makeRequest };