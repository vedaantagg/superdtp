/**
 * SuperDTP contact form — Google Apps Script mail handler.
 * Plain-JS twin of Code.ts, for pasting straight into script.google.com.
 *
 * Deploy → New deployment → Web app
 *   Execute as:     Me
 *   Who has access: Anyone
 * Copy the /exec URL into CONTACT_API_URL in index.html.
 *
 * Mail is sent from the Google account that owns this script.
 */

var RECIPIENT = "dtp.bulgaria@gmail.com";
var MAX_TOTAL_BYTES = 10 * 1024 * 1024;

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label, value) {
  if (!value) return "";
  return (
    '<tr><td style="padding:6px 14px 6px 0;color:#666;white-space:nowrap;vertical-align:top;">' +
    esc(label) +
    '</td><td style="padding:6px 0;color:#111;">' +
    esc(value).replace(/\n/g, "<br>") +
    "</td></tr>"
  );
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: "Empty request body." });
    }

    var payload = JSON.parse(e.postData.contents);

    if (!payload.name || !payload.email) {
      return json({ ok: false, error: "Name and email are required." });
    }

    var files = payload.files || [];
    var attachments = [];
    var totalBytes = 0;

    for (var i = 0; i < files.length; i++) {
      var bytes = Utilities.base64Decode(files[i].data);
      totalBytes += bytes.length;
      if (totalBytes > MAX_TOTAL_BYTES) {
        return json({ ok: false, error: "Attachments exceed 10 MB total." });
      }
      attachments.push(
        Utilities.newBlob(bytes, files[i].mimeType, files[i].name)
      );
    }

    var html =
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
