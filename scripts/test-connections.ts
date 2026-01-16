import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Pinecone } from '@pinecone-database/pinecone';

async function test() {
  console.log('--- Debug Info ---');
  console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
  console.log('PINECONE_API_KEY present:', !!process.env.PINECONE_API_KEY);
  console.log('PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME);
  
  if (!process.env.PINECONE_API_KEY) {
    console.error('Missing PINECONE_API_KEY');
    return;
  }

  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    console.log('Connecting to Pinecone...');
    const indexes = await pc.listIndexes();
    console.log('Indexes found:', indexes);
  } catch (err) {
    console.error('Pinecone Error:', err);
  }
}

test();
