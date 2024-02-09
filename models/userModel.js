class User {
    constructor(usercode, firstname, lastname, idCard, username, email, password, image, sex, cartcode, favcode, writingcode, followercode, followingcode) {
        this.usercode = usercode;
        this.firstname = firstname;
        this.lastname = lastname;
        this.idCard = idCard;
        this.username = username;
        this.email = email;
        this.password = password;
        this.image = image;
        this.sex = sex;
        this.cartcode = cartcode;
        this.favcode = favcode;
        this.writingcode = writingcode;
        this.followercode = followercode;
        this.followingcode = followingcode;
    }

    static fromDbObject(dbObject) {
        return new User(
            dbObject.usercode,
            dbObject.firstname,
            dbObject.lastname,
            dbObject.idCard,
            dbObject.username,
            dbObject.email,
            dbObject.password,
            dbObject.image,
            dbObject.sex,
            dbObject.cartcode,
            dbObject.favcode,
            dbObject.writingcode,
            dbObject.followercode,
            dbObject.followingcode,
        );
    }

    toDbObject() {
        return {
            usercode: this.usercode,
            firstname: this.firstname,
            lastname: this.lastname,
            idCard: this.idCard,
            username: this.username,
            email: this.email,
            password: this.password,
            image: this.image,
            sex: this.sex,
            cartcode: this.cartcode,
            favcode: this.favcode,
            writingcode: this.writingcode,
            followercode: this.followercode,
            followingcode: this.followingcode,
        };
    }
}

module.exports = User;