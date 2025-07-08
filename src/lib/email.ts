// lib/email.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export interface EmailTemplate {
  to: string
  from: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private static instance: EmailService
  private fromEmail: string

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@servicetrackerpro.com'
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      await sgMail.send(template)
      return true
    } catch (error) {
      console.error('Email send failed:', error)
      return false
    }
  }

  // Welcome email for new customers
  async sendCustomerWelcome(
    customerEmail: string, 
    businessName: string, 
    portalUrl: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      to: customerEmail,
      from: this.fromEmail,
      subject: `Welcome to ${businessName} Customer Portal`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ${businessName}!</h2>
          <p>Your customer portal is now ready. You can:</p>
          <ul>
            <li>Track your service requests</li>
            <li>View service history</li>
            <li>Communicate with technicians</li>
            <li>View invoices and estimates</li>
          </ul>
          <a href="${portalUrl}" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Access Your Portal
          </a>
          <p>If you have any questions, please contact ${businessName} directly.</p>
        </div>
      `,
      text: `Welcome to ${businessName}! Access your customer portal at: ${portalUrl}`
    }

    return this.sendEmail(template)
  }

  // Service update notification
  async sendServiceUpdate(
    customerEmail: string,
    serviceName: string,
    updateMessage: string,
    businessName: string,
    portalUrl: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      to: customerEmail,
      from: this.fromEmail,
      subject: `Service Update: ${serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Service Update from ${businessName}</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${serviceName}</h3>
            <p>${updateMessage}</p>
          </div>
          <a href="${portalUrl}" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Full Details
          </a>
        </div>
      `,
      text: `Service Update: ${serviceName} - ${updateMessage}. View details at: ${portalUrl}`
    }

    return this.sendEmail(template)
  }

  // New service request notification for business
  async sendNewServiceAlert(
    businessEmail: string,
    customerName: string,
    serviceName: string,
    description: string,
    dashboardUrl: string
  ): Promise<boolean> {
    const template: EmailTemplate = {
      to: businessEmail,
      from: this.fromEmail,
      subject: `New Service Request: ${serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Service Request</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${serviceName}</h3>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Description:</strong> ${description}</p>
          </div>
          <a href="${dashboardUrl}" style="background: #1D4ED8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Dashboard
          </a>
        </div>
      `,
      text: `New service request from ${customerName}: ${serviceName} - ${description}. View in dashboard: ${dashboardUrl}`
    }

    return this.sendEmail(template)
  }
}