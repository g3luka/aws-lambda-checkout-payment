import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, UnauthorizedException, } from '@nestjs/common'
import { Response } from 'express'
import { LocalStrategy } from './local.strategy'

@Catch(UnauthorizedException, ForbiddenException)
export class Unauthorized implements ExceptionFilter {
  constructor(private readonly strategy: LocalStrategy) {}
  catch(
    _exception: ForbiddenException | UnauthorizedException,
    host: ArgumentsHost,
  ) {
    console.log(_exception);
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    response.redirect(this.strategy.failureRedirect)
  }
}
