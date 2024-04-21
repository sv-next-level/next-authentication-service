import { Test, TestingModule } from "@nestjs/testing";
import { LoggedinController } from "@/loggedin/loggedin.controller";

describe("LoggedinController", () => {
  let controller: LoggedinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoggedinController],
    }).compile();

    controller = module.get<LoggedinController>(LoggedinController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
