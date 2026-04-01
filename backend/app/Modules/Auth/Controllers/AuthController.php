<?php

namespace App\Modules\Auth\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\Auth\Actions\ChangePasswordAction;
use App\Modules\Auth\Actions\LoginAction;
use App\Modules\Auth\Actions\RegisterAction;
use App\Modules\Auth\Actions\UpdateProfileAction;
use App\Modules\Auth\Requests\ChangePasswordRequest;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Requests\UpdateProfileRequest;
use App\Modules\Auth\Resources\AuthResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseController
{
    /**
     * Login a user and return token.
     */
    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        $result = $action->execute($request->validated());

        return $this->successResponse($result, __('messages.login_success'));
    }

    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request, RegisterAction $action): JsonResponse
    {
        $result = $action->execute($request->validated());

        return $this->createdResponse($result, 'messages.register_success');
    }

    /**
     * Logout the authenticated user.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, __('messages.logout_success'));
    }

    /**
     * Get the authenticated user's profile.
     */
    public function profile(Request $request): JsonResponse
    {
        return $this->successResponse(
            new AuthResource($request->user()),
            __('messages.profile_retrieved'),
        );
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(UpdateProfileRequest $request, UpdateProfileAction $action): JsonResponse
    {
        $user = $action->execute($request->user(), $request->validated());

        return $this->successResponse(
            new AuthResource($user),
            __('messages.profile_updated'),
        );
    }

    /**
     * Change the authenticated user's password.
     */
    public function changePassword(ChangePasswordRequest $request, ChangePasswordAction $action): JsonResponse
    {
        $action->execute($request->user(), $request->validated());

        return $this->successResponse(null, __('messages.password_changed'));
    }
}
