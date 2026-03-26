import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeesEntity } from './employees.entity';
import { UsersEntity } from 'src/auth/users/users.entity';
import { CreateEmployeesDto } from './dtos/createEmployees.dto';
import { MailsService } from '../mails/mails.service';
import { JwtService } from '@nestjs/jwt';
import { pickUser } from 'src/utils/formatters';
import { EmployeeResponse } from 'src/common/types/employee-response.type';
import { UsersService } from 'src/auth/users/users.service';
import { env } from 'src/config/env';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeesEntity)
    private employeesRepository: Repository<EmployeesEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private mailsService: MailsService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async findEmployeesByAdmin(adminId: number): Promise<EmployeeResponse[]> {
    const employees = await this.employeesRepository.find({
      where: {
        createdBy: {
          id: adminId,
        },
      },
      relations: {
        user: true,
      },
      order: { createdAt: 'DESC' },
    });

    return employees.map((emp) => ({
      ...emp,
      user: pickUser(emp.user),
    }));
  }

  async createEmployee(
    data: CreateEmployeesDto,
    adminId: number,
  ): Promise<any> {
    const { employee_name, employee_email, employee_phone } = data;
    // console.log('name: ', employee_name);
    // console.log('email: ', employee_email);
    // console.log('phone: ', employee_phone);

    const admin = await this.usersService.findById(adminId);
    if (!admin) throw new NotFoundException('Admin not found!');

    const existingUser = await this.usersRepository.findOne({
      where: { email: employee_email },
    });

    if (existingUser) {
      throw new BadRequestException('Employee already exists!');
    }

    const user = await this.usersRepository.save({
      username: employee_name,
      email: employee_email,
      password: '',
      role: 'employee',
      isFirstLogin: true,
    });

    const employee = await this.employeesRepository.save({
      user: user,
      employee_phone: employee_phone,
      createdBy: { id: adminId },
    });

    const firstLoginToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        type: 'first_login',
      },
      {
        expiresIn: '15m',
      },
    );

    const firstLoginUrl = `${env.WEBSITE_DOMAIN}/auth/verification-first-login?token=${firstLoginToken}`;
    await this.mailsService.sendEmployeeCredentials(
      employee_email,
      employee_name,
      firstLoginUrl,
    );

    return {
      message: 'Employee created and email sent',
      employeeId: employee.id,
    };
  }

  async deleteEmployee(employeeId: number, adminId: number) {
    const employee = await this.employeesRepository.findOne({
      where: {
        user: {
          id: employeeId,
        },
      },
      relations: { user: true },
    });
    // console.log('employee: ', employee);

    if (!employee) throw new NotFoundException('Employee not found!');
    if (employee.createdById !== adminId)
      throw new ForbiddenException('You cannot delete this employee');

    await this.employeesRepository.delete(employee.id);
    await this.usersRepository.delete(employee.user.id);

    return {
      message: 'Employee deleted successfully',
    };
  }
}
