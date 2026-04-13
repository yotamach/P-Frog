import {Logger} from "tslog";
import { IUser, User } from "@schemas";
import HttpStatus from 'http-status-codes'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const log = new Logger({});

export class AuthService {

  async SignUp(user: IUser) {
    log.info(`AuthService.Signup`);
    try{
      const {password, userName} = user;
      const oldUser = await User.findOne({ userName: user.userName }).exec();
      console.log(oldUser);
      if (oldUser)
        return { status: HttpStatus.CONFLICT, resBody: { success: false, data: "User already exist!"} };
      const salt = await bcrypt.genSaltSync(10);
      const encryptedPassword = await bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        ...user,
        password: encryptedPassword,
      });

      const token = jwt.sign(
        { user_id: newUser._id, userName },
        process.env.JWT_SECRET || 'g2r0e1e3n_t2o5p8s5_e0n5e2r5g8y30119',
        {
          expiresIn: "2h",
        }
      );
      newUser.token = token;
      newUser.save();
      return { status: HttpStatus.CREATED, resBody: { success: true, data: user} };
    } catch (err) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, resBody: { success: false, data: err}};
    }
  }

  async Login(params: Record<string,string>) {
    log.info(`AuthService.Login: user fetched! params:${JSON.stringify(params)}`);
    // Our login logic starts here
    try {
      // Get user input
      const { userName, password } = params;

      // Validate user input
      if (!(userName && password)) {
        log.info(`AuthService.Login: user credentials! params:${JSON.stringify(params)}`);
        return { status: HttpStatus.NOT_FOUND, resBody: { success: false, data: "username or password missing!"} };
      }
      // Validate if user exist in our database - check both userName and email
      const user = await User.findOne({ 
        $or: [{ userName }, { email: userName }] 
      }).exec();
      
      if (!user) {
        log.info(`AuthService.Login: user not found for userName/email: ${userName}`);
        return { status: HttpStatus.BAD_REQUEST, resBody: { success: false, data: "Invalid Credentials!"} };
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, userName },
          process.env.JWT_SECRET || 'g2r0e1e3n_t2o5p8s5_e0n5e2r5g8y30119',
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;

        // user
        return { status: HttpStatus.OK, resBody: { success: true, data: user} };
      }
      return { status: HttpStatus.BAD_REQUEST, resBody: { success: false, data: "Invalid Credentials!"} };
    } catch (err) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, resBody: { success: false, data: err}};
    }
  }
}