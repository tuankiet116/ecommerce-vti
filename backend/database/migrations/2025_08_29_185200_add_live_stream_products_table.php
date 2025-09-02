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
        Schema::create('live_stream_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('live_stream_sesion_id')->index();
            $table->unsignedBigInteger('product_id');
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();

            $table->unique(['live_stream_sesion_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_stream_products');
    }
};
