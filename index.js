import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/community/llms/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { retriever } from "./utils/retriever.js";
import { combineDocuments } from './utils/combineDocuments.js'
import { formatConvHistory } from '/utils/formatConvHistory'
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import './style.css';

document.addEventListener('submit', (e) => {
    e.preventDefault()
    progressConversation()
})

const ollama = new Ollama({
    baseUrl: "http://localhost:11434", // Default value
    model: "llama3:latest", // Default value
    temperature: 0
});

const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
conversation history: {conv_history}
question: {question} 
standalone question:`

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic support bot 
who can answer a given question about CoEET (Center of Excellence in Educational Technology) 
based on the context provided and the conversation history. Try to find the answer in the 
context. If the answer is not given in the context, find the answer in 
the conversation history if possible. If you really don't know the answer,
say "I'm sorry, I don't know the answer to that." And direct the 
questioner to email nucoeet@st.niituniversity.in. Don't try to make up an answer. 
Always speak as if you were chatting to a friend.
context: {context}
conversation history: {conv_history}
question: {question}
answer: `
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

const standaloneQuestionChain = standaloneQuestionPrompt
    .pipe(ollama)
    .pipe(new StringOutputParser())
    
const retrieverChain = RunnableSequence.from([
    prevResult => prevResult.standalone_question,
    retriever,
    combineDocuments
])

const answerChain = answerPrompt
    .pipe(ollama)
    .pipe(new StringOutputParser())

// const chain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever).pipe(combineDocuments).pipe(answerPrompt)

const chain = RunnableSequence.from([
    {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
    },
    {
        context: retrieverChain,
        question: ({ original_input }) => original_input.question,
        conv_history: ({ original_input }) => original_input.conv_history
    },
    answerChain
])

// // console.log(chain.context)

// const response = await chain.invoke({ 
//     question: 'Hey, is it okay if I run Scrimba on a old laptop?'
// })

// console.log(response)


const convHistory = []

async function progressConversation() {
    const userInput = document.getElementById('user-input')
    const chatbotConversation = document.getElementById('chatbot-conversation-container')
    const question = userInput.value
    userInput.value = ''

    // add human message
    const newHumanSpeechBubble = document.createElement('div')
    newHumanSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newHumanSpeechBubble)
    newHumanSpeechBubble.textContent = question
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    
    const response = await chain.invoke({
        question: question,
        conv_history: formatConvHistory(convHistory),
    })

    console.log(response);

    convHistory.push(question);
    convHistory.push(response);


    // console.log('Done')
    // console.log(retrieverChain)

    // add AI message
    const newAiSpeechBubble = document.createElement('div')
    newAiSpeechBubble.classList.add('speech', 'speech-ai')
    chatbotConversation.appendChild(newAiSpeechBubble)
    newAiSpeechBubble.textContent = response
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}