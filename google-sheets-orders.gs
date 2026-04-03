const SPREADSHEET_ID = '17bJzDbIvWKvcbTgc0CWwhx6MtzM1yQzfB834IQxHEGk';
const SHEET_NAME = 'Orders';

// إعدادات إشعارات تليجرام
const TELEGRAM_BOT_TOKEN = '8659735935:AAGJUG7dlW3yMHVgOcGjZsiKRLPVZ6UUT7s'; 
const TELEGRAM_CHAT_ID = '6770893711';

// إعدادات إشعارات واتساب (CallMeBot)
const CALLMEBOT_PHONE = '+201500007300'; // رقمك مع الرمز الدولي
const CALLMEBOT_API_KEY = '8528900'; // الـ API Key الذي حصلت عليه من البوت

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: 'HTML'
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  try {
    UrlFetchApp.fetch(url, options);
  } catch (e) {
    // Ignore error
  }
}

function sendWhatsAppMessage(text) {
  if (!CALLMEBOT_PHONE || !CALLMEBOT_API_KEY) return;
  const encodedText = encodeURIComponent(text);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodedText}&apikey=${CALLMEBOT_API_KEY}`;
  const options = {
    method: 'get'
  };
  try {
    UrlFetchApp.fetch(url, options);
  } catch (e) {
    // Ignore error
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: 'Orders endpoint is running.' });
}

function doPost(e) {
  try {
    if (!e) {
      return jsonResponse({ ok: false, error: 'Missing request data.' });
    }

    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents || '{}');
      } catch (jsonError) {
        payload = {
          name: e.parameter && e.parameter.name,
          phoneNumber: e.parameter && e.parameter.phoneNumber,
          order: e.parameter && e.parameter.order,
          date: e.parameter && e.parameter.date,
          paymentMethod: e.parameter && e.parameter.paymentMethod
        };
      }
    } else if (e.parameter) {
      payload = {
        name: e.parameter.name,
        phoneNumber: e.parameter.phoneNumber,
        order: e.parameter.order,
        date: e.parameter.date,
        paymentMethod: e.parameter.paymentMethod
      };
    }

    if (!payload.name || !payload.phoneNumber || !payload.order || !payload.paymentMethod) {
      return jsonResponse({ ok: false, error: 'Missing required order fields.' });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Name', 'Phone Number', 'Order', 'Date', 'Payment Method']);
    }

    sheet.appendRow([
      payload.name || '',
      payload.phoneNumber || '',
      payload.order || '',
      payload.date || new Date().toISOString(),
      payload.paymentMethod || ''
    ]);

    // الإشعار للتليجرام
    const tgMsg = `📦 <b>طلب جديد! (ZARZ)</b>\n\n` +
                `👤 <b>الاسم:</b> ${payload.name || ''}\n` +
                `📱 <b>الهاتف:</b> ${payload.phoneNumber || ''}\n` +
                `💳 <b>الدفع:</b> ${payload.paymentMethod || ''}\n\n` +
                `📝 <b>التفاصيل:</b>\n${payload.order || ''}`;
    sendTelegramMessage(tgMsg);

    // الإشعار للواتساب
    const waMsg = `📦 *طلب جديد! (ZARZ)*\n\n` +
                `👤 *الاسم:* ${payload.name || ''}\n` +
                `📱 *الهاتف:* ${payload.phoneNumber || ''}\n` +
                `💳 *الدفع:* ${payload.paymentMethod || ''}\n\n` +
                `📝 *التفاصيل:*\n${payload.order || ''}`;
    sendWhatsAppMessage(waMsg);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error && error.message ? error.message : String(error) });
  }
}
