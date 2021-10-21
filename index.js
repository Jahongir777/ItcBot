const {Telegraf, session, Scenes: {BaseScene, Stage}, Markup} = require('telegraf')

//const { Markup } = require('telegraf')

const token = "2091250111:AAHN12guzaD05wH4PIJKjOjzCJmdLnqphlg"

const bot = new Telegraf(token);
const chatId = 1018120467;

bot.use(session());


bot.command('start', async (ctx) => {
  return await ctx.reply(`Assalom alaykum ${ctx.message.from.first_name}!  Pastdan kerakli b\'limni tanlang! `, Markup
    .keyboard([
      ['🔹 DATA learning centre 🔸', '📋 O\'quv kurslar'],
      ['☎️ Aloqa', '📍 Location'],
      ['📝 Registratsiya']
    ])
    .resize()
  )
})


//registratsiya
//
const nameScene = new BaseScene("nameScene");
nameScene.enter((ctx) => ctx.reply("Ismingiz va familiyangiz"));
nameScene.on("text", (ctx) => {
  ctx.session.name = ctx.message.text;
  return ctx.scene.enter("ageScene", { name: ctx.message.text });
});

const ageScene = new BaseScene("ageScene");
ageScene.enter((ctx) => ctx.reply("Yoshingiz nechida?"));
ageScene.on("text", (ctx) => {
  ctx.session.age = ctx.message.text;
  return ctx.scene.enter("courseScene", { age: ctx.message.text });
});

const courseScene = new BaseScene("courseScene");
courseScene.enter((ctx) =>
  ctx.reply(
    "Qaysi yo'nalishda o'qishni hohlaysiz?\n (Misol uchun: Web dasturlash, Android dasturlash, Video mantaj, Kompyuter savodhonligi va h.k)"
  )
);
courseScene.on("text", (ctx) => {
  ctx.session.course = ctx.message.text;
  return ctx.scene.enter("infoScene", { course: ctx.message.text });
});

const infoScene = new BaseScene("infoScene");
infoScene.enter((ctx) =>
  ctx.reply(
    "Bu yo'nalish bo'yicha ma'lumotingiz qanday?\n(Misol uchun: Umuman bilmayman, o'rtacha, yaxshi bilaman"
  )
);
infoScene.on("text", (ctx) => {
  ctx.session.info = ctx.message.text;

  ctx.reply(
    `Anketa o\'rnatildi jo'natishni tasdiqlaysizmi?\n\n👨‍🎓 Ismi: ${ctx.session?.name}\n🧍 Yoshi: ${ctx.session?.age}\n💻 Tanlangan yo\'nalish: ${ctx.session?.course}\n📚 Ma\'lumoti: ${ctx.session?.info}`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Anketani jo'natish", callback_data: "send" }],
        ],
      },
    }
  );
  return ctx.scene.leave();
});

const stage = new Stage([nameScene, ageScene, courseScene, infoScene]);
stage.hears("exit", (ctx) => ctx.scene.leave());

bot.use(session());
bot.use(stage.middleware());
bot.command("/start", (ctx) => {
  return ctx.reply(
    `Assalom alaykum ${ctx.message.from.first_name}!`,
    Markup.keyboard([["📝 Registratsiya"]]).resize()
  );
});
bot.hears("📝 Registratsiya", (ctx) => ctx.scene.enter("nameScene"));
bot.command("/send", (ctx) =>
  ctx.telegram.sendMessage(
    chatId,
    `Ism: ${ctx.session?.name}\nYoshi: ${ctx.session?.age}\nTanlangan yo\'nalish: ${ctx.session?.course}\nMa\'lumoti: ${ctx.session?.info}`
  )
);
bot.action("send", (ctx) => {
  return ctx.telegram.sendMessage(
    chatId,
    `Yangi o'quvchi\n\n👨‍🎓 Ismi: ${ctx.session?.name}\n🧍 Yoshi: ${ctx.session?.age}\n💻 Tanlangan yo\'nalish: ${ctx.session?.course}\n📚 Ma\'lumoti: ${ctx.session?.info}`
  );
});



//registratsiya


  
  
  
  
  

  bot.launch();