import { Injectable, UnauthorizedException } from '@nestjs/common';

const users = [
  {
    name: 'Giovanni de Luca',
    username: 'giovanni@nordica.digital',
    password: 'Nordicaio!@#',
    role: 'admin'
  },
  {
    name: 'Rafael Maia',
    username: 'rafaelmaia@tribunadoparana.com.br',
    password: 'RafaelMaiaTribuna!@#',
    role: 'admin'
  },
  {
    name: 'Leonardo CZ',
    username: 'leonardocz@gazetadopovo.com.br',
    password: 'LeonardoGP!@#',
    role: 'financeiro'
  },
];

@Injectable()
export class AuthService {

  async validateUser(username: string, password: string): Promise<any> {
    try {
      if (!username || !password) throw new UnauthorizedException('Missing username or password')
      const { name = undefined, role = undefined } = users.find(user => user.username === username && user.password === password) || {}
      if (!name || !role) return null
      return { name, role }
    } catch (e) {
      return null
    }
  }

}
