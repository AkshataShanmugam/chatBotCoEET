import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from '@supabase/supabase-js';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

const hfApiKey = import.meta.env.VITE_HF_API_KEY
const embeddings = new HuggingFaceInferenceEmbeddings({ apiKey: hfApiKey });
const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL_LC_CHATBOT
const client = createClient(supabaseUrl, sbApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client, 
    tableName: 'documents',
    queryName: 'match_documents'
})

const retriever = vectorStore.asRetriever()

export { retriever }