import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end('ok');
  }

  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL || '');
    
    // Create leads table if not exists
    await sql`
      create table if not exists leads (
        id bigserial primary key,
        created_at timestamptz default now(),
        name text,
        email text,
        phone text,
        preferred_contact_method text,
        buying_stage text,
        preferred_contact_time text,
        message text,
        source text,
        conversation_history jsonb,
        properties_interested jsonb,
        status text default 'new'
      )
    `;

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      // Save lead to database
      const result = await sql`
        insert into leads (
          name, 
          email, 
          phone, 
          preferred_contact_method,
          buying_stage,
          preferred_contact_time,
          message,
          source,
          conversation_history,
          properties_interested
        ) values (
          ${body.name},
          ${body.email},
          ${body.phone},
          ${body.preferredContactMethod || body.preferred_contact_method},
          ${body.buyingStage || body.buying_stage},
          ${body.preferredContactTime || body.preferred_contact_time},
          ${body.message},
          ${body.source || 'Contact Form'},
          ${body.conversationHistory ? JSON.stringify(body.conversationHistory) : null},
          ${body.propertiesInterested ? JSON.stringify(body.propertiesInterested) : null}
        )
        returning id
      `;

      const leadId = result[0]?.id;

      // Send email notification if sendEmail is true (default true)
      if (body.sendEmail !== false) {
        try {
          const {
            name,
            email,
            phone,
            preferredContactMethod,
            buyingStage,
            preferredContactTime,
            message,
            source = 'Contact Form',
            conversationHistory,
            propertiesInterested
          } = body;

          // Build email HTML
          const emailHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 30px; text-align: center; }
                  .badge { display: inline-block; background: #D4AF37; color: white; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 10px; }
                  .section { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
                  .section-title { font-size: 18px; font-weight: bold; color: #000000; margin-bottom: 15px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
                  .field { margin: 12px 0; }
                  .field-label { font-weight: bold; color: #666; }
                  .field-value { color: #333; margin-left: 10px; }
                  .conversation { background: white; padding: 15px; border-left: 4px solid #D4AF37; margin: 10px 0; }
                  .message-user { background: #000000; color: white; padding: 10px; border-radius: 8px; margin: 5px 0; }
                  .message-assistant { background: #f0ebe6; padding: 10px; border-radius: 8px; margin: 5px 0; }
                  .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                  .property-item { background: white; padding: 10px; margin: 5px 0; border-radius: 4px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">🏠 New Lead from NMS Realty</h1>
                    <span class="badge">${source}</span>
                  </div>

                  <div class="section">
                    <div class="section-title">📋 Contact Information</div>
                    ${name ? `<div class="field"><span class="field-label">Name:</span><span class="field-value">${name}</span></div>` : ''}
                    ${email ? `<div class="field"><span class="field-label">Email:</span><span class="field-value"><a href="mailto:${email}">${email}</a></span></div>` : ''}
                    ${phone ? `<div class="field"><span class="field-label">Phone:</span><span class="field-value"><a href="tel:${phone}">${phone}</a></span></div>` : ''}
                    ${preferredContactMethod ? `<div class="field"><span class="field-label">Preferred Contact:</span><span class="field-value">${preferredContactMethod}</span></div>` : ''}
                  </div>

                  ${buyingStage || preferredContactTime ? `
                  <div class="section">
                    <div class="section-title">🎯 Lead Details</div>
                    ${buyingStage ? `<div class="field"><span class="field-label">Buying Stage:</span><span class="field-value">${buyingStage}</span></div>` : ''}
                    ${preferredContactTime ? `<div class="field"><span class="field-label">Best Time to Contact:</span><span class="field-value">${preferredContactTime}</span></div>` : ''}
                  </div>
                  ` : ''}

                  ${message ? `
                  <div class="section">
                    <div class="section-title">💬 Message</div>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                  </div>
                  ` : ''}

                  ${conversationHistory && conversationHistory.length > 0 ? `
                  <div class="section">
                    <div class="section-title">💭 Conversation History</div>
                    ${conversationHistory.map((msg: any) => `
                      <div class="${msg.role === 'user' ? 'message-user' : 'message-assistant'}">
                        <strong>${msg.role === 'user' ? 'User' : 'AI Assistant'}:</strong> ${msg.text}
                      </div>
                    `).join('')}
                  </div>
                  ` : ''}

                  ${propertiesInterested && propertiesInterested.length > 0 ? `
                  <div class="section">
                    <div class="section-title">🏘️ Properties of Interest</div>
                    ${propertiesInterested.map((prop: any) => `
                      <div class="property-item">
                        <strong>${prop.address || 'Property'}</strong><br>
                        ${prop.city ? `${prop.city}, ${prop.state || ''}<br>` : ''}
                        ${prop.price ? `Price: $${prop.price.toLocaleString()}<br>` : ''}
                        ${prop.beds || prop.baths ? `${prop.beds || 0} bed, ${prop.baths || 0} bath` : ''}
                      </div>
                    `).join('')}
                  </div>
                  ` : ''}

                  <div class="footer">
                    <p>Lead ID: ${leadId || 'N/A'}</p>
                    <p>Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</p>
                    <p style="margin-top: 20px; font-size: 11px; color: #999;">
                      This lead was automatically captured from nmsrealtypa.homes
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `;

          // Send email - ALWAYS to nicole@exppgh.com
          await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'leads@nmsrealtypa.homes',
          to: 'nicole@exppgh.com',
          subject: `🏠 New ${source} Lead - ${name || email || 'Anonymous'}`,
          html: emailHtml,
          });
        } catch (emailError) {
          console.error('Email sending error:', emailError);
          // Don't fail the whole request if email fails
        }
      }

      return res.status(200).json({ 
        success: true, 
        leadId: leadId 
      });
    }

    if (req.method === 'GET') {
      const leads = await sql`
        select * from leads 
        order by created_at desc
      `;
      return res.status(200).json({ leads });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e: any) {
    console.error('Leads API error:', e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}

