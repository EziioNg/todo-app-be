import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';
import { CreateEmployeesDto } from './dtos/createEmployees.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  getAdminData() {
    return 'Only admin can see this';
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get('get-employees')
  async getEmployees(@CurrentUser() user: JwtPayload) {
    const userId = user.sub;
    const employees = await this.employeesService.findEmployeesByUser(userId);

    return employees;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create-employee')
  createEmployee(
    @Body(new ValidationPipe()) body: CreateEmployeesDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const adminId = user.sub;
    return this.employeesService.createEmployee(body, adminId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete-employee/:id')
  deleteEmployee(
    @Param('id', ParseIntPipe) employeeId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const adminId = user.sub;

    return this.employeesService.deleteEmployee(employeeId, adminId);
  }
}
