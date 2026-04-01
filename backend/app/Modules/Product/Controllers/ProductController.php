<?php

namespace App\Modules\Product\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\Product\Actions\CreateProductAction;
use App\Modules\Product\Actions\DeleteProductAction;
use App\Modules\Product\Actions\UpdateProductAction;
use App\Modules\Product\Repositories\ProductRepository;
use App\Modules\Product\Requests\StoreProductRequest;
use App\Modules\Product\Requests\UpdateProductRequest;
use App\Modules\Product\Resources\ProductListResource;
use App\Modules\Product\Resources\ProductResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends BaseController
{
    public function __construct(
        protected ProductRepository $repository,
    ) {}

    /**
     * List products (filtered + paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search',
            'category_id',
            'brand',
            'min_price',
            'max_price',
            'in_stock',
            'supplier_id',
            'sort_by',
            'sort_order',
        ]);
        $perPage = (int) $request->get('per_page', 15);

        $products = $this->repository->getFilteredProducts($filters, $perPage);

        return $this->paginatedResponse(
            ProductListResource::collection($products),
            'product::messages.products_listed',
        );
    }

    /**
     * Show a single product by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $product = $this->repository->findBySlug($slug);

        if (! $product) {
            return $this->notFoundResponse('product::messages.product_not_found');
        }

        return $this->successResponse(
            new ProductResource($product),
            'product::messages.product_found',
        );
    }

    /**
     * Store a new product.
     */
    public function store(StoreProductRequest $request, CreateProductAction $action): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['vehicles'])) {
            $data['vehicle_ids'] = $data['vehicles'];
            unset($data['vehicles']);
        }

        if (isset($data['suppliers'])) {
            $data['supplier_data'] = $data['suppliers'];
            unset($data['suppliers']);
        }

        $product = $action($data);

        return $this->createdResponse(
            new ProductResource($product),
            'product::messages.product_created',
        );
    }

    /**
     * Update an existing product.
     */
    public function update(
        UpdateProductRequest $request,
        int $product,
        UpdateProductAction $action,
    ): JsonResponse {
        $model = $this->repository->findByIdOrFail($product);

        $data = $request->validated();

        if (isset($data['vehicles'])) {
            $data['vehicle_ids'] = $data['vehicles'];
            unset($data['vehicles']);
        }

        if (isset($data['suppliers'])) {
            $data['supplier_data'] = $data['suppliers'];
            unset($data['suppliers']);
        }

        $updated = $action($model, $data);

        return $this->successResponse(
            new ProductResource($updated),
            'product::messages.product_updated',
        );
    }

    /**
     * Delete a product.
     */
    public function destroy(int $product, DeleteProductAction $action): JsonResponse
    {
        $model = $this->repository->findByIdOrFail($product);

        $action($model);

        return $this->noContentResponse('product::messages.product_deleted');
    }
}
