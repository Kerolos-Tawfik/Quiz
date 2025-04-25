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

  // store
public function store(Request $request) {
    $student = studentinfo::create([
        'name' => $request->name,
        'phone' => $request->phone,
        'email' => $request->email,
        'score' => $request->score,
        'percentage' => $request->percentage
    ]);
    return response()->json(['id' => $student->id]);
}

// update
public function update(Request $request, $id) {
    $student = studentinfo::findOrFail($id);
    $student->update([
        'score' => $request->score,
        'percentage' => $request->percentage
    ]);
    return response()->json(['message' => 'updated']);
}

    public function destroy($id)
    {
  
        $student =studentinfo::destroy($id);

        return response()->json($student , 201);
    }
    public function destroyAll()
    {
        $count = StudentInfo::count(); // نعد الطلاب قبل الحذف
    
        if ($count === 0) {
            return response()->json(['message' => 'لا يوجد طلاب لحذفهم'], 200);
        }
    
        $deleted = StudentInfo::query()->delete(); // أو forceDelete() لو جدولك معمول له SoftDeletes
    
        return response()->json([
            'message' => "تم حذف $deleted طالب من أصل $count"
        ], 200);
    }
    

}
