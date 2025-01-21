import nodemailer from 'nodemailer';

// Configurez votre transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true, // true pour le port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`;

  const mailOptions = {
    from: {
      name: 'Diet App',
      address: process.env.EMAIL_USER // Utiliser EMAIL_USER au lieu de EMAIL_FROM
    },
    to: email,
    subject: 'Vérifiez votre adresse email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Vérification de votre email</h2>
        <p>Bonjour,</p>
        <p>Pour continuer votre inscription, veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
        <p style="margin: 20px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Vérifier mon email
          </a>
        </p>
        <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
        <p style="color: #4F46E5;">${verificationUrl}</p>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email.</p>
      </div>
    `
  };

  try {
    // Vérifier la connexion avant l'envoi
    await transporter.verify();
    
    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    throw error;
  }
}