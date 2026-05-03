/**
 * MentorHub Professional Email Templates
 * Standardized SaaS-style HTML layouts for role-based notifications.
 */

const primaryColor = "#4F46E5"; // Indigo-600
const secondaryColor = "#1E293B"; // Slate-800

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MentorHub Notification</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px; color: #334155; line-height: 1.6; }
        .content h2 { color: #1e293b; font-size: 20px; margin-top: 0; }
        .card { background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
        .card-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
        .card-row:last-child { border-bottom: none; }
        .label { font-weight: 700; color: #64748b; font-size: 12px; uppercase; }
        .value { color: #1e293b; font-weight: 500; text-align: right; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3); }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .badge-pending { background-color: #fef3c7; color: #92400e; }
        .badge-approved { background-color: #dcfce7; color: #166534; }
        .badge-rejected { background-color: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div className="container">
        <div className="header">
            <h1>MentorHub</h1>
        </div>
        <div className="content">
            ${content}
        </div>
        <div className="footer">
            <p>&copy; 2026 MentorHub Platform. All rights reserved.</p>
            <p>Smart Campus Connection — Connecting Students & Teachers Smarter.</p>
            <p>Support: <a href="mailto:dsiconnection.project@gmail.com" style="color: #4f46e5; text-decoration: none;">dsiconnection.project@gmail.com</a></p>
        </div>
    </div>
</body>
</html>
`;

export const adminRegistrationNotification = (adminData) => baseTemplate(`
    <h2>New Admin Registration Request</h2>
    <p>Hello SuperAdmin, a new Admin has registered for your department and is awaiting verification.</p>
    <div className="card">
        <div className="card-row">
            <span className="label">Full Name</span>
            <span className="value">${adminData.name}</span>
        </div>
        <div className="card-row">
            <span className="label">Email</span>
            <span className="value">${adminData.email}</span>
        </div>
        <div className="card-row">
            <span className="label">Department</span>
            <span className="value">${adminData.department}</span>
        </div>
        <div className="card-row">
            <span className="label">College</span>
            <span className="value">${adminData.college}</span>
        </div>
    </div>
    <p>Please log in to your SuperAdmin dashboard to review and approve this request.</p>
    <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/admin-auth" className="btn">Review Request</a>
    </div>
`);

export const adminApprovalEmail = (adminName) => baseTemplate(`
    <h2>Account Approved! 🎉</h2>
    <p>Hello ${adminName},</p>
    <p>Your MentorHub Admin account has been <strong>Approved</strong>. You can now log in and access your department dashboard.</p>
    <div className="card" style="text-align: center; background-color: #dcfce7;">
        <span className="badge badge-approved">Status: Approved</span>
    </div>
    <p>Manage your department, upload institutional CSVs, and oversee student interactions effectively.</p>
    <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/admin-auth" className="btn">Login to Dashboard</a>
    </div>
`);

export const adminRejectionEmail = (adminName) => baseTemplate(`
    <h2>Registration Update</h2>
    <p>Hello ${adminName},</p>
    <p>We regret to inform you that your registration as an Admin on MentorHub has been <strong>Rejected</strong> by the Department SuperAdmin.</p>
    <div className="card" style="text-align: center; background-color: #fee2e2;">
        <span className="badge badge-rejected">Status: Rejected</span>
    </div>
    <p>If you believe this is a mistake, please contact your department head or institutional administrator.</p>
`);

export const appointmentBookingNotification = (details) => baseTemplate(`
    <h2>New Appointment Request 📅</h2>
    <p>Hello ${details.teacherName}, a student has booked a new appointment with you.</p>
    <div className="card">
        <div className="card-row">
            <span className="label">Student</span>
            <span className="value">${details.studentName}</span>
        </div>
        <div className="card-row">
            <span className="label">Academic Details</span>
            <span className="value">${details.year} Year - Sec ${details.section}</span>
        </div>
        <div className="card-row">
            <span className="label">Topic</span>
            <span className="value">${details.topic}</span>
        </div>
        <div className="card-row">
            <span className="label">Date</span>
            <span className="value">${details.date}</span>
        </div>
        <div className="card-row">
            <span className="label">Time</span>
            <span className="value">${details.time}</span>
        </div>
    </div>
    <p>Please log in to your dashboard to Approve or Reject this request.</p>
    <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/teacher/login" className="btn">View Request</a>
    </div>
`);

export const appointmentStatusEmail = (details) => baseTemplate(`
    <h2>Appointment ${details.status}</h2>
    <p>Hello ${details.studentName},</p>
    <p>Your appointment request with <strong>${details.teacherName}</strong> has been <strong>${details.status}</strong>.</p>
    <div className="card">
        <div className="card-row">
            <span className="label">Topic</span>
            <span className="value">${details.topic}</span>
        </div>
        <div className="card-row">
            <span className="label">Schedule</span>
            <span className="value">${details.date} at ${details.time}</span>
        </div>
        <div className="card-row">
            <span className="label">Status</span>
            <span className="value">
                <span className="badge badge-${details.status.toLowerCase()}">${details.status}</span>
            </span>
        </div>
        ${details.reason ? `
        <div className="card-row" style="border-top: 1px solid #e2e8f0; margin-top: 10px; padding-top: 10px;">
            <span className="label">Reason</span>
            <span className="value" style="color: #991b1b;">${details.reason}</span>
        </div>
        ` : ''}
    </div>
    ${details.status === 'Approved' ? `
    <p>Real-time chat will be enabled shortly before your appointment time.</p>
    <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/student/login" className="btn">View Appointments</a>
    </div>
    ` : ''}
`);

export const forgotPasswordEmail = (resetUrl, userName) => baseTemplate(`
    <h2>Reset Your Password</h2>
    <p>Hello ${userName || 'User'},</p>
    <p>We received a request to reset your MentorHub account password. Click the button below to set a new password. This link is valid for <strong>10 minutes</strong>.</p>
    <div style="text-align: center; margin: 40px 0;">
        <a href="${resetUrl}" className="btn">Reset Password</a>
    </div>
    <p style="font-size: 13px; color: #64748b;">If you didn't request a password reset, you can safely ignore this email.</p>
    <p style="font-size: 11px; color: #94a3b8; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
        For security, never share this link with anyone.
    </p>
`);

export const adminApprovalConfirmationTemplate = ({ name }) => baseTemplate(`
    <h2>Account Approved! 🎉</h2>
    <p>Hello ${name || "Admin"} 👋</p>
    <p>Your MentorHub Admin account has been <strong>Approved</strong> successfully.</p>
    <div className="card" style="text-align: center; background-color: #dcfce7;">
        <span className="badge badge-approved">Status: Approved</span>
    </div>
    <p>You can now login and access your department dashboard to manage students and teachers.</p>
    <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/admin-auth" className="btn">Login Now</a>
    </div>
`);
