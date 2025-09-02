<?php
namespace App\Http\Services\Admin;

class ProductCategoryService
{
    /**
     * Get the next sequence ID for a given sequence name.
     *
     * @param string $sequenceName
     * @return int|null
     */
    public function getNextSequenceId($sequenceName)
    {
        $result = \DB::select("SELECT nextval('{$sequenceName}') as id");
        return $result[0]->id ?? null;
    }
}