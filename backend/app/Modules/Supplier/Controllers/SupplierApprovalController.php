<?php

namespace App\Modules\Supplier\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Supplier\Actions\ApproveSupplierAction;
use App\Modules\Supplier\Actions\RejectSupplierAction;
use App\Modules\Supplier\Models\Supplier;
use App\Modules\Supplier\Resources\SupplierResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierApprovalController extends Controller
{
    /**
     * List suppliers pending approval
     */
    public function pendingList(Request $request): JsonResponse
    {
        $query = Supplier::query()
            ->when(
                $request->status,
                fn ($q, $s) => $q->where('approval_status', $s),
                fn ($q) => $q->whereIn('approval_status', ['pending', 'under_review'])
            )
            ->when($request->search, fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('code', 'like', "%{$s}%");
            }))
            ->orderBy('created_at', 'asc');

        $suppliers = $query->paginate($request->get('per_page', 15));

        return SupplierResource::collection($suppliers)->response();
    }

    /**
     * Mark supplier as under review
     */
    public function markUnderReview(int $id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);

        if (!$supplier->isPending()) {
            return response()->json(['message' => 'Supplier is not in pending status.'], 422);
        }

        $supplier->update(['approval_status' => 'under_review']);

        return response()->json([
            'success' => true,
            'message' => 'Supplier marked as under review.',
            'data' => new SupplierResource($supplier->fresh()),
        ]);
    }

    /**
     * Approve a supplier
     */
    public function approve(int $id, Request $request, ApproveSupplierAction $action): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);
        $supplier = $action->execute($supplier, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Supplier approved successfully.',
            'data' => new SupplierResource($supplier),
        ]);
    }

    /**
     * Reject a supplier
     */
    public function reject(int $id, Request $request, RejectSupplierAction $action): JsonResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $supplier = Supplier::findOrFail($id);
        $supplier = $action->execute($supplier, $request->reason);

        return response()->json([
            'success' => true,
            'message' => 'Supplier rejected.',
            'data' => new SupplierResource($supplier),
        ]);
    }
}
