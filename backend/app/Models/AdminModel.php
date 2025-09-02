<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User;

class AdminModel extends User
{
    protected $table = 'admins';

    protected $fillable = [
        'email',
        'password',
        'remember_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
