import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDetails } from '../entities/user-details.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
  ) { }

  async create(userDto: UserDto): Promise<User> {
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(userDto.password, saltRounds);
    const now = new Date();

    const employeeCount = await this.userRepository.count({
      where: { isDeleted: false },
    });
    const employeeCode = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

    const user = this.userRepository.create({
      companyId: userDto.company_id,
      departmentId: userDto.department_id,
      designationId: userDto.designation_id,
      email: userDto.email,
      employeeCode: employeeCode,
      fullName: userDto.full_name,
      joiningDate: userDto.joining_date ? new Date(userDto.joining_date) : new Date(),
      phoneNumber: userDto.phone_number,
      roleId: userDto.role_id,
      shiftId: userDto.shift_id,
      dob: (userDto as any).dob ? new Date((userDto as any).dob) : new Date(),
      gender: (userDto as any).gender || 'Male',
      createdAt: now,
      // password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    const dto = userDto as any;
    const details = this.userDetailsRepository.create({
      employeeId: savedUser.id,
      profileImage: dto.avatar || '',
      houseNo: dto.house_no || '',
      landmark: dto.area_landmark || '',
      zipCode: dto.zipcode || '',
      city: dto.city || '',
      state: dto.state || '',
      country: dto.country || '',
      aadharNo: dto.aadhar_number || '',
      panNo: dto.pan_number || '',
    });
    await this.userDetailsRepository.save(details);

    return this.findOne(savedUser.id);
  }

  async findAll(): Promise<User[]> {
    const employees = await this.userRepository.find({
      where: { isDeleted: false },
      relations: ['role'],
    });

    // Populate user details for each
    for (const emp of employees) {
      const details = await this.userDetailsRepository.findOneBy({ employeeId: emp.id });
      if (details) {
        (emp as any).avatar = details.profileImage;
      }
    }
    return employees;
  }

  async findOne(id: number): Promise<User> {
    const employee = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!employee) throw new NotFoundException(`User #${id} not found`);

    const details = await this.userDetailsRepository.findOneBy({ employeeId: id });
    if (details) {
      (employee as any).avatar = details.profileImage;
      (employee as any).houseNo = details.houseNo;
      (employee as any).house_no = details.houseNo;
      (employee as any).areaLandmark = details.landmark;
      (employee as any).area_landmark = details.landmark;
      (employee as any).zipcode = details.zipCode;
      (employee as any).zipCode = details.zipCode;
      (employee as any).city = details.city;
      (employee as any).state = details.state;
      (employee as any).country = details.country;
      (employee as any).aadharNo = details.aadharNo;
      (employee as any).aadharNumber = details.aadharNo;
      (employee as any).aadhar_number = details.aadharNo;
      (employee as any).panNo = details.panNo;
      (employee as any).panNumber = details.panNo;
      (employee as any).pan_number = details.panNo;
    }
    return employee;
  }

  async update(id: number, updateEmployeeDto: UserDto): Promise<User> {
    const employee = await this.userRepository.findOneBy({ id });
    if (!employee) throw new NotFoundException(`User #${id} not found`);

    const dto = updateEmployeeDto as any;

    // Explicitly update fields from DTO (which are in snake_case) to entity properties (camelCase)
    if (dto.full_name !== undefined) employee.fullName = dto.full_name;
    if (dto.phone_number !== undefined) employee.phoneNumber = dto.phone_number;
    if (dto.email !== undefined) employee.email = dto.email;
    if (dto.gender !== undefined) employee.gender = dto.gender;
    if (dto.dob !== undefined) employee.dob = dto.dob ? new Date(dto.dob) : null as any;
    if (dto.department_id !== undefined) employee.departmentId = dto.department_id;
    if (dto.designation_id !== undefined) employee.designationId = dto.designation_id;
    if (dto.shift_id !== undefined) employee.shiftId = dto.shift_id;
    if (dto.role_id !== undefined) employee.roleId = dto.role_id;
    if (dto.joining_date !== undefined) employee.joiningDate = dto.joining_date ? new Date(dto.joining_date) : null as any;

    const updatedUser = await this.userRepository.save(employee);

    // Find or create UserDetails record
    let details = await this.userDetailsRepository.findOneBy({ employeeId: id });
    if (!details) {
      details = new UserDetails();
      details.employeeId = id;
    }

    if (dto.house_no !== undefined) details.houseNo = dto.house_no;
    if (dto.area_landmark !== undefined) details.landmark = dto.area_landmark;
    if (dto.zipcode !== undefined) details.zipCode = dto.zipcode;
    if (dto.city !== undefined) details.city = dto.city;
    if (dto.state !== undefined) details.state = dto.state;
    if (dto.country !== undefined) details.country = dto.country;
    if (dto.aadhar_number !== undefined) details.aadharNo = dto.aadhar_number;
    if (dto.pan_number !== undefined) details.panNo = dto.pan_number;
    if (dto.avatar !== undefined) details.profileImage = dto.avatar;

    await this.userDetailsRepository.save(details);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.userRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException(`User #${id} not found`);
    }
    employee.isDeleted = true;
    await this.userRepository.save(employee);
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { phoneNumber } });
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    const employee = await this.userRepository.findOneBy({ id });
    if (!employee) throw new NotFoundException(`User #${id} not found`);
    employee.password = hashedPassword;
    await this.userRepository.save(employee);
  }
}
