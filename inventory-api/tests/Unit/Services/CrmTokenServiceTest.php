<?php
// tests/Unit/Services/CrmTokenServiceTest.php

namespace Tests\Unit\Services;

use App\Services\Auth\CrmTokenService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CrmTokenServiceTest extends TestCase
{
  #[Test]
  public function service_can_be_instantiated()
  {
    $service = new CrmTokenService();
    $this->assertInstanceOf(CrmTokenService::class, $service);
  }
}
