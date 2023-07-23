import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('Public', true);
