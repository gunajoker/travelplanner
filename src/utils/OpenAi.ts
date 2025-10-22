 
import OpenAI from 'openai';
import util from 'util';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export class OpenAIHelper {
        private apiKey: string;

        constructor() {
            this.apiKey = this.getApiKey();
           
        }

        private getApiKey() {
            const envPath = resolve(__dirname, '../../env/env.Env');
            const envContent = readFileSync(envPath, 'utf-8');
            const envLines = envContent.split('\n');
            const apiKeyLine = envLines.find(line => line.startsWith('OPENAI_API_KEY='));

            if (apiKeyLine) {
                return apiKeyLine.split('=')[1].trim();
            } else {
                console.warn('OPENAI_API_KEY not found in env.Env file.');
                return '';
            }
        }   

        async interactWithOpenAI({roleContent, userContent}: {roleContent: string, userContent: string}) {
            if (!this.apiKey) {
                console.log('Skipping OpenAI call because OPENAI_API_KEY is not set.');
                return;
            }

            const openai = new OpenAI({ apiKey: this.apiKey });
            try {
                const response = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content:roleContent },
                        { role: 'user', content: userContent }
                    ]
                });

                return(response.choices?.[0]?.message?.content ?? util.inspect(response, { depth: 1 }));
            } catch (err) {
                console.error('OpenAI error:', util.inspect(err, { depth: 1 }));
            }
        }
    }