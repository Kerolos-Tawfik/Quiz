<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>رمز التحقق</title>
    <style>
        body {
            background-color: #f9f9f9;
            font-family: 'Tahoma', 'Arial', sans-serif;
            direction: rtl;
            color: #2c3e50;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .code {
            font-size: 32px;
            font-weight: bold;
            background-color: #fef3c7;
            color: #d97706;
            padding: 15px 25px;
            border-radius: 10px;
            display: inline-block;
            margin: 20px 0;
            letter-spacing: 3px;
        }

        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>رمز التحقق الخاص بك:</h2>
        <div class="code">{{ $code }}</div>
        <p>هذا الرمز صالح لمدة <strong>10 دقائق</strong> فقط.</p>
        <div class="footer">
            إذا لم تطلب هذا البريد، يمكنك تجاهله بأمان.<br>
            شكراً لاستخدامك منصة الأمثل التعليمية.
        </div>
    </div>
</body>
</html>
