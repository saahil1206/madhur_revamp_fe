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
      "img",
      "transaction_status",
    ],
  });

  if (!user) {
    return null;
  }

  let account = null;
  try {
    account = await UserAccount.findOne({
      where: { game_user_id: user.id },
      attributes: ["creditrefrence", "exposurelimit", "game_group_id"],
    });
  } catch (_err) {
    account = null;
  }

  return {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    phone: user.phonenumber,
    city: user.city,
    photo: user.img || null,
    transactionStatus: user.transaction_status,
    creditReference: account ? account.creditrefrence : null,
    exposureLimit: account ? account.exposurelimit : null,
    accessLevel: account ? account.game_group_id : null,
  };
}

module.exports = { getProfile };
