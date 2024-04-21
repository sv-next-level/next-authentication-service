import { Test, TestingModule } from "@nestjs/testing";
import { LoggedinService } from "@/loggedin/loggedin.service";

describe("LoggedinService", () => {
  let service: LoggedinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggedinService],
    }).compile();

    service = module.get<LoggedinService>(LoggedinService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
