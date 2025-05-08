<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>بنك الأسئلة</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        h1 { text-align: center; margin-bottom: 20px; }
        .question { margin-bottom: 15px; }
    </style>
</head>
<body>
    <h1>بنك الأسئلة</h1>
    @foreach($questions as $q)
        <div class="question">
            <strong>{{ $q->title }}</strong>
            <p>{!! $q->content !!}</p>
        </div>
    @endforeach
</body>
</html>
