import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';


// UPDATE THE UI, CURRENTLY A GENERIC CHAT SCREEN

function Gpt() {
    const [isTyping, setIsTyping] = useState(false)
    const [nouResponses, setNouResponses] = useState([
        {
            message: "BLAH BLAH",
            sender: "ChatGPT"
        }
    ]);

    const handleRequest = async (nougatData) => {
        const newRequest = {
            message: nougatData,
            sender: "user",
            direction: "outgoing"
        }

        // Each new request is stored here
        const newRequests = [...nouResponses, newRequest];

        // Every request is met with a "typing..." bubble
        setNouResponses(newRequests);
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
            return { role: role, content: textObj.message}
        })

        const prePrompt = {
            role: "system",
            content: "You are an autograder that receives metadata from an OCR, please revise this carefully"
        }

        const apiRequestBody = {
            "model": "gpt-4",
            "messages": [
                prePrompt,    // What should GPT "act" like?
                ...nougatText // [nougatData1, nougatData2, nougatData3, etc]
            ]
        }

        // Fetch the API URL 
        await fetch("https://api.openai.com/v1/chat/completions", {
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
                    message: data.choices[0].message.content,
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
                            typingIndicator={isTyping ? <TypingIndicator content="GPT is typing..."/> : null}
                        >
                            {nouResponses.map((nougatData, i) => {
                            return <Message key={i} model={nougatData}/>
                            })}
                        </MessageList>
                        <MessageInput placeholder="NOUGAT RESPONSE HERE" onSend={handleRequest}/>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}

export default Gpt;