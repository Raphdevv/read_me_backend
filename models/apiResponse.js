class APIResponse {
  constructor(success, message, data) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

   static fromDbObject(dbObject) {
        return new User(
            dbObject.success,
            dbObject.message,
            dbObject.data,
         );
    }

    toDbObject() {
        return {
            success: this.success,
            message: this.message,
            data: this.data,
        };
    }

}

module.exports = APIResponse;