import { HttpServer, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Connection, EntityManager, QueryRunner } from 'typeorm';
import { AppModule } from '../src/app.module';
import { TypeOrmConfigService } from '../src/config/typeormConfig.service';
import { UserTypes } from '../src/types/userTypes.enum';
import { TypeOrmE2EConfigService } from './typeormE2EConfigService';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeOrmConfigService)
      .useClass(TypeOrmE2EConfigService)
      .compile();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();

    const dbConnection = moduleFixture.get(Connection);
    const manager = moduleFixture.get(EntityManager);
    // eslint-disable-next-line
    // @ts-ignore
    queryRunner = manager.queryRunner = dbConnection.createQueryRunner(
      'master',
    );
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  it('/ getGello (GET)', async () => {
    const response = await request(httpServer)
      .get('/')
      .expect(200);
    expect(response.text.length).toBeGreaterThan(0);
  });

  it('/user/users (GET)', async () => {
    await request(httpServer)
      .get('/user/users')
      .expect(401);

    await request(httpServer)
      .get('user/users')
      .set('Authorization', 'FakeAuth ADMIN')
      .expect(200)
      .expect(({ body }) => {
        const users = body;

        expect(users.length).not.toBeNaN();
        expect(users.length).not.toBeNull();
        expect(users.length).not.toEqual(0);
        expect(users[0]).toHaveProperty('userType');
        expect(users[0].userType).toEqual('ADMIN');
      });
  });

  it('/user/register (POST)', async () => {
    return request(httpServer)
      .post('/user/register')
      .send({
        registerInput: {
          email: 'newcustomer@test.test',
          password: 'Qwerty#123!ABC',
          userType: UserTypes.BOOKER,
        },
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.ok).toBeTruthy();
      });
  });
});
