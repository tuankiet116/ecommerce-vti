<?php

namespace App\Http\Ultils;

class CommonUltils
{
    public static function generateUidFromEmailMicrotime(string $email): int
    {
        $data = strtolower(trim($email)) . '_' . microtime(true);
        $hash = sha1($data, true);
        $unpacked = unpack('N', substr($hash, 0, 4));
        $uint32 = $unpacked[1];

        // Convert to signed 32-bit int if needed
        if ($uint32 > 0x7FFFFFFF) { // 2,147,483,647
            $int32 = $uint32 - 0x100000000; // subtract 2^32
        } else {
            $int32 = $uint32;
        }

        return abs($int32);
    }
}
