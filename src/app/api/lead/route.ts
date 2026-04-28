import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, productName, comment } = await request.json();

    const source = process.env.BITRIX_SOURCE || 'Website';
    const selectedProduct = productName || 'Не указан';
    const userComment = comment?.trim() || 'Без комментария';

    const BITRIX_WEBHOOK_URL = getWebhookUrl(process.env.BITRIX_WEBHOOK_URL) || getWebhookUrl(process.env.BITRIX24_WEBHOOK_URL);
    const assignedById = getAssignedManagerId(phone);

    const leadData = {
      fields: {
        TITLE: `Заявка с сайта: ${selectedProduct}`,
        NAME: name,
        PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
        COMMENTS: `Источник: ${source}\nТовар: ${selectedProduct}\nКомментарий: ${userComment}`,
        SOURCE_ID: source,
        ...(assignedById ? { ASSIGNED_BY_ID: assignedById } : {}),
      },
    };

    await notifyTelegram({ name, phone, selectedProduct, userComment });

    if (!BITRIX_WEBHOOK_URL) {
      console.warn('Bitrix24 webhook is not configured. Lead accepted locally but was not sent to CRM.');
      return NextResponse.json({
        success: true,
        accepted: true,
        crmConfigured: false,
        message: 'Заявка принята сайтом. Для отправки в CRM настройте BITRIX_WEBHOOK_URL.',
      });
    }

    const response = await axios.post(`${BITRIX_WEBHOOK_URL}/crm.lead.add.json`, leadData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.result) {
      return NextResponse.json({ success: true, leadId: response.data.result, message: 'Lead created successfully in Bitrix24' });
    }

    console.error('Bitrix24 response error:', response.data);
    return NextResponse.json({ error: 'Failed to create lead in Bitrix24' }, { status: 500 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

function getAssignedManagerId(phone: string): number | null {
  const explicitId = process.env.BITRIX_ASSIGNED_BY_ID || process.env.BITRIX24_USER_ID;
  if (explicitId) {
    const parsed = Number(explicitId);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const managerIds = (process.env.BITRIX_MANAGER_IDS || '')
    .split(',')
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isFinite(id));

  if (!managerIds.length) return null;

  const hash = phone.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return managerIds[hash % managerIds.length];
}

function getOptionalEnv(value?: string) {
  const normalized = value?.trim();
  if (!normalized || normalized === 'disabled' || normalized === 'false') return undefined;
  return normalized;
}

function getWebhookUrl(value?: string) {
  return getOptionalEnv(value)?.replace(/\/+$/, '');
}

async function notifyTelegram({
  name,
  phone,
  selectedProduct,
  userComment,
}: {
  name: string;
  phone: string;
  selectedProduct: string;
  userComment: string;
}) {
  const token = getOptionalEnv(process.env.TELEGRAM_BOT_TOKEN);
  const chatIds = (process.env.TELEGRAM_MANAGER_CHAT_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || !chatIds.length) return;

  const text = [
    'Новая заявка с сайта Septus',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Товар: ${selectedProduct}`,
    `Комментарий: ${userComment}`,
  ].join('\n');

  await Promise.allSettled(
    chatIds.map((chatId) =>
      axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text,
      }),
    ),
  );
}
