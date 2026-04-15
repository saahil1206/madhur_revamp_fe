const { UserPersonal, UserAccount } = require("../models");

async function getProfile(userId) {
  const user = await UserPersonal.findOne({
    where: { id: userId },
    attributes: [
      "id",
      "username",
      "fullname",
      "phonenumber",
      "city",
      "transaction_status",
    ],
    include: [
      {
        model: UserAccount,
        as: "account",
        required: false,
        attributes: ["creditrefrence", "exposurelimit", "game_group_id"],
      },
    ],
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    phone: user.phonenumber,
    city: user.city,
    transactionStatus: user.transaction_status,
    creditReference: user.account ? user.account.creditrefrence : null,
    exposureLimit: user.account ? user.account.exposurelimit : null,
    accessLevel: user.account ? user.account.game_group_id : null,
  };
}

module.exports = { getProfile };
