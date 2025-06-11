const bcrypt = require("bcryptjs");
const adminShcema = require("../models/Admin.js");

const createAdminUser = async () => {
  const email = "mebratukumera@gmail.com";
  const password = "12345678";

  const existingAdmin = await adminShcema.findOne({ email });

  if (!existingAdmin) {
    const hash = await bcrypt.hash(password, 10);
    const admin = new adminShcema({
      email,
      passwordHash: hash,
      isAdmin: true,
    });

    await admin.save();
    console.log(`Admin user created: ${email}`);
  } else {
    console.log(`Admin user already exists: ${email}`);
  }
};

module.exports = createAdminUser;