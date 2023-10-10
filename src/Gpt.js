import React, { useState } from 'react';
import './App'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';


// UPDATE THE UI, CURRENTLY A GENERIC CHAT SCREEN
API_KEY = null

function Gpt() {
    const [isTyping, setIsTyping] = useState(false)
    const [nouResponses, setNouResponses] = useState([
        {
            nougatData: "BLAH BLAH",
            sender: "ChatGPT"
        }
    ]);

    const handleRequest = async (nougatData) => {
        const newRequest = {
            nougatData: nougatData,
            sender: "nougat",
            direction: "outgoing"
        }

        // Each new request is stored here
        const newRequests = [...nouResponses, newRequest];

        // Every request is met with a "typing..." bubble
        setResponses(newRequests);
        setIsTyping(true);
        await processToGPT(newRequests);
    }

    async function processToGPT(dataText) {

        // Distinguish between GPT and user
        let nougatText = dataText.map((textObj) => {
            let role="";
            if (textObj.sender === "ChatGPT") {
                role="assistant"
            } else {
                role="user"
            }
            return { role: role, content: textObj.nougatData}
        })

        const prePrompt = {
            role: "system",
            content: "You are an autograder that receives metadata from an OCR, please revise this carefully"
        }

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                prePrompt,    // What should GPT "act" like?
                ...nougatText // [nougatData1, nougatData2, nougatData3, etc]
            ]
        }

        // Fetch the API URL 
        await fetch('https://api.openai.com/v1/chat/completions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            mode: 'cors',
            body: JSON.stringify(apiRequestBody)
        }).then(data => {
            return data.json()
        }).then(data => {
            console.log(data);
            console.log(data.choices[0].message.content);

            // Create an array of Nougat's responses
            setNouResponses(
                [...dataText, {
                    nougatData: data.choices[0].nougatData.content,
                    sender: "ChatGPT"
                }]
            );
            // False when GPT send a message
            setIsTyping(false)
        })

    }

    // Map responses by returning Message component that displays text
    return (
        <div className="Gpt">
            <div style={{position: "relative", height: "800px", width: "700px"}}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={typing ? <TypingIndicator content="GPT is typing..."/> : null}
                        >
                            {responses.map((nougatData, i) => {
                            return <Message key={i} model={nougatData}/>
                            })}
                        </MessageList>
                        <MessageInput placeholder="NOUGAT RESPONSE HERE" onSend={handleSend}/>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}

export default Gpt;