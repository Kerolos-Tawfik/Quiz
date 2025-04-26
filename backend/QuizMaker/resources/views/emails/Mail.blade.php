<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>نتيجة الاختبار</title>
  <style>
    body {
      font-family: 'Tahoma', sans-serif;
      background-color: #f9fafb;
      padding: 30px;
      color: #1f2937;
    }

    .container {
      max-width: 750px;
      margin: auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 0 16px rgba(0, 0, 0, 0.06);
      padding: 40px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header img {
      width: 100px;
      height: auto;
      margin-bottom: 10px;
    }

    .header h2 {
      font-size: 26px;
      margin: 0;
      color: #1e3a8a;
    }

    .header p {
      font-size: 18px;
      color: #6b7280;
      margin-top: 5px;
    }

    .thankyou {
      background-color: #f0f9ff;
      padding: 20px;
      margin-top: 20px;
      border-radius: 12px;
      font-size: 17px;
      color: #0c4a6e;
      text-align: center;
      font-weight: bold;
    }

    .student-info, .section, .footer {
      text-align: center;
      margin-top: 25px;
    }

    .section h3 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #047857;
      border-bottom: 2px solid #d1fae5;
      padding-bottom: 8px;
    }

    table {
      width: 100%;
      margin-top: 8px;
      border-collapse: collapse;
    }

    th, td {
      padding: 10px;
      border: 1px solid #e5e7eb;
      font-size: 15px;
    }

    th {
      background-color: #d1fae5;
      color: #065f46;
    }

    .final-score {
      margin-top: 30px;
      font-size: 22px;
      font-weight: bold;
      color: #065f46;
    }

    .social-icons {
      margin-top: 20px;
    }

    .social-icons a {
      margin: 0 8px;
      display: inline-block;
    }

    .social-icons img {
      width: 28px;
      height: 28px;
    }
    .info-table, .score-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .info-table td, .score-table th, .score-table td {
      border: 1px solid #d1d5db;
      padding: 10px;
      text-align: center;
      font-size: 16px;
    }
    .info-table td {
      background-color: #f9fafb;
    }
    .score-table th {
      background-color: #f3f4f6;
      color: #1f2937;
      font-weight: bold;
    }
    .section{
        margin-top: 50px;
    }
    
  </style>
</head>
<body>
  <div class="container">
<div class="header" style="text-align: center;">
  <a href="https://alamthal.org" target="_blank">
    <img src="alamthal.org/pluginfile.php/1/theme_remui/logomini/1733240691/%D9%85%D8%B1%D9%83%D8%B2%20%D8%B4%D8%B1%D9%83%D8%A9%20%D8%A7%D9%84%D8%A3%D9%85%D8%AB%D9%84%20%D9%84%D9%84%D8%AA%D8%AF%D8%B1%D9%8A%D8%A82.png" alt="شعار المركز" style="width: 120px; height: auto; margin-bottom: 10px;" />
  </a>
  <h2 style="font-size:28px; margin-bottom: 5px; color: #1e3a8a;">مركز النور الأمثل للتدريب</h2>
  <p style="font-size: 18px; color: #6b7280;">
    <img src="https://cdn-icons-png.flaticon.com/512/3820/3820331.png" style="width: 26px; vertical-align: middle; margin-left: 8px;" />
    نتيجة اختبار الطالب
  </p>
</div>


    <div class="thankyou">
      شكراً لك على مشاركتك في الاختبار، نتمنى لك دوام التفوق والنجاح!
    </div>

 <table class="info-table">
      <tr>
        <td><strong>الاسم:</strong> {{ $name }}</td>
        <td><strong>رقم الهاتف:</strong> {{ $phone }}</td>
      </tr>
    </table>

    <!-- ✨ جدول النتيجة العامة -->
    <table class="score-table">
      <thead>
        <tr>
          <th></th>
          <th>عدد الإجابات الصحيحة</th>
          <th>عدد الإجابات الخاطئة</th>
          <th>النسبة</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>الدرجة الكلية</td>
          <td>{{ $correct }}</td>
          <td>{{ $wrong }}</td>
          <td>{{ $percentage }}%</td>
        </tr>
      </tbody>
    </table>

   @foreach ($sections as $section)
  @if(count($section['banks']) > 0)
    <div class="section">
     @php
  $sectionTotalScore = 0;
@endphp

<h3>
  {{ $section['title'] }}
  @foreach ($section['banks'] as $bank)
    @php
      $sectionTotalScore += $bank['score'];
    @endphp
  @endforeach
  — ✅ %{{ $sectionTotalScore }}
</h3>


      @php
        $totalScore = 0;
        $totalCorrect = 0;
        $totalWrong = 0;
      @endphp
 

    
      <table>
        <thead>
          <tr>
            <th>البنك</th>
            <th>✅ صحيحة</th>
            <th>❌ خاطئة</th>
            <th>📊 الدرجة</th>
            <th>📈 النسبة</th>
          </tr>
        </thead>
        <tbody>
          @foreach ($section['banks'] as $bank)
            @php
              $totalScore += $bank['score'];
              $totalCorrect += $bank['correct'] ?? 0;
              $totalWrong += $bank['wrong'] ?? 0;
              $bankTotal = ($bank['correct'] ?? 0) + ($bank['wrong'] ?? 0);
              $bankPercentage = $bankTotal > 0 ? round(($bank['score'] / $bankTotal) * 100, 1) : 0;
            @endphp
            <tr>
              <td>{{ $bank['name'] }}</td>
              <td>{{ $bank['correct'] ?? 0 }}</td>
              <td>{{ $bank['wrong'] ?? 0 }}</td>
              <td>{{ $bank['score'] }}</td>
              <td>{{ $bankPercentage }}%</td>
            </tr>
          @endforeach
        </tbody>
      </table>


    </div>
  @endif
@endforeach


    <div class="final-score">
      ✅ الدرجة النهائية: {{ $correct }} / {{ $correct + $wrong }} — النسبة: {{ $percentage }}%
    </div>

    <div class="footer" style="text-align: center; margin-top: 40px;">
  <p>📞 تواصل معنا عبر:</p>
  <div class="social-icons" style="margin-top: 10px;">
   
<a href="https://instagram.com" target="_blank">
  <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" style="width: 30px; margin: 0 8px;" alt="إنستجرام" />
</a>

<a href="https://tiktok.com" target="_blank">
  <img src="https://cdn-icons-png.flaticon.com/512/3046/3046122.png" style="width: 30px; margin: 0 8px;" alt="تيك توك" />
</a>
    <a href="https://alamthal.org" target="_blank">
      <img src="https://img.icons8.com/?size=100&id=1349&format=png&color=000000" style="width: 30px; margin: 0 8px;" />
    </a>
  </div>
</div>

  </div>
</body>
</html>
