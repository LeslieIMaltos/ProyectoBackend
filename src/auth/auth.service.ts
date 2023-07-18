import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User, UserDocument } from './schema/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { isJwtExpired } from 'jwt-check-expiration';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async register(userObject: CreateAuthDto): Promise<User> {
    const { password, email } = userObject; //texto plano 1234...

    const findUser = await this.userModel.findOne({ email });
    if (findUser) throw new HttpException('Email ya registrado.', 400);

    //hacer hash de la contraseña (encriptar)
    const plainToHash = await hash(password, 10);
    userObject = { ...userObject, password: plainToHash };
    return this.userModel.create(userObject);
  }

  async login(userObject: LoginAuthDto) {
    const { username, password } = userObject;

    const findUser = await this.userModel.findOne({ username });
    //validar usuario y contraseña
    if (!findUser) throw new HttpException('Usuario incorrecto', 404);
    const isPasswordValid = await compare(password, findUser.password);
    if (!isPasswordValid) throw new HttpException('Contrasena incorrecta', 404);

    const payload = { username: findUser.username };
    const token = this.jwtService.sign(payload);

    const data = {
      ok: true,
      user: {
        idUser: findUser._id,
        username: findUser.username,
        email: findUser.email,
        roleId: findUser.roleId,
      },
      token,
    };
    return data;
  }

  async refreshToken(token: string) {
    if (isJwtExpired(token)) return { ok: false, message: 'Token Expirado' };
    return { ok: true, message: 'Token Valido' };
  }

  async sendEmailToResetPassword(toEmail: string) {
    const findUser = await this.userModel.findOne({ email: toEmail });
    if (!findUser) throw new HttpException('Usuario No Existe', 404);
    //create new token with expiration date 120s
    const payload = { username: findUser.username };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    //https://clownfish-app-q3btf.ondigitalocean.app/resetPassword/${token}/${mongoId}
    // http://localhost:3000/api/resetPassword/${token}${mongoId}
    const mongoId = findUser._id;
    const myHref = `https://clownfish-app-q3btf.ondigitalocean.app/resetPassword/${token}/${mongoId}`;
    await this.mailService.sendMail({
      to: toEmail,
      from: 'adrian1jr@gmail.com',
      subject: 'Restablecimiento de contraseña',
      html: `
      <h1>Hola <b>${findUser.username}</b></h1>
      <p>Se solicitó un restablecimiento de contraseña para su cuenta.</p>
      <p>Haga clic en el enlace de abajo para cambiar su contraseña.</p>

      <p>Este link expirara dentro de 1 hora.</p>
      
      <a href="${myHref}">Restablecer contraseña</a>
      `,
    });

    return {
      ok: true,
      message: 'Se envio un correo para restablecer la contraseña',
    };
  }

  async resetPassword(userObject: UpdateAuthDto) {
    const { _id, password } = userObject;
    const findUser = await this.userModel.findOne({ _id });
    if (!findUser) throw new HttpException('Usuario No Existe', 404);

    const plainToHash = await hash(password, 10);
    userObject = { ...userObject, password: plainToHash };

    await this.userModel.findByIdAndUpdate(_id, userObject, { new: true });
    return {
      ok: true,
      message: 'Se actualizo la contraseña',
    };
  }

  findAll() {
    return this.userModel.find({});
  }

  findOne(id: string) {
    const user = this.userModel.findById(id);
    if (!user) throw new HttpException('USER_NOT_FOUND', 404);
    return user;
  }

  remove(id: string) {
    const user = this.userModel.findByIdAndDelete(id);
    if (!user) throw new HttpException('USER_NOT_FOUND', 404);
    return user;
  }
}
