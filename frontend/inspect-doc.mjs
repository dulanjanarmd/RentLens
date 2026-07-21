import mammoth from 'mammoth';

async function inspect() {
  const result = await mammoth.extractRawText({ path: 'data/SRS_Smart_Rental_Platform-2-e3f4f9.docx' });
  console.log(result.value.slice(0, 5000));
}

inspect().catch(console.error);
