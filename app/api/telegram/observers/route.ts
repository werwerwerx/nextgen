import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  
  try {
    const { telegram_id, email, action } = await request.json();

    if ((!telegram_id && !email) || !action) {
      return NextResponse.json({
        success: false,
        error: "Не указан telegram_id или email, или действие"
      }, { status: 400 });
    }

    if (action === 'add') {
      let existingObserver = null;
      
      if (telegram_id) {
        const { data } = await supabase
          .from('notifications_ovserver_contacts')
          .select('*')
          .eq('observer_telegram_id', telegram_id)
          .single();
        existingObserver = data;
      }
      
      if (email) {
        const { data } = await supabase
          .from('notifications_ovserver_contacts')
          .select('*')
          .eq('obvserver_email', email)
          .single();
        existingObserver = existingObserver || data;
      }

      if (existingObserver) {
        return NextResponse.json({
          success: false,
          error: "Пользователь уже получает уведомления"
        }, { status: 400 });
      }

      const insertData: { observer_telegram_id?: string; obvserver_email?: string } = {};
      if (telegram_id) insertData.observer_telegram_id = telegram_id;
      if (email) insertData.obvserver_email = email;

      const { data, error } = await supabase
        .from('notifications_ovserver_contacts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data,
        message: "Пользователь добавлен в список уведомлений"
      });

    } else if (action === 'remove') {
      let query = supabase
        .from('notifications_ovserver_contacts')
        .delete();
      
      if (telegram_id) {
        query = query.eq('observer_telegram_id', telegram_id);
      } else if (email) {
        query = query.eq('obvserver_email', email);
      }

      const { error } = await query;

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Пользователь удален из списка уведомлений"
      });

    } else {
      return NextResponse.json({
        success: false,
        error: "Неверное действие. Используйте 'add' или 'remove'"
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error managing observer:', error);
    return NextResponse.json({
      success: false,
      error: "Внутренняя ошибка сервера"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  
  try {
    const { data: observers, error } = await supabase
      .from('notifications_ovserver_contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: observers || []
    });

  } catch (error) {
    console.error('Error fetching observers:', error);
    return NextResponse.json({
      success: false,
      error: "Внутренняя ошибка сервера"
    }, { status: 500 });
  }
} 