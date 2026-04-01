<?php

namespace App\Modules\Vehicle\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\Vehicle\Repositories\VehicleRepository;
use App\Modules\Vehicle\Requests\StoreVehicleRequest;
use App\Modules\Vehicle\Requests\UpdateVehicleRequest;
use App\Modules\Vehicle\Resources\VehicleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleController extends BaseController
{
    public function __construct(
        protected VehicleRepository $repository,
    ) {}

    /**
     * List vehicles (filtered + paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'make', 'model', 'year', 'sort_by', 'sort_order']);
        $perPage = (int) $request->get('per_page', 15);

        $vehicles = $this->repository->getFilteredVehicles($filters, $perPage);

        return $this->paginatedResponse(
            VehicleResource::collection($vehicles),
            'vehicle::messages.vehicles_listed',
        );
    }

    /**
     * Show a single vehicle by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $vehicle = $this->repository->findBySlug($slug);

        if (!$vehicle) {
            return $this->notFoundResponse('vehicle::messages.vehicle_not_found');
        }

        return $this->successResponse(
            new VehicleResource($vehicle),
            'vehicle::messages.vehicle_found',
        );
    }

    /**
     * Store a new vehicle (admin).
     */
    public function store(StoreVehicleRequest $request): JsonResponse
    {
        $vehicle = $this->repository->create($request->validated());

        return $this->createdResponse(
            new VehicleResource($vehicle),
            'vehicle::messages.vehicle_created',
        );
    }

    /**
     * Update an existing vehicle (admin).
     */
    public function update(UpdateVehicleRequest $request, int $id): JsonResponse
    {
        $vehicle = $this->repository->findByIdOrFail($id);

        $vehicle->update($request->validated());

        return $this->successResponse(
            new VehicleResource($vehicle->fresh()),
            'vehicle::messages.vehicle_updated',
        );
    }

    /**
     * Delete a vehicle (admin).
     */
    public function destroy(int $id): JsonResponse
    {
        $vehicle = $this->repository->findByIdOrFail($id);

        $vehicle->delete();

        return $this->noContentResponse('vehicle::messages.vehicle_deleted');
    }

    /**
     * Get distinct vehicle makes.
     */
    public function makes(): JsonResponse
    {
        $makes = $this->repository->getMakes();

        return $this->successResponse(
            $makes->pluck('make'),
            'vehicle::messages.makes_listed',
        );
    }

    /**
     * Get distinct models for a given make.
     */
    public function models(string $make): JsonResponse
    {
        $models = $this->repository->getModelsByMake($make);

        return $this->successResponse(
            $models->pluck('model'),
            'vehicle::messages.models_listed',
        );
    }

    /**
     * Get years for a given make and model.
     */
    public function years(string $make, string $model): JsonResponse
    {
        $years = $this->repository->getYearsByMakeAndModel($make, $model);

        return $this->successResponse(
            $years,
            'vehicle::messages.years_listed',
        );
    }
}
