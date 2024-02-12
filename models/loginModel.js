class LoginModel {
  constructor(usercode, token, create_date, update_date) {
    this.usercode = usercode;
    this.token = token;
    this.create_date = create_date;
    this.update_date = update_date;
  }

   static fromDbObject(dbObject) {
        return new User(
            dbObject.usercode,
            dbObject.token,
            dbObject.create_date,
            dbObject.update_date,
         );
    }

    toDbObject() {
        return {
            usercode: this.usercode,
            token: this.token,
            create_date: this.create_date,
            update_date: this.update_date,
        };
    }

}

class LoginResponseModel {
  constructor(usercode, firstname, lastname, username, email, image, sex, token) {
    this.usercode = usercode;
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.email = email;
    this.image = image;
    this.sex = sex;
    this.token = token;
  }

   static fromDbObject(dbObject) {
        return new User(
            dbObject.usercode,
            dbObject.firstname,
            dbObject.lastname,
            dbObject.username,
            dbObject.email,
            dbObject.image,
            dbObject.sex,
            dbObject.token,
         );
    }

    toDbObject() {
        return {
            usercode: this.usercode,
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.username,
            email: this.email,
            image: this.image,
            sex: this.sex,
            token: this.token,
        };
    }

}

module.exports = { LoginModel, LoginResponseModel } ;