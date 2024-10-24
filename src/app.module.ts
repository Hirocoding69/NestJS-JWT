import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { DevConfigService } from './common/providers/DevConfigService';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { RolesController } from './modules/roles/roles.controller';
import { TokenModule } from './modules/tokens/token.module';
import { AuthController } from './modules/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfigModule } from './config/database.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    DatabaseConfigModule,
    UsersModule,
    AuthModule,
    RolesModule,
    TokenModule,
  ],
  controllers: [AppController, UsersController, RolesController, AuthController],
  providers: [
    AppService,
    DevConfigService,
    {
      provide: 'CONFIG',
      useFactory: (configService: ConfigService) => {
        return {
          port: configService.get<number>('PORT') || 3000,
        };
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
    //  apply globally, uncomment the line below
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
