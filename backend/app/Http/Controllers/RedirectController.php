<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RedirectController extends Controller
{
    public function redirectLink(Request $request)
    {
        $url = $request->input('url');
        if (!$url)  return $this->responseError(message: 'Invalid URL provided.', httpCode: 400);

        return redirect(to: $url);
    }
}
