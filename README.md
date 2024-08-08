# ChatbotCoEET
Welcome to ChatbotCoEET! This project is a chatbot built using LangChain.js that can answer questions about the Center of Excellence in Educational Technology (CoEET) based on the provided text. The project leverages Ollama for embeddings to ensure the entire application remains open-source.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Set Up Supabase](#3-set-up-supabase)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Upload Embeddings to Supabase](#5-upload-embeddings-to-supabase)
  - [6. Run the Chatbot](#6-run-the-chatbot)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Credits](#credits)


## Project Overview

In this project, you'll use LangChain.js to build a chatbot that can answer questions about CoEET using the provided text. The application consists of several steps:
1. Splitting the text into chunks.
2. Converting these chunks to vectors using Ollama embeddings.
3. Storing the vectors in a Supabase vector store.
4. Using chains to retrieve and answer questions based on the stored data.


## Features

- **Open-Source Embeddings**: Uses Ollama for embeddings, ensuring the project is completely open-source.
- **Vector Store**: Stores vectors in Supabase, making it easy to scale and manage your data.
- **Conversation Handling**: Maintains conversation history to provide context-aware responses.
- **Scalable Setup**: Easily deploy and extend the chatbot with new text data.


## Prerequisites

- **Node.js** (v16 or higher)
- **NPM** (v8 or higher)
- **Supabase** account
- **HuggingFace** API key
- **Ollama** installed and running locally. Check out Official [Ollama Website](https://ollama.com/)


## Setup Instructions


### 1. Clone the Repository

```cmd
git clone https://github.com/your-username/ChatbotCoEET.git
cd ChatbotCoEET
```


### 2. Install Dependencies
```cmd
npm install
```


### 3. Set Up Supabase
- Create a new project in your Supabase account. 
- Copy and add the project URL and project API to your env file.
- Create a new table in your Supabase project by copying the SQL code from setupCode/createDocument.sql into the SQL editor in your Supabase dashboard.
- Make sure your table is named correctly as referenced in the project (usually documents).


### 4. Configure Environment Variables
Create a .env file in the root directory and add the following environment variables:
Create an Huggingface API key in your HF account, if not done already. 

```env
VITE_SUPABASE_API_KEY=your-supabase-api-key
VITE_SUPABASE_URL_LC_CHATBOT=your-supabase-url
VITE_HF_API_KEY=your-huggingface-api-key
```


### 5. Upload Embeddings to Supabase
Prepare your content text files (e.g., aboutCoEET.txt and shortHands.txt).
Use the setupCode/uploadEmbeddings.js script to create embeddings for your content and upload them to Supabase:
```cmd
node setupCode/uploadEmbeddings.js
```


### 6. Run the Chatbot
Once everything is set up, start the chatbot locally:

```cmd
npm run dev
```
Open your browser and navigate to http://localhost:5173 to interact with your chatbot.


### Usage
- Enter your questions in the input field provided on the webpage.
- The chatbot will answer based on the context provided in the text files.
- Conversation history is maintained to provide more accurate and context-aware responses.


### File Structure

```plaintext
├── index.js                # Main entry point for the chatbot application
├── package.json            # Project dependencies and scripts
├── utils                   
├── setupCode/              # Contains scripts and SQL setup files
│   ├── .env                # Environment variables for the project, added here to upload to Supabase
│   ├── createDocument.sql  # SQL script for setting up Supabase table
│   └── uploadEmbeddings.js # Script to create and upload embeddings to Supabase
├── style.css               # Styles for the chatbot UI
└── .env                    # Environment variables for the project
```

### Credits
This project was inspired by the [official LangChain.js course on Scrimba](https://v2.scrimba.com/the-official-langchainjs-course-c02t:details).
