<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();
    
        return response()->json([
            'status' => 'success',
            'data' => $settings
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'questionCount' => 'required|integer',
            'questionBank' => 'required|string',
            'duration' => 'required|integer',
        ]);
    
        Setting::updateOrCreate([], $validated);
    
        return response()->json(['message' => 'Saved']);
    }
    
}
