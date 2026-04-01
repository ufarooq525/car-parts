<?php

namespace App\Modules\Category\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\Category\Actions\CreateCategoryAction;
use App\Modules\Category\Actions\DeleteCategoryAction;
use App\Modules\Category\Actions\UpdateCategoryAction;
use App\Modules\Category\Repositories\CategoryRepository;
use App\Modules\Category\Requests\StoreCategoryRequest;
use App\Modules\Category\Requests\UpdateCategoryRequest;
use App\Modules\Category\Resources\CategoryResource;
use App\Modules\Category\Resources\CategoryTreeResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends BaseController
{
    public function __construct(
        protected CategoryRepository $repository,
    ) {}

    /**
     * List categories (filtered + paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'is_active', 'parent_id']);
        $perPage = (int) $request->get('per_page', 15);

        $categories = $this->repository->getFilteredCategories($filters, $perPage);

        return $this->paginatedResponse(
            CategoryResource::collection($categories),
            'category::messages.categories_listed',
        );
    }

    /**
     * Show a single category by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $category = $this->repository->findBySlug($slug);

        if (!$category) {
            return $this->notFoundResponse('category::messages.category_not_found');
        }

        return $this->successResponse(
            new CategoryResource($category),
            'category::messages.category_found',
        );
    }

    /**
     * Store a new category.
     */
    public function store(StoreCategoryRequest $request, CreateCategoryAction $action): JsonResponse
    {
        $category = $action->execute($request->validated());

        return $this->createdResponse(
            new CategoryResource($category),
            'category::messages.category_created',
        );
    }

    /**
     * Update an existing category.
     */
    public function update(
        UpdateCategoryRequest $request,
        int $id,
        UpdateCategoryAction $action,
    ): JsonResponse {
        $category = $this->repository->findByIdOrFail($id);

        $updated = $action->execute($category, $request->validated());

        return $this->successResponse(
            new CategoryResource($updated),
            'category::messages.category_updated',
        );
    }

    /**
     * Delete a category.
     */
    public function destroy(int $id, DeleteCategoryAction $action): JsonResponse
    {
        $category = $this->repository->findByIdOrFail($id);

        $action->execute($category);

        return $this->noContentResponse('category::messages.category_deleted');
    }

    /**
     * Get full category tree.
     */
    public function tree(): JsonResponse
    {
        $tree = $this->repository->getTree();

        return $this->successResponse(
            CategoryTreeResource::collection($tree),
            'category::messages.categories_listed',
        );
    }
}
