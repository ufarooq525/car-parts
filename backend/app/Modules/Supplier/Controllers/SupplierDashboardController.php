<?php

namespace App\Modules\Supplier\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Supplier\Models\Supplier;
use App\Modules\Supplier\Resources\SupplierResource;
use App\Modules\Supplier\Resources\SyncLogResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SupplierDashboardController extends Controller
{
    /**
     * Get supplier dashboard overview
     */
    public function dashboard(Request $request): JsonResponse
    {
        $supplier = $request->user()->supplier;

        if (!$supplier) {
            return response()->json(['message' => 'No supplier profile found.'], 404);
        }

        $supplier->loadCount('products');
        $supplier->load(['syncLogs' => fn ($q) => $q->latest()->limit(1)]);

        return response()->json([
            'success' => true,
            'data' => [
                'supplier' => new SupplierResource($supplier),
                'stats' => [
                    'products_count' => $supplier->products_count ?? 0,
                    'approval_status' => $supplier->approval_status,
                    'is_active' => $supplier->is_active,
                    'last_synced_at' => $supplier->last_synced_at,
                ],
            ],
        ]);
    }

    /**
     * Get supplier's own products
     */
    public function products(Request $request): JsonResponse
    {
        $supplier = $request->user()->supplier;

        if (!$supplier) {
            return response()->json(['message' => 'No supplier profile found.'], 404);
        }

        $products = $supplier->products()
            ->when($request->search, fn ($q, $s) => $q->where('products.name', 'like', "%{$s}%"))
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
        ]);
    }

    /**
     * Get supplier's sync logs
     */
    public function syncLogs(Request $request): JsonResponse
    {
        $supplier = $request->user()->supplier;

        if (!$supplier) {
            return response()->json(['message' => 'No supplier profile found.'], 404);
        }

        $logs = $supplier->syncLogs()
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => SyncLogResource::collection($logs)->resolve(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'from' => $logs->firstItem(),
                'to' => $logs->lastItem(),
            ],
        ]);
    }

    /**
     * Update supplier's own feed settings
     */
    public function updateFeed(Request $request): JsonResponse
    {
        $supplier = $request->user()->supplier;

        if (!$supplier) {
            return response()->json(['message' => 'No supplier profile found.'], 404);
        }

        if (!$supplier->isApproved()) {
            return response()->json(['message' => 'Your account must be approved before updating feed settings.'], 403);
        }

        $validated = $request->validate([
            'feed_type' => ['nullable', 'in:api,xml,csv,none'],
            'api_url' => ['nullable', 'url'],
            'api_key' => ['nullable', 'string'],
            'feed_url' => ['nullable', 'url'],
            'csv_file' => ['nullable', 'file', 'mimes:csv,txt', 'max:10240'],
            'sync_interval_minutes' => ['nullable', 'integer', 'min:15'],
        ]);

        // Handle CSV file upload
        if ($request->hasFile('csv_file')) {
            // Delete old file if exists
            if ($supplier->csv_file_path) {
                Storage::disk('public')->delete($supplier->csv_file_path);
            }
            $file = $request->file('csv_file');
            $validated['csv_file_path'] = $file->store('supplier-feeds', 'public');
            $validated['csv_original_name'] = $file->getClientOriginalName();
        }

        // Update feed type if provided
        if (isset($validated['feed_type'])) {
            $validated['type'] = $validated['feed_type'];
        }
        unset($validated['feed_type'], $validated['csv_file']);

        $supplier->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Feed settings updated successfully.',
            'data' => new SupplierResource($supplier->fresh()),
        ]);
    }

    /**
     * Update supplier's own profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $supplier = $request->user()->supplier;

        if (!$supplier) {
            return response()->json(['message' => 'No supplier profile found.'], 404);
        }

        $validated = $request->validate([
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'website' => ['nullable', 'url', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $supplier->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'data' => new SupplierResource($supplier->fresh()),
        ]);
    }
}
