<?php

namespace App\Modules\Supplier\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Resources\AuthResource;
use App\Modules\Supplier\Actions\RegisterSupplierAction;
use App\Modules\Supplier\Requests\SupplierRegisterRequest;

class SupplierAuthController extends Controller
{
    public function register(SupplierRegisterRequest $request, RegisterSupplierAction $action)
    {
        $result = $action->execute($request->validated(), $request->file('csv_file'));

        return response()->json([
            'success' => true,
            'message' => 'Supplier registration submitted successfully. Your application is pending review.',
            'data' => [
                'user' => new AuthResource($result['user']),
                'token' => $result['token'],
                'supplier' => [
                    'id' => $result['supplier']->id,
                    'name' => $result['supplier']->name,
                    'code' => $result['supplier']->code,
                    'approval_status' => $result['supplier']->approval_status,
                ],
            ],
        ], 201);
    }
}
