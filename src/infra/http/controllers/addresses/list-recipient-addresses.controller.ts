import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchRecipientAddressesUseCase } from '@/domain/use-cases/addresses/fetch-recipient-addresses';
import { AddressPresenter } from '../../presenters/address-presenter';

@ApiTags('Addresses')
@ApiBearerAuth()
@Controller('/addresses/:recipientId')
export class FetchRecipientAddresssController {
  constructor(
    private fetchRecipientAddresses: FetchRecipientAddressesUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Rota para listagem de todas os endereços de um destinatário específico.',
  })
  async handle(@Param('recipientId') recipientId: string) {
    const result = await this.fetchRecipientAddresses.execute({
      recipientId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const addresses = result.value.addresses;

    return { addresses: addresses.map(AddressPresenter.toHTTP) };
  }
}
