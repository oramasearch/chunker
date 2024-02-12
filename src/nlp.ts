import nlp from 'https://esm.sh/compromise@14.11.2/one'
import { Chunker } from './common.ts'

export class NLPChunker extends Chunker {
  public async chunk(input: string, maxTokensPerChunk: number): Promise<string[]> {
    const sentences = nlp.tokenize(input).fullSentences().out('array')
    const chunks: string[] = []

    let currentChunk = ''
    for (const sentence of sentences) {
      const [sentenceTokenCount, currentChunkTokenCount] = await Promise.all([
        this.getNumberOfTokens(sentence),
        this.getNumberOfTokens(currentChunk),
      ])

      if (sentenceTokenCount + currentChunkTokenCount <= maxTokensPerChunk) {
        currentChunk += (currentChunk ? ' ' : '') + sentence // Ensure space between sentences
      } else {
        if (currentChunk) {
          chunks.push(currentChunk)
        }
        currentChunk = sentenceTokenCount > maxTokensPerChunk ? '' : sentence

        if (sentenceTokenCount > maxTokensPerChunk) {
          chunks.push(sentence)
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk)
    }

    return chunks
  }
}
