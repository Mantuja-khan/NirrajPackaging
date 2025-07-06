import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'mantujak@gmail.com',
    pass: process.env.EMAIL_PASS || 'cnpc klkk wuou zlmv'
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    // Email to owner
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL || "mantujakhan79@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
              ${message}
            </div>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This message was sent from the Nirraj Packaging website contact form.
          </p>
        </div>
      `
    };

    // Confirmation email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Nirraj Packaging',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            Thank You for Your Inquiry
          </h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting Nirraj Packaging. We have received your message and will get back to you within 24 hours.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Your Message:</h3>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
              ${message}
            </div>
          </div>

          <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: white;">Contact Information</h3>
            <p style="margin: 5px 0; color: white;">📧 Email: info@nirraj.com</p>
            <p style="margin: 5px 0; color: white;">📞 Phone: +1 (555) 123-4567</p>
            <p style="margin: 5px 0; color: white;">📍 Address: 123 Industrial Ave, Manufacturing District</p>
          </div>

          <p>Best regards,<br>
          <strong>Nirraj Packaging Team</strong></p>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// Product enquiry endpoint
app.post('/api/enquiry', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      message, 
      productName, 
      productImage, 
      productCategory,
      enquiryType 
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message || !productName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, phone, message, and product name are required' 
      });
    }

    // Email to owner
    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL || 'mantujakhan79@gmail.com',
      subject: `New Product Enquiry: ${productName} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            New Product Enquiry
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <img src="${productImage}" alt="${productName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
              <div>
                <h3 style="margin: 0; color: #dc2626;">${productName}</h3>
                <p style="margin: 5px 0; color: #64748b; font-size: 14px;">${productCategory}</p>
                <p style="margin: 5px 0; color: #059669; font-size: 14px; font-weight: bold;">${enquiryType}</p>
              </div>
            </div>
            
            <h4 style="color: #374151; margin-bottom: 15px;">Customer Details:</h4>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            
            <h4 style="color: #374151; margin: 20px 0 10px 0;">Customer Message:</h4>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
              ${message}
            </div>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            This enquiry was sent from the Nirraj Packaging website product page.
          </p>
        </div>
      `
    };

    // Confirmation email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for your enquiry about ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            Thank You for Your Product Enquiry
          </h2>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in our products. We have received your enquiry about <strong>${productName}</strong> and our team will contact you within 24 hours with detailed information and pricing.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <img src="${productImage}" alt="${productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
              <div>
                <h3 style="margin: 0; color: #dc2626;">${productName}</h3>
                <p style="margin: 5px 0; color: #64748b; font-size: 14px;">${productCategory}</p>
              </div>
            </div>
            
            <h4 style="color: #374151; margin-bottom: 10px;">Your Enquiry Details:</h4>
            <p><strong>Your Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
              ${message}
            </div>
          </div>

          <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: white;">Contact Information</h3>
            <p style="margin: 5px 0; color: white;">📧 Email: info@nirraj.com</p>
            <p style="margin: 5px 0; color: white;">📞 Phone: +1 (555) 123-4567</p>
            <p style="margin: 5px 0; color: white;">📍 Address: 123 Industrial Ave, Manufacturing District</p>
          </div>

          <p>Best regards,<br>
          <strong>Nirraj Packaging Team</strong></p>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.json({ 
      success: true, 
      message: 'Enquiry sent successfully! Our team will contact you within 24 hours.' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send enquiry. Please try again later.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});