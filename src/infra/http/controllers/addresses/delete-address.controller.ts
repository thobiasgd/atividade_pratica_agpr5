import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteAddressUseCase } from '@/domain/use-cases/addresses/delete-address';

@ApiTags('Addresses')
@ApiBearerAuth()
@Controller('/addresss/:id')
export class DeleteAddressController {
  constructor(private deleteAddress: DeleteAddressUseCase) {}

  @Delete()
  @ApiOperation({
    summary: 'Rota para remoção de endereços de usuários existentes.',
  })
  @Roles('ADMIN')
  @HttpCode(204)
  async handle(@Param('id') addressId: string) {
    const result = await this.deleteAddress.execute({
      addressId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
