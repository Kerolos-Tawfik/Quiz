<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('answers', function (Blueprint $table) {
            $table->text('text')->change(); // ← ده بيخلّيها تقبل HTML طويل
        });
    }

    public function down(): void {
        Schema::table('answers', function (Blueprint $table) {
            $table->string('text', 255)->change(); // ← رجوع للوضع الأصلي
        });
    }
};
