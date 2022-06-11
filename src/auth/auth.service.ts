import { Injectable } from '@nestjs/common';
import { iif } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService){}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email)

        if(user){
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (isPasswordValid){
                return{
                    ...user,
                    password:undefined
                }
            }
        }

        throw new Error("E-mail address or password provided is incorrect")
    }

    login(user: any) {
        const payload = {
            sub: user._id,
            email: user.email,
            name: user.name
        }

        const jwttoken = this.jwtService.sign(payload)

        return {
            access_token: jwttoken 
        }
    }
}
