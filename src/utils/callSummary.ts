import { JsonResultOutput, KeyItem } from "./transcription";

export interface CallSummary {
  category: string,
  companies: string[],
  keyItems: KeyItem[],
  overallSentiment: string,
  people: string[],
  summary: string,
  topics: string[],
}

export function generateCallSummary(
  jsonResultOutput: JsonResultOutput
): CallSummary {
  const callSummary: CallSummary = {
    category: jsonResultOutput.category,
    companies: jsonResultOutput.ner.map(ner => (ner.Companies)).flat(),
    keyItems: jsonResultOutput.key_items.map(keyItem => ({
      itemName: keyItem.split(':')[0],
      itemValue: keyItem.split(':')[1]
    })),
    overallSentiment: jsonResultOutput.sentiment,
    people: jsonResultOutput.ner.map(ner => (ner.People)).flat(),
    summary: jsonResultOutput.summary,
    topics: jsonResultOutput.topics
  };

  return callSummary;
}