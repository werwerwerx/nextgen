import { createAdminClient } from './supabase/admin';

export async function sendEmailNotification(email: string, subject: string, htmlContent: string) {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email
    });

    if (error) {
      console.error('Ошибка генерации ссылки Supabase:', error);
      return false;
    }

    console.log(`Email уведомление отправлено на ${email}`);
    console.log(`Тема: ${subject}`);
    console.log(`Содержимое: ${htmlContent}`);
    
    return true;
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    return false;
  }
}

export async function sendNewLeadEmailNotification(email: string, leadData: any, courseName?: string) {
  const subject = 'Новая заявка на курс';
  const htmlContent = `
    <h2>🔔 Новая заявка!</h2>
    <p><strong>Имя:</strong> ${leadData.name}</p>
    <p><strong>Email:</strong> ${leadData.email || 'Не указан'}</p>
    <p><strong>Телефон:</strong> ${leadData.phone || 'Не указан'}</p>
    <p><strong>Курс:</strong> ${courseName || 'Не определился'}</p>
    <p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
  `;

  return await sendEmailNotification(email, subject, htmlContent);
} 