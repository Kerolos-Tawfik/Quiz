<?php

namespace App\Http\Controllers;

use App\Models\studentinfo;
use Illuminate\Http\Request;

class StudentInfoController
{

    public function index()
    {
        $students = studentinfo::all();
    
        return response()->json([
            'status' => 'success',
            'data' => $students
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'score' => 'required|integer',
            'precentage' => 'required|numeric',
        ]);

        $student = studentinfo::create($request->all());

        return response()->json($student, 201);
    }
    public function destroy($id)
    {
  
        $student =studentinfo::destroy($id);

        return response()->json($student , 201);
    }
}
