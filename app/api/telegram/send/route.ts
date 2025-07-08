import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    return NextResponse.json({
      success: false,
      error: "TELEGRAM_BOT_TOKEN не настроен"
    }, { status: 500 });
  }

  try {
    const { chat_id, message } = await request.json();

    if (!chat_id || !message) {
      return NextResponse.json({
        success: false,
        error: "Требуется указать chat_id и message"
      }, { status: 400 });
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        error: `Telegram API error: ${JSON.stringify(errorData)}`
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: "Сообщение отправлено"
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({
      success: false,
      error: "Не удалось отправить сообщение"
    }, { status: 500 });
  }
} 