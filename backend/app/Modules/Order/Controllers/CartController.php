<?php

namespace App\Modules\Order\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\Order\Actions\AddToCartAction;
use App\Modules\Order\Actions\ClearCartAction;
use App\Modules\Order\Actions\UpdateCartItemAction;
use App\Modules\Order\Models\CartItem;
use App\Modules\Order\Repositories\CartRepository;
use App\Modules\Order\Requests\AddToCartRequest;
use App\Modules\Order\Requests\UpdateCartItemRequest;
use App\Modules\Order\Resources\CartResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends BaseController
{
    public function __construct(
        protected CartRepository $repository,
    ) {}

    /**
     * Show the current user's cart.
     */
    public function show(Request $request): JsonResponse
    {
        $cart = $this->repository->getByUser($request->user()->id);

        if (!$cart) {
            return $this->successResponse(
                ['items' => [], 'total' => 0],
                'order::messages.cart_retrieved',
            );
        }

        return $this->successResponse(
            new CartResource($cart),
            'order::messages.cart_retrieved',
        );
    }

    /**
     * Add an item to the cart.
     */
    public function addItem(AddToCartRequest $request, AddToCartAction $action): JsonResponse
    {
        $cart = $action->execute($request->user(), $request->validated());

        return $this->createdResponse(
            new CartResource($cart->load('items.product')),
            'order::messages.cart_item_added',
        );
    }

    /**
     * Update a cart item quantity.
     */
    public function updateItem(
        UpdateCartItemRequest $request,
        int $itemId,
        UpdateCartItemAction $action,
    ): JsonResponse {
        $cartItem = CartItem::findOrFail($itemId);

        $cart = $action->execute($request->user(), $cartItem, $request->validated());

        return $this->successResponse(
            new CartResource($cart->load('items.product')),
            'order::messages.cart_item_updated',
        );
    }

    /**
     * Remove an item from the cart.
     */
    public function removeItem(Request $request, int $itemId): JsonResponse
    {
        $cart = $this->repository->getByUser($request->user()->id);

        if (!$cart) {
            return $this->notFoundResponse('order::messages.cart_item_not_found');
        }

        $item = $cart->items()->where('id', $itemId)->first();

        if (!$item) {
            return $this->notFoundResponse('order::messages.cart_item_not_found');
        }

        $item->delete();

        return $this->successResponse(
            new CartResource($cart->fresh('items.product')),
            'order::messages.cart_item_removed',
        );
    }

    /**
     * Clear all items from the cart.
     */
    public function clear(Request $request, ClearCartAction $action): JsonResponse
    {
        $action->execute($request->user());

        return $this->noContentResponse('order::messages.cart_cleared');
    }
}
