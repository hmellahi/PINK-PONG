import { HttpException, HttpStatus } from '@nestjs/common';
import User from '../entities/user.entity';
// import { extname } from 'path/posix';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const fileExtName =   (file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};


export const filteredUser = (user: User) =>
{
    user.email = undefined;
    user.currentRefreshToken = undefined;
    user.two_factor_auth_code = undefined;
    user.password = undefined;
    user.create_date = undefined;
    return user;
}

export const filteredUsers = (users: User[]): User[] =>
{
    return users.map(user => filteredUser(user));
}
