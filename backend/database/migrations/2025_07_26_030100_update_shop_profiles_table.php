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
        Schema::table('shop_profiles', function (Blueprint $table) {
            $table->string("legal_person_first_name")->nullable();
            $table->string("legal_person_last_name")->nullable();
            $table->string("legal_person_cni_number")->nullable();
            $table->string("street")->nullable();
            $table->string("apartment")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shop_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'legal_person_first_name',
                'legal_person_last_name',
                'legal_person_cni_number',
                'street',
                'apartment',
            ]);
        });
    }
};
