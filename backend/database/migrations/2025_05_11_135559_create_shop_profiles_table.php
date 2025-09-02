<?php

use App\Models\ShopModel;
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
        Schema::create('shop_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_credential_id')->index();
            $table->string('handle')->unique();
            $table->string('shop_name')->unique();
            $table->string('bussiness_name');
            $table->string("bussiness_number")->nullable();
            $table->string("bussiness_tax_number")->nullable();
            $table->string("contact_person_name")->nullable();
            $table->string("contact_person_number")->nullable();
            $table->string("contact_person_email")->nullable();
            $table->string("contact_phone_number")->nullable();
            $table->string("profile_image")->nullable();
            $table->string("banner_image")->nullable();
            $table->string("description")->nullable();
            $table->string("address")->nullable();
            $table->string("state")->nullable();
            $table->string("city")->nullable();
            $table->string("zip_code")->nullable();
            $table->string("country")->nullable();
            $table->string('status')->default(ShopModel::STATUS_INACTIVE);
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_profiles');
    }
};
