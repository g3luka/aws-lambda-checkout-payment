import { Controller, Post, Req, Res, UseGuards, Get, Render } from '@nestjs/common'
import { LocalStrategy } from './local.strategy'
import { LoginGuard } from './login.guard'
import { AuthenticatedGuard } from './authenticated.guard';

@Controller()
export class AuthController {
  constructor(private readonly strategy: LocalStrategy) {}

  @Get('auth/login')
  @Render('auth/login')
  async loginForm() {
    return {};
  }

  @Post('auth/login')
  @UseGuards(LoginGuard)
  async login(@Req() req, @Res() res) {
    return req.user
      ? res.redirect(this.strategy.successRedirect)
      : res.redirect(this.strategy.failureRedirect)
  }

  @Get('auth/logout')
  @UseGuards(AuthenticatedGuard)
  async logout(@Res() res) {
    res.clearCookie('tribuna:sess.sig');
    res.clearCookie('tribuna:sess');
    res.redirect('/auth/login');
  }

}
