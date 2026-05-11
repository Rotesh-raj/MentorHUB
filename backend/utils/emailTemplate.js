/**
 * MentorHub Professional Email Templates
 * Standardized SaaS-style HTML layouts for role-based notifications.
 */

const primaryColor = "#4F46E5"; // Indigo-600

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MentorHub Notification</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f7ff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background-color: ${primaryColor}; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
        .content { padding: 40px; color: #1f2937; line-height: 1.6; }
        .content h2 { color: #111827; font-size: 22px; margin-top: 0; font-weight: 700; }
        .details-card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .details-row { display: flex; margin-bottom: 8px; }
        .details-label { font-weight: 600; color: #6b7280; width: 120px; min-width: 120px; }
        .details-value { color: #111827; font-weight: 500; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; }
        .btn { display: inline-block; padding: 12px 28px; background-color: ${primaryColor}; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
        .footer p { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MentorHub</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; 2025 MentorHub Platform. All rights reserved.</p>
            <p>Smart Campus Connection — Connecting Students & Teachers.</p>
        </div>
    </div>
</body>
</html>
`;

// 1. Welcome Email
export const welcomeEmail = (name, loginUrl) => baseTemplate(`
    <h2>Welcome to MentorHub! 🚀</h2>
    <p>Hello ${name || 'User'},</p>
    <p>Your account has been successfully created. We're excited to have you on board. MentorHub is designed to bridge the gap between students and mentors seamlessly.</p>
    <p>You can now log in to your dashboard to get started.</p>
    <div style="text-align: center;">
        <a href="${loginUrl || '#'}" class="btn">Login to Your Account</a>
    </div>
    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser: <br> ${loginUrl}</p>
`);

// 2. High-Security Forgot Password Email
export const forgotPasswordEmail = (name, resetUrl, expiryMinutes = 10) => baseTemplate(`
    <h2>Reset Your MentorHub Password</h2>
    <p>Hello ${name || 'User'},</p>
    <p>We received a request to reset your password. Click the button below to secure your account and set a new password.</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl || '#'}" class="btn">Reset Password</a>
    </div>
    <p style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; color: #92400e; font-size: 14px;">
        <strong>⚠️ Security Warning:</strong> This link is strictly valid for only <strong>${expiryMinutes} minutes</strong>. If the link expires, you will need to request a new one.
    </p>
    <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">If you didn't request this password reset, please ignore this email. Your account remains secure and no changes have been made.</p>
`);

// 3. Password Reset Success Email
export const passwordResetSuccessEmail = (name) => baseTemplate(`
    <h2>Password Updated Successfully ✅</h2>
    <p>Hello ${name || 'User'},</p>
    <p>Your MentorHub account password has been successfully updated. You can now use your new password to log in to your dashboard.</p>
    <p style="color: #6b7280; font-size: 14px;">If you did not perform this action, please contact our support team immediately as your account security may be at risk.</p>
    <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.FRONTEND_URL}/login" class="btn">Login to Your Account</a>
    </div>
`);

// 4. Appointment Booked (To Student)
export const appointmentBookedStudentEmail = (studentName, teacherName, date, time) => baseTemplate(`
    <h2>Appointment Booked! 📅</h2>
    <p>Hello ${studentName || 'Student'},</p>
    <p>Your appointment request with <strong>${teacherName || 'Teacher'}</strong> has been successfully submitted and is now pending approval.</p>
    <div class="details-card">
        <div class="details-row"><span class="details-label">Mentor:</span><span class="details-value">${teacherName}</span></div>
        <div class="details-row"><span class="details-label">Date:</span><span class="details-value">${date}</span></div>
        <div class="details-row"><span class="details-label">Time:</span><span class="details-value">${time}</span></div>
    </div>
    <p>We will notify you once the mentor reviews your request.</p>
`);

// 5. Appointment Booked (To Teacher)
export const appointmentBookedTeacherEmail = (teacherName, studentName, date, time) => baseTemplate(`
    <h2>New Appointment Request 🔔</h2>
    <p>Hello ${teacherName || 'Mentor'},</p>
    <p>A student has booked an appointment with you. Please review and update the status of this request.</p>
    <div class="details-card">
        <div class="details-row"><span class="details-label">Student:</span><span class="details-value">${studentName}</span></div>
        <div class="details-row"><span class="details-label">Date:</span><span class="details-value">${date}</span></div>
        <div class="details-row"><span class="details-label">Time:</span><span class="details-value">${time}</span></div>
    </div>
    <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/teacher/login" class="btn">Review Request</a>
    </div>
`);

// 6. Appointment Approved
export const appointmentApprovedEmail = (studentName, teacherName, date, time) => baseTemplate(`
    <h2>Appointment Approved! 🎉</h2>
    <p>Hello ${studentName || 'Student'},</p>
    <p>Great news! Your appointment with <strong>${teacherName || 'Mentor'}</strong> has been <strong>Approved</strong>.</p>
    <div class="details-card">
        <div class="details-row"><span class="details-label">Mentor:</span><span class="details-value">${teacherName}</span></div>
        <div class="details-row"><span class="details-label">Date:</span><span class="details-value">${date}</span></div>
        <div class="details-row"><span class="details-label">Time:</span><span class="details-value">${time}</span></div>
        <div class="details-row"><span class="details-label">Status:</span><span class="details-value" style="color: #059669;">Approved</span></div>
    </div>
    <p>Please make sure to be available at the scheduled time. Real-time chat will be enabled shortly before the meeting.</p>
`);

// 7. Appointment Rejected
export const appointmentRejectedEmail = (studentName, teacherName, reason) => baseTemplate(`
    <h2>Appointment Update</h2>
    <p>Hello ${studentName || 'Student'},</p>
    <p>Your appointment request with <strong>${teacherName || 'Mentor'}</strong> has been declined.</p>
    <div class="details-card">
        <div class="details-row"><span class="details-label">Mentor:</span><span class="details-value">${teacherName}</span></div>
        <div class="details-row"><span class="details-label">Status:</span><span class="details-value" style="color: #dc2626;">Rejected</span></div>
        <div class="details-row"><span class="details-label">Reason:</span><span class="details-value">${reason || 'No specific reason provided.'}</span></div>
    </div>
    <p>You can try booking another slot that better suits the mentor's availability.</p>
`);

// 8. Account Approved
export const accountApprovedEmail = (name, role, loginUrl) => baseTemplate(`
    <h2>Account Approved! 🎉</h2>
    <p>Hello ${name || 'User'},</p>
    <p>Your MentorHub <strong>${role || 'Account'}</strong> has been reviewed and <strong>Approved</strong>.</p>
    <p>You can now access all the features associated with your role.</p>
    <div style="text-align: center;">
        <a href="${loginUrl || '#'}" class="btn">Login to Dashboard</a>
    </div>
`);

// 9. Account Rejected
export const accountRejectedEmail = (name, reason) => baseTemplate(`
    <h2>Registration Update</h2>
    <p>Hello ${name || 'User'},</p>
    <p>We regret to inform you that your registration request for MentorHub has been <strong>Rejected</strong>.</p>
    <div class="details-card">
        <div class="details-row"><span class="details-label">Status:</span><span class="details-value" style="color: #dc2626;">Rejected</span></div>
        <div class="details-row"><span class="details-label">Reason:</span><span class="details-value">${reason || 'The information provided did not meet our verification criteria.'}</span></div>
    </div>
    <p>If you believe this is a mistake, please contact our support team.</p>
`);

// Admin Registration Notification (For SuperAdmin)
export const adminRegistrationNotification = (details) => baseTemplate(`
    <h2>New Admin Registration Request</h2>
    <p>Hello SuperAdmin, a new Admin has registered and is awaiting verification.</p>
    <div class="details-card">
        <div class="details-row"><span class="details-label">Name:</span><span class="details-value">${details.name}</span></div>
        <div class="details-row"><span class="details-label">Email:</span><span class="details-value">${details.email}</span></div>
        <div class="details-row"><span class="details-label">Department:</span><span class="details-value">${details.department}</span></div>
        <div class="details-row"><span class="details-label">College:</span><span class="details-value">${details.college}</span></div>
    </div>
    <p>Please log in to your SuperAdmin dashboard to review and approve this request.</p>
    <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/admin-auth" class="btn">Review Request</a>
    </div>
`);
