const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options')
const token ='6362670214:AAGVYJOQCppqPPipFL_Wga5pvmpvTIIkqaI';

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async(chatId) => {
  await bot.sendMessage (chatId, 'Cейчас я загадаю цифру от 0 до 9, а ты должен(а) ее отгадать')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадай', gameOptions);
}

const startBot = () => {
  bot.setMyCommands ( [
    {command: '/start', description:'Приветсвие'},
    {command: '/info', description:'Получить инофрмацию о пользователе'},
    {command: '/game', description:'Игра угадай цифру'},
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот Ильи!')
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я не понимаю, попробуй еще')

  })

bot.on('callback_query', async msg => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data === '/again') {
    return startGame(chatId)
  }
  if (data === chats[chatId]) {
    return bot.sendMessage(chatId, `Поздравляю, ты угадал(а) цифру ${chats[chatId]}` , againOptions)
  } else {
    return bot.sendMessage(chatId, `К сожалению, ты не отгадал(а) цифру, бот загадал ${chats[chatId]}`, againOptions)
  }
})

}

startBot()
