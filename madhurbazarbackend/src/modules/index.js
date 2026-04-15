const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const resultRoutes = require("../routes/result.routes");

const modules = {
  aakda: require("./aakda/routes"),
  account: require("./account/routes"),
  admin: require("./admin/routes"),
  adminaakda: require("./adminaakda/routes"),
  adminagent: require("./adminagent/routes"),
  adminbalancereport: require("./adminbalancereport/routes"),
  admindouble: require("./admindouble/routes"),
  admindpmotor: require("./admindpmotor/routes"),
  adminfamily: require("./adminfamily/routes"),
  admingamereport: require("./admingamereport/routes"),
  adminjodi: require("./adminjodi/routes"),
  adminmaster: require("./adminmaster/routes"),
  adminmpana: require("./adminmpana/routes"),
  adminplayer: require("./adminplayer/routes"),
  adminplreport: require("./adminplreport/routes"),
  adminsingle: require("./adminsingle/routes"),
  adminspmotor: require("./adminspmotor/routes"),
  admintriple: require("./admintriple/routes"),
  agentmaster: require("./agentmaster/routes"),
  balancereport: require("./balancereport/routes"),
  batcontroller: require("./batcontroller/routes"),
  bazar: require("./bazar/routes"),
  client: require("./client/routes"),
  double: require("./double/routes"),
  dpmotor: require("./dpmotor/routes"),
  family: require("./family/routes"),
  gameopen: require("./gameopen/routes"),
  gamereport: require("./gamereport/routes"),
  gameresult: require("./gameresult/routes"),
  home: require("./home/routes"),
  jodi: require("./jodi/routes"),
  jodifamily: require("./jodifamily/routes"),
  multipatti: require("./multipatti/routes"),
  "lucky-number": require("./lucky-number/routes"),
  plreport: require("./plreport/routes"),
  profile: require("./profile/routes"),
  single: require("./single/routes"),
  spmotor: require("./spmotor/routes"),
  seo: require("./seo/routes"),
  settings: require("./settings/routes"),
  tripple: require("./tripple/routes"),
  user: require("./user/routes"),
  seoPublic: require("./seo-public/routes"),

};

function registerModuleRoutes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/login", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/results", resultRoutes);

  for (const [name, router] of Object.entries(modules)) {
    app.use("/api/" + name, router);
  }
}

module.exports = { registerModuleRoutes };
