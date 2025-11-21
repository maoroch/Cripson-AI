// lib/groq.ts

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export async function queryGroq(messages: GroqMessage[]): Promise<string> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`GROQ API error: ${response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response from AI';
  } catch (error) {
    console.error('Error querying GROQ:', error);
    throw error;
  }
}

// Специализированная функция для анализа аналитики
export async function analyzeAdsData(platformData: any, metrics: any) {
  const systemPrompt = `Ты эксперт по аналитике и маркетингу. Проанализируй данные рекламной кампании и дай рекомендации на русском языке. Будь конкретен, используй числа из данных.`;

  const userPrompt = `
Данные платформы:
- Название: ${platformData.name}
- Показы: ${platformData.summary?.impressions || platformData.stats?.impressions}
- Клики: ${platformData.summary?.clicks || platformData.stats?.clicks}
- CTR: ${platformData.summary?.ctr || platformData.stats?.ctr}%
- Расходы: $${platformData.summary?.spent || platformData.stats?.spent}
- Конверсии: ${platformData.summary?.conversions || platformData.stats?.conversions}
- ROI: ${platformData.summary?.roi || platformData.stats?.roi}%

Дополнительные метрики: ${JSON.stringify(metrics)}

Проанализируй эффективность и дай 2-3 конкретных рекомендации для улучшения показателей.`;
  
  return await queryGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]);
}

// Функция для анализа хештегов
export async function analyzeHashtags(platform: string, currentTags: string[]) {
  const systemPrompt = `Ты эксперт по социальным медиа и контент-маркетингу. Анализируй хештеги и давай рекомендации на русском языке.`;

  const userPrompt = `
Платформа: ${platform}
Текущие хештеги: ${currentTags.join(', ')}

Проанализируй эти хештеги и предложи 3-5 дополнительных релевантных хештегов для улучшения охвата. Также дай краткую оценку текущему набору тегов.`;

  return await queryGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]);
}

// Функция для анализа графиков
export async function analyzeChartData(chartData: any[]) {
  const systemPrompt = `Ты эксперт по аналитике и визуализации данных. Проанализируй данные графиков и дай краткие инсайты на русском языке. Выдели основные тренды, аномалии и дай рекомендации.`;

  const userPrompt = `
Данные графиков для анализа:
${chartData.map((chart, index) => `
График ${index + 1}: ${chart.name}
- Период: ${chart.period}
- Данные: ${JSON.stringify(chart.data)}
- Статистика: Макс: ${chart.stats.max}, Среднее: ${chart.stats.average}, Рост: ${chart.stats.growth}
`).join('')}

Проанализируй эти данные и дай 2-3 ключевых инсайта. Будь конкретен и используй числа из данных.`;

  return await queryGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]);
}