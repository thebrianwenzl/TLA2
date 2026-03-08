import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export interface GeneratedTerm {
  fullForm: string | null;
  definition: string;
  exampleJargon: string;
  examplePlain: string;
  difficulty: 1 | 2 | 3;
}

export async function generateTerm(
  term: string,
  industryName: string
): Promise<GeneratedTerm> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `You are helping populate a jargon-learning app for the "${industryName}" industry.

Generate content for the term: "${term}"

Respond ONLY with valid JSON — no preamble, no markdown fences:
{
  "fullForm": "<expanded form if acronym, or null if not an acronym>",
  "definition": "<plain-English definition, 1-2 sentences>",
  "exampleJargon": "<one realistic sentence using the term as an industry insider would>",
  "examplePlain": "<the same sentence rewritten in plain English a non-expert would understand>",
  "difficulty": <1 for beginner, 2 for intermediate, 3 for advanced>
}`,
      },
    ],
  });

  const text = (response.content[0] as { type: 'text'; text: string }).text.trim();
  return JSON.parse(text) as GeneratedTerm;
}
