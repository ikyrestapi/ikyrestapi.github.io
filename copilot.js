import WebSocket from 'ws';
import axios from 'axios';
import { logApiRequest } from '../../utils/logger';

async function createConversationID() {
    try {
        const response = await axios.post("https://copilot.microsoft.com/c/api/conversations");
        return response.data.id;
    } catch (error) {
        throw new Error('Failed to create Copilot conversation ID.');
    }
}

function fetchCopilotResponse(text) {
    return new Promise(async (resolve, reject) => {
        try {
            const conversationId = await createConversationID();
            const url = "wss://copilot.microsoft.com/c/api/chat?api-version=2&features=-,ncedge,edgepagecontext&setflight=-,ncedge,edgepagecontext&ncedge=1";
            
            const payload = {
                event: "send",
                content: [{ type: "text", text: text }],
                conversationId: conversationId
            };
            
            const full_response = {
                conversationId: conversationId,
                messageId: null,
                text: "",
                suggestions: []
            };

            const ws = new WebSocket(url);

            ws.on('open', () => {
                ws.send(JSON.stringify(payload));
            });

            ws.on('message', (message) => {
                const data = JSON.parse(message.toString());

                if (data.event === "startMessage") {
                    full_response.messageId = data.messageId;
                } else if (data.event === "appendText" && data.messageId === full_response.messageId) {
                    full_response.text += data.text || "";
                } else if (data.event === "suggestedFollowups") {
                    full_response.suggestions = data.suggestions || [];
                    ws.close();
                    resolve(full_response);
                } else if (data.event === "done" && !full_response.suggestions.length) {
                    // Fallback in case suggestedFollowups doesn't arrive
                    ws.close();
                    resolve(full_response);
                }
            });

            ws.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
}


export default async function handler(req, res) {
    const endpoint = '/api/copilot';
    const { prompt } = req.query;

    if (!prompt) {
        await logApiRequest(endpoint, 400);
        return res.status(400).json({ success: false, error: 'Parameter "prompt" is required.' });
    }

    try {
        const result = await fetchCopilotResponse(prompt);
        await logApiRequest(endpoint, 200);
        res.status(200).json({ success: true, result });
    } catch (error) {
        await logApiRequest(endpoint, 500);
        res.status(500).json({
            success: false,
            error: 'Failed to get response from Copilot.',
            details: error.message,
        });
    }
}
