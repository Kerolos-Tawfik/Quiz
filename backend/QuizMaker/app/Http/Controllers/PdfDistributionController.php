<?php

namespace App\Http\Controllers;

use App\Models\PdfDistribution;
use Illuminate\Http\Request;

class PdfDistributionController extends Controller
{
    public function store(Request $request)
    {
        // حذف القديم
        PdfDistribution::truncate();

        foreach ($request->all() as $category => $count) {
            if ((int) $count > 0) {
                PdfDistribution::create([
                    'category' => $category,
                    'count' => $count,
                ]);
            }
        }

        return response()->json(['message' => '✅ تم حفظ التوزيع']);
    }

    public function get()
    {
        $data = PdfDistribution::all();

        $result = [];
        foreach ($data as $row) {
            $result[$row->category] = $row->count;
        }

        return response()->json($result);
    }
}
