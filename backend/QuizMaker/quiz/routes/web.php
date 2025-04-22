<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return file_get_contents(__DIR__.'/../react/index.html');
})->where('any', '.*');
