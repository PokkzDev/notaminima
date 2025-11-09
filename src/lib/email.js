import { Resend } from 'resend';

// Initialize Resend with API key validation
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not set. Email functionality will not work.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

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
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #f9fafb; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827;">
            <div style="background: #1f2937; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido a NotaMinima!</h1>
            </div>
            <div style="background: #111827; padding: 30px; border: 2px solid #374151; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #f9fafb;">
                Hola ${username || 'estudiante'},
              </p>
              <p style="font-size: 16px; margin-bottom: 20px; color: #f9fafb;">
                ¡Gracias por registrarte en NotaMinima! Tu cuenta ha sido creada exitosamente.
              </p>
              <p style="font-size: 16px; margin-bottom: 20px; color: #f9fafb;">
                Ahora puedes:
              </p>
              <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px; color: #f9fafb;">
                <li>Gestionar tus cursos y calcular promedios ponderados</li>
                <li>Guardar tus datos en la nube y acceder desde cualquier dispositivo</li>
                <li>Exportar e importar tus datos cuando lo necesites</li>
                <li>Usar todas nuestras herramientas de cálculo académico</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/promedio" 
                   style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Comenzar a usar NotaMinima
                </a>
              </div>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #374151; padding-top: 20px;">
                Si tienes alguna pregunta, no dudes en contactarnos. ¡Que tengas éxito en tus estudios!
              </p>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 10px;">
                El equipo de NotaMinima
              </p>
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
        
        Si tienes alguna pregunta, no dudes en contactarnos. ¡Que tengas éxito en tus estudios!
        
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
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #f9fafb; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827;">
            <div style="background: #1f2937; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Verifica tu email</h1>
            </div>
            <div style="background: #111827; padding: 30px; border: 2px solid #374151; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #f9fafb;">
                Hola,
              </p>
              <p style="font-size: 16px; margin-bottom: 20px; color: #f9fafb;">
                Gracias por registrarte en NotaMinima. Para completar tu registro, por favor verifica tu dirección de email haciendo clic en el botón de abajo.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Verificar mi email
                </a>
              </div>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                O copia y pega este enlace en tu navegador:
              </p>
              <p style="font-size: 12px; color: #60a5fa; word-break: break-all; margin-bottom: 20px;">
                ${verificationUrl}
              </p>
              <p style="font-size: 14px; color: #ef4444; margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                ⚠️ Este enlace expirará en 24 horas.
              </p>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                Si no solicitaste este registro, puedes ignorar este email de forma segura.
              </p>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 10px;">
                El equipo de NotaMinima
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
        Verifica tu email - NotaMinima
        
        Hola,
        
        Gracias por registrarte en NotaMinima. Para completar tu registro, por favor verifica tu dirección de email visitando el siguiente enlace:
        
        ${verificationUrl}
        
        ⚠️ Este enlace expirará en 24 horas.
        
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
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #f9fafb; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #111827;">
            <div style="background: #1f2937; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Verifica tu nuevo email</h1>
            </div>
            <div style="background: #111827; padding: 30px; border: 2px solid #374151; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #f9fafb;">
                Hola,
              </p>
              <p style="font-size: 16px; margin-bottom: 20px; color: #f9fafb;">
                Has solicitado cambiar el email de tu cuenta en NotaMinima. Para completar el cambio, por favor verifica esta nueva dirección de email haciendo clic en el botón de abajo.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Verificar mi nuevo email
                </a>
              </div>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                O copia y pega este enlace en tu navegador:
              </p>
              <p style="font-size: 12px; color: #60a5fa; word-break: break-all; margin-bottom: 20px;">
                ${verificationUrl}
              </p>
              <p style="font-size: 14px; color: #ef4444; margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                ⚠️ Este enlace expirará en 24 horas.
              </p>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 20px;">
                Si no solicitaste este cambio de email, puedes ignorar este mensaje de forma segura. Tu email actual permanecerá sin cambios.
              </p>
              <p style="font-size: 14px; color: #9ca3af; margin-top: 10px;">
                El equipo de NotaMinima
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
        Verifica tu nuevo email - NotaMinima
        
        Hola,
        
        Has solicitado cambiar el email de tu cuenta en NotaMinima. Para completar el cambio, por favor verifica esta nueva dirección de email visitando el siguiente enlace:
        
        ${verificationUrl}
        
        ⚠️ Este enlace expirará en 24 horas.
        
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


