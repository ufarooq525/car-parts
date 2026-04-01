<?php

namespace App\Modules\Supplier\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\Supplier\Actions\CreateSupplierAction;
use App\Modules\Supplier\Actions\DeleteSupplierAction;
use App\Modules\Supplier\Actions\TriggerSyncAction;
use App\Modules\Supplier\Actions\UpdateSupplierAction;
use App\Modules\Supplier\Repositories\SupplierRepository;
use App\Modules\Supplier\Requests\StoreSupplierRequest;
use App\Modules\Supplier\Requests\UpdateSupplierRequest;
use App\Modules\Supplier\Resources\SupplierResource;
use App\Modules\Supplier\Resources\SyncLogResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends BaseController
{
    public function __construct(
        protected SupplierRepository $repository,
    ) {}

    /**
     * List suppliers (filtered + paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'is_active', 'type']);
        $perPage = (int) $request->get('per_page', 15);

        $suppliers = $this->repository->getFilteredSuppliers($filters, $perPage);

        return $this->paginatedResponse(
            SupplierResource::collection($suppliers),
            'supplier::messages.suppliers_listed',
        );
    }

    /**
     * Show a single supplier.
     */
    public function show(int $id): JsonResponse
    {
        $supplier = $this->repository->findById($id, ['*'], ['syncLogs' => fn ($q) => $q->latest()->limit(1)]);

        if (!$supplier) {
            return $this->notFoundResponse('supplier::messages.supplier_not_found');
        }

        $supplier->loadCount('products');

        return $this->successResponse(
            new SupplierResource($supplier),
            'supplier::messages.supplier_found',
        );
    }

    /**
     * Store a new supplier.
     */
    public function store(StoreSupplierRequest $request, CreateSupplierAction $action): JsonResponse
    {
        $supplier = $action->execute($request->validated());

        return $this->createdResponse(
            new SupplierResource($supplier),
            'supplier::messages.supplier_created',
        );
    }

    /**
     * Update an existing supplier.
     */
    public function update(
        UpdateSupplierRequest $request,
        int $id,
        UpdateSupplierAction $action,
    ): JsonResponse {
        $supplier = $this->repository->findByIdOrFail($id);

        $updated = $action->execute($supplier, $request->validated());

        return $this->successResponse(
            new SupplierResource($updated),
            'supplier::messages.supplier_updated',
        );
    }

    /**
     * Delete a supplier.
     */
    public function destroy(int $id, DeleteSupplierAction $action): JsonResponse
    {
        $supplier = $this->repository->findByIdOrFail($id);

        $action->execute($supplier);

        return $this->noContentResponse('supplier::messages.supplier_deleted');
    }

    /**
     * Trigger a sync for the supplier.
     */
    public function triggerSync(int $id, TriggerSyncAction $action): JsonResponse
    {
        $supplier = $this->repository->findByIdOrFail($id);

        $syncLog = $action->execute($supplier);

        return $this->successResponse(
            new SyncLogResource($syncLog),
            'supplier::messages.sync_triggered',
        );
    }
}
