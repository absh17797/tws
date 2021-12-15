var mongoose = require("mongoose"); //Define a schema
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");
var Schema = mongoose.Schema;
let userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, lowercase: true, required: true },
    username: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    photo: { type: String },
    address: { type: String }
}, {
    timestamps: true
});

mongoosePaginate.paginate.options = {
    limit: 5
};
userSchema.plugin(mongoosePaginate);

userSchema.set('toObject', { virtuals: true });

userSchema.pre("save", function (next) {
    if (this.isNew) {
        var saltRounds = 10;
        var encPassword = bcrypt.hashSync(this.password, saltRounds);
        this.password = encPassword;
    }
    next();
});

userSchema.statics.encPassword = async (password) => {
    var saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

module.exports = mongoose.model("Students", userSchema);
