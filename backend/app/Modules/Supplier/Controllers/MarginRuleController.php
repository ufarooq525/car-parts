<?php

namespace App\Modules\Supplier\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\Supplier\Actions\CreateMarginRuleAction;
use App\Modules\Supplier\Actions\DeleteMarginRuleAction;
use App\Modules\Supplier\Actions\UpdateMarginRuleAction;
use App\Modules\Supplier\Repositories\MarginRuleRepository;
use App\Modules\Supplier\Requests\StoreMarginRuleRequest;
use App\Modules\Supplier\Requests\UpdateMarginRuleRequest;
use App\Modules\Supplier\Resources\MarginRuleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MarginRuleController extends BaseController
{
    public function __construct(
        protected MarginRuleRepository $repository,
    ) {}

    /**
     * List margin rules (filtered + paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);

        $query = $this->repository->query()
            ->with(['supplier', 'category'])
            ->orderByDesc('priority');

        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->get('supplier_id'));
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->get('category_id'));
        }

        $rules = $query->paginate($perPage);

        return $this->paginatedResponse(
            MarginRuleResource::collection($rules),
            'supplier::messages.margin_rules_listed',
        );
    }

    /**
     * Store a new margin rule.
     */
    public function store(StoreMarginRuleRequest $request, CreateMarginRuleAction $action): JsonResponse
    {
        $rule = $action->execute($request->validated());

        return $this->createdResponse(
            new MarginRuleResource($rule),
            'supplier::messages.margin_rule_created',
        );
    }

    /**
     * Update an existing margin rule.
     */
    public function update(
        UpdateMarginRuleRequest $request,
        int $id,
        UpdateMarginRuleAction $action,
    ): JsonResponse {
        $rule = $this->repository->findByIdOrFail($id);

        $updated = $action->execute($rule, $request->validated());

        return $this->successResponse(
            new MarginRuleResource($updated),
            'supplier::messages.margin_rule_updated',
        );
    }

    /**
     * Delete a margin rule.
     */
    public function destroy(int $id, DeleteMarginRuleAction $action): JsonResponse
    {
        $rule = $this->repository->findByIdOrFail($id);

        $action->execute($rule);

        return $this->noContentResponse('supplier::messages.margin_rule_deleted');
    }
}
