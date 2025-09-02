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
        Schema::create('live_stream_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shop_id')->index();
            $table->string("title")->fulltext();
            $table->string("channel_name")->nullable();
            $table->text("description")->fulltext()->nullable();
            $table->string("thumbnail")->nullable();
            $table->string("token")->unique()->nullable();
            $table->string("status")->default('scheduled'); // scheduled, live, ended
            $table->timestamp("start_time")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_stream_sessions');
    }
};
