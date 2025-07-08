import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { LeadResponse, TLeadData, validateLead } from "./shared";
import { sendNewLeadEmailNotification } from "@/lib/email";
import { Database } from "@/lib/supabase/database.types";
import { PostgrestError } from "@supabase/supabase-js";

type SavedLead = Database["public"]["Tables"]["leads"]["Row"];

type Observer = Database["public"]["Tables"]["notifications_ovserver_contacts"]["Row"];

// Функция для отправки Telegram уведомления
async function sendTelegramNotification(chatId: string, message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN не настроен');
  }

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
    throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
  }
}

// Функция для уведомления наблюдателей о новой заявке
async function notifyObservers(leadData: SavedLead, courseName?: string): Promise<void> {
  const supabase = await createClient();
  
  console.log('Получаем список наблюдателей...');
  const { data: observers, error: observersError } = await supabase
    .from('notifications_ovserver_contacts')
    .select('*');

  if (observersError) {
    console.error('Ошибка при получении списка наблюдателей:', observersError);
    throw new Error(`Ошибка при получении списка наблюдателей: ${observersError.message}`);
  }

  console.log('Получены наблюдатели:', observers);

  if (!observers || observers.length === 0) {
    console.log('Не найдено наблюдателей для уведомления');
    return;
  }

  const telegramMessage = `
🔔 <b>Новая заявка!</b>

👤 <b>Имя:</b> ${leadData.name}
📧 <b>Email:</b> ${leadData.email || 'Не указан'}
📱 <b>Телефон:</b> ${leadData.phone || 'Не указан'}
📚 <b>Курс:</b> ${courseName || 'Нуждается в консультации'}
🕐 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
  `.trim();

  const notifications: Promise<void>[] = [];

  const telegramObservers = observers.filter(obs => obs.observer_telegram_id);
  console.log('Telegram наблюдатели:', telegramObservers);
  
  telegramObservers.forEach(observer => {
    if (observer.observer_telegram_id) {
      console.log('Отправляем уведомление в Telegram для:', observer.observer_telegram_id);
      notifications.push(
        sendTelegramNotification(observer.observer_telegram_id, telegramMessage)
          .catch(error => {
            console.error(`Ошибка отправки Telegram уведомления для ${observer.observer_telegram_id}:`, error);
          })
      );
    }
  });

  const emailObservers = observers.filter(obs => obs.obvserver_email);
  console.log('Email наблюдатели:', emailObservers);
  
  emailObservers.forEach(observer => {
    if (observer.obvserver_email) {
      console.log('Отправляем уведомление на email:', observer.obvserver_email);
      notifications.push(
        sendNewLeadEmailNotification(observer.obvserver_email, leadData, courseName)
          .then(() => {
            console.log('Email уведомление успешно отправлено:', observer.obvserver_email);
          })
          .catch(error => {
            console.error(`Ошибка отправки Email уведомления для ${observer.obvserver_email}:`, error);
          })
      );
    }
  });

  await Promise.allSettled(notifications);
  console.log(`Отправлены уведомления ${observers.length} наблюдателям (Telegram: ${telegramObservers.length}, Email: ${emailObservers.length})`);
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<LeadResponse>> {
  try {
    const leadData = (await request.json()) as TLeadData;
    console.log('Получены данные лида:', leadData);
    
    // Проверка honeypot
    if (leadData.company && leadData.company.length > 0) {
      console.log('Обнаружен спам бот (honeypot)');
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "SPAM_DETECTED",
          message: "Spam detected"
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const errors = validateLead(leadData);
    if (errors) {
      console.log('Ошибки валидации:', errors);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "VALIDATION_ERROR",
          errors,
          message: "Некорректные данные формы. Пожалуйста, проверьте введенные данные."
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createAdminClient();
    const [phoneResult, emailResult] = await Promise.all([
      supabase.from("leads").select("*").eq("phone", leadData.phone).single(),
      supabase.from("leads").select("*").eq("email", leadData.email).single(),
    ]);

    if (phoneResult.error && phoneResult.error.code !== 'PGRST116') {
      console.error('Ошибка проверки телефона:', phoneResult.error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "DATABASE_ERROR",
          message: "Ошибка при проверке данных. Пожалуйста, попробуйте позже."
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (emailResult.error && emailResult.error.code !== 'PGRST116') {
      console.error('Ошибка проверки email:', emailResult.error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "DATABASE_ERROR",
          message: "Ошибка при проверке данных. Пожалуйста, попробуйте позже."
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (phoneResult.data || emailResult.data) {
      console.log('Найден дубликат контакта:', { 
        byPhone: phoneResult.data, 
        byEmail: emailResult.data 
      });
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "DUPLICATE_CONTACT",
          message: "Такой контакт уже существует в нашей базе."
        }),
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: leadSaved, error: saveError } = await supabase
      .from("leads")
      .insert({
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        ip: request.headers.get("x-forwarded-for") || "unknown",
      })
      .select()
      .single();
    
    if (saveError || !leadSaved) {
      console.error('Ошибка сохранения лида:', saveError);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "DATABASE_ERROR",
          message: "Не удалось сохранить ваши данные. Пожалуйста, попробуйте позже."
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Лид успешно сохранен:', leadSaved);

    let courseName: string | undefined;
    if (leadData.courseInterestedInId) {
      console.log('Создаем связь с курсом:', leadData.courseInterestedInId);
      
      const [{ data: course, error: courseError }, { error: userCourseError }] = await Promise.all([
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

      if (courseError) {
        console.error('Ошибка при получении информации о курсе:', courseError);
      } else if (course) {
        courseName = course.course_name;
        console.log('Найден курс:', courseName);
      }

      if (userCourseError) {
        console.error('Ошибка при сохранении связи пользователя с курсом:', userCourseError);
      } else {
        console.log('Связь с курсом создана успешно');
      }
    }

    try {
      await notifyObservers(leadSaved, courseName);
    } catch (error) {
      console.error('Ошибка отправки уведомлений:', error);
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: leadSaved,
        message: "Заявка успешно создана"
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Критическая ошибка при обработке заявки:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "INTERNAL_ERROR",
        message: "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже."
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
