const mongoose = require('mongoose');

// Feature paginate method 
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.pagination = function (page = 1, perPage = 10) {
    this.paginate = true;
    this.skipValue = (page - 1) * perPage;
    this.limitValue = perPage;
    return this;
}

mongoose.Query.prototype.exec = async function () {
    if (this.paginate) {
        this.skip(this.skipValue).limit(this.limitValue);
        return await exec.apply(this, arguments);
    }
    return exec.apply(this, arguments);
}

String.prototype.firstLetterCapital = function () {
    return this.at(0).toUpperCase + this.substring(1);
}