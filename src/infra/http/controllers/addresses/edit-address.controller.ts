import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { bodyValidationPipe, EditAddressDTO } from './dto/edit-address.dto';
import { EditAddressUseCase } from '@/domain/use-cases/addresses/edit-addresses';

@ApiTags('Addresses')
@Controller('/addresss/:addressId/edit')
export class EditAddressController {
  constructor(private editAddress: EditAddressUseCase) {}

  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rota para edição de endereços dos usuários existentes.',
  })
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAddressDTO,
    @Param('addressId') addressId: string,
  ) {
    const {
      newCountry,
      newState,
      newCity,
      newNeighborhood,
      newStreet,
      newNumber,
    } = body;

    const result = await this.editAddress.execute({
      addressId,
      newCountry,
      newState,
      newCity,
      newNeighborhood,
      newStreet,
      newNumber,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
