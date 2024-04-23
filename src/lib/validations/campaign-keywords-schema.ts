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

export const CreateManualKeywordSchema = z.object({
  projectId: z.string(),
  content: z.string().min(2, { message: 'Please add a valid keyword.' }).max(15, { message: "Keywords can't be longer than 25 characters" })
})