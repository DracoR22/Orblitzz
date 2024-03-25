import * as z from 'zod'

const KeywordItemArraySchema = z.array(
    z.object({
      id: z.string(),
      columnId: z.string(),
      order: z.number(),
      content: z.string(),
    })
  );
  
  // Use the defined type and schema in your mutation input schema
export const UpdateKeywordOrderInputSchema = z.object({
    projectId: z.string(),
    items: KeywordItemArraySchema,
  });