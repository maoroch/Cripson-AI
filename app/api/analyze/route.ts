// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Интерфейсы для типизации
interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

// Функция для запроса к GROQ API
async function queryGroq(messages: GroqMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  
  console.log('GROQ API Key exists:', !!apiKey);
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not found in environment variables');
  }

  // Проверяем формат ключа
  if (!apiKey.startsWith('gsk_')) {
    throw new Error('Invalid GROQ API key format. Should start with gsk_');
  }

  try {
    console.log('Sending request to GROQ API...');
    console.log('Messages:', JSON.stringify(messages, null, 2));
    
    const requestBody = {
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('GROQ API response status:', response.status);
    
    if (!response.ok) {
      let errorText = 'No error details';
      try {
        errorText = await response.text();
      } catch (e) {
        console.error('Could not read error response:', e);
      }
      
      console.error('GROQ API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      if (response.status === 401) {
        throw new Error('Invalid GROQ API key - unauthorized');
      } else if (response.status === 429) {
        throw new Error('GROQ API rate limit exceeded');
      } else if (response.status === 400) {
        throw new Error(`GROQ API bad request: ${errorText}`);
      } else {
        throw new Error(`GROQ API error: ${response.status} ${response.statusText}`);
      }
    }

    const data: GroqResponse = await response.json();
    console.log('GROQ API success, response received');
    console.log('Response:', JSON.stringify(data, null, 2));
    return data.choices[0]?.message?.content || 'No response from AI';
  } catch (error) {
    console.error('Error querying GROQ:', error);
    throw error;
  }
}

// Функция для анализа графиков через GROQ
async function analyzeChartDataWithGROQ(chartData: any[]) {
  // Упрощаем системный промпт
  const systemPrompt = `You are a data analysis expert. Analyze the chart data and provide insights in Russian. Use **bold** for headings and important points. Be concise.`;

  // Упрощаем и структурируем пользовательский промпт
  const userPrompt = `Please analyze this chart data and provide key insights in Russian:

${chartData.map((chart, index) => `
Chart ${index + 1}: ${chart.name}
Period: ${chart.period}
Data points: ${chart.data.map((d: any) => `${d.name}: ${d.value}`).join(', ')}
Statistics: Max ${chart.stats.max}, Average ${chart.stats.average}, Growth ${chart.stats.growth}
`).join('\n')}

Provide 2-3 key insights and recommendations. Use **bold** for section headings.`;

  return await queryGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]);
}

// Улучшенная заглушка с более реалистичными данными
async function mockAnalyzeChartData(chartData: any[]) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Анализируем реальные данные из chartData для более точной заглушки
  const trends = chartData.map(chart => {
    const values = chart.data.map((d: any) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const lastValue = values[values.length - 1];
    const firstValue = values[0];
    const trend = lastValue > firstValue ? 'растет' : lastValue < firstValue ? 'снижается' : 'стабилен';
    
    return `- **${chart.name}** ${trend} с ${firstValue} до ${lastValue} (${chart.stats.growth})`;
  });

  const totalGrowth = chartData.reduce((acc, chart) => {
    const growth = parseFloat(chart.stats.growth.replace('%', '')) || 0;
    return acc + growth;
  }, 0);

  const avgGrowth = (totalGrowth / chartData.length).toFixed(1);

  return `
📊 **Анализ графиков**

**Основные тренды:**
${trends.join('\n')}

💡 **Рекомендации:**
1. **Сфокусируйтесь на пиковых периодах** - увеличивайте активность когда показатели максимальны
2. **Анализируйте причины роста** - определите факторы влияющие на положительную динамику  
3. **Мониторинг трендов** - отслеживайте изменения для своевременной корректировки стратегии

✅ **Общая эффективность:** Средний рост ${avgGrowth}% по всем графикам

*Анализ выполнен на основе актуальных данных*`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== ANALYZE API CALLED ===');
    console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
    console.log('GROQ_API_KEY first 10 chars:', process.env.GROQ_API_KEY?.substring(0, 10) + '...');
    
    const { type, chartData } = await request.json();
    console.log('Request data:', { 
      type, 
      chartDataLength: chartData?.length,
      chartNames: chartData?.map((c: any) => c.name)
    });

    if (type !== 'charts') {
      return NextResponse.json(
        { error: 'Invalid analysis type' },
        { status: 400 }
      );
    }

    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return NextResponse.json(
        { error: 'Invalid chart data' },
        { status: 400 }
      );
    }

    let analysis: string;
    let source = 'mock';
    let errorDetails = null;

    // Пытаемся использовать GROQ API, если доступен ключ
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
      try {
        console.log('Attempting to use GROQ API...');
        analysis = await analyzeChartDataWithGROQ(chartData);
        source = 'groq';
        console.log('✅ GROQ analysis completed successfully');
      } catch (groqError: any) {
        console.error('❌ GROQ API failed:', groqError.message);
        errorDetails = groqError.message;
        analysis = await mockAnalyzeChartData(chartData);
        source = 'mock_fallback';
      }
    } else {
      console.log('⚠️ No valid GROQ_API_KEY found, using mock data');
      analysis = await mockAnalyzeChartData(chartData);
      source = 'mock_no_key';
    }
    
    console.log('Analysis source:', source);
    
    return NextResponse.json({ 
      analysis,
      debug: {
        source,
        chartsCount: chartData.length,
        chartNames: chartData.map((c: any) => c.name),
        hasApiKey: !!process.env.GROQ_API_KEY,
        apiKeyValid: process.env.GROQ_API_KEY?.startsWith('gsk_'),
        error: errorDetails,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('💥 API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze data',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}