<?php

namespace App\Modules\Order\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\Order\Actions\CreateOrderAction;
use App\Modules\Order\Actions\UpdateOrderStatusAction;
use App\Modules\Order\Repositories\OrderRepository;
use App\Modules\Order\Requests\StoreOrderRequest;
use App\Modules\Order\Requests\UpdateOrderStatusRequest;
use App\Modules\Order\Resources\OrderListResource;
use App\Modules\Order\Resources\OrderResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends BaseController
{
    public function __construct(
        protected OrderRepository $repository,
    ) {}

    /**
     * List all orders (admin, filtered + paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status', 'user_id', 'date_from', 'date_to', 'sort_by', 'sort_order']);
        $perPage = (int) $request->get('per_page', 15);

        $orders = $this->repository->getFilteredOrders($filters, $perPage);

        return $this->paginatedResponse(
            OrderListResource::collection($orders),
            'order::messages.orders_listed',
        );
    }

    /**
     * Show a single order by order number.
     */
    public function show(string $orderNumber): JsonResponse
    {
        $order = $this->repository->findByOrderNumber($orderNumber);

        if (!$order) {
            return $this->notFoundResponse('order::messages.order_not_found');
        }

        // Ensure customer can only view their own orders
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'staff' && $order->user_id !== $user->id) {
            return $this->forbiddenResponse('order::messages.forbidden');
        }

        return $this->successResponse(
            new OrderResource($order),
            'order::messages.order_found',
        );
    }

    /**
     * Create a new order from the user's cart.
     */
    public function store(StoreOrderRequest $request, CreateOrderAction $action): JsonResponse
    {
        $order = $action->execute($request->user(), $request->validated());

        return $this->createdResponse(
            new OrderResource($order),
            'order::messages.order_created',
        );
    }

    /**
     * Update order status (admin).
     */
    public function updateStatus(
        UpdateOrderStatusRequest $request,
        int $id,
        UpdateOrderStatusAction $action,
    ): JsonResponse {
        $order = $this->repository->findByIdOrFail($id);

        $updated = $action->execute($order, $request->validated());

        return $this->successResponse(
            new OrderResource($updated),
            'order::messages.order_status_updated',
        );
    }

    /**
     * List the authenticated customer's own orders.
     */
    public function myOrders(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);

        $orders = $this->repository->getUserOrders($request->user()->id, $perPage);

        return $this->paginatedResponse(
            OrderListResource::collection($orders),
            'order::messages.orders_listed',
        );
    }
}
