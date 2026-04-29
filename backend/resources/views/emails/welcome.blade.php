<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Museum Ticketing</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; mx-auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .header { background: #040810; color: #D9A048; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #fff; }
        .footer { text-align: center; font-size: 12px; color: #888; margin-top: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background: #D9A048; color: #040810; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MUSEUM TICKETING</h1>
        </div>
        <div class="content">
            <h2>Welcome, {{ $user->name }}!</h2>
            <p>Thank you for joining Museum Ticketing. We are excited to have you on board.</p>
            <p>Your account has been successfully created. You can now explore cultural treasures and book tickets with ease using our chatbot-based system.</p>
            <p><strong>Username:</strong> {{ $user->email }}</p>
            <a href="{{ config('app.url') }}" class="btn">Start Exploring</a>
            <p>If you have any questions, feel free to reply to this email or use our AI chatbot on the website.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Museum Ticketing System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
