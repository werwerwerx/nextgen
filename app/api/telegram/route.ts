import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin-check";

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
}

interface TelegramResponse {
  ok: boolean;
  result: TelegramUpdate[];
  description?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    return NextResponse.json({
      success: false,
      error: "TELEGRAM_BOT_TOKEN не настроен"
    }, { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const offset = url.searchParams.get('offset');
    const limit = url.searchParams.get('limit') || '100';

    let telegramUrl = `https://api.telegram.org/bot${token}/getUpdates?limit=${limit}`;
    if (offset) {
      telegramUrl += `&offset=${offset}`;
    }

    const response = await fetch(telegramUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Telegram API error: ${response.status}`
      }, { status: response.status });
    }

    const data: TelegramResponse = await response.json();

    if (!data.ok) {
      return NextResponse.json({
        success: false,
        error: data.description || "Неизвестная ошибка Telegram API"
      }, { status: 400 });
    }

    // Если есть обновления, автоматически подтверждаем их получение
    if (data.result.length > 0) {
      const lastUpdateId = data.result[data.result.length - 1].update_id;
      const confirmUrl = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}`;
      
      await fetch(confirmUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Форматируем данные для удобного отображения
    const formattedUpdates = data.result.map(update => ({
      update_id: update.update_id,
      message_id: update.message?.message_id,
      user_id: update.message?.from.id,
      username: update.message?.from.username,
      first_name: update.message?.from.first_name,
      last_name: update.message?.from.last_name,
      chat_id: update.message?.chat.id,
      chat_type: update.message?.chat.type,
      text: update.message?.text,
      date: update.message?.date ? new Date(update.message.date * 1000).toISOString() : null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedUpdates,
      total: data.result.length
    });

  } catch (error) {
    console.error('Error fetching Telegram updates:', error);
    return NextResponse.json({
      success: false,
      error: "Не удалось получить обновления Telegram"
    }, { status: 500 });
  }
}

// POST method to mark updates as processed (acknowledge offset)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    return NextResponse.json({
      success: false,
      error: "TELEGRAM_BOT_TOKEN не настроен"
    }, { status: 500 });
  }

  try {
    const { offset } = await request.json();

    if (!offset) {
      return NextResponse.json({
        success: false,
        error: "Требуется указать offset"
      }, { status: 400 });
    }

    const telegramUrl = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}`;

    const response = await fetch(telegramUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Failed to acknowledge offset: ${response.status}`
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: "Offset подтвержден"
    });

  } catch (error) {
    console.error('Error acknowledging offset:', error);
    return NextResponse.json({
      success: false,
      error: "Не удалось подтвердить offset"
    }, { status: 500 });
  }
} 