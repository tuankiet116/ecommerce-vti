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
        Schema::create('live_stream_banned_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('moderator_id')->nullable();
            $table->unsignedBigInteger('session_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->string("user_name");
            $table->string('role_banned');
            $table->boolean('is_banned_by_host')->default(false);
            $table->timestamps();

            $table->unique(['session_id', 'user_id'], 'unique_session_user_ban');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_stream_banned_users');
    }
};
