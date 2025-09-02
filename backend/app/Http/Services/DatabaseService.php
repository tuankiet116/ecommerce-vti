<?php

namespace App\Http\Services;

class DatabaseService
{
    public function getNextSequenceId($sequenceName)
    {
        $result = \DB::select("SELECT nextval('{$sequenceName}') as id");
        return $result[0]->id ?? null;
    }
}
