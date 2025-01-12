import sgMail from '@sendgrid/mail';

export const sendEmail = async (email:string, subject:string, content:string) => {
  try {
    // Set your SendGrid API key (replace this with your SendGrid API key)
    sgMail.setApiKey('SENDGRID_API_KEY'); // Replace with your SendGrid API key

    // Define email options
    const msg = {
      to: email,
      from: 'noreply.emailserviceofsr3x0r@gmail.com', // Your sender email
      subject: subject,
      html: content,
    };

    // Send email using SendGrid
    const response = await sgMail.send(msg);
    console.log('Email sent: ' + response[0].statusCode);
    return 'Email sent successfully: ' + response[0].statusCode;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Failed to send email');
  }
};
