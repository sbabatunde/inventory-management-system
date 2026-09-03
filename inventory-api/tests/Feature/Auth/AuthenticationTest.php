<?php
// tests/Feature/Auth/AuthenticationTest.php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
  use RefreshDatabase;

  #[Test]
  public function user_can_login_with_valid_credentials()
  {
    $user = User::create([
      'name' => 'Test User',
      'email' => 'test@example.com',
      'password' => Hash::make('password123'),
      'is_active' => true,
      'email_verified_at' => now(),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'local',
      'email' => 'test@example.com',
      'password' => 'password123',
    ]);

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
      ]);
  }

  #[Test]
  public function user_cannot_login_with_wrong_password()
  {
    $user = User::factory()->create([
      'password' => Hash::make('correctpassword'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'local',
      'email' => $user->email,
      'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422);
  }

  #[Test]
  public function login_requires_email()
  {
    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'local',
      'password' => 'password123',
    ]);

    // Just check status is 422 (validation error)
    $response->assertStatus(422);

    // Check response has validation errors
    $response->assertJsonValidationErrors(['email']);
  }

  #[Test]
  public function login_requires_password()
  {
    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'local',
      'email' => 'test@example.com',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['password']);
  }

  #[Test]
  public function invalid_method_is_rejected()
  {
    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'invalid_method',
      'email' => 'test@example.com',
      'password' => 'password123',
    ]);

    $response->assertStatus(422);
  }
}
