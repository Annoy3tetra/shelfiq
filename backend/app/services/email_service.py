import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings

logger = logging.getLogger(__name__)


def _build_reset_email_html(reset_link: str) -> str:
    """Build a branded HTML email for password reset."""
    return f"""\
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; box-shadow:0 4px 24px rgba(15,23,42,0.06); overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a; padding:28px 32px; text-align:center;">
              <span style="font-size:22px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">
                Shelf<span style="color:#38bdf8;">IQ</span>
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px;">
              <h1 style="margin:0 0 12px; font-size:20px; font-weight:700; color:#0f172a;">
                Reset your password
              </h1>
              <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#475569;">
                We received a request to reset the password for your ShelfIQ account.
                Click the button below to choose a new password. This link expires in
                <strong>15 minutes</strong>.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background-color:#3b82f6; border-radius:8px;">
                    <a href="{reset_link}"
                       target="_blank"
                       style="display:inline-block; padding:12px 28px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px; font-size:12px; color:#94a3b8;">
                If the button doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="margin:0 0 24px; font-size:12px; color:#3b82f6; word-break:break-all;">
                {reset_link}
              </p>
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:0 0 20px;">
              <p style="margin:0; font-size:12px; color:#94a3b8; line-height:1.5;">
                If you didn't request this, you can safely ignore this email.
                Your password will remain unchanged.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background-color:#f8fafc; text-align:center;">
              <p style="margin:0; font-size:11px; color:#94a3b8;">
                &copy; 2025 ShelfIQ Inc. &mdash; Intelligent Bookstore ERP
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def send_password_reset_email(to_email: str, reset_token: str) -> None:
    """
    Send a password reset email.

    If SMTP credentials are not configured, logs the reset link
    to the console (useful for local development).
    """
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

    # Dev fallback: print to console if SMTP not configured
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP not configured — printing reset link to console."
        )
        print("\n" + "=" * 60)
        print("  PASSWORD RESET LINK (dev mode)")
        print(f"  {reset_link}")
        print("=" * 60 + "\n")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your ShelfIQ password"
    msg["From"] = f"ShelfIQ <{settings.SMTP_USER}>"
    msg["To"] = to_email

    # Plain-text fallback
    text_body = (
        f"Reset your ShelfIQ password\n\n"
        f"Click the link below to reset your password (expires in 15 minutes):\n"
        f"{reset_link}\n\n"
        f"If you didn't request this, ignore this email."
    )
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(_build_reset_email_html(reset_link), "html"))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())

        logger.info("Password reset email sent to %s", to_email)
    except Exception:
        logger.exception("Failed to send password reset email to %s", to_email)
        # Still print the link so devs can test manually
        print(f"\n[EMAIL SEND FAILED] Reset link: {reset_link}\n")
