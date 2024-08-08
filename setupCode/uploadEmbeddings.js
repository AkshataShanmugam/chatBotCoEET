import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { promises as fs } from 'fs';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

// node modules required: npm install @huggingface/inference @langchain/community @langchain/core @supabase/supabase-js langchain ollama

try {
  // const text = await fs.readFile('aboutCoEET.txt', 'utf8');
  const text = await fs.readFile('shortHands.txt', 'utf8');
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 750,
    separators: ['\n\n', '\n', ' ', ''], // default setting
    chunkOverlap: 100
  });

  const output = await splitter.createDocuments([text]);
  // console.log(output)

  const sbApiKey = process.env.VITE_SUPABASE_API_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL_LC_CHATBOT;
  const hfApiKey = process.env.VITE_HF_API_KEY;

  // console.log(sbApiKey, supabaseUrl, hfApiKey);
  const client = createClient(supabaseUrl, sbApiKey);

  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: hfApiKey
  });

  // console.log(embeddings);

  await SupabaseVectorStore.fromDocuments(
    output,
    embeddings,
    {
      client,
      tableName: 'documents'
    }
  )

} catch (err) {
  console.log(err);
}