import config from '../config/config';
import nodemailer from 'nodemailer';
import moment from 'moment';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    secure: true,
    auth: config.email.smtp.auth
});

const invoiceHtml = (data: any) => {
    let mailString = `<!DOCTYPE html>
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333333;
                    text-align: center;
                    margin-top: 0;
                }
                p {
                    margin-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #dddddd;
                }
                .total-row td {
                    border-top: 1px solid #dddddd;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #888888;
                }
                .company-logo {
                    display: block;
                    margin: 0 auto 50px;
                }
                .company-name {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .invoice-info {
                    text-align: right;
                    margin-bottom: 20px;
                }
                .invoice-info div {
                    margin-left: 15px;
                }
                .wrap-pdf {
                    margin: 40px auto;
                    text-align: center;
                }
                .view-pdf {
                    padding: 12px 20px;
                    font-size: 16px;
                    color: #2196F3;
                    border: 1px solid #2196F3;
                    border-radius: 16px;
                    text-decoration: none;
                }
                .bage {
                    text-align: center;
                    border-radius: 8px;
                    padding: 2px 10px;
                    text-transform: capitalize;
                }
                .pending {
                    background-color: rgba(255, 171, 0, 0.16);
                    color:rgb(183, 110, 0);
                }
                .paid {
                    color: rgb(17, 141, 87);
                    background-color: rgba(34, 197, 94, 0.16);
                }
                .overdue {
                    color: rgb(183, 29, 24);
                    background-color: rgba(255, 86, 48, 0.16);    
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://trock-frontend-v2.vercel.app/logo/logo_full.png" alt="Company Logo" class="company-logo">
                <h1>Invoice</h1>
                <div class="invoice-info">
                    <div>Invoice Number:  ${data.invoiceNumber}</div>
                    <div>Create Date:  ${moment(data.createDate).format('MMM DD yyyy')}</div>
                    <div>Due Date:  ${moment(data.dueDate).format('MMM DD yyyy')}</div>
                    <div>Status:  
                    <span class="${data.status} bage">${data.status}</span>
                    </div>
                </div>
                <p>Dear  ${data.invoiceTo.firstName} ${data.invoiceTo.lastName},</p>
                <p>Please find attached the invoice for the services provided:</p>

                <table>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>`;

    data.items.forEach((row: any) => {
        mailString += `<tr>
                                <td>${row.title}</td>
                                <td>${row.description}</td>
                                <td>${row.quantity}</td>
                                <td>${row.price}</td>
                                <td>${row.total}</td>
                            </tr>`;
    });
    mailString += `<tr class="total-row">
                        <td colspan="3">Total:</td>
                        <td>$${data.totalAmount}</td>
                    </tr>
                </table>

                <div class="wrap-pdf">
                <a class="view-pdf" href='https://trock-frontend-v2.vercel.app' target="_blank">View PDF<a/>
                </div>

                <p>If you have any questions or concerns regarding this invoice, please don't hesitate to contact us.</p>

                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>Best regards,</p>
                    <p class="company-name">${data.invoiceFrom.company}</p>
                    <p>${data.invoiceFrom.fullAddress}</p>
                    <p>Phone: ${data.invoiceFrom.phoneNumber} | Email: ${data.invoiceFrom.email}</p>
                </div>
            </div>
        </body>
        </html>
  `;
    return mailString;
};

const estimateHtml = (data: any) => {
    let mailString = `<!DOCTYPE html>
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333333;
                    text-align: center;
                    margin-top: 0;
                }
                p {
                    margin-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #dddddd;
                }
                .total-row td {
                    border-top: 1px solid #dddddd;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #888888;
                }
                .company-logo {
                    display: block;
                    margin: 0 auto 50px;
                }
                .company-name {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .estimate-info {
                    text-align: right;
                    margin-bottom: 20px;
                }
                .estimate-info div {
                    margin-left: 15px;
                }
                .wrap-pdf {
                    margin: 40px auto;
                    text-align: center;
                }
                .view-pdf {
                    padding: 12px 20px;
                    font-size: 16px;
                    color: #2196F3;
                    border: 1px solid #2196F3;
                    border-radius: 16px;
                    text-decoration: none;
                }
                .bage {
                    text-align: center;
                    border-radius: 8px;
                    padding: 2px 10px;
                    text-transform: capitalize;
                }
                .pending {
                    background-color: rgba(255, 171, 0, 0.16);
                    color:rgb(183, 110, 0);
                }
                .paid {
                    color: rgb(17, 141, 87);
                    background-color: rgba(34, 197, 94, 0.16);
                }
                .overdue {
                    color: rgb(183, 29, 24);
                    background-color: rgba(255, 86, 48, 0.16);    
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://trock-frontend-v2.vercel.app/logo/logo_full.png" alt="Company Logo" class="company-logo">
                <h1>Invoice</h1>
                <div class="estimate-info">
                    <div>Invoice Number:  ${data.estimateNumber}</div>
                    <div>Create Date:  ${moment(data.createDate).format('MMM DD yyyy')}</div>
                    <div>Due Date:  ${moment(data.dueDate).format('MMM DD yyyy')}</div>
                    <div>Status:  
                    <span class="${data.status} bage">${data.status}</span>
                    </div>
                </div>
                <p>Dear  ${data.estimateTo.firstName} ${data.estimateTo.lastName},</p>
                <p>Please find attached the estimate for the services provided:</p>

                <table>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>`;

    data.items.forEach((row: any) => {
        mailString += `<tr>
                                <td>${row.title}</td>
                                <td>${row.description}</td>
                                <td>${row.quantity}</td>
                                <td>${row.price}</td>
                                <td>${row.total}</td>
                            </tr>`;
    });
    mailString += `<tr class="total-row">
                        <td colspan="3">Total:</td>
                        <td>$${data.totalAmount}</td>
                    </tr>
                </table>

                <div class="wrap-pdf">
                <a class="view-pdf" href='https://trock-frontend-v2.vercel.app' target="_blank">View PDF<a/>
                </div>

                <p>If you have any questions or concerns regarding this estimate, please don't hesitate to contact us.</p>

                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>Best regards,</p>
                    <p class="company-name">${data.estimateFrom.company}</p>
                    <p>${data.estimateFrom.fullAddress}</p>
                    <p>Phone: ${data.estimateFrom.phoneNumber} | Email: ${data.estimateFrom.email}</p>
                </div>
            </div>
        </body>
        </html>
  `;
    return mailString;
};

export { transporter, nodemailer, invoiceHtml, estimateHtml };
