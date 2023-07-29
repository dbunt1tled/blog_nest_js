import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mailController';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: MailController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [AppService],
    }).compile();

    appController = app.get<MailController>(MailController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
