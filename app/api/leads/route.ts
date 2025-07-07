import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadResponse, TLeadData, validateLead } from "./shared";
import { sendNewLeadEmailNotification } from "@/lib/email";

// Функция для отправки Telegram уведомления
async function sendTelegramNotification(chatId: string, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN не найден в переменных окружения');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
    }
  } catch (error) {
    console.error('Ошибка отправки Telegram сообщения:', error);
  }
}

// Функция для уведомления наблюдателей о новой заявке
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function notifyObservers(leadData: any, courseName?: string) {
  const supabase = await createClient();
  
  try {
    const { data: observers } = await supabase
      .from('notifications_ovserver_contacts')
      .select('observer_telegram_id, obvserver_email');

    if (!observers || observers.length === 0) {
      console.log('Не найдено наблюдателей');
      return;
    }

    const telegramMessage = `
🔔 <b>Новая заявка!</b>

👤 <b>Имя:</b> ${leadData.name}
📧 <b>Email:</b> ${leadData.email || 'Не указан'}
📱 <b>Телефон:</b> ${leadData.phone || 'Не указан'}
📚 <b>Курс:</b> ${courseName || 'Не определился'}
🕐 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
    `.trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const notifications: Promise<any>[] = [];

    // Отправляем Telegram уведомления
    const telegramObservers = observers.filter(obs => obs.observer_telegram_id);
    telegramObservers.forEach(observer => {
      notifications.push(
        sendTelegramNotification(observer.observer_telegram_id!, telegramMessage)
      );
    });

    // Отправляем Email уведомления
    const emailObservers = observers.filter(obs => obs.obvserver_email);
    emailObservers.forEach(observer => {
      notifications.push(
        sendNewLeadEmailNotification(observer.obvserver_email!, leadData, courseName)
      );
    });

    // Выполняем все уведомления параллельно
    await Promise.allSettled(notifications);

    console.log(`Отправлены уведомления ${observers.length} наблюдателям (Telegram: ${telegramObservers.length}, Email: ${emailObservers.length})`);
  } catch (error) {
    console.error('Ошибка уведомления наблюдателей:', error);
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LeadResponse>> {
  const leadData = (await request.json()) as TLeadData;
  const supabase = createAdminClient();
  
  console.log('Получены данные лида:', leadData);
  
  const errors = validateLead(leadData);
  if (errors) {
    console.log('Ошибки валидации:', errors);
    return NextResponse.json({
      success: false,
      errorMessage: JSON.stringify(errors),
      clientErrorMessage: "Некорректные данные",
    });
  }

  const [{ data: userByPhone }, { data: userByEmail }] = await Promise.all([
    supabase.from("leads").select("*").eq("phone", leadData.phone).single(),
    supabase.from("leads").select("*").eq("email", leadData.email).single(),
  ]);

  if (userByPhone || userByEmail) {
    console.log('Найден дубликат контакта:', { userByPhone, userByEmail });
    return NextResponse.json({
      success: false,
      errorMessage: "Contact already exists",
      clientErrorMessage: "Контакт уже существует",
    });
  }

  const { data: leadSaved, error } = await supabase
    .from("leads")
    .insert({
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      ip: request.headers.get("x-forwarded-for") || "unknown",
    })
    .select()
    .single();
    
  if (!leadSaved) {
    console.error('Ошибка сохранения лида:', error);
    return NextResponse.json({
      success: false,
      errorMessage: error?.message || 'Unknown error',
      clientErrorMessage: "Упс! Что-то пошло не так. Попробуйте позже.",
    });
  }

  console.log('Лид успешно сохранен:', leadSaved);

  let courseName: string | undefined;

  if (leadData.courseInterestedInId) {
    console.log('Создаем связь с курсом:', leadData.courseInterestedInId);
    
    // Получаем название курса и создаем связь
    const [{ data: course }, { error: userCourseError }] = await Promise.all([
      supabase
        .from('cources')
        .select('course_name')
        .eq('id', leadData.courseInterestedInId)
        .single(),
      supabase
        .from("user_course")
        .insert({
          course_id: leadData.courseInterestedInId,
          lead_id: leadSaved.id,
        })
    ]);

    if (course) {
      courseName = course.course_name;
      console.log('Найден курс:', courseName);
    }

    if (userCourseError) {
      console.error('Ошибка при сохранении связи пользователя с курсом:', userCourseError);
      // НЕ возвращаем ошибку, так как лид уже сохранен!
      // Просто логируем ошибку
    } else {
      console.log('Связь с курсом создана успешно');
    }
  }

  // Отправляем уведомления наблюдателям (в фоновом режиме)
  notifyObservers(leadSaved, courseName).catch(error => {
    console.error('Ошибка отправки уведомлений:', error);
  });

  console.log('Возвращаем успешный ответ');
  return NextResponse.json({
    success: true,
    data: leadSaved,
  });
}
