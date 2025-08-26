const TOGETHER_API_KEY = process.env.NEXT_PUBLIC_TOGETHER_API_KEY || '7a56f57f025eb35c9b9be7b573a6504d8c10556e272543b415726eb798d63e27';

interface TogetherAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens: number;
  temperature: number;
}

interface TogetherAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateMomentumLoops(
  momentumDefinition: string,
  energyAnchors: string[],
  currentPhase: string,
  focusAreas: string[]
): Promise<{
  career: string;
  culture: string;
  growth: string;
}> {
  const prompt = `You are a momentum coach helping someone create personalized momentum loops. 

User's momentum definition: ${momentumDefinition}
Energy anchors: ${energyAnchors.join(', ')}
Current phase: ${currentPhase}
Focus areas: ${focusAreas.join(', ')}

Create 3 momentum loops that are:
1. Simple and actionable (not complex)
2. Specific to their energy anchors and phase
3. Easy to track and measure
4. Designed to feed back into each other

Format each loop as: "Action → Outcome → Next Action"

Return only the 3 loops in this exact format:
Career & Money: [loop]
Culture & People: [loop]  
Self-Growth: [loop]`;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.1-8B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful momentum coach who creates simple, actionable momentum loops.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      } as TogetherAIRequest),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: TogetherAIResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse the response to extract the three loops
    const lines = content.split('\n').filter(line => line.trim());
    const careerMatch = lines.find(line => line.includes('Career & Money:'));
    const cultureMatch = lines.find(line => line.includes('Culture & People:'));
    const growthMatch = lines.find(line => line.includes('Self-Growth:'));

    return {
      career: careerMatch?.replace('Career & Money:', '').trim() || 'Weekly review of 1 new skill → apply at work → share insights',
      culture: cultureMatch?.replace('Culture & People:', '').trim() || 'Try 1 new place weekly → reflect on experience → connect with locals',
      growth: growthMatch?.replace('Self-Growth:', '').trim() || 'Learn 1 new thing daily → document it → share with community'
    };
  } catch (error) {
    console.error('Together AI request failed:', error);
    // Fallback to default loops
    return {
      career: 'Weekly review of 1 new skill → apply at work → share insights',
      culture: 'Try 1 new place weekly → reflect on experience → connect with locals',
      growth: 'Learn 1 new thing daily → document it → share with community'
    };
  }
}

export async function generateCustomFocusArea(
  userDescription: string,
  currentFocusAreas: string[]
): Promise<{
  name: string;
  description: string;
  metrics: string[];
  color: string;
}> {
  const prompt = `You are helping someone create a custom focus area for momentum tracking.

User's description: "${userDescription}"
Current focus areas: ${currentFocusAreas.join(', ')}

Create a custom focus area that:
1. Has a clear, memorable name (1-2 words)
2. Includes a brief description of what it tracks
3. Suggests 3-4 specific metrics they can track daily
4. Suggests a color theme (choose from: blue, green, purple, orange, red, teal)

Return in this exact format:
Name: [name]
Description: [description]
Metrics: [metric1, metric2, metric3, metric4]
Color: [color]`;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.1-8B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful momentum coach who creates custom focus areas for tracking personal growth.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      } as TogetherAIRequest),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: TogetherAIResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse the response
    const nameMatch = content.match(/Name: (.+)/);
    const descMatch = content.match(/Description: (.+)/);
    const metricsMatch = content.match(/Metrics: (.+)/);
    const colorMatch = content.match(/Color: (.+)/);

    return {
      name: nameMatch?.[1]?.trim() || 'Custom',
      description: descMatch?.[1]?.trim() || 'Your custom focus area',
      metrics: metricsMatch?.[1]?.split(',').map(m => m.trim()) || ['Progress', 'Effort', 'Quality'],
      color: colorMatch?.[1]?.trim() || 'blue'
    };
  } catch (error) {
    console.error('Together AI request failed:', error);
    // Fallback
    return {
      name: 'Custom',
      description: 'Your custom focus area',
      metrics: ['Progress', 'Effort', 'Quality'],
      color: 'blue'
    };
  }
}

export async function improveMomentumLoop(
  currentLoop: string,
  context: string
): Promise<string> {
  const prompt = `You are a momentum coach helping improve an existing momentum loop.

Current loop: "${currentLoop}"
Context: ${context}

Improve this loop to make it:
1. More specific and actionable
2. Easier to track and measure
3. More aligned with momentum principles
4. More engaging and motivating

Return only the improved loop, keeping it simple and actionable.`;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.1-8B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful momentum coach who improves existing momentum loops.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      } as TogetherAIRequest),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data: TogetherAIResponse = await response.json();
    return data.choices[0]?.message?.content?.trim() || currentLoop;
  } catch (error) {
    console.error('Together AI request failed:', error);
    return currentLoop;
  }
}
