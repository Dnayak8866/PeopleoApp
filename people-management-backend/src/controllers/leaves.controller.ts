import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { LeaveApplicationService } from '../services/leaves.service';
import { LeaveApplicationDto } from '../dto/leaves.dto';
import { ApiBody, ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('leaves')
@ApiBearerAuth('access-token')
@Controller('leaves')
export class LeaveApplicationController {
    constructor(private readonly leaveService: LeaveApplicationService) { }

    @Post('apply')
    @ApiOperation({ summary: 'Apply for a leave' })
    @ApiBody({ type: LeaveApplicationDto })
    @ApiResponse({ status: 201, description: 'Leave applied successfully.' })
    async applyLeave(@Body() dto: LeaveApplicationDto) {
        try {
            return this.leaveService.applyLeave(dto);
        } catch (error) {
            throw error;
        }
    }

    @Get('employee/:id')
    @ApiOperation({ summary: 'Get all leave applications for an employee' })
    @ApiParam({ name: 'id', type: Number, description: 'Employee ID' })
    @ApiResponse({ status: 200, description: 'Employee leave list returned.' })
    async getEmployeeLeaves(@Param('id') id: number) {
        try {
            return this.leaveService.getEmployeeLeaves(id);
        } catch (error) {
            throw error;
        }
    }

    @Get('balances/:employeeId/:companyId')
    @ApiOperation({ summary: 'Get leave balances for an employee' })
    @ApiParam({ name: 'employeeId', type: Number })
    @ApiParam({ name: 'companyId', type: Number })
    @ApiResponse({ status: 200, description: 'Leave balances returned.' })
    async getLeaveBalances(
        @Param('employeeId') employeeId: number,
        @Param('companyId') companyId: number
    ) {
        try {
            return this.leaveService.getLeaveBalances(employeeId, companyId);
        } catch (error) {
            throw error;
        }
    }

    @Get('pending/:companyId')
    @ApiOperation({ summary: 'Get all pending leave applications for a company' })
    @ApiParam({ name: 'companyId', type: Number, description: 'Company ID' })
    @ApiResponse({ status: 200, description: 'Pending leave list returned.' })
    async getPendingLeaves(@Param('companyId') companyId: number) {
        try {
            return this.leaveService.getPendingLeaves(companyId);
        } catch (error) {
            throw error;
        }
    }

    @Patch(':id/approve')
    @ApiOperation({ summary: 'Approve a leave application' })
    @ApiParam({ name: 'id', type: Number, description: 'Leave Application ID' })
    @ApiBody({ schema: { properties: { approved_by: { type: 'number' } }, required: ['approved_by'] } })
    @ApiResponse({ status: 200, description: 'Leave approved.' })
    @ApiResponse({ status: 404, description: 'Leave not found.' })
    async approveLeave(
        @Param('id') id: number,
        @Body('approved_by') approvedBy: number,
    ) {
        try {
            return this.leaveService.approveLeave(id, approvedBy);
        } catch (error) {
            throw error;
        }
    }

    @Patch(':id/reject')
    @ApiOperation({ summary: 'Reject a leave application' })
    @ApiParam({ name: 'id', type: Number, description: 'Leave Application ID' })
    @ApiResponse({ status: 200, description: 'Leave rejected.' })
    @ApiResponse({ status: 404, description: 'Leave not found.' })
    async rejectLeave(@Param('id') id: number) {
        try {
            return this.leaveService.rejectLeave(id);
        } catch (error) {
            throw error;
        }
    }

    @Get('count/:employeeId')
    @ApiOperation({ summary: 'Get total approved leaves for an employee in current year' })
    @ApiParam({ name: 'employeeId', type: Number })
    @ApiResponse({ status: 200, description: 'Total leaves count returned.' })
    async getEmployeeLeaveCount(@Param('employeeId') employeeId: string) {
        const year = new Date().getFullYear();
        return this.leaveService.getEmployeeLeaveCount(+employeeId, year);
    }

    @Get('pending-count/:companyId')
    @ApiOperation({ summary: 'Get count of pending leave applications for a company' })
    @ApiParam({ name: 'companyId', type: Number, description: 'Company ID' })
    @ApiResponse({ status: 200, description: 'Pending leave count returned.' })
    async getPendingCount(@Param('companyId') companyId: string) {
        return this.leaveService.getPendingLeavesCount(+companyId);
    }
}
