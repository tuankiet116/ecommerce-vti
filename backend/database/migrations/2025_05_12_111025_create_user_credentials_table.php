<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_credentials', function (Blueprint $table) {
            $table->id();
            $table->string("email")->unique();
            $table->string("password");
            $table->string("email_verified_at")->nullable();
            $table->string("verify_expire_at")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_credentials');
    }
};
