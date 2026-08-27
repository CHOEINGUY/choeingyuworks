import * as dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

dotenv.config({ path: '.env.local' });

async function test() {
  console.log('--- AI / RAG Connection Check ---');
  console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
  console.log('PINECONE_API_KEY present:', !!process.env.PINECONE_API_KEY);
  console.log('COHERE_API_KEY present:', !!process.env.COHERE_API_KEY);
  console.log('DEEPSEEK_API_KEY present:', !!process.env.DEEPSEEK_API_KEY);
  console.log('PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME || 'resume-chatbot');
  console.log('DEEPSEEK_MODEL:', process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash');

  if (process.env.PINECONE_API_KEY) {
    try {
      const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
      console.log('\nConnecting to Pinecone...');
      const indexes = await pc.listIndexes();
      console.log('✅ Pinecone connected. Indexes:', indexes.indexes?.map((index) => index.name) || []);
    } catch (err) {
      console.error('❌ Pinecone Error:', err);
    }
  } else {
    console.error('❌ Missing PINECONE_API_KEY');
  }

  if (process.env.DEEPSEEK_API_KEY) {
    try {
      const deepseek = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com',
      });
      console.log('\nConnecting to DeepSeek...');
      const models = await deepseek.models.list();
      const modelIds = models.data.map((model) => model.id);
      console.log('✅ DeepSeek authenticated. Models:', modelIds);

      const configuredModel = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
      if (!modelIds.includes(configuredModel)) {
        console.warn(`⚠️ Configured DeepSeek model not returned by /models: ${configuredModel}`);
      }
    } catch (err) {
      console.error('❌ DeepSeek Error:', err);
    }
  } else {
    console.error('❌ Missing DEEPSEEK_API_KEY');
  }
}

test();
