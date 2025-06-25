import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from './token/token.module';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './common/logger.middleware';
import { UserController } from './user/user.controller';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://pipaliyayakshat:74wpEPgI9qRwSbIF@nestjs-crud.9fpkn1c.mongodb.net/Revision', {
      connectionFactory: (connection) => {
        console.log("connected to mongodb");
        return connection;
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join('/var/www/html/images'),
      serveRoot: '/uploads/images',
    }),
    JwtModule.register({
      secret: 'YP',
      signOptions: { expiresIn: '60m' },
    }),
    UserModule,
    ProductModule,
    JwtModule,
    TokenModule,
    ImagesModule,
    ReviewModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UserController);
  }
}
