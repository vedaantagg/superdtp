/**
 * SuperDTP contact form — Google Apps Script mail handler.
 *
 * Build:  npm i -D @google/clasp typescript @types/google-apps-script
 *         clasp push        # clasp transpiles .ts → .gs on push
 *
 * Deploy: Apps Script editor → Deploy → New deployment → Web app
 *           Execute as:      Me (your Google account)
 *           Who has access:  Anyone
 *         Copy the /exec URL into CONTACT_API_URL in index.html.
 *
 * Mail is sent *from* the Google account that owns this script, so deploy it
 * from the inbox you want the enquiries to land in.
 */

/** Where enquiries are delivered. */
const RECIPIENT = "dtp.bulgaria@gmail.com";

/** Raw bytes across all attachments. Gmail's hard ceiling is 25 MB. */
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

interface IncomingFile {
  name: string;
  mimeType: string;
  /** base64, without the `data:...;base64,` prefix. */
  data: string;
}

interface ContactPayload {
  subject?: string;
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  phone?: string;
  languages?: string;
  message?: string;
  files?: IncomingFile[];
}

function json(body: Record<string, unknown>): GoogleAppsScript.Content.TextOutput {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Escape user input before it goes into the HTML body of the email. */
function esc(value: string | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | undefined): string {
  if (!value) return "";
  return (
    '<tr><td style="padding:6px 14px 6px 0;color:#666;white-space:nowrap;' +
    'vertical-align:top;">' +
    esc(label) +
    '</td><td style="padding:6px 0;color:#111;">' +
    esc(value).replace(/\n/g, "<br>") +
    "</td></tr>"
  );
}

function doPost(
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: "Empty request body." });
    }

    const payload = JSON.parse(e.postData.contents) as ContactPayload;

    if (!payload.name || !payload.email) {
      return json({ ok: false, error: "Name and email are required." });
    }

    const files = payload.files ?? [];
    const attachments: GoogleAppsScript.Base.Blob[] = [];
    let totalBytes = 0;

    for (const file of files) {
      const bytes = Utilities.base64Decode(file.data);
      totalBytes += bytes.length;
      if (totalBytes > MAX_TOTAL_BYTES) {
        return json({ ok: false, error: "Attachments exceed 10 MB total." });
      }
      attachments.push(
        Utilities.newBlob(bytes, file.mimeType, file.name),
      );
    }

    const html =
      '<div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;">' +
      '<h2 style="margin:0 0 16px;font-size:17px;">New enquiry — superdtp.com</h2>' +
      '<table style="border-collapse:collapse;">' +
      row("Name", payload.name) +
      row("Email", payload.email) +
      row("Phone", payload.phone) +
      row("Company", payload.company) +
      row("Service", payload.service) +
      row("Languages", payload.languages) +
      row("Message", payload.message) +
      row("Attachments", attachments.length ? String(attachments.length) : "") +
      "</table></div>";

    MailApp.sendEmail({
      to: RECIPIENT,
      // Gmail only honours replyTo — `from` must be a verified alias, so the
      // sender stays the deploying account and replies route to the enquirer.
      replyTo: payload.email,
      name: "SuperDTP Website",
      subject: payload.subject || "SuperDTP Enquiry",
      htmlBody: html,
      attachments: attachments,
    });

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) });
  }
}
