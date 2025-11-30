import { Resend } from 'resend';

// Initialize Resend with API key validation
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not set. Email functionality will not work.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Shared email styles for consistent branding
const emailStyles = {
  body: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f3f4f6;',
  container: 'max-width: 520px; margin: 0 auto; padding: 24px 16px;',
  card: 'background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); overflow: hidden;',
  header: 'background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 24px 28px; text-align: center;',
  headerTitle: 'color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;',
  content: 'padding: 28px;',
  text: 'font-size: 15px; margin: 0 0 16px; color: #374151; line-height: 1.6;',
  textMuted: 'font-size: 13px; color: #6b7280; margin: 0 0 12px;',
  button: 'display: inline-block; background: #3b82f6; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;',
  link: 'font-size: 12px; color: #3b82f6; word-break: break-all;',
  warning: 'font-size: 13px; color: #dc2626; margin: 16px 0 0; padding-top: 16px; border-top: 1px solid #e5e7eb;',
  footer: 'padding: 20px 28px; background: #f9fafb; border-top: 1px solid #e5e7eb;',
  footerText: 'font-size: 12px; color: #9ca3af; margin: 0; text-align: center;',
  list: 'font-size: 14px; margin: 0 0 20px; padding-left: 20px; color: #374151;',
  listItem: 'margin-bottom: 8px; line-height: 1.5;',
  infoBox: 'background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;',
  infoBoxText: 'font-size: 13px; color: #0369a1; margin: 0;',
};

export async function sendWelcomeEmail(email, username) {
  // Check if Resend is properly initialized
  if (!resend) {
    const error = new Error('Resend API key is not configured');
    console.error('Failed to send welcome email:', error.message);
    return { success: false, error: { message: error.message } };
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'NotaMinima <onboarding@resend.dev>';
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: '¡Bienvenido a NotaMinima!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido a NotaMinima</title>
          </head>
          <body style="${emailStyles.body}">
            <div style="${emailStyles.container}">
              <div style="${emailStyles.card}">
                <div style="${emailStyles.header}">
                  <h1 style="${emailStyles.headerTitle}">¡Bienvenido a NotaMinima!</h1>
                </div>
                <div style="${emailStyles.content}">
                  <p style="${emailStyles.text}">
                    Hola <strong>${username || 'estudiante'}</strong>,
                  </p>
                  <p style="${emailStyles.text}">
                    ¡Gracias por registrarte en NotaMinima! Tu cuenta ha sido creada exitosamente.
                  </p>
                  <div style="${emailStyles.infoBox}">
                    <p style="${emailStyles.infoBoxText}">
                      <strong>Ahora puedes:</strong>
                    </p>
                  </div>
                  <ul style="${emailStyles.list}">
                    <li style="${emailStyles.listItem}">Gestionar tus cursos y calcular promedios ponderados</li>
                    <li style="${emailStyles.listItem}">Guardar tus datos en la nube</li>
                    <li style="${emailStyles.listItem}">Exportar e importar tus datos</li>
                    <li style="${emailStyles.listItem}">Usar todas nuestras herramientas de calculo</li>
                  </ul>
                  <div style="text-align: center; margin: 24px 0;">
                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/promedio" style="${emailStyles.button}">
                      Comenzar a usar NotaMinima
                    </a>
                  </div>
                </div>
                <div style="${emailStyles.footer}">
                  <p style="${emailStyles.footerText}">
                    ¡Que tengas exito en tus estudios! — El equipo de NotaMinima
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
¡Bienvenido a NotaMinima!

Hola ${username || 'estudiante'},

¡Gracias por registrarte en NotaMinima! Tu cuenta ha sido creada exitosamente.

Ahora puedes:
- Gestionar tus cursos y calcular promedios ponderados
- Guardar tus datos en la nube y acceder desde cualquier dispositivo
- Exportar e importar tus datos cuando lo necesites
- Usar todas nuestras herramientas de cálculo académico

Comienza a usar NotaMinima: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/promedio

¡Que tengas éxito en tus estudios!

El equipo de NotaMinima
      `,
    });

    if (error) {
      console.error('Resend API error sending welcome email:', {
        message: error.message,
        statusCode: error.statusCode,
        email: email,
        error: error,
      });
      return { success: false, error };
    }

    console.log('Welcome email sent successfully:', {
      email: email,
      messageId: data?.id,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending welcome email:', {
      message: error.message,
      stack: error.stack,
      email: email,
      error: error,
    });
    return { success: false, error: { message: error.message, stack: error.stack } };
  }
}

export async function sendVerificationEmail(email, token) {
  // Check if Resend is properly initialized
  if (!resend) {
    const error = new Error('Resend API key is not configured');
    console.error('Failed to send verification email:', error.message);
    return { success: false, error: { message: error.message } };
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'NotaMinima <onboarding@resend.dev>';
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/register/verify?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Verifica tu email - NotaMinima',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verifica tu email - NotaMinima</title>
          </head>
          <body style="${emailStyles.body}">
            <div style="${emailStyles.container}">
              <div style="${emailStyles.card}">
                <div style="${emailStyles.header}">
                  <h1 style="${emailStyles.headerTitle}">Verifica tu email</h1>
                </div>
                <div style="${emailStyles.content}">
                  <p style="${emailStyles.text}">
                    Hola,
                  </p>
                  <p style="${emailStyles.text}">
                    Gracias por registrarte en NotaMinima. Para completar tu registro, verifica tu direccion de email haciendo clic en el boton de abajo.
                  </p>
                  <div style="text-align: center; margin: 24px 0;">
                    <a href="${verificationUrl}" style="${emailStyles.button}">
                      Verificar mi email
                    </a>
                  </div>
                  <p style="${emailStyles.textMuted}">
                    O copia y pega este enlace en tu navegador:
                  </p>
                  <p style="${emailStyles.link}">
                    ${verificationUrl}
                  </p>
                  <p style="${emailStyles.warning}">
                    Este enlace expirara en 24 horas.
                  </p>
                  <p style="${emailStyles.textMuted}; margin-top: 12px;">
                    Si no solicitaste este registro, puedes ignorar este email.
                  </p>
                </div>
                <div style="${emailStyles.footer}">
                  <p style="${emailStyles.footerText}">
                    El equipo de NotaMinima
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Verifica tu email - NotaMinima

Hola,

Gracias por registrarte en NotaMinima. Para completar tu registro, por favor verifica tu dirección de email visitando el siguiente enlace:

${verificationUrl}

Este enlace expirará en 24 horas.

Si no solicitaste este registro, puedes ignorar este email de forma segura.

El equipo de NotaMinima
      `,
    });

    if (error) {
      console.error('Resend API error sending verification email:', {
        message: error.message,
        statusCode: error.statusCode,
        email: email,
        error: error,
      });
      return { success: false, error };
    }

    console.log('Verification email sent successfully:', {
      email: email,
      messageId: data?.id,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending verification email:', {
      message: error.message,
      stack: error.stack,
      email: email,
      error: error,
    });
    return { success: false, error: { message: error.message, stack: error.stack } };
  }
}

export async function sendEmailChangeVerificationEmail(newEmail, token) {
  // Check if Resend is properly initialized
  if (!resend) {
    const error = new Error('Resend API key is not configured');
    console.error('Failed to send email change verification email:', error.message);
    return { success: false, error: { message: error.message } };
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'NotaMinima <onboarding@resend.dev>';
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/cuenta/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: newEmail,
      subject: 'Verifica tu nuevo email - NotaMinima',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verifica tu nuevo email - NotaMinima</title>
          </head>
          <body style="${emailStyles.body}">
            <div style="${emailStyles.container}">
              <div style="${emailStyles.card}">
                <div style="${emailStyles.header}">
                  <h1 style="${emailStyles.headerTitle}">Verifica tu nuevo email</h1>
                </div>
                <div style="${emailStyles.content}">
                  <p style="${emailStyles.text}">
                    Hola,
                  </p>
                  <p style="${emailStyles.text}">
                    Has solicitado cambiar el email de tu cuenta en NotaMinima. Para completar el cambio, verifica esta nueva direccion haciendo clic en el boton de abajo.
                  </p>
                  <div style="text-align: center; margin: 24px 0;">
                    <a href="${verificationUrl}" style="${emailStyles.button}">
                      Verificar mi nuevo email
                    </a>
                  </div>
                  <p style="${emailStyles.textMuted}">
                    O copia y pega este enlace en tu navegador:
                  </p>
                  <p style="${emailStyles.link}">
                    ${verificationUrl}
                  </p>
                  <p style="${emailStyles.warning}">
                    Este enlace expirara en 24 horas.
                  </p>
                  <p style="${emailStyles.textMuted}; margin-top: 12px;">
                    Si no solicitaste este cambio, puedes ignorar este mensaje. Tu email actual permanecera sin cambios.
                  </p>
                </div>
                <div style="${emailStyles.footer}">
                  <p style="${emailStyles.footerText}">
                    El equipo de NotaMinima
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Verifica tu nuevo email - NotaMinima

Hola,

Has solicitado cambiar el email de tu cuenta en NotaMinima. Para completar el cambio, por favor verifica esta nueva dirección de email visitando el siguiente enlace:

${verificationUrl}

Este enlace expirará en 24 horas.

Si no solicitaste este cambio de email, puedes ignorar este mensaje de forma segura. Tu email actual permanecerá sin cambios.

El equipo de NotaMinima
      `,
    });

    if (error) {
      console.error('Resend API error sending email change verification email:', {
        message: error.message,
        statusCode: error.statusCode,
        email: newEmail,
        error: error,
      });
      return { success: false, error };
    }

    console.log('Email change verification email sent successfully:', {
      email: newEmail,
      messageId: data?.id,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending email change verification email:', {
      message: error.message,
      stack: error.stack,
      email: newEmail,
      error: error,
    });
    return { success: false, error: { message: error.message, stack: error.stack } };
  }
}

export async function sendPasswordResetEmail(email, token) {
  // Check if Resend is properly initialized
  if (!resend) {
    const error = new Error('Resend API key is not configured');
    console.error('Failed to send password reset email:', error.message);
    return { success: false, error: { message: error.message } };
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'NotaMinima <onboarding@resend.dev>';
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/login/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Restablecer contraseña - NotaMinima',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restablecer contraseña - NotaMinima</title>
          </head>
          <body style="${emailStyles.body}">
            <div style="${emailStyles.container}">
              <div style="${emailStyles.card}">
                <div style="${emailStyles.header}">
                  <h1 style="${emailStyles.headerTitle}">Restablecer contraseña</h1>
                </div>
                <div style="${emailStyles.content}">
                  <p style="${emailStyles.text}">
                    Hola,
                  </p>
                  <p style="${emailStyles.text}">
                    Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en NotaMinima. Haz clic en el boton de abajo para crear una nueva contraseña.
                  </p>
                  <div style="text-align: center; margin: 24px 0;">
                    <a href="${resetUrl}" style="${emailStyles.button}">
                      Restablecer mi contraseña
                    </a>
                  </div>
                  <p style="${emailStyles.textMuted}">
                    O copia y pega este enlace en tu navegador:
                  </p>
                  <p style="${emailStyles.link}">
                    ${resetUrl}
                  </p>
                  <p style="${emailStyles.warning}">
                    Este enlace expirara en 15 minutos por seguridad.
                  </p>
                  <p style="${emailStyles.textMuted}; margin-top: 12px;">
                    Si no solicitaste restablecer tu contraseña, puedes ignorar este email. Tu contraseña actual permanecera sin cambios.
                  </p>
                </div>
                <div style="${emailStyles.footer}">
                  <p style="${emailStyles.footerText}">
                    El equipo de NotaMinima
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Restablecer contraseña - NotaMinima

Hola,

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en NotaMinima. Visita el siguiente enlace para crear una nueva contraseña:

${resetUrl}

Este enlace expirará en 15 minutos por seguridad.

Si no solicitaste restablecer tu contraseña, puedes ignorar este email de forma segura. Tu contraseña actual permanecerá sin cambios.

El equipo de NotaMinima
      `,
    });

    if (error) {
      console.error('Resend API error sending password reset email:', {
        message: error.message,
        statusCode: error.statusCode,
        email: email,
        error: error,
      });
      return { success: false, error };
    }

    console.log('Password reset email sent successfully:', {
      email: email,
      messageId: data?.id,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error sending password reset email:', {
      message: error.message,
      stack: error.stack,
      email: email,
      error: error,
    });
    return { success: false, error: { message: error.message, stack: error.stack } };
  }
}
