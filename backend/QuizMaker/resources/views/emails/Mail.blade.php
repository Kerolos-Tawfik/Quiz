<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <title>النتيجة</title>
    <style>
        body {
            background-color: #f3f4f6;
            font-family: 'Tahoma', 'Arial', sans-serif;
            color: #111827;
            padding: 30px;
            direction: rtl;
        }

        .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
            text-align: center;
        }

        .percentage {
            font-size: 48px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 20px;
        }

        .message {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .footer {
            font-size: 16px;
            color: #6b7280;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="percentage">{{ $percentage }}%</h2>
        <p class="message">🎉 شكراً لاستخدامك منصة الأمثل التعليمية</p>
        <p class="footer">نتمنى لك دوام التوفيق والنجاح<br>فريق <strong>Alamthal</strong></p>
    </div>
</body>
</html>
