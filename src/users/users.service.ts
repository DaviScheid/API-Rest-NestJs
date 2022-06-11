import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {

    const user = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10)
    }

    const newUser = new this.userModel(user)
    await newUser.save()
    return {msg:"Usuário criado com sucesso!"};
  }

  findAll() {
    return this.userModel.find()
  }

  findOne(id: string) {
    return this.userModel.findById(id)
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({"email":email})
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    if(updateUserDto.password != undefined){
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }

    return this.userModel.findByIdAndUpdate({
      _id:id,

    }, {
      $set: updateUserDto
    },
    {
      new:true
    })
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec()
  }
}
